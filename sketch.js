// Bakeoff #2 -- Seleção em Interfaces Densas
// IPM 2022-23, Período 3
// Entrega: até dia 31 de Março às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 10 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 24; // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE = false; // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS = 12; // The numbers of trials (i.e., target selections) to be completed
const GRID_ROWS = 8; // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS = 10; // We divide our 80 targets in a 8x10 grid
let continue_button;
let legendas; // The item list from the "legendas" CSV
let letrasP;
// Metrics
let testStartTime, testEndTime; // time between the start and end of one attempt (8 trials)
let hits = 0; // number of successful selections
let misses = 0; // number of missed selections (used to calculate accuracy)
let database; // Firebase DB

// Study control parameters
let trials; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)

// Target list
let targets = [];
let letras = [];

let letra_target = "A";

const letters = "ABCFGKLMNOPRSTVWYZ0";

const target_letter_info = [
	[5, 3, 1], // Golden
	[4, 6, 2], // Granny Smith
	[5, 5, 2], // Pink Lady
	[3, 6, 2], // Red Delicious
	[5, 6, 2], // Royal Gala
	[5, 4, 1], // Avocado
	[4, 4, 1], // Banana
	[4, 6, 1], // Kiwi
	[4, 6, 1], // Lemon
	[5, 5, 1], // Lime
	[4, 3, 1], // Mango
	[3, 4, 1], // Cantaloupe
	[4, 5, 2], // Galia Melon
	[4, 4, 1], // Melon
	[4, 5, 1], // Watermelon
	[4, 5, 1], // Nectarine
	[4, 4, 1], // Orange
	[3, 3, 1], // Papaya
	[3, 5, 2], // Passion Fruit
	[3, 4, 1], // Peach
	[4, 3, 1], // Anjou
	[4, 4, 1], // Conference
	[4, 5, 1], // Kaiser
	[4, 3, 1], // Pineapple
	[4, 4, 1], // Plum
	[5, 3, 1], // Pomegranate
	[4, 5, 2], // Red Grapefruit
	[4, 3, 1], // Satsumas
	[4, 5, 2], // Apple Juice
	[4, 6, 2], // Orange Juice
	[4, 5, 2], // Pear Juice
	[4, 6, 2], // Mango Juice
	[3, 6, 2], // Peach Juice
	[4, 6, 2], // Fresh Juice
	[4, 5, 2], // Cherry Juice
	[4, 4, 1], // Smoothie
	[4, 5, 2], // Mandarin Juice
	[4, 7, 3], // Bio Fat Milk
	[4, 5, 2], // 0% Milk
	[4, 5, 2], // Fat Milk
	[4, 6, 2], // Standard Milk
	[4, 8, 3], // Bio Skim Milk
	[4, 6, 2], // Bio Milk
	[4, 3, 1], // Oatghurt
	[4, 5, 2], // Oat Milk
	[4, 5, 2], // Bio Cream
	[3, 5, 2], // Sour Cream
	[3, 6, 2], // Sour Milk
	[5, 5, 2], // Bio Soyghurt
	[5, 3, 1], // Soyghurt
	[5, 7, 3], // Bio Soy Milk
	[4, 5, 2], // Soy Milk
	[4, 6, 2], // Cherry Yoghurt
	[4, 6, 2], // 0% Yoghurt
	[4, 5, 1], // Yoghurt
	[5, 5, 2], // Mango Yoghurt
	[4, 6, 2], // Pear Yoghurt
	[4, 5, 2], // Vanilla Yoghurt
	[4, 4, 1], // Asparagus
	[5, 3, 1], // Aubergine
	[3, 3, 1], // Cabbage
	[4, 3, 1], // Carrots
	[5, 3, 1], // Cucumber
	[4, 3, 1], // Garlic
	[4, 4, 1], // Ginger
	[4, 5, 1], // Leek
	[5, 3, 1], // Mushroom
	[4, 6, 2], // Yellow Onion
	[3, 6, 2], // Bell Pepper
	[5, 5, 2], // Rocoto Pepper
	[5, 6, 2], // Piri Piri
	[5, 6, 2], // Mild Pepper
	[4, 6, 2], // White Potato
	[4, 6, 2], // Red Potato
	[5, 5, 2], // Sweet Potato
	[3, 5, 2], // Red Beet
	[3, 5, 2], // Beef Tomato
	[4, 5, 1], // Tomato
	[4, 6, 2], // Vine Tomato
	[4, 5, 1], // Zucchini
];


const state = { ALPHA: 0, LETTERS: 1, TARGETS: 2, NO: 3 };
let mode = state.NO;

// Ensures important data is loaded before the program starts
function preload() {
	legendas = loadTable("legendas.csv", "csv", "header");
	letrasP = loadTable("letras.csv", "csv", "header");
}

// Runs once at the start
function setup() {
	createCanvas(700, 500); // window size in px before we go into fullScreen()
	frameRate(60); // frame rate (DO NOT CHANGE!)

	randomizeTrials(); // randomize the trial order at the start of execution
	drawUserIDScreen(); // draws the user start-up screen (student ID and display size)
}

function draw_the_first_targets() {
	background(color(0, 0, 0));

	// loop para desenhar 16 círculos
	for (let i = 0; i < letrasP.getRowCount() + 1; i++) {
		letras[i].draw();
	}

	// Print trial count at the top left-corner of the canvas
	textFont("Arial", 16);
	fill(color(255, 255, 255));
	textAlign(LEFT);
	text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

	// Draw the target label to be selected in the current trial
	textFont("Arial", 20);
	textAlign(CENTER);
	text(legendas.getString(trials[current_trial], 0), width / 2, height - 20);
}

// Runs every frame and redraws the screen
function draw() {
	if (mode === state.NO) {
		return;
	}
	if (mode === state.LETTERS) {
		draw_the_first_targets();
		return;
	}
	if (attempt < 2) {
		// The user is interacting with the 6x3 target grid
		background(color(0, 0, 0)); // sets background to black
		// Print trial count at the top left-corner of the canvas
		textFont("Arial", 16);
		fill(color(255, 255, 255));
		textAlign(LEFT);
		text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

		textFont("Arial", 20);
		textAlign(CENTER);
		text(legendas.getString(trials[current_trial], 0), width / 2, height - 20);
	}
	// Draw all targets
	draw_targets();
}

function draw_targets() {
	let i;
	if (mode === state.ALPHA) {
		for (i = 0; i < legendas.getRowCount(); i++) {
			targets[i].draw();
		}
	} else if (mode === state.TARGETS) {
		for (i = 0; i < legendas.getRowCount(); i++) {
			if (targets[i].label[0] === letra_target) {
				targets[i].draw();
			}
		}
	}
}

// Print and save results at the end of 54 trials
function printAndSavePerformance() {
	// DO NOT CHANGE THESE!
	let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
	let test_time = (testEndTime - testStartTime) / 1000;
	let time_per_target = nf(test_time / parseFloat(hits + misses), 0, 3);
	let penalty = constrain(
		(parseFloat(95) - parseFloat(hits * 100) / parseFloat(hits + misses)) * 0.2,
		0,
		100
	);
	let target_w_penalty = nf(test_time / parseFloat(hits + misses) + penalty, 0, 3);
	let timestamp =
		day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();

	textFont("Arial", 18);
	background(color(0, 0, 0)); // clears screen
	fill(color(255, 255, 255)); // set text fill color to white
	textAlign(LEFT);
	text(timestamp, 10, 20); // display time on screen (top-left corner)

	textAlign(CENTER);
	text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
	text("Hits: " + hits, width / 2, 100);
	text("Misses: " + misses, width / 2, 120);
	text("Accuracy: " + accuracy + "%", width / 2, 140);
	text("Total time taken: " + test_time + "s", width / 2, 160);
	text("Average time per target: " + time_per_target + "s", width / 2, 180);
	text("Average time for each target (+ penalty): " + target_w_penalty + "s", width / 2, 220);

	// Saves results (DO NOT CHANGE!)
	let attempt_data = {
		project_from: GROUP_NUMBER,
		assessed_by: student_ID,
		test_completed_by: timestamp,
		attempt: attempt,
		hits: hits,
		misses: misses,
		accuracy: accuracy,
		attempt_duration: test_time,
		time_per_target: time_per_target,
		target_w_penalty: target_w_penalty,
	};

	// Send data to DB (DO NOT CHANGE!)
	if (RECORD_TO_FIREBASE) {
		// Access the Firebase DB
		if (attempt === 0) {
			firebase.initializeApp(firebaseConfig);
			database = firebase.database();
		}

		// Add user performance results
		let db_ref = database.ref("G" + GROUP_NUMBER);
		db_ref.push(attempt_data);
	}
}

function update_trials() {
	current_trial++;
	if (current_trial === NUM_OF_TRIALS) {
		mode = state.NO;
		testEndTime = millis();
		// Print the user's results on-screen and send these to the DB
		printAndSavePerformance();
		attempt++;
		// If there's an attempt to go create a button to start this
		if (attempt < 2) {
			continue_button = createButton("START 2ND ATTEMPT");
			continue_button.mouseReleased(continueTest);
			continue_button.position(
				width / 2 - continue_button.size().width / 2,
				height / 2 - continue_button.size().height / 2
			);
		}
	}
	// Check if this was the first selection in an attempt
	else if (current_trial === 1) testStartTime = millis();
}

function is_wrong_target(itarget) {
	if (mode === state.TARGETS) {
		return targets[itarget].label[0] === letra_target;
	}
	return mode === state.ALPHA;
}

function update_mode() {
	if (mouseButton === LEFT && mode === state.TARGETS) {
		mode = state.LETTERS;
		return;
	}
}

function update_target_letter(letter) {
	for (let i = 0; i < letrasP.getRowCount() + 1; i++) {
		if (letras[i].label === letter) {
			letra_target = letter;
			return;
		}
	}
}

function do_left() {
	if (mode === state.LETTERS) {
		for (let i = 0; i < letrasP.getRowCount() + 1; i++) {
			if (letras[i].clicked(mouseX, mouseY)) {
				update_target_letter(letters[i]);
				mode = state.TARGETS;
				return;
			}
		}
	}
	for (let i = 0; i < legendas.getRowCount(); i++) {
		// Check if the user clicked over one of the targets
		if (targets[i].clicked(mouseX, mouseY)) {
			// Checks if it was the correct target
			if (targets[i].id === trials[current_trial]) {
				hits++;
			} else if (is_wrong_target(i)) {
				misses++;
			} else {
				return;
			}
			update_mode();
			update_trials();
		}
	}
}

function do_right() {
	if (mode !== state.TARGETS) {
		mode = (mode === state.LETTERS) ? state.ALPHA : state.LETTERS; 
		changeTargets(mode);
		return;
	}
	mode = state.LETTERS;
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
	if (mode === state.NO) {
		return;
	}
	if (mouseButton === LEFT) {
		do_left();
		return;
	}
	do_right();
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
	// Re-randomize the trial order
	randomizeTrials();

	// Resets performance variables
	hits = 0;
	misses = 0;

	current_trial = 0;
	continue_button.remove();

	// Shows the targets again
	mode = state.LETTERS;
}

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap) {
	// Define the margins between targets by dividing the white space
	// for the number of targets minus one
	h_margin = horizontal_gap / (GRID_COLUMNS - 1);
	v_margin = vertical_gap / (GRID_ROWS - 1);
	for (let i = 0; i < GRID_COLUMNS * GRID_ROWS; i++) {
		targets.push(
			new Target(
				target_letter_info[i][0],
				target_letter_info[i][1],
				target_letter_info[i][2],
				target_size,
				legendas.getString(i, 0),
				legendas.getNum(i, 1)
			)
		);
	}
}

function changeTargets(new_mode) {
	if (new_mode === state.ALPHA) {
		const target_alpha_info = [
			[3, 9, 1], // Golden
			[3, 10, 2], // Granny Smith
			[6, 5, 2], // Pink Lady
			[6, 10, 2], // Red Delicious
			[7, 4, 2], // Royal Gala
			[1, 7, 1], // Avocado
			[1, 8, 1], // Banana
			[4, 2, 1], // Kiwi
			[4, 4, 1], // Lemon
			[4, 5, 1], // Lime
			[4, 7, 1], // Mango
			[2, 8, 1], // Cantaloupe
			[3, 6, 2], // Galia Melon
			[4, 10, 1], // Melon
			[8, 6, 1], // Watermelon
			[5, 3, 1], // Nectarine
			[5, 6, 1], // Orange
			[5, 8, 1], // Papaya
			[5, 9, 2], // Passion Fruit
			[5, 10, 1], // Peach
			[1, 3, 1], // Anjou
			[3, 2, 1], // Conference
			[4, 1, 1], // Kaiser
			[6, 4, 1], // Pineapple
			[6, 7, 1], // Plum
			[6, 8, 1], // Pomegranate
			[7, 1, 2], // Red Grapefruit
			[7, 5, 1], // Satsumas
			[1, 4, 2], // Apple Juice
			[5, 7, 2], // Orange Juice
			[6, 2, 2], // Pear Juice
			[4, 8, 2], // Mango Juice
			[6, 1, 2], // Peach Juice
			[3, 5, 2], // Fresh Juice
			[2, 10, 2], // Cherry Juice
			[7, 6, 1], // Smoothie
			[4, 6, 2], // Mandarin Juice
			[2, 2, 3], // Bio Fat Milk
			[1, 1, 2], // 0% Milk
			[3, 4, 2], // Fat Milk
			[8, 1, 2], // Standard Milk
			[2, 4, 3], // Bio Skim Milk
			[2, 3, 2], // Bio Milk
			[5, 5, 1], // Oatghurt
			[5, 4, 2], // Oat Milk
			[2, 1, 2], // Bio Cream
			[7, 7, 2], // Sour Cream
			[7, 8, 2], // Sour Milk
			[2, 6, 2], // Bio Soyghurt
			[7, 10, 1], // Soyghurt
			[2, 5, 3], // Bio Soy Milk
			[7, 9, 2], // Soy Milk
			[3, 1, 2], // Cherry Yoghurt
			[1, 2, 2], // 0% Yoghurt
			[8, 9, 1], // Yoghurt
			[4, 9, 2], // Mango Yoghurt
			[6, 3, 2], // Pear Yoghurt
			[8, 4, 2], // Vanilla Yoghurt
			[1, 5, 1], // Asparagus
			[1, 6, 1], // Aubergine
			[2, 7, 1], // Cabbage
			[2, 9, 1], // Carrots
			[3, 3, 1], // Cucumber
			[3, 7, 1], // Garlic
			[3, 8, 1], // Ginger
			[4, 3, 1], // Leek
			[5, 2, 1], // Mushroom
			[8, 8, 2], // Yellow Onion
			[1, 10, 2], // Bell Pepper
			[7, 3, 2], // Rocoto Pepper
			[6, 6, 2], // Piri Piri
			[5, 1, 2], // Mild Pepper
			[8, 7, 2], // White Potato
			[7, 2, 2], // Red Potato
			[8, 2, 2], // Sweet Potato
			[6, 9, 2], // Red Beet
			[1, 9, 2], // Beef Tomato
			[8, 3, 1], // Tomato
			[8, 5, 2], // Vine Tomato
			[8, 10, 1], // Zucchini
		];
		for (let i = 0; i < targets.length; i++) {
			targets[i].setRow(target_alpha_info[i][0]);
			targets[i].setColumn(target_alpha_info[i][1]);
		}
	} else if (new_mode === state.LETTERS) {
		for (let i = 0; i < targets.length; i++) {
			targets[i].setRow(target_letter_info[i][0]);
			targets[i].setColumn(target_letter_info[i][1]);
		}
	}
}

function createLetters(radius) {
	const centerX = width / 2; // coordenada x do centro da circunferência
	const centerY = height / 2; // coordenada y do centro da circunferência
	const den = letters.length + 1;
	for (let i = 0; i < letrasP.getRowCount() + 1; i++) {
		let angle = (3 * TWO_PI) / 4 + (i * TWO_PI) / den; // ângulo em radianos
		let x = centerX + cos(angle) * radius; // coordenada x do centro do círculo
		let y = centerY + sin(angle) * radius; // coordenada y do centro do círculo

		let letra = new Letra(x, y, radius * sin(TWO_PI / den), letters[i]);
		letras.push(letra);
	}
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
	if (fullscreen()) {
		// DO NOT CHANGE THESE!
		resizeCanvas(windowWidth, windowHeight);
		let display = new Display({ diagonal: display_size }, window.screen);
		PPI = display.ppi; // calculates pixels per inch
		PPCM = PPI / 2.54; // calculates pixels per cm

		// Make your decisions in 'cm', so that targets have the same size for all participants
		// Below we find out out white space we can have between 2 cm targets
		let screen_width = display.width * 2.54; // screen width
		screen_height = display.height * 2.54; // screen height
		// sets the target size (will be converted to cm when passed to createTargets)
		let target_size = (screen_height - 80 / PPCM) / GRID_ROWS;
		let radius = (screen_height * PPCM * 0.6) / 2; // raio da circunferência das letras

		// empty space in cm across the x-axis (based on 10 targets per row)
		let horizontal_gap = screen_width - target_size * GRID_COLUMNS;
		// empty space in cm across the y-axis (based on 8 targets per column)
		let vertical_gap = screen_height - target_size * GRID_ROWS;

		// Creates and positions the UI targets according to the white space defined above (in cm!)
		// 80 represent some margins around the display (e.g., for text)
		createTargets(target_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 80);
		createLetters(radius);

		// Starts drawing targets immediately after we go fullscreen
		mode = state.LETTERS;
	}
}
