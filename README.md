# 🎩 Stylish | Preact

![Code Coverage by Test Suite][coverage]
![License][license]
[![Bundle Size][footprint]][bundlephobia]
[![Current Release Version][version]][npm]
![Weekly Downloads][downloads]
[![Sponsors][sponsors]][become-a-sponsor]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities]

Stylish is a tiny yet capable CSS library for [Preact][4] apps. It is heavily
inspired by [@emotion/styled][1] and [styled-components][2], so if you are
familiar with either of those, you should quickly get the hang of Stylish.

## Features

 * Extremely lightweight (under **1KB** gzipped)
 * No dependencies (uses the Preact/HTM you already have)
 * Comprehensive test suite (100% code coverage)
 * Animations supported
 * Theme context provided right out of the box
 * CSS rules have access to component props
 * Auto-generated class names (never have to use a `className` or `style` prop again!)
 * Make any component stylish
 * No React shims needed -- built for Preact

## Installing

```
npm install stylish-preact
```

Yarn users, you know what to do instead.

## Usage

Learn Stylish by example. The following examples use [htm][5] instead of
[JSX][6], so they will run directly in a modern web browser, no transpilation
needed.

### Basic Example

```javascript
import { html } from 'htm/preact';
import { render } from 'preact';
import { stylish } from 'stylish-preact';

const RedText = stylish('div', `
  color: red;
`);

render(html`
  <${RedText}>Hi, I'm red!<//>
`, document.body);
```

### Example with props

```javascript
import { html } from 'htm/preact';
import { render } from 'preact';
import { stylish } from 'stylish-preact';

const Tint = stylish('div', (props) => `
  color: ${props.color};
`);

render(html`
  <${Tint} color="blue">Hi, I'm blue!<//>
`, document.body);
```

### Example with pseudo-classes

```javascript
import { html } from 'htm/preact';
import { render } from 'preact';
import { stylish } from 'stylish-preact';

const HoverGreen = stylish('div', {
  rule: `
    color: green;
  `,
  states: [':hover']
});

render(html`
  <${HoverGreen}>Hi, hover me to make me green!<//>
`, document.body);
```

### Example with animation

```javascript
import { keyframes, stylish } from 'stylish-preact';

import { html } from 'htm/preact';
import { render } from 'preact';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = stylish('div', `
  animation: 1s infinite linear ${spin};
`);

render(html`
  <${Spinner}>Weeeeee!<//>
`, document.body);
```

### Example with inheritance

```javascript
import { html } from 'htm/preact';
import { render } from 'preact';
import { stylish } from 'stylish-preact';

const Big = stylish('span', `
  font-size: 4em;
`);

const BigAndBlue = stylish(Big, `
  color: blue;
`);

render(html`
  <${BigAndBlue}>Hi, I'm big and blue.<//>
`, document.body);
```

### Example with theme

```javascript
import { Theme, stylish } from 'stylish-preact';

import { html } from 'htm/preact';
import { render } from 'preact';

const Logo = stylish('h1', ({ theme }) => `
  color: ${theme.color.primary};
`);

render(html`
  <${Theme.Provider} value=${{ color: { primary: 'purple' }}}>
    <${Logo}>Purple Power<//>
  <//>
`, document.body);
```

## Migrating from `@emotion/styled` or `styled-components`?

There are some notable differences between Stylish and these two libraries.

 * Stylish does not support **nested** rules. It is primitive in that way.
   Each set of properties must be defined in its own *rule*, complete with
   any `media` selector and/or `states` (pseudo-classes or other criteria)
   applicable to that rule.

 * The `stylish` function behaves differently than the `styled` function
   for either of these two libraries. Read through the examples and usage
   documentation prior to reporting issues. Most notably, `stylish` should
   not be used as a tagged template.

## API Reference

### `import { Theme } from 'stylish-preact';`

`Theme` is a [context][3]. To provide a theme, `<Theme.Provider value={theme}>...<//>`.
This theme will be automatically injected to all stylish components. To access
the theme directly, `const theme = useContext(Theme);`, just like you would any
other context.

The shape of the theme you define is completely up to you. Stylish does not use
it directly; it only passes it through, if present, so your stylish components
have access to it without having to do any additional work.

### `import { keyframes } from 'stylish-preact';`

The `keyframes` function can be used as a tagged template or invoked directly.
Use it to define an animation. It returns the animation's *name* which can then
be injected into other components to use that animation.

### `import { stylish } from 'stylish-preact';`

The `stylish` function creates a stylish component. It takes two arguments:

#### `stylish(Component, ...)`

The **first** argument *may* be the `string` name of the HTML element to
serve as the component's base element.

Alternatively, the **first** argument *may* be a reference to another
component to extend. For example, `const Convertible = stylish(Vehicle);`.

#### `stylish(..., outfit)`

The **second** argument is where the whole outfit comes together. It can be a
string, a function, an object, or an array of strings/functions/objects. These all define
aspects of how the stylish component is dressed.

##### String

When `outfit` is a string, it should contain a set of static CSS properties
describing the component's appearance.

##### Function

Whe `outfit` is a function, it should **expect** to be given the `props` given
to the component when it is rendered, and should **return** a string containing
the set of CSS properties describing the component's appearance.

##### Object

When `outfit` is an object, it should contain the following properties:

 * `rule` - Required. This should be either a `string` or a `function` which
   behaves as described above.

 * `media` - Optional. If present, this should be a **media selector** `string`.
   For example, `(max-width: 500px)`.

 * `states` - Optional. If present, this should be `string[]`, where each item
   is a suffix to be added to the component's CSS selector for this rule block.
   For example, a simple `:hover` or a more complex `:not(:last-of-type)::after`.

##### Array

When `outfit` is an array, each item in the array should conform to the above
requirements depending on the type of that item (`string` vs `function` vs
`object`).

[1]: https://emotion.sh/docs/styled
[2]: https://styled-components.com/
[3]: https://preactjs.com/guide/v10/context/
[4]: https://preactjs.com/
[5]: https://github.com/developit/htm
[6]: https://reactjs.org/docs/introducing-jsx.html
[coverage]: https://img.shields.io/badge/coverage-100%25-success
[license]: https://img.shields.io/npm/l/stylish-preact
[footprint]: https://img.shields.io/bundlephobia/minzip/stylish-preact
[version]: https://img.shields.io/npm/v/stylish-preact
[downloads]: https://img.shields.io/npm/dw/stylish-preact
[sponsors]: https://img.shields.io/github/sponsors/canterberry
[become-a-sponsor]: https://github.com/sponsors/canterberry
[npm]: https://npmjs.com/package/stylish-preact
[bundlephobia]: https://bundlephobia.com/package/stylish-preact
[vulnerabilities-badge]: https://snyk.io/test/npm/stylish-preact/badge.svg
[vulnerabilities]: https://snyk.io/test/npm/stylish-preact
