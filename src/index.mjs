import { createContext } from 'preact';
import { html } from 'htm/preact';
import { useContext } from 'preact/hooks';

// eslint-disable-next-line no-magic-numbers
const generateIdentifier = (prefix = 'ui') => `${prefix}-${Math.ceil(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;

export const Theme = createContext();

const addRule = (rule) => {
  if (document.styleSheets.length < 1) {
    document.body.appendChild(document.createElement('style'));
  }

  document.styleSheets[0].insertRule(rule);
};

const PLACEHOLDER = '%%%PLACEHOLDER%%%';

const cache = {};

export const keyframes = (spec) => {
  if (Array.isArray(spec)) {
    return keyframes(spec[0]);
  }

  if (!cache[spec]) {
    cache[spec] = generateIdentifier('animation');
    addRule(`@keyframes ${cache[spec]} { ${spec} }`);
  }

  return cache[spec];
};

export const stylish = (Component, spec) => {
  // eslint-disable-next-line complexity, max-statements
  const compile = (spec, props, selector = PLACEHOLDER) => {
    if (!spec) {
      return [];
    }

    if (Array.isArray(spec)) {
      return spec.reduce((a, spec) => a.concat(compile(spec, props)), []);
    }

    if (typeof spec === 'string') {
      return [`${selector} { ${spec} }`];
    }

    if (typeof spec === 'function') {
      return [`${selector} { ${spec(props)} }`];
    }

    const { media, rule, states = [] } = spec;

    const nextSelector = states.length < 1 ? PLACEHOLDER : states.map((state) => `${PLACEHOLDER}${state}`).join(', ');

    if (media) {
      return [`@media ${media} { ${compile(rule, props, nextSelector).filter(Boolean).join('\n')} }`];
    }

    return compile(rule, props, nextSelector).filter(Boolean);
  };

  // eslint-disable-next-line max-statements
  const className = (props) => {
    if (!spec) {
      return undefined;
    }

    const rules = compile(spec, props).filter(Boolean);

    if (rules.length < 1) {
      return undefined;
    }

    const key = rules.join('\n');

    if (!cache[key]) {
      cache[key] = generateIdentifier('ui');
      for (const rule of rules) {
        addRule(rule.replace(new RegExp(PLACEHOLDER, 'g'), `.${cache[key]}`));
      }
    }

    return cache[key];
  };

  return function StylishComponent(props) {
    const theme = useContext(Theme);
    return html`<${Component} ...${props} class=${[props.class, className({ theme, ...props })].filter(Boolean).join(' ') || undefined}/>`;
  };
};

export default stylish;
