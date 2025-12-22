const GRID_SIZE = 9;

let board = [];
let goals = [];
let playerPos = { r: 0, c: 0 };

function initmainGame() {
    const level = [
        "#########",
        "###   ###",
        "#.PB  ###",
        "### B.###",
        "#.##B ###",
        "# # . ###",
        "#B.BBB.##",   
        "#   .  ##",                                 
        "#########"        
      
    ];

    board = level.map(row => row.split(""));
    parseGoals();

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

/* ---------------- GOAL PARSING ---------------- */

function parseGoals() {
    goals = [];

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === '.') {
                goals.push({ r, c });
                board[r][c] = ' '; // turn into floor
            }
        }
    }
}

function isGoalTile(r, c) {
    return goals.some(g => g.r === r && g.c === c);
}

/* ---------------- INPUT ---------------- */

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

/* ---------------- MOVEMENT ---------------- */

function movePlayer(dr, dc) {
    const pr = playerPos.r;
    const pc = playerPos.c;
    const nr = pr + dr;
    const nc = pc + dc;

    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) return;

    const target = board[nr][nc];

    if (target === '#') return;

    // Push box
    if (target === 'B') {
        const br = nr + dr;
        const bc = nc + dc;

        if (br < 0 || br >= GRID_SIZE || bc < 0 || bc >= GRID_SIZE) return;

        const boxDest = board[br][bc];
        if (boxDest === '#' || boxDest === 'B') return;

        board[br][bc] = 'B';
    }

    // Move player
    board[nr][nc] = 'P';
    board[pr][pc] = isGoalTile(pr, pc) ? ' ' : ' ';

    playerPos = { r: nr, c: nc };

    rendermainGame();
    checkWinCondition();
}

/* ---------------- WIN CHECK ---------------- */

function checkWinCondition() {
    const complete = goals.every(g => board[g.r][g.c] === 'B');

    if (complete) {
        document.getElementById("mainGame").innerHTML = `
            <h2 class="centerTitle" style="color:#10b981;">PUZZLE SOLVED!</h2>
            <p class="centerTitle">Room number is 75632</p>
        `;
        document.getElementById("controls").style.display = 'none';
        document.removeEventListener("keydown", handleMove);
    }
}

/* ---------------- RENDER ---------------- */

function rendermainGame() {
    const container = document.getElementById("mainGame");
    container.innerHTML = `
        <h2 class="centerTitle">Sokoban: Push the Boxes</h2>
        <p class="centerTitle" style="color:#93c5fd;">
            Push the yellow boxes into the green goals
        </p>
        <p class="centerTitle" style="color:#93c5fd;">
            Use WASD or Arrow keys to move
        </p>
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

            const char = board[r][c];
            const isGoal = isGoalTile(r, c);

            let bgColor = "#334155";

            if (char === '#') {
                bgColor = "#1e293b";
            } else if (isGoal) {
                bgColor = "#10b981";
            }

            if (char === 'P') {
                bgColor = "#3b82f6";
            } else if (char === 'B') {
                bgColor = isGoal ? "#f59e0b" : "#fcd34d";
            }

            cell.style.background = bgColor;
            cell.style.boxShadow = "inset 0 0 5px rgba(0,0,0,0.1)";
            grid.appendChild(cell);
        }
    }

    document.getElementById("controls").style.display = 'flex';
}

/* ---------------- START ---------------- */

window.onload = initmainGame;
