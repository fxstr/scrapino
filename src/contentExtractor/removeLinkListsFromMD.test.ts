import assert from 'node:assert';
import { describe, it } from 'node:test';
import removeLinkListsFromMD from './removeLinkListsFromMD.js';

// eslint-disable-next-line
describe('removes link lists', () => {
  // eslint-disable-next-line
  it('keeps links in text', () => {
    const content = 'This is a [link](https://www.vsao-bern.ch) and this is another [link](https://www.vsao-bern.ch/folder).';
    assert.equal(
      removeLinkListsFromMD(content),
      content,
    );
  });

  // eslint-disable-next-line
  it('removes links when they\'re not embedded within content', () => {
    const link = '[link](https://www.vsao-bern.ch)';
    const contentWihtoutNewlines = `a${link} -- ${link}     *  . ${link}  ++ ${link}b`;
    assert.equal(
      removeLinkListsFromMD(contentWihtoutNewlines),
      // The last link is not removed because it's in a non-capturing group
      'ab',
    );
    const contentWithNewlines = `${link} \n ${link}      *  . ${link}  -\n\n ${link}`;
    assert.equal(
      removeLinkListsFromMD(contentWithNewlines),
      '',
    );
  });

  // eslint-disable-next-line
  it('removes link lists but keeps links in text', () => {
    const link = '[link](https://www.vsao-bern.ch)';
    const content = `${link} \n ${link}      *  . ${link}  \n\n ${link} and then we ${link} on`;
    assert.equal(
      removeLinkListsFromMD(content),
      ` and then we ${link} on`,
    );
  });
});
