"""
dfs.py

DFS（深さ優先探索）の実装です。

【概要】
- あるノードから行けるところまで深く探索し、
  行き止まったら戻る
- 再帰またはスタックで実装できる

【向いている場面】
- 経路探索
- 連結成分の判定
- 再帰的構造の探索
"""


def dfs(graph: dict[str, list[str]], start: str) -> list[str]:
    """
    DFS を行い、訪問順を返す。
    再帰を使った実装。
    """
    visited = set()
    order = []

    def _dfs(node: str) -> None:
        # 既に訪れていれば何もしない
        if node in visited:
            return

        # 訪問済みにし、順序に追加する
        visited.add(node)
        order.append(node)

        # 隣接ノードを再帰的に探索する
        for neighbor in graph.get(node, []):
            _dfs(neighbor)

    _dfs(start)
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

    print("DFS order:", dfs(sample_graph, "A"))
