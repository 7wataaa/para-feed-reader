/**
 * HTMLエンコードされている文字列をデコードする関数
 *
 * @example
 * "&lt;" → "<"
 * "&gt;" → ">"
 * "&quot;" → '"'
 * "&#039;" → "'"
 * "&#044;" → ","
 * "&amp;" → "&"
 * "&lt;Component&gt;" → "<Component>"
 * @param {string} str - デコードしたい文字列
 * @return {string} - デコードされた文字列
 */
const decodeHTMLEscape = (str: string): string => {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#044;/g, ',')
    .replace(/&amp;/g, '&');
};

export { decodeHTMLEscape };
