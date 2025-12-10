// SCENARIO 3: PUZZLE LOCK (4x4 LIGHTS OUT)

const S3_GRID_SIZE = 4;
let s3_board = []; // 2D array representing the light state (true for on/glowing)

// Initialize the 4x4 Lights Out board
function initmainGame() {
    // 1. Create the board and initialize all lights to OFF (false)
    s3_board = Array(S3_GRID_SIZE).fill(0).map(() => Array(S3_GRID_SIZE).fill(false));

    // 2. Randomly initialize the board with a solvable pattern
    scrambleBoard();

    // 3. Render the UI
    rendermainGame();
}

// Randomly press buttons to create a solvable, non-blank board
function scrambleBoard() {
    let blank = true;
    while(blank) {
        s3_board = Array(S3_GRID_SIZE).fill(0).map(() => Array(S3_GRID_SIZE).fill(false));
        for (let r = 0; r < S3_GRID_SIZE; r++) {
            for (let c = 0; c < S3_GRID_SIZE; c++) {
                // Press a cell with 30% chance
                if (Math.random() < 0.3) {
                    toggleLight(r, c, true); // true means no UI update during scramble
                }
            }
        }
        // Check if the board is still blank after scrambling
        blank = s3_board.every(row => row.every(light => light === false));
    }
}

// Function to toggle a single light and its adjacent neighbors
// isScrambling prevents a render loop during board initialization
function toggleLight(r, c, isScrambling = false) {
    const directions = [
        [0, 0], // Center
        [0, 1], [0, -1], // Left/Right
        [1, 0], [-1, 0]  // Up/Down
    ];

    directions.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < S3_GRID_SIZE && nc >= 0 && nc < S3_GRID_SIZE) {
            // Toggle the state (true -> false, false -> true)
            s3_board[nr][nc] = !s3_board[nr][nc];
        }
    });

    if (!isScrambling) {
        rendermainGame();
        checkWinCondition();
    }
}

// Check if all lights are off
function checkWinCondition() {
    const isCleared = s3_board.every(row => row.every(light => light === false));
    if (isCleared) {
        document.getElementById("mainGame").innerHTML = `
            <h2 class = "centerTitle" >PUZZLE SOLVED!</h2>
            <p class = "centerTitle">The map is 3533.</p>
        `;
    }
}

// Render the puzzle UI
function rendermainGame() {
    const scenarioDiv = document.getElementById("mainGame");
    scenarioDiv.classList.remove("hidden");
    scenarioDiv.innerHTML = `
        <h2 class = "centerTitle">Puzzle game: Lights Out (4x4 Puzzle)</h2>
        <p class = "centerTitle" >Click a cell to toggle its light and the adjacent ones. Clear the board to win!</p>
        <p class = "centerTitle" > refresh the page to restart the puzzle. </p>
        <div id="lights-out-grid"></div>
    `;

    const gridDiv = document.getElementById("lights-out-grid");
    gridDiv.style.display = 'grid';
    gridDiv.style.gridTemplateColumns = `repeat(${S3_GRID_SIZE}, 60px)`;
    gridDiv.style.gap = '5px';
    gridDiv.style.margin = '20px auto';
    gridDiv.style.width = 'fit-content';

    for (let r = 0; r < S3_GRID_SIZE; r++) {
        for (let c = 0; c < S3_GRID_SIZE; c++) {
            const cell = document.createElement('button');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.style.width = '60px';
            cell.style.height = '60px';
            cell.style.border = '1px solid #333';
            cell.style.borderRadius = '5px';
            cell.style.cursor = 'pointer';
            
            // Set background color based on light state
            cell.style.backgroundColor = s3_board[r][c] ? 'yellow' : '#333';
            
            // Add click handler
            cell.onclick = () => toggleLight(r, c);
            
            gridDiv.appendChild(cell);
        }
    }
}