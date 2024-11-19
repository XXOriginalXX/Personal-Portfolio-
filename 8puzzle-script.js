const puzzleContainer = document.getElementById("puzzle-container");
const shuffleButton = document.getElementById("shuffle");
const hintButton = document.getElementById("hint");
const solveButton = document.getElementById("solve");

const goalState = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

let currentState = JSON.parse(JSON.stringify(goalState));
let solutionPath = [];


function renderPuzzle(state) {
    puzzleContainer.innerHTML = "";
    state.flat().forEach((value, index) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = value !== 0 ? value : "";
        if (value === 0) tile.classList.add("empty");
        tile.dataset.index = index;
        puzzleContainer.appendChild(tile);
    });
}


function findEmptyTile(state) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === 0) return [i, j];
        }
    }
}


function generateMoves(state) {
    const [x, y] = findEmptyTile(state);
    const moves = [];
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    directions.forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < 3 && newY >= 0 && newY < 3) {
            const newState = state.map(row => [...row]);
            [newState[x][y], newState[newX][newY]] = [newState[newX][newY], newState[x][y]];
            moves.push(newState);
        }
    });

    return moves;
}


function statesEqual(state1, state2) {
    return JSON.stringify(state1) === JSON.stringify(state2);
}


function aStar(start, goal) {
    const priorityQueue = [];
    priorityQueue.push({ state: start, path: [] });
    const visited = new Set();

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.path.length - b.path.length);
        const { state, path } = priorityQueue.shift();

        if (statesEqual(state, goal)) return path.concat([state]);

        visited.add(JSON.stringify(state));

        generateMoves(state).forEach(nextState => {
            if (!visited.has(JSON.stringify(nextState))) {
                priorityQueue.push({
                    state: nextState,
                    path: path.concat([state])
                });
            }
        });
    }

    return null;
}


function handleTileClick(e) {
    const index = parseInt(e.target.dataset.index);
    const x = Math.floor(index / 3);
    const y = index % 3;

    const [emptyX, emptyY] = findEmptyTile(currentState);
    if (Math.abs(emptyX - x) + Math.abs(emptyY - y) === 1) {
        [currentState[emptyX][emptyY], currentState[x][y]] = [currentState[x][y], currentState[emptyX][emptyY]];
        renderPuzzle(currentState);

        if (statesEqual(currentState, goalState)) {
            alert("Congratulations! You solved the puzzle.");
        }
    }
}


shuffleButton.addEventListener("click", () => {
    currentState = JSON.parse(JSON.stringify(goalState));
    for (let i = 0; i < 100; i++) {
        const moves = generateMoves(currentState);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        currentState = randomMove;
    }
    solutionPath = aStar(currentState, goalState) || [];
    renderPuzzle(currentState);
});


hintButton.addEventListener("click", () => {
    if (solutionPath.length > 1) {
        renderPuzzle(solutionPath[1]);
        currentState = solutionPath[1];
        solutionPath.shift();
    } else {
        alert("You're already at the goal state or need to shuffle first!");
    }
});


solveButton.addEventListener("click", () => {
    if (solutionPath.length > 0) {
        let step = 0;
        const interval = setInterval(() => {
            if (step < solutionPath.length) {
                renderPuzzle(solutionPath[step]);
                currentState = solutionPath[step];
                step++;
            } else {
                clearInterval(interval);
            }
        }, 500);
    } else {
        alert("No solution available! Shuffle first.");
    }
});


puzzleContainer.addEventListener("click", e => {
    if (e.target.classList.contains("tile")) {
        handleTileClick(e);
    }
});


renderPuzzle(currentState);
