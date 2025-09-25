const BOARD = document.getElementById('game');
let PUZZLE;
let SOLUTION;

const copyBoard = board => board.map(row => row.slice());
const shuffle = array => array.sort(() => Math.random() - 0.5);

const isValid = (board, row, col, num) => {
	for (let i = 0; i < 9; i++) {
		if (board[row][i] === num || board[i][col] === num) return false;
		const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
		const boxCol = 3 * Math.floor(col / 3) + (i % 3);
		if (board[boxRow][boxCol] === num) return false;
	}
	return true;
};

const generateSolved = () => {
	const board = Array.from({ length: 9 }, () => Array(9).fill(0));
	const solve = (board) => {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (board[row][col] === 0) {
					for (let num of shuffle([1,2,3,4,5,6,7,8,9])) {
						if (isValid(board, row, col, num)) {
							board[row][col] = num;
							if (solve(board)) return true;
							board[row][col] = 0;
						}
					}
					return false;
				}
			}
		}
		return true;
	};
	solve(board);
	return board;
};

const generatePuzzle = () => {
	const board = generateSolved();
	const puzzle = copyBoard(board);
	const totalToRemove = 40;
	let removed = 0;

	while (removed < totalToRemove) {
		for (let blockRow = 0; blockRow < 3; blockRow++) {
			for (let blockCol = 0; blockCol < 3; blockCol++) {
				let cells = [];
				for (let r = 0; r < 3; r++) {
					for (let c = 0; c < 3; c++) {
						cells.push([blockRow * 3 + r, blockCol * 3 + c]);
					}
				}
				shuffle(cells);
				for (let [r, c] of cells) {
					if (puzzle[r][c] !== 0) {
						puzzle[r][c] = 0;
						removed++;
						break;
					}
				}
				if (removed >= totalToRemove) break;
			}
			if (removed >= totalToRemove) break;
		}
	}

	return { puzzle, solution: board };
};


const createBoard = puzzle => {
	while (BOARD.firstChild) BOARD.removeChild(BOARD.firstChild);
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			const input = document.createElement("input");
			input.type = "number";
			input.className = "field";
			input.setAttribute("row", row);
			input.setAttribute("col", col);
			input.min = 1;
			input.max = 9;
			input.inputMode = "numeric";
			input.addEventListener("input", e => {
				let val = e.target.value;
				if (!/^[1-9]$/.test(val)) e.target.value = val.slice(-1).match(/[1-9]/) ? val.slice(-1) : "";
			});
			if ((col + 1) % 3 === 0) input.style.borderRight = "3px solid black";
			if ((row + 1) % 3 === 0) input.style.borderBottom = "3px solid black";
			if (puzzle[row][col] !== 0) {
				input.value = puzzle[row][col];
				input.disabled = true;
				input.className += " set";
			}
			BOARD.appendChild(input);
		}
	}
};

const initGame = () => {
	const { puzzle, solution } = generatePuzzle();
	PUZZLE = puzzle;
	SOLUTION = solution;
	createBoard(PUZZLE);
	console.table(SOLUTION);
};

const resetBoard = () => {
	while (BOARD.firstChild) BOARD.removeChild(BOARD.firstChild);
	initGame();
};

const showMessage = msg => {
	document.getElementById('message-box-uzenet').innerHTML = `${msg}`;
	document.getElementById('message-box-container').style.display = 'flex';

}

const checkSolution = () => {
	const inputs = BOARD.querySelectorAll('.field');
	for (let input of inputs) {
		const row = parseInt(input.getAttribute('row'));
		const col = parseInt(input.getAttribute('col'));
		const val = parseInt(input.value);

		if (val !== SOLUTION[row][col]) {
			showMessage("Sajnos megoldásod helytelen");
			return false;
		}
	}
	showMessage("Gratulálok megoldásod helyes");
	return true;
};


initGame();
