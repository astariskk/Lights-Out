const GRID_SIZE = 7;

let board = [];
let playerPos = { r: 0, c: 0 };

function initmainGame() {
    const level = [
        "#######",
        "# PB  #",
        "###BB #",
        "##    #",
        "##  ###",
        "##  ###",  
        "#######",                                     
     
    ];

    board = level.map(row => row.split(""));

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === 'P') {
                playerPos = { r, c };
            }
        }
    }

    rendermainGame();
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

    // Out of bounds
    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) return;

    const target = board[nr][nc];

    // Wall
    if (target === '#') return;

    // --- If pushing a box ---
    if (target === 'B') {
        const br = nr + dr;
        const bc = nc + dc;

        // Out of bounds for box
        if (br < 0 || br >= GRID_SIZE || bc < 0 || bc >= GRID_SIZE) return;

        const boxDest = board[br][bc];

        // Can't push into wall or another box
        if (boxDest === '#' || boxDest === 'B') return;

        // Move box
        board[br][bc] = 'B';
    }

    // --- Move player ---
    board[nr][nc] = 'P';

    // Restore previous tile
    board[pr][pc] = isGoalTile(pr, pc) ? '.' : ' ';

    // If player stood on a goal tile, keep the goal underneath
    if (isGoalTile(nr, nc) && target !== 'B') {
        board[nr][nc] = 'P';
    }

    playerPos = { r: nr, c: nc };

    rendermainGame();
    checkWinCondition();
}


function isGoalTile(r, c) {
    return (
        (r === 1 && c === 1) ||
        (r === 2 && c === 3) ||        
        (r === 3 && c === 2)
    );
}

function checkWinCondition() {
    const goals = [
        { r: 1, c: 1 },
        { r: 2, c: 3 },        
        { r: 3, c: 2 }
    ];

    const complete = goals.every(g => board[g.r][g.c] === 'B');

    if (complete) {
        document.getElementById("mainGame").innerHTML = `
            <h2 class="centerTitle" style="color:#10b981;">PUZZLE SOLVED!</h2>
            <p class="centerTitle">Room number is 68791</p>
        `;
        document.getElementById("controls").style.display = 'none';
        document.removeEventListener("keydown", handleMove);
    }
}

function rendermainGame() {
    const container = document.getElementById("mainGame");
    container.innerHTML = `
        <h2 class="centerTitle">Sokoban: Push the Boxes</h2>
        <p class="centerTitle" style="color:#93c5fd;">Push the yellow boxes into the green goals </p>        
        <p class="centerTitle" style="color:#93c5fd;">Use the buttons or WASD/Arrow keys to move.</p>
        <div id="sokoban-grid"></div>
    `;

    const grid = document.getElementById("sokoban-grid");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 50px)`;
    grid.style.gap = "2px";
    grid.style.margin = "20px auto";
    grid.style.width = "fit-content";

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement("div");
            cell.style.width = "50px";
            cell.style.height = "50px";
            cell.style.borderRadius = "4px";
            cell.style.display = "flex";
            cell.style.justifyContent = "center";
            cell.style.alignItems = "center";
            cell.style.transition = "background 0.2s";

            const char = board[r][c];
            const isGoal = isGoalTile(r, c);

            let bgColor = "#64748b";
            let content = '';

            if (char === '#') {
                // Wall
                bgColor = "#1e293b";
            } else if (isGoal) {
                // Goal tile (empty)
                bgColor = "#10b981"; 
            } else {
                // Floor tile
                bgColor = "#334155";
            }

            if (char === 'P') {
                // Player
                bgColor = "#3b82f6";
                content = '';
            } else if (char === 'B') {
                // Box
                content = '';
                bgColor = isGoal ? "#f59e0b" : "#fcd34d";
            } else if (char === '.') {
                // Empty Goal tile
                content = '';
            }
            
            cell.style.background = bgColor;
            cell.textContent = content;
            cell.style.fontSize = "30px";
            cell.style.boxShadow = "inset 0 0 5px rgba(0,0,0,0.1)";

            grid.appendChild(cell);
        }
    }
    // Ensure controls are visible unless the game is won
    document.getElementById("controls").style.display = 'flex';
}

// Start the game when the window loads
window.onload = function () {
    initmainGame();
}