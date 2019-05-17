var cellElements;

function setup() {
	createCanvas(324, 729);

	frameRate(10);

	SudokuSolver.Initialize();

	cellElements = selectAll(".cell");
}

function draw() {
	clear();
	noStroke();
	for (var count = 0; count < 12; ++count) {
		for (var _count = 0; _count < 27; ++_count) {
			fill((count + _count) % 2 ? color(137, 207, 240) : color(176, 224, 230));
			rect(count * 27, _count * 27, count * 27 + 27, _count * 27 + 27);
		}
	}

	loadPixels();

	RenderDancingLinks();

	updatePixels();
}

function CountHeader() {
	var count = 0;
	for (var current = SudokuSolver_root.right; current != SudokuSolver_root; current = current.right, ++count);
	var _count = 0;
	for (var current = SudokuSolver_root.down; current != SudokuSolver_root; current = current.down, ++_count);
	print("Columns : " + count + " | Rows : " + _count);
}

function RenderDancingLinks() {
	for (var currentCol = SudokuSolver_root.right; currentCol != SudokuSolver_root; currentCol = currentCol.right) {
		for (var current = currentCol.down; current != currentCol; current = current.down) {
			var currentRow;
			for (currentRow = current.left; !(currentRow instanceof RowHeader); currentRow = currentRow.left);
			set(currentCol._num, currentRow._num, color(0));
		}
	}
}

function Solve() {
	var cellValues = [];
	for (var count = 0; count < 9; ++count) {
		cellValues[count] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	cellElements.forEach(function(element) {
		if (!isNaN(parseInt(element.value()))) {
			var cellPos = element.id();
			cellValues[parseInt(cellPos.charAt(0))][parseInt(cellPos.charAt(1))] = parseInt(element.value());
		}
	});

	print(SudokuSolver.Solve(cellValues));
}
