const levelLayout = [
    "YGGYGRRYY",
    "YBBGGBGBG",
    "RGGBRRGBG",
    "RBRGYGBGY",
    "GGYYYYYGG",
    "YGBGYGRBR",
    "GBGRRGBGR", 
    "GBGBGGBBY",  
    "YYRRGYGGY"
];

const GRID_SIZE = levelLayout.length;

let grid = [];
let selectedColor = 'R';
let isFlooding = false;

// Color lookup
const COLORS = {
    R: "#FF6961",
    Y: "#FDFD96",
    B: "#8fe6f1ff",
    G: "#80EF80"
};
const SHADOW = {
    R: "#c24e48ff",
    Y: "#b3b369ff",
    B: "#68a3acff",
    G: "#55a355ff"
};

const sounds = {
    click: new Audio('pop.mp3'),
}

/* ---------------- INIT ---------------- */
function initGame() {
    grid = levelLayout.map(row => row.split(""));
    movesLeft = 6;
    selectedColor = 'R';
    renderGrid();
    renderControls();
    selectColor(selectedColor);
}

/* ---------------- ANIMATED FLOOD FILL ---------------- */
function animatedFloodFill(r, c, originalColor, targetColor) {
    isFlooding = true;
    const queue = [[r, c]];
    const visited = new Set();

    function step() {
        if (queue.length === 0) {
            isFlooding = false; 
            checkWin();              
            return;
        }
        const [x, y] = queue.shift();
        const key = `${x},${y}`;
        if (visited.has(key)) {
            step();
            return;
        }
        visited.add(key);

        if (grid[x][y] !== originalColor) {           
            step();
            return;
        }

        grid[x][y] = targetColor;
        renderGrid();      
        new Audio('pop.mp3').play();         

        // Add neighbors
        [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].forEach(([nx,ny]) => {
            if(nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE){
                queue.push([nx,ny]);
            }
        });

        setTimeout(step, 50); // delay for animation
    }

    step();
}

/* ---------------- TILE CLICK ---------------- */
function handleTileClick(r, c) {
    if (movesLeft <= 0) return;

    const originalColor = grid[r][c];
    if (originalColor === selectedColor) return;

    movesLeft--;

    sounds.click.play();

    renderControls();
    animatedFloodFill(r, c, originalColor, selectedColor);
}

/* ---------------- RENDER GRID ---------------- */
function renderGrid() {
    const container = document.getElementById("sokoban-grid");
    container.innerHTML = "";
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 40px)`;
    container.style.gridGap = "3px";

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement("div");
            cell.className = "tile";
            cell.style.background = COLORS[grid[r][c]];
            cell.onclick = () => handleTileClick(r, c);
            container.appendChild(cell);
        }
    }
}

/* ---------------- CONTROLS ---------------- */
function renderControls() {
    const container = document.getElementById("controls");
    container.innerHTML = `
        <div id="moves-left">Moves Left: ${movesLeft}</div>
        <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="color-btn" onclick="selectColor('R')" style="background:${COLORS.R}; box-shadow: 0 4px ${SHADOW.R};"></button>
            <button class="color-btn" onclick="selectColor('Y')" style="background:${COLORS.Y}; box-shadow: 0 4px ${SHADOW.Y};"></button>
            <button class="color-btn" onclick="selectColor('B')" style="background:${COLORS.B}; box-shadow: 0 4px ${SHADOW.B};"></button>
            <button class="color-btn" onclick="selectColor('G')" style="background:${COLORS.G}; box-shadow: 0 4px ${SHADOW.G};"></button>
        </div>
        <button id="reset-btn" style="margin-top:10px;">Reset Level</button>
    `;

    document.getElementById("reset-btn").onclick = initGame;
}

/* ---------------- COLOR SELECT ---------------- */
function selectColor(color) {
    selectedColor = color;

    // remove active class from all buttons
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // add active class to the clicked button
    const clickedBtn = document.querySelector(`.color-btn[onclick="selectColor('${color}')"]`);
    if (clickedBtn) {
        clickedBtn.classList.add("active");
    }
}

/* ---------------- WIN CHECK ---------------- */
function checkWin() {
    const uniqueColors = new Set(grid.flat());

    if (uniqueColors.size === 1) {
        const container = document.getElementById("game-wrapper");
        container.innerHTML = `
            <h2 class="centerTitle" style="color:#10b981;">🎉 PUZZLE SOLVED! 🎉</h2>
            <p class="centerTitle">Room number is 35337</p>
            <button onclick="location.reload()">Play Again</button>
        `;
    } else if (movesLeft <= 0) {
        const controls = document.getElementById("controls");
        controls.innerHTML = `
            <div class="win-msg">❌ Out of Moves</div>
            <button onclick="initGame()">Try Again</button>
        `;
    }
}

window.onload = initGame;
