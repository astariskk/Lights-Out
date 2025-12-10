// SCENARIO: SOKOBAN (Push the crates onto goal tiles)

const GRID_SIZE = 7;

// Tile types
// ' ' = floor
// '#' = wall
// 'B' = box
// '.' = goal
// 'P' = player

let board = [];
let playerPos = { r: 0, c: 0 };

function initmainGame() {
    // Simple Sokoban level layout
    const level = [
        "#######",
        "# .   #",
        "#  B  #",
        "# ##. #",
        "# PB  #",
        "#     #",
        "#######"
    ];

    board = level.map(row => row.split(""));

    // Find player position
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === 'P') {
                playerPos = { r, c };
            }
        }
    }

    rendermainGame();

    // Listen for movement
    document.addEventListener("keydown", handleMove);
}

function handleMove(e) {
    const keyMap = {
        "ArrowUp": [-1, 0], "w": [-1, 0],
        "ArrowDown": [1, 0], "s": [1, 0],
        "ArrowLeft": [0, -1], "a": [0, -1],
        "ArrowRight": [0, 1], "d": [0, 1]
    };

    if (!keyMap[e.key]) return;

    const [dr, dc] = keyMap[e.key];
    movePlayer(dr, dc);
}

function movePlayer(dr, dc) {
    const pr = playerPos.r;
    const pc = playerPos.c;
    const nr = pr + dr;
    const nc = pc + dc;

    if (board[nr][nc] === '#') return; // hit wall

    // If pushing a box
    if (board[nr][nc] === 'B') {
        const br = nr + dr;
        const bc = nc + dc;

        // Can't push into walls or another box
        if (board[br][bc] === '#' || board[br][bc] === 'B') return;

        // Move box
        board[br][bc] = 'B';
        board[nr][nc] = 'P';
    } else {
        // Normal movement
        board[nr][nc] = 'P';
    }

    // Restore previous tile (goal or floor)
    board[pr][pc] = isGoalTile(pr, pc) ? '.' : ' ';

    playerPos = { r: nr, c: nc };

    rendermainGame();
    checkWinCondition();
}

function isGoalTile(r, c) {
    return (
        (r === 1 && c === 2) ||
        (r === 3 && c === 4)
    );
}

function checkWinCondition() {
    // Win if all goals have boxes on them
    const goals = [
        { r: 1, c: 2 },
        { r: 3, c: 4 }
    ];

    const complete = goals.every(g => board[g.r][g.c] === 'B');

    if (complete) {
        document.getElementById("mainGame").innerHTML = `
            <h2 class="centerTitle">PUZZLE SOLVED!</h2>
            <p class="centerTitle">The map is 3353.</p>
        `;
    }
}

function rendermainGame() {
    const container = document.getElementById("mainGame");
    container.innerHTML = `
        <h2 class="centerTitle">Puzzle Game: Sokoban</h2>
        <p class="centerTitle">Push the yellow boxes onto the green goal tiles!</p>
        <p class="centerTitle">Use WASD or arrow keys to move.</p>
        <div id="sokoban-grid"></div>
    `;

    const grid = document.getElementById("sokoban-grid");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 50px)`;
    grid.style.gap = "4px";
    grid.style.margin = "20px auto";
    grid.style.width = "fit-content";

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement("div");
            cell.style.width = "50px";
            cell.style.height = "50px";
            cell.style.borderRadius = "4px";

            const char = board[r][c];

            // Visual representation
            if (char === '#') {
                cell.style.background = "#333";
            } else if (char === 'P') {
                cell.style.background = "lightblue";
            } else if (char === 'B') {
                cell.style.background = "gold";
            } else if (isGoalTile(r, c)) {
                cell.style.background = "green";
            } else {
                cell.style.background = "#999";
            }

            grid.appendChild(cell);
        }
    }
}
