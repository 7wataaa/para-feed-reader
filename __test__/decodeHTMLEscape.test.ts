import { decodeHTMLEscape } from '../util/decodeHTMLEscape';

describe('decodeHTMLEscape.ts', () => {
  test('すべての文字が正しくエスケープされるか', () => {
    const testStr =
      '&lt;' +
      '&gt;' +
      '&quot;' +
      '&#039;' +
      '&#044;' +
      '&amp;' +
      '&lt;Component&gt;';

    const decodedTestStr = decodeHTMLEscape(testStr);

    expect(decodedTestStr).toBe(
      '<' + '>' + '"' + "'" + ',' + '&' + '<Component>'
    );
  });
});
