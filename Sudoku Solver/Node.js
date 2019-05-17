class Node {
	constructor() {
		this._up = null;
		this._down = null;
		this._left = null;
		this._right = null;
		this._colHeader = null;
		this._rowHeader = null;
	}

	set up(value) {
		this._up = value;
	}

	get up() {
		return this._up;
	}

	set down(value) {
		this._down = value;
	}

	get down() {
		return this._down;
	}

	set left(value) {
		this._left = value;
	}

	get left() {
		return this._left;
	}

	set right(value) {
		this._right = value;
	}

	get right() {
		return this._right;
	}

	set colHeader(value) {
		this._colHeader = value;
	}

	get colHeader() {
		return this._colHeader;
	}

	set rowHeader(value) {
		this._rowHeader = value;
	}

	get rowHeader() {
		return this._rowHeader;
	}

	coverUD() {
		this._up._down = this._down;
		this._down._up = this._up;
		if (this._colHeader != null)
			this._colHeader.subCount();
	}

	uncoverUD() {
		this._up._down = this;
		this._down._up = this;
		if (this._colHeader != null)
			this._colHeader.addCount();
	}

	coverLR() {
		this._left._right = this._right;
		this._right._left = this._left;
	}

	uncoverLR() {
		this._left._right = this;
		this._right._left = this;
	}
}

class ColHeader extends Node {
	constructor(root, num, count) {
		super();
		this._col = this;
		this._row = root;
		this._num = num; // Col number, represents constraints of the puzzle
		this._count = count; // Count of nodes connected in the column, used to deterministically determine which row has least nodes
	}

	set count(value) {
		this._count = value;
	}

	get count() {
		return this._count;
	}

	addCount() {
		this._count += 1;
	}

	subCount() {
		this._count -= 1;
	}
}

class RowHeader extends Node {
	constructor(root, num) {
		super();
		this._col = root;
		this._row = this;
		this._num = num; // Row number, represents a possible solution for a cell in the puzzle, represented by a col, row and val
	}
}
