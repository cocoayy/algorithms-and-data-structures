"""
bfs.py

BFS（幅優先探索）の実装です。

【概要】
- 探索開始ノードから近い順に探索するアルゴリズム
- キューを使う
- 重みなしグラフでは最短手数の探索に使える

【向いている場面】
- 最短手数を求めたい
- 近いノードから順番に見たい
"""

from collections import deque


def bfs(graph: dict[str, list[str]], start: str) -> list[str]:
    """
    BFS を行い、訪問順を返す。

    Parameters
    ----------
    graph : dict[str, list[str]]
        隣接リスト形式のグラフ
    start : str
        探索開始ノード

    Returns
    -------
    list[str]
        BFS の訪問順
    """
    visited = set()          # 既に訪れたノードを記録する
    queue = deque([start])   # BFS ではキューを使う
    order = []               # 訪問順を保存する

    visited.add(start)

    while queue:
        current = queue.popleft()
        order.append(current)

        # current に隣接するノードを順番に調べる
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


if __name__ == "__main__":
    sample_graph = {
        "A": ["B", "C"],
        "B": ["D", "E"],
        "C": ["F"],
        "D": [],
        "E": ["F"],
        "F": []
    }

    print("BFS order:", bfs(sample_graph, "A"))
