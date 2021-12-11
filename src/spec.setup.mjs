import { JSDOM } from 'jsdom';

import chai from 'chai';
import sinonChai from 'sinon-chai';

const { window } = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body></body></html>');

// Intentionally set some globals here to inject browser-specific APIs referenced by this package's default (convenience) implementation
// eslint-disable-next-line no-undef
Object.assign(global, { document: window.document, window });

chai.use(sinonChai);
