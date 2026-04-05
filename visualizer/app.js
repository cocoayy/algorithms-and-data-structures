// app.js
// アルゴリズムの可視化用スクリプト
// Start ボタンを押すと、手順を1つずつアニメーションで表示する

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

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

// ------------------------------
// タブ切り替え
// ------------------------------
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((tab) => tab.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");
    });
});

// ------------------------------
// スライダー表示更新
// ------------------------------
arraySizeInput.addEventListener("input", () => {
    arraySizeValue.textContent = arraySizeInput.value;
});

speedRange.addEventListener("input", () => {
    speedValue.textContent = speedRange.value;
});

// ------------------------------
// 配列生成
// ------------------------------
function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        // 20〜320 の範囲でランダム生成
        arr.push(Math.floor(Math.random() * 300) + 20);
    }
    return arr;
}

// ------------------------------
// バー描画
// activeIndices: 今注目しているインデックス
// compareIndices: 比較中のインデックス
// sortedIndices: ソート済みとして色を変えるインデックス
// ------------------------------
function renderBars(
    arr,
    activeIndices = [],
    compareIndices = [],
    sortedIndices = []
) {
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

function updateStatus(message) {
    statusBox.textContent = message;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function initializeArray() {
    const size = Number(arraySizeInput.value);
    currentArray = generateRandomArray(size);
    originalArray = [...currentArray];
    renderBars(currentArray);
    updateStatus("ランダム配列を生成しました。");
}

// ------------------------------
// 操作ボタン
// ------------------------------
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

// ------------------------------
// Bubble Sort
// ------------------------------
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
                // 順番が逆なら交換する
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                renderBars(arr, [j, j + 1], [], []);
                await sleep(speed);
            }
        }
    }
}

// ------------------------------
// Selection Sort
// ------------------------------
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

// ------------------------------
// Insertion Sort
// ------------------------------
async function insertionSort(arr, speed) {
    for (let i = 1; i < arr.length; i++) {
        if (shouldStop) return;

        const key = arr[i];
        let j = i - 1;

        updateStatus(`Insertion Sort: index ${i} の値を左側へ挿入中`);

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

// ------------------------------
// Merge Sort 用
// ------------------------------
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

// ------------------------------
// Quick Sort 用
// ------------------------------
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

// 初期化
initializeArray();
