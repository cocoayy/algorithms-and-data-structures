"""
quick_sort.py

Quick Sort（クイックソート）の実装です。

【概要】
- 配列から1つピボットを選び、
  それより小さい要素群 / 等しい要素群 / 大きい要素群
  に分けて再帰的に並べ替えるアルゴリズムです。

【特徴】
- 平均計算量: O(n log n)
- 最悪計算量: O(n^2)
- 実用上高速なことが多い

【向いている場面】
- 一般的なソート
- 平均的に高速なソートを使いたい場合
"""


def quick_sort(arr: list[int]) -> list[int]:
    """
    配列をクイックソートで昇順に並べ替えて返す。

    Parameters
    ----------
    arr : list[int]
        ソートしたい整数配列

    Returns
    -------
    list[int]
        昇順にソートされた新しい配列
    """
    # 要素数が 0 or 1 なら、それ以上分割する必要はない
    if len(arr) <= 1:
        return arr

    # 今回は簡単のため、中央の要素をピボットにする
    pivot = arr[len(arr) // 2]

    # pivot より小さい要素
    left = [x for x in arr if x < pivot]

    # pivot と等しい要素
    middle = [x for x in arr if x == pivot]

    # pivot より大きい要素
    right = [x for x in arr if x > pivot]

    # 左右を再帰的にソートし、最後に結合する
    return quick_sort(left) + middle + quick_sort(right)


if __name__ == "__main__":
    sample = [5, 3, 8, 4, 2, 7, 1, 10]
    print("before:", sample)
    print("after: ", quick_sort(sample))
