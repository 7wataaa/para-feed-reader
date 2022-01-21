import { reorder } from '../util/reorder';

describe('reorder.ts', () => {
  test('正しく順序が変わるか', () => {
    const beforeList = ['o', 'x', 'x', 'x'];

    const afterList = reorder(beforeList, 0, 3);

    expect(afterList).toEqual(['x', 'x', 'x', 'o']);
  });

  test('toIndexに範囲外を指定したときのテスト', () => {
    const beforeList = ['o', 'x', 'x', 'x'];

    // エラーは発生しない
    const afterList = reorder(beforeList, 0, 10000);

    expect(afterList).toEqual(['x', 'x', 'x', 'o']);
  });

  test('fromIndexに範囲外を指定したときのテスト', () => {
    const beforeList = ['o', 'x', 'x', 'x'];

    // エラーは発生しない
    const afterList = reorder(beforeList, -1, 3);

    expect(afterList).toEqual(['o', 'x', 'x', 'x']);
  });
});
