import { Theme, keyframes, stylish } from './index.mjs';
import { describe, it } from 'mocha';
import { mount, withComponent } from './spec.utils.mjs';

import { expect } from 'chai';
import { fake } from 'sinon';
import { html } from 'htm/preact';

describe('<Theme.Provider>', () => {
  it('is a function', () => {
    expect(Theme.Provider).to.be.a('function');
  });
});

describe('keyframes', () => {
  it('is a function', () => {
    expect(keyframes).to.be.a('function');
  });

  describe('when used as a tagged template', () => {
    it('returns a string', () => {
      expect(keyframes`...`).to.be.a('string');
    });
  });

  describe('when called as a function', () => {
    it('returns a string', () => {
      expect(keyframes('...')).to.be.a('string');
    });
  });
});

describe('stylish', () => {
  it('is a function', () => {
    expect(stylish).to.be.a('function');
  });

  describe('when given only a string element name', () => {
    it('is a function', () => {
      expect(stylish('div')).to.be.a('function');
    });

    describe('when the component is mounted', () => {
      it('does not have a CSS class name', () => withComponent(html`
        <${stylish('b')}/>
      `, (component) => {
        expect(component.getAttribute('class')).to.be.null;
      }));
    });
  });

  describe('when given only a component to wrap', () => {
    it('is a function', () => {
      expect(stylish(() => 'I am a component to wrap.')).to.be.a('function');
    });

    describe('when the component is mounted', () => {
      it('does not have a CSS class name', () => withComponent(html`
        <${stylish(() => html`<b>Hello<//>`)}/>
      `, (component) => {
        expect(component.getAttribute('class')).to.be.null;
      }));
    });
  });

  describe('when the given spec is a string', () => {
    it('is a function', () => {
      expect(stylish('div', 'color: red;')).to.be.a('function');
    });

    describe('when the component is mounted', () => {
      it('has a CSS class name', () => withComponent(html`
        <${stylish('b', 'color: red;')}/>
      `, (component) => {
        expect(component.getAttribute('class')).to.be.a('string');
      }));
    });
  });

  describe('when the given spec is a function', () => {
    it('is a function', () => {
      expect(stylish('div', () => 'color: red;')).to.be.a('function');
    });

    describe('when the component is mounted', () => {
      it('calls the given spec', async () => {
        const spec = fake.returns('color: red;');
        await mount(html`<${stylish('div', spec)}/>`);
        expect(spec).to.have.been.calledOnce;
      });

      describe('when the spec is called', () => {
        it('includes the component props', async () => {
          const spec = fake.returns('color: red;');
          await mount(html`<${stylish('div', spec)} foo="bar"/>`);
          expect(spec.getCall(0).args[0]).to.have.property('foo', 'bar');
        });

        it('injects the theme', async () => {
          const spec = fake.returns('color: red;');
          await mount(html`<${Theme.Provider} value="dark"><${stylish('div', spec)}/><//>`);
          expect(spec.getCall(0).args[0]).to.have.property('theme', 'dark');
        });
      });
    });
  });

  describe('when the given spec is an object', () => {
    it('is a function', () => {
      expect(stylish('div', { rule: 'color: red;' })).to.be.a('function');
    });

    describe('when a media selector is present', () => {
      describe('when the component is mounted', () => {
        it('has a CSS class name', () => withComponent(html`
          <${stylish('b', { media: '(max-width: 640px)', rule: 'font-weight: 700;' })}/>
        `, (component) => {
          expect(component.getAttribute('class')).to.be.a('string');
        }));
      });
    });

    describe('when at least one state selector is present', () => {
      describe('when the component is mounted', () => {
        it('has a CSS class name', () => withComponent(html`
          <${stylish('b', { rule: 'font-weight: 700;', states: [':hover'] })}/>
        `, (component) => {
          expect(component.getAttribute('class')).to.be.a('string');
        }));
      });
    });

    describe('when the component is mounted', () => {
      it('has a CSS class name', () => withComponent(html`
        <${stylish('b', { rule: 'font-weight: 700;' })}/>
      `, (component) => {
        expect(component.getAttribute('class')).to.be.a('string');
      }));
    });
  });

  describe('when the given spec is a non-empty array', () => {
    it('is a function', () => {
      expect(stylish('div', ['color: red;'])).to.be.a('function');
    });

    describe('when each item in the array is empty', () => {
      describe('when the component is mounted', () => {
        it('does not have a CSS class name', () => withComponent(html`
          <${stylish('b', [''])}/>
        `, (component) => {
          expect(component.getAttribute('class')).to.be.null;
        }));
      });
    });
  });

  describe('when the given spec is an empty array', () => {
    it('is a function', () => {
      expect(stylish('div', [])).to.be.a('function');
    });
  });

  describe('when the component is mounted with an additional "class" prop', () => {
    it('includes both the given class and the stylish class', () => withComponent(html`
      <${stylish('b', 'font-weight: 700')} class="important"/>
    `, (component) => {
      expect(component.getAttribute('class')).to.include('important');
    }));
  });
});
