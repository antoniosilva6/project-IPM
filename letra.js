class Letra {
	constructor(x, y, w, l) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.label = l;
	}

	// Checks if a mouse click took place
	// within the target
	clicked(mouse_x, mouse_y) {
		return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
	}

	draw() {
		// desenha o círculo
		if (
			this.label[0] === "A" ||
			this.label[0] === "K" ||
			this.label[0] === "P" ||
			this.label[0] === "W"
		) {
			fill(189, 83, 107);
		} else {
			fill(255);
		}
		stroke(0);
		strokeWeight(2);
		circle(this.x, this.y, this.width);

		// escreve o texto dentro do círculo
		const letter = this.label === "0" ? "0%" : this.label; // obtém a letra correspondente
		textFont("Arial", 25);
		fill(color(0, 0, 0));
		textAlign(CENTER);
		text(letter, this.x, this.y);
	}
}
