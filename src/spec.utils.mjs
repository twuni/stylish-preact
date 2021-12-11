import { render } from 'preact';

export const withComponent = async (component, f) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(component, container);
  try {
    await f(...container.children);
  } finally {
    container.remove();
  }
};

export const mount = (component) => withComponent(component, () => true);
