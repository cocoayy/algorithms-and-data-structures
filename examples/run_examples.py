"""
run_examples.py

各アルゴリズムの簡単な実行例をまとめたファイルです。
"""

import os
import sys

# examples ディレクトリから src を import できるようにパスを追加する
CURRENT_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
SRC_DIR = os.path.join(PROJECT_ROOT, "src")

if SRC_DIR not in sys.path:
    sys.path.append(SRC_DIR)

from sorting.quick_sort import quick_sort
from sorting.merge_sort import merge_sort
from graphs.bfs import bfs
from graphs.dfs import dfs
from graphs.dijkstra import dijkstra


def run_sorting_examples() -> None:
    data = [8, 3, 1, 7, 0, 10, 2]

    print("=== Sorting Examples ===")
    print("original   :", data)
    print("quick_sort :", quick_sort(data))
    print("merge_sort :", merge_sort(data))
    print()


def run_graph_examples() -> None:
    graph_unweighted = {
        "A": ["B", "C"],
        "B": ["D", "E"],
        "C": ["F"],
        "D": [],
        "E": ["F"],
        "F": []
    }

    graph_weighted = {
        "A": [("B", 1), ("C", 4)],
        "B": [("C", 2), ("D", 5)],
        "C": [("D", 1)],
        "D": []
    }

    print("=== Graph Examples ===")
    print("BFS from A      :", bfs(graph_unweighted, "A"))
    print("DFS from A      :", dfs(graph_unweighted, "A"))
    print("Dijkstra from A :", dijkstra(graph_weighted, "A"))
    print()


if __name__ == "__main__":
    run_sorting_examples()
    run_graph_examples()
