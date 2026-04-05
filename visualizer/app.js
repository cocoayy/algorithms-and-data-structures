// app.js
// 学習用のアルゴリズム可視化ページ
// このファイルでは以下を扱う:
// 1. タブ切り替え
// 2. ソート可視化
// 3. グラフ可視化 (BFS / DFS / Dijkstra)
// 4. Study Log の LocalStorage 保存

// --------------------------------------------------
// タブ関連
// --------------------------------------------------
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

// --------------------------------------------------
// Sorting Visualizer 関連
// --------------------------------------------------
const algorithmSelect = document.getElementById("algorithm-select");
const arraySizeInput = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-value");
const speedRange = document.getElementById("speed-range");
const speedValue = document.getElementById("speed-value");

const generateButton = document.getElementById("generate-button");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

const barsContainer = document.getElementById("bars-container");
const statusBox = document.getElementById("status-box");

let currentArray = [];
let originalArray = [];
let isSorting = false;
let shouldStop = false;

// --------------------------------------------------
// Graph Visualizer 関連
// --------------------------------------------------
const graphAlgorithmSelect = document.getElementById("graph-algorithm-select");
const graphSpeedRange = document.getElementById("graph-speed-range");
const graphSpeedValue = document.getElementById("graph-speed-value");

const graphResetButton = document.getElementById("graph-reset-button");
const graphStartButton = document.getElementById("graph-start-button");
const graphStopButton = document.getElementById("graph-stop-button");

const graphCanvas = document.getElementById("graph-canvas");
const graphStatusBox = document.getElementById("graph-status-box");
const distanceList = document.getElementById("distance-list");

let graphShouldStop = false;
let graphIsRunning = false;

// ノード位置
const graphPositions = {
    A: { x: 100, y: 100 },
    B: { x: 280, y: 80 },
    C: { x: 280, y: 220 },
    D: { x: 470, y: 80 },
    E: { x: 470, y: 220 },
    F: { x: 650, y: 150 },
};

// 無向グラフ風の見た目だが、処理は adjacency に従う
const graphAdjacency = {
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["E"],
    D: ["F"],
    E: ["F"],
    F: [],
};

// Dijkstra 用の重み付きグラフ
const weightedGraph = {
    A: [["B", 2], ["C", 5]],
    B: [["D", 4], ["E", 1]],
    C: [["E", 2]],
    D: [["F", 1]],
    E: [["F", 3]],
    F: [],
};

// グラフ描画時に使う状態
let nodeStates = {
    A: "default",
    B: "default",
    C: "default",
    D: "default",
    E: "default",
    F: "default",
};

let currentDistances = {
    A: "∞",
    B: "∞",
    C: "∞",
    D: "∞",
    E: "∞",
    F: "∞",
};

// --------------------------------------------------
// Study Log 関連
// --------------------------------------------------
const logDate = document.getElementById("log-date");
const logLearned = document.getElementById("log-learned");
const logStuck = document.getElementById("log-stuck");
const logUnderstood = document.getElementById("log-understood");
const logNext = document.getElementById("log-next");

const saveLogButton = document.getElementById("save-log-button");
const clearLogButton = document.getElementById("clear-log-button");
const deleteLogButton = document.getElementById("delete-log-button");
const logMessage = document.getElementById("log-message");

const STUDY_LOG_KEY = "algorithm-study-log";

// --------------------------------------------------
// 共通ユーティリティ
// --------------------------------------------------
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateStatus(message) {
    statusBox.textContent = message;
}

function updateGraphStatus(message) {
    graphStatusBox.textContent = message;
}

// --------------------------------------------------
// タブ切り替え
// --------------------------------------------------
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((tab) => tab.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");
    });
});

// --------------------------------------------------
// Sorting Visualizer
// --------------------------------------------------
arraySizeInput.addEventListener("input", () => {
    arraySizeValue.textContent = arraySizeInput.value;
});

speedRange.addEventListener("input", () => {
    speedValue.textContent = speedRange.value;
});

function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 300) + 20);
    }
    return arr;
}

function renderBars(arr, activeIndices = [], compareIndices = [], sortedIndices = []) {
    barsContainer.innerHTML = "";

    arr.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;

        if (activeIndices.includes(index)) {
            bar.classList.add("active");
        }
        if (compareIndices.includes(index)) {
            bar.classList.add("compare");
        }
        if (sortedIndices.includes(index)) {
            bar.classList.add("sorted");
        }

        barsContainer.appendChild(bar);
    });
}

function initializeArray() {
    const size = Number(arraySizeInput.value);
    currentArray = generateRandomArray(size);
    originalArray = [...currentArray];
    renderBars(currentArray);
    updateStatus("ランダム配列を生成しました。");
}

generateButton.addEventListener("click", () => {
    if (isSorting) return;
    initializeArray();
});

resetButton.addEventListener("click", () => {
    if (isSorting) return;
    currentArray = [...originalArray];
    renderBars(currentArray);
    updateStatus("配列をリセットしました。");
});

stopButton.addEventListener("click", () => {
    shouldStop = true;
    updateStatus("停止要求を受け付けました。");
});

startButton.addEventListener("click", async () => {
    if (isSorting) return;

    isSorting = true;
    shouldStop = false;

    const algorithm = algorithmSelect.value;
    const speed = Number(speedRange.value);

    updateStatus(`${algorithm} のソートを開始します。`);

    try {
        switch (algorithm) {
            case "bubble":
                await bubbleSort(currentArray, speed);
                break;
            case "selection":
                await selectionSort(currentArray, speed);
                break;
            case "insertion":
                await insertionSort(currentArray, speed);
                break;
            case "merge":
                await mergeSortVisualizer(currentArray, speed);
                break;
            case "quick":
                await quickSortVisualizer(currentArray, 0, currentArray.length - 1, speed);
                break;
            default:
                break;
        }

        if (!shouldStop) {
            renderBars(currentArray, [], [], currentArray.map((_, i) => i));
            updateStatus("ソート完了。");
        }
    } finally {
        isSorting = false;
        shouldStop = false;
    }
});

async function bubbleSort(arr, speed) {
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        if (shouldStop) return;

        for (let j = 0; j < n - i - 1; j++) {
            if (shouldStop) return;

            renderBars(arr, [], [j, j + 1], []);
            updateStatus(`Bubble Sort: index ${j} と ${j + 1} を比較中`);
            await sleep(speed);

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                renderBars(arr, [j, j + 1], [], []);
                await sleep(speed);
            }
        }
    }
}

async function selectionSort(arr, speed) {
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        if (shouldStop) return;

        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (shouldStop) return;

            renderBars(arr, [minIndex], [j], []);
            updateStatus(`Selection Sort: 最小値候補 ${minIndex} と ${j} を比較中`);
            await sleep(speed);

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            renderBars(arr, [i, minIndex], [], []);
            await sleep(speed);
        }
    }
}

async function insertionSort(arr, speed) {
    for (let i = 1; i < arr.length; i++) {
        if (shouldStop) return;

        const key = arr[i];
        let j = i - 1;

        updateStatus(`Insertion Sort: index ${i} の値を左へ挿入中`);

        while (j >= 0 && arr[j] > key) {
            if (shouldStop) return;

            renderBars(arr, [i], [j, j + 1], []);
            await sleep(speed);

            arr[j + 1] = arr[j];
            j--;

            renderBars(arr, [j + 1], [], []);
            await sleep(speed);
        }

        arr[j + 1] = key;
        renderBars(arr, [j + 1], [], []);
        await sleep(speed);
    }
}

async function mergeSortVisualizer(arr, speed) {
    await mergeSortRecursive(arr, 0, arr.length - 1, speed);
}

async function mergeSortRecursive(arr, left, right, speed) {
    if (shouldStop) return;
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    await mergeSortRecursive(arr, left, mid, speed);
    await mergeSortRecursive(arr, mid + 1, right, speed);
    await merge(arr, left, mid, right, speed);
}

async function merge(arr, left, mid, right, speed) {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
        if (shouldStop) return;

        renderBars(arr, [k], [], []);
        updateStatus(`Merge Sort: left=${left}, mid=${mid}, right=${right} をマージ中`);
        await sleep(speed);

        if (leftPart[i] <= rightPart[j]) {
            arr[k] = leftPart[i];
            i++;
        } else {
            arr[k] = rightPart[j];
            j++;
        }

        renderBars(arr, [k], [], []);
        await sleep(speed);
        k++;
    }

    while (i < leftPart.length) {
        if (shouldStop) return;
        arr[k] = leftPart[i];
        renderBars(arr, [k], [], []);
        await sleep(speed);
        i++;
        k++;
    }

    while (j < rightPart.length) {
        if (shouldStop) return;
        arr[k] = rightPart[j];
        renderBars(arr, [k], [], []);
        await sleep(speed);
        j++;
        k++;
    }
}

async function quickSortVisualizer(arr, low, high, speed) {
    if (shouldStop) return;

    if (low < high) {
        const pivotIndex = await partition(arr, low, high, speed);
        await quickSortVisualizer(arr, low, pivotIndex - 1, speed);
        await quickSortVisualizer(arr, pivotIndex + 1, high, speed);
    }
}

async function partition(arr, low, high, speed) {
    const pivot = arr[high];
    let i = low - 1;

    updateStatus(`Quick Sort: pivot は index ${high} の値 ${pivot}`);

    for (let j = low; j < high; j++) {
        if (shouldStop) return high;

        renderBars(arr, [high], [j], []);
        await sleep(speed);

        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            renderBars(arr, [i, j, high], [], []);
            await sleep(speed);
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    renderBars(arr, [i + 1, high], [], []);
    await sleep(speed);

    return i + 1;
}

// --------------------------------------------------
// Graph Visualizer
// --------------------------------------------------

// スライダー表示
graphSpeedRange.addEventListener("input", () => {
    graphSpeedValue.textContent = graphSpeedRange.value;
});

// ノード状態を初期化
function resetNodeStates() {
    nodeStates = {
        A: "default",
        B: "default",
        C: "default",
        D: "default",
        E: "default",
        F: "default",
    };
}

// 距離表示を初期化
function resetDistances() {
    currentDistances = {
        A: "∞",
        B: "∞",
        C: "∞",
        D: "∞",
        E: "∞",
        F: "∞",
    };
}

// ノード描画用ヘルパー
function createNodeElement(nodeName, state) {
    const node = document.createElement("div");
    node.classList.add("graph-node");

    if (state === "active") {
        node.classList.add("active");
    } else if (state === "visited") {
        node.classList.add("visited");
    } else if (state === "done") {
        node.classList.add("done");
    }

    node.textContent = nodeName;
    node.style.left = `${graphPositions[nodeName].x}px`;
    node.style.top = `${graphPositions[nodeName].y}px`;

    return node;
}

// エッジ描画
function createEdgeElement(from, to, weight = null) {
    const edge = document.createElement("div");
    edge.classList.add("graph-edge");

    const fromPos = graphPositions[from];
    const toPos = graphPositions[to];

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    edge.style.width = `${length}px`;
    edge.style.left = `${fromPos.x}px`;
    edge.style.top = `${fromPos.y}px`;
    edge.style.transform = `rotate(${angle}deg)`;

    graphCanvas.appendChild(edge);

    // 重みがある場合はラベルを追加
    if (weight !== null) {
        const label = document.createElement("div");
        label.classList.add("edge-weight");
        label.textContent = weight;

        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;

        label.style.left = `${midX}px`;
        label.style.top = `${midY}px`;

        graphCanvas.appendChild(label);
    }
}

// グラフ全体を描画
function renderGraph(weighted = false) {
    graphCanvas.innerHTML = "";

    if (weighted) {
        for (const from in weightedGraph) {
            for (const [to, weight] of weightedGraph[from]) {
                createEdgeElement(from, to, weight);
            }
        }
    } else {
        for (const from in graphAdjacency) {
            for (const to of graphAdjacency[from]) {
                createEdgeElement(from, to);
            }
        }
    }

    Object.keys(graphPositions).forEach((nodeName) => {
        const node = createNodeElement(nodeName, nodeStates[nodeName]);
        graphCanvas.appendChild(node);
    });

    renderDistanceList();
}

// Dijkstra の距離表示
function renderDistanceList() {
    distanceList.innerHTML = "";

    Object.keys(currentDistances).forEach((nodeName) => {
        const li = document.createElement("li");
        li.textContent = `${nodeName}: ${currentDistances[nodeName]}`;
        distanceList.appendChild(li);
    });
}

// グラフ UI 初期化
function initializeGraphVisualizer() {
    resetNodeStates();
    resetDistances();
    renderGraph(false);
    updateGraphStatus("グラフを初期化しました。");
}

// BFS 可視化
async function runBFS(speed) {
    const queue = ["A"];
    const visited = new Set(["A"]);

    updateGraphStatus("BFS を開始します。近いノードから順番に探索します。");

    while (queue.length > 0) {
        if (graphShouldStop) return;

        const current = queue.shift();

        nodeStates[current] = "active";
        renderGraph(false);
        await sleep(speed);

        for (const neighbor of graphAdjacency[current]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }

        nodeStates[current] = "visited";
        renderGraph(false);
        updateGraphStatus(`BFS: ${current} を訪問しました。`);
        await sleep(speed);
    }

    updateGraphStatus("BFS が完了しました。");
}

// DFS 可視化
async function runDFS(speed) {
    const visited = new Set();

    updateGraphStatus("DFS を開始します。深く進めるところまで探索します。");

    async function dfs(node) {
        if (graphShouldStop) return;
        if (visited.has(node)) return;

        visited.add(node);
        nodeStates[node] = "active";
        renderGraph(false);
        updateGraphStatus(`DFS: ${node} を探索中。`);
        await sleep(speed);

        for (const neighbor of graphAdjacency[node]) {
            await dfs(neighbor);
        }

        nodeStates[node] = "visited";
        renderGraph(false);
        await sleep(speed);
    }

    await dfs("A");
    updateGraphStatus("DFS が完了しました。");
}

// Dijkstra 可視化
async function runDijkstra(speed) {
    const distances = {
        A: 0,
        B: Infinity,
        C: Infinity,
        D: Infinity,
        E: Infinity,
        F: Infinity,
    };

    const visited = new Set();

    currentDistances = {
        A: 0,
        B: "∞",
        C: "∞",
        D: "∞",
        E: "∞",
        F: "∞",
    };

    renderGraph(true);
    updateGraphStatus("Dijkstra を開始します。最短距離を更新していきます。");
    await sleep(speed);

    while (visited.size < Object.keys(weightedGraph).length) {
        if (graphShouldStop) return;

        // 未確定ノードの中から最小距離を持つノードを探す
        let current = null;
        let minDistance = Infinity;

        for (const node of Object.keys(weightedGraph)) {
            if (!visited.has(node) && distances[node] < minDistance) {
                minDistance = distances[node];
                current = node;
            }
        }

        // 到達不能ノードしか残っていない場合
        if (current === null) break;

        nodeStates[current] = "active";
        renderGraph(true);
        updateGraphStatus(`Dijkstra: ${current} を確定候補として確認中。`);
        await sleep(speed);

        for (const [neighbor, weight] of weightedGraph[current]) {
            if (visited.has(neighbor)) continue;

            const newDistance = distances[current] + weight;

            // より短い距離が見つかったら更新する
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                currentDistances[neighbor] = newDistance;
                renderGraph(true);
                updateGraphStatus(
                    `Dijkstra: ${current} -> ${neighbor} を使って距離を ${newDistance} に更新`
                );
                await sleep(speed);
            }
        }

        visited.add(current);
        nodeStates[current] = "done";
        currentDistances[current] = distances[current];
        renderGraph(true);
        await sleep(speed);
    }

    updateGraphStatus("Dijkstra が完了しました。");
}

// ボタン操作
graphResetButton.addEventListener("click", () => {
    if (graphIsRunning) return;

    const weighted = graphAlgorithmSelect.value === "dijkstra";
    resetNodeStates();
    resetDistances();
    renderGraph(weighted);
    updateGraphStatus("グラフをリセットしました。");
});

graphStopButton.addEventListener("click", () => {
    graphShouldStop = true;
    updateGraphStatus("グラフ探索の停止要求を受け付けました。");
});

graphStartButton.addEventListener("click", async () => {
    if (graphIsRunning) return;

    graphIsRunning = true;
    graphShouldStop = false;

    resetNodeStates();
    resetDistances();

    const algorithm = graphAlgorithmSelect.value;
    const speed = Number(graphSpeedRange.value);

    try {
        if (algorithm === "bfs") {
            renderGraph(false);
            await runBFS(speed);
        } else if (algorithm === "dfs") {
            renderGraph(false);
            await runDFS(speed);
        } else if (algorithm === "dijkstra") {
            renderGraph(true);
            await runDijkstra(speed);
        }
    } finally {
        graphIsRunning = false;
        graphShouldStop = false;
    }
});

// --------------------------------------------------
// Study Log
// --------------------------------------------------
function getStudyLogPayload() {
    return {
        date: logDate.value,
        learned: logLearned.value,
        stuck: logStuck.value,
        understood: logUnderstood.value,
        next: logNext.value,
    };
}

function fillStudyLogForm(data) {
    logDate.value = data.date || "";
    logLearned.value = data.learned || "";
    logStuck.value = data.stuck || "";
    logUnderstood.value = data.understood || "";
    logNext.value = data.next || "";
}

function clearStudyLogForm() {
    logDate.value = "";
    logLearned.value = "";
    logStuck.value = "";
    logUnderstood.value = "";
    logNext.value = "";
}

function saveStudyLog() {
    const payload = getStudyLogPayload();
    localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(payload));
    logMessage.textContent = "Study Log を保存しました。";
}

function loadStudyLog() {
    const raw = localStorage.getItem(STUDY_LOG_KEY);

    if (!raw) {
        logMessage.textContent = "保存済みの Study Log はまだありません。";
        return;
    }

    try {
        const data = JSON.parse(raw);
        fillStudyLogForm(data);
        logMessage.textContent = "保存済みの Study Log を読み込みました。";
    } catch (error) {
        logMessage.textContent = "保存データの読み込みに失敗しました。";
    }
}

function deleteStudyLog() {
    localStorage.removeItem(STUDY_LOG_KEY);
    logMessage.textContent = "保存済みの Study Log を削除しました。";
}

saveLogButton.addEventListener("click", () => {
    saveStudyLog();
});

clearLogButton.addEventListener("click", () => {
    clearStudyLogForm();
    logMessage.textContent = "フォームをクリアしました。";
});

deleteLogButton.addEventListener("click", () => {
    deleteStudyLog();
});

// --------------------------------------------------
// 初期化
// --------------------------------------------------
initializeArray();
initializeGraphVisualizer();
loadStudyLog();
