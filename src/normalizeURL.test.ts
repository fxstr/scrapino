import assert from 'node:assert';
import { describe, it } from 'node:test';
import normalizeURL from './normalizeURL.js';

// eslint-disable-next-line
describe('normalize URL', () => {
  // eslint-disable-next-line
  it('should return normalized URL', () => {
    // Normalized URL
    assert.strictEqual(
      normalizeURL('https://www.vsao-bern.ch/unknown'),
      'https://www.vsao-bern.ch/unknown',
    );
    // Trailing slash
    assert.strictEqual(
      normalizeURL('https://www.vsao-bern.ch/unknown/'),
      'https://www.vsao-bern.ch/unknown',
    );
    // Slash and anchor
    assert.strictEqual(
      normalizeURL('https://www.vsao-bern.ch/unknown/#anchor'),
      'https://www.vsao-bern.ch/unknown',
    );
    // New URL with slash and anchor
    assert.strictEqual(
      normalizeURL('https://www.vsao-bern.ch/unknown/segment#anchor'),
      // No adjustments to be made
      'https://www.vsao-bern.ch/unknown/segment',
    );
  });
});
