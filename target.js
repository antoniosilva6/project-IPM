class Target {
	constructor(row, column, nWords, w, l, id) {
		this.numWords = nWords;
		this.width = w;
		this.label = l;
		this.id = id;
		this.x = 40 + (h_margin + this.width) * (column - 1) + this.width / 2;
		this.y = 40 + (v_margin + this.width) * (row - 1) + this.width / 2;
	}

	setColumn(new_column) {
		this.x = 40 + (h_margin + this.width) * (new_column - 1) + this.width / 2;
	}

	setRow(new_row) {
		this.y = 40 + (v_margin + this.width) * (new_row - 1) + this.width / 2;
	}
	// Checks if a mouse click took place
	// within the target
	clicked(mouse_x, mouse_y) {
		if (mode === state.TARGETS) {
			return (
				this.label[0] === letra_target &&
				dist(this.x + this.width / 2, this.y + this.width / 2, mouse_x, mouse_y) < this.width / 2
			);
		}
		if (mode === state.ALPHA) {
			return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
		}
		return false;
	}

	// Draws the target (i.e., a circle)
	// and its label
	draw() {
		fill(this.get_color());
		if (mode === state.TARGETS) {
			rect(this.x, this.y, this.width);
			textAlign(CENTER, CENTER);
		} else {
			circle(this.x, this.y, this.width);
			textAlign(CENTER);
		}
		// Draw label
		textStyle(BOLD);
		fill(color(255, 255, 255));
		if (mode == state.ALPHA) {
			textFont("Arial", 28);
			if (this.label[0] === "0") {
				text(this.label[0] + this.label[1], this.x, this.y - 20);
			} else {
				text(this.label[0], this.x, this.y - 20);
			}
		}
		textFont("Arial", 20);
		if (mode === state.TARGETS) {
			text(this.label, this.x + this.width / 2, this.y + this.width / 2);
		} else {
			text(this.label, this.x, this.y);
		}
		textStyle(NORMAL);
	}

	get_color() {
		let c = color(155, 155, 155);
		if (mode === state.TARGETS) {
			switch (this.numWords) {
				case 1:
					c = color(128, 0, 128);
					break;
				case 2:
					c = color(255, 20, 147);
					break;
				case 3:
					c = color(67, 0, 150);
					break;
			}
		} else if (mode === state.ALPHA) {
			switch (this.label[0]) {
				case "0":
					c = color(194, 192, 181);
					break;
				case "A":
					c = color(255, 77, 77);
					break;
				case "B":
					c = color(23, 45, 162);
					break;
				case "C":
					c = color(230, 138, 0);
					break;
				case "F":
					c = color(235, 41, 157);
					break;
				case "G":
					c = color(0, 133, 67);
					break;
				case "K":
					c = color(102, 210, 0);
					break;
				case "L":
					c = color(210, 210, 0);
					break;
				case "M":
					c = color(77, 38, 0);
					break;
				case "N":
					c = color(46, 184, 184);
					break;
				case "O":
					c = color(235, 61, 21);
					break;
				case "P":
					c = color(179, 0, 151);
					break;
				case "R":
					c = color(173, 0, 0);
					break;
				case "S":
					c = color(153, 153, 102);
					break;
				case "T":
					c = color(153, 153, 235);
					break;
				case "V":
					c = color(77, 0, 77);
					break;
				case "W":
					c = color(0, 153, 204);
					break;
				case "Y":
					c = color(255, 255, 153);
					break;
				case "Z":
					c = color(77, 0, 40);
					break;
			}
		}
		return c;
	}
}
