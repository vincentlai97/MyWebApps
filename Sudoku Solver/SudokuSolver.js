var SudokuSolver_initialized = false;
var SudokuSolver_root;
var SudokuSolver_colHeaders;
var SudokuSolver_rowHeaders;
var SudokuSolver_nodes;
var SudokuSolver_solution;

class SudokuSolver {

	constructor() {

	}

	static Initialize() {
		SudokuSolver_root = new Node();
		SudokuSolver_colHeaders = [];
		SudokuSolver_rowHeaders = [];
		SudokuSolver_nodes = [];

		// Set up col header linked list
		for (var count = 0; count < 324; ++count) {
			SudokuSolver_colHeaders.push(new ColHeader(SudokuSolver_root, count, 9));
		}

		SudokuSolver_colHeaders[0].left = SudokuSolver_colHeaders[323];
		SudokuSolver_colHeaders[0].right = SudokuSolver_colHeaders[1];

		for (var count = 1; count < 323; ++count) {
			SudokuSolver_colHeaders[count].left = SudokuSolver_colHeaders[count - 1];
			SudokuSolver_colHeaders[count].right = SudokuSolver_colHeaders[count + 1];
		}

		SudokuSolver_colHeaders[323].left = SudokuSolver_colHeaders[322];
		SudokuSolver_colHeaders[323].right = SudokuSolver_colHeaders[0];

		// Add root to colHeader
		SudokuSolver_root.right = SudokuSolver_colHeaders[0];
		SudokuSolver_root.left = SudokuSolver_colHeaders[323];
		SudokuSolver_root.uncoverLR();

		// Set up row header linked list
		for (var count = 0; count < 729; ++count) {
			SudokuSolver_rowHeaders.push(new RowHeader(SudokuSolver_root, count));
		}

		SudokuSolver_rowHeaders[0].up = SudokuSolver_rowHeaders[728];
		SudokuSolver_rowHeaders[0].down = SudokuSolver_rowHeaders[1];

		for (var count = 1; count < 728; ++count) {
			SudokuSolver_rowHeaders[count].up = SudokuSolver_rowHeaders[count - 1];
			SudokuSolver_rowHeaders[count].down = SudokuSolver_rowHeaders[count + 1];
		}

		SudokuSolver_rowHeaders[728].up = SudokuSolver_rowHeaders[727];
		SudokuSolver_rowHeaders[728].down = SudokuSolver_rowHeaders[0];

		// Add root to rowHeader
		SudokuSolver_root.down = SudokuSolver_rowHeaders[0];
		SudokuSolver_root.up = SudokuSolver_rowHeaders[728];
		SudokuSolver_root.uncoverUD();

		// Set up nodes
		var tempColArr = SudokuSolver_colHeaders.slice(); // Used to store more recent discovered node in each column, starts from column header

		for (var count = 0; count < 9; ++count) { // Col count
			for (var _count = 0; _count < 9; ++_count) { // Row count
				for (var __count = 0; __count < 9; ++__count) { // Val count
					var rowNum = __count + _count * 9 + count * 81;
					var colNum;
					var boxNum = floor(_count / 3) + floor(count / 3) * 3;

					// This part of code works because we are guaranteed to add new nodes left to right and up to down

					// Add first node from the left to the row header
					var node = new Node();
					SudokuSolver_nodes.push(node);
					node.left = SudokuSolver_rowHeaders[rowNum];
					node.left.right = node;
					// First part of constraints is sorted by col then row
					colNum = _count + count * 9;
					node.up = tempColArr[colNum];
					node.up.down = node;
					tempColArr[colNum] = node; // Update temp arr
					node.colHeader = SudokuSolver_colHeaders[colNum];
					node.rowHeader = SudokuSolver_rowHeaders[rowNum];

					// Add node to previous
					var next = new Node();
					SudokuSolver_nodes.push(next);
					next.left = node;
					node.right = next;
					// Second part of constraints is sorted by col then val
					colNum = __count + count * 9 + 81;
					next.up = tempColArr[colNum];
					next.up.down = next;
					tempColArr[colNum] = next; // Update temp arr
					next.colHeader = SudokuSolver_colHeaders[colNum];
					next.rowHeader = SudokuSolver_rowHeaders[rowNum];

					// Add node to previous
					node = new Node();
					SudokuSolver_nodes.push(node);
					node.left = next;
					next.right = node;
					// Third part of constraints is sorted by row then value
					colNum = __count + _count * 9 + 162;
					node.up = tempColArr[colNum];
					node.up.down = node;
					tempColArr[colNum] = node; // Update temp arr
					node.colHeader = SudokuSolver_colHeaders[colNum];
					node.rowHeader = SudokuSolver_rowHeaders[rowNum];

					// Add node to previous
					next = new Node();
					SudokuSolver_nodes.push(next);
					next.left = node;
					node.right = next;
					// Second part of constraints is sorted by col then val
					colNum = __count + boxNum * 9 + 243;
					next.up = tempColArr[colNum];
					next.up.down = next;
					tempColArr[colNum] = next; // Update temp arr
					next.colHeader = SudokuSolver_colHeaders[colNum];
					next.rowHeader = SudokuSolver_rowHeaders[rowNum];

					// Add last node back to row header
					next.right = SudokuSolver_rowHeaders[rowNum];
					next.right.left = next;

					/*byteArr[_count + count * 9][rowNum] = true;
					byteArr[__count + count * 9 + 81][rowNum] = true;
					byteArr[__count + _count * 9 + 162][rowNum] = true;
					byteArr[__count + boxNum * 9 + 243][rowNum] = true;*/
				}
			}
		}

		// Add last nodes in column back to column header
		for (var count = 0; count < 324; ++count) {
			tempColArr[count].down = SudokuSolver_colHeaders[count];
			SudokuSolver_colHeaders[count].up = tempColArr[count];
		}

		SudokuSolver_initialized = true;
	}

	static IsInitialized() {
		return SudokuSolver_initialized;
	}

	static Solve(initVal) {
		print("Initial Values:")
		for (var count = 0; count < initVal.length; ++count) {
			for (var _count = 0; _count < initVal[count].length; ++_count) {
				print("    " + count.toString() + _count.toString() + initVal[count][_count].toString());
				if (initVal[count][_count] > 0)
					this.CoverRow(count * 81 + _count * 9 + initVal[count][_count] - 1);
			}
		}
		print("----End----");

		SudokuSolver_solution = [];
		SudokuSolver.ChooseRow();
		SudokuSolver.Decrypt(SudokuSolver_solution);
		SudokuSolver_solution.sort(function(a, b) {
			return a - b;
		});
		return SudokuSolver_solution;
	}

	static CoverRow(rowNum) {
		var rowHeader = SudokuSolver_rowHeaders[rowNum];
		for (var current = rowHeader.right, end = rowHeader; current != end; current = current.right) {
			for (var _current = current.down, _end = current; _current != _end; _current = _current.down) {
				if (_current.rowHeader != null) {
					for (var __current = _current.right, __end = _current; __current != __end; __current = __current.right) {
						__current.coverUD();
					}
				} else {
					_current.coverLR();
				}
			}
		}
		rowHeader.coverUD();
	}

	static UncoverRow(rowNum) {
		var rowHeader = SudokuSolver_rowHeaders[rowNum];
		for (var current = rowHeader.left, end = rowHeader; current != end; current = current.left) {
			for (var _current = current.down, _end = current; _current != _end; _current = _current.down) {
				if (_current.rowHeader != null) {
					print(_current.rowHeader._num);
					for (var __current = _current.right, __end = _current; __current != __end; __current = __current.right) {
						__current.uncoverUD();
					}
				} else {
					_current.uncoverLR();
				}
			}
		}
		rowHeader.uncoverUD();
	}

	static ChooseRow() {
		if (SudokuSolver_root.right == SudokuSolver_root) {
			print("Solved!");
			return true; // Solved!
		}

		var col = SudokuSolver_root.right,
			least = col.count;
		for (var current = col.right, end = SudokuSolver_root; current != end; current = current.right) {
			if (current.count < least) {
				col = current;
				least = col.count;
			}
		}
		print("Col Chosen: " + col._num + " | Count: " + least);

		if (col.down == col) {
			print("Unsolvable!");
			return false; // Unsolvable!
		}

		for (var current = col.down, end = col; current != end; current = current.down) {
			SudokuSolver_solution.push(current.rowHeader._num);
			SudokuSolver.CoverRow(current.rowHeader._num);
			print("Row Chosen: " + current.rowHeader._num);

			var solved = SudokuSolver.ChooseRow();
			if (solved) {
				return true;
			} else {
				SudokuSolver.UncoverRow(current.rowHeader._num);
				SudokuSolver_solution.pop();
			}
		}

		return false;
	}

	static Decrypt(solution) {
		for (var count = 0; count < solution.length; ++count) {
			var key = solution[count];
			var col = floor(key / 81);
			var row = floor(key % 81 / 9);
			var val = key % 9 + 1;
			solution[count] = col * 100 + row * 10 + val;
		}
	}
}
