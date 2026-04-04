"""
dijkstra.py

Dijkstra（ダイクストラ法）の実装です。

【概要】
- 重み付きグラフにおける単一始点最短経路アルゴリズム
- 負の重みがない場合に使える
- 優先度付きキュー（heapq）を使う

【向いている場面】
- 最短距離の計算
- 経路最適化の基礎問題

【注意点】
- 負の辺があるグラフには使えない
"""

import heapq


def dijkstra(graph: dict[str, list[tuple[str, int]]], start: str) -> dict[str, int]:
    """
    始点 start から各ノードへの最短距離を返す。

    Parameters
    ----------
    graph : dict[str, list[tuple[str, int]]]
        隣接リスト形式の重み付きグラフ
        例: {"A": [("B", 1), ("C", 4)], ...}
    start : str
        始点ノード

    Returns
    -------
    dict[str, int]
        各ノードへの最短距離
    """
    # 初期状態では、全ノードへの距離を無限大とみなす
    distances = {node: float("inf") for node in graph}
    distances[start] = 0

    # (距離, ノード) の組を優先度付きキューに入れる
    priority_queue = [(0, start)]

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        # キューから取り出した距離が、既知の最短距離より大きい場合は無視する
        if current_distance > distances[current_node]:
            continue

        # current_node から行ける隣接ノードを確認する
        for neighbor, weight in graph[current_node]:
            distance = current_distance + weight

            # より短い経路が見つかったら更新する
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))

    return distances


if __name__ == "__main__":
    sample_graph = {
        "A": [("B", 1), ("C", 4)],
        "B": [("C", 2), ("D", 5)],
        "C": [("D", 1)],
        "D": []
    }

    result = dijkstra(sample_graph, "A")
    print("Shortest distances from A:", result)
