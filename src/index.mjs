import { createContext } from 'preact';
import { html } from 'htm/preact';
import { useContext } from 'preact/hooks';

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
    return spec.map(keyframes);
  }

  if (!cache[spec]) {
    cache[spec] = `animation-${Math.ceil(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;
    addRule(`@keyframes ${cache[spec]} { ${spec} }`);
  }

  return cache[spec];
};

export const stylish = (Component, spec) => {
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

  const className = (props) => {
    const rules = compile(spec, props);
    const key = rules.join('\n');

    if (!cache[key]) {
      cache[key] = `ui-${Math.ceil(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;
      for (const rule of rules) {
        addRule(rule.replace(new RegExp(PLACEHOLDER, 'g'), `.${cache[key]}`));
      }
    }

    return cache[key];
  };

  return (props) => {
    const theme = useContext(Theme);
    return html`<${Component} ...${props} class=${[props.class, className({ theme, ...props })].filter(Boolean).join(' ')}/>`;
  };
};

export default stylish;
