"""
merge_sort.py

Merge Sort（マージソート）の実装です。

【概要】
- 配列を半分に分割し、それぞれをソートしてから
  最後にマージ（統合）するアルゴリズムです。

【特徴】
- 計算量: O(n log n)
- 安定ソート
- 追加メモリが必要

【向いている場面】
- 最悪ケースでも O(n log n) を保証したい
- 安定ソートが必要
"""


def merge(left: list[int], right: list[int]) -> list[int]:
    """
    2つのソート済み配列をマージして、
    1つのソート済み配列として返す。
    """
    merged = []
    i = 0
    j = 0

    # left と right を先頭から比較しながら、小さい方を merged に入れる
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    # 片方が余った場合、残りをそのまま追加する
    merged.extend(left[i:])
    merged.extend(right[j:])

    return merged


def merge_sort(arr: list[int]) -> list[int]:
    """
    配列をマージソートで昇順に並べ替えて返す。
    """
    # 要素数が 0 or 1 ならソート済み
    if len(arr) <= 1:
        return arr

    # 配列を中央で 2 分割する
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]

    # 左右をそれぞれ再帰的にソートする
    sorted_left = merge_sort(left_half)
    sorted_right = merge_sort(right_half)

    # 最後に 2 つのソート済み配列を統合する
    return merge(sorted_left, sorted_right)


if __name__ == "__main__":
    sample = [9, 1, 6, 3, 7, 5, 2, 8]
    print("before:", sample)
    print("after: ", merge_sort(sample))
