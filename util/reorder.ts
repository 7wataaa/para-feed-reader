/**
 * [list]の[fromIndex]にある要素を[toIndex]に移動させたリストを生成する関数(非破壊的)
 *
 * @param {T[]} list - 元となるリスト
 * @param {number} fromIndex - 移動したい要素が存在するインデックス
 * @param {number} toIndex - 要素の移動先
 * @return {T[]} [fromIdex]の要素を[toIndex]に移動させた配列
 */
const reorder = <T>(list: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...list];

  // 開始地点の要素を削除、一時保存する
  const [removed] = result.splice(fromIndex, 1);

  // 削除した要素を終着地点に挿入
  result.splice(toIndex, 0, removed);

  return result;
};

export { reorder };
