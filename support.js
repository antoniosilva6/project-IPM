// Support variables & functions (DO NOT CHANGE!)

let student_ID_form, display_size_form, start_button; // Initial input variables
let student_ID, display_size; // User input parameters

// Prints the initial UI that prompts that ask for student ID and screen size
function drawUserIDScreen() {
	background(color(0, 0, 0)); // sets background to black

	// Text prompt
	main_text = createDiv("Insert your student number and display size");
	main_text.id("main_text");
	main_text.position(10, 10);

	// Game Description
	description_text = createDiv(
		"Vais encontrar um MENU CIRCULAR com a primeira letra de cada alvo<br>\
		e só depois os alvos. Caso te ENGANES clica no BOTÃO DIREITO para<br>\
		retroceder ao MENU CIRCULAR."
	);
	description_text.id("description_text");
	description_text.position(20, 370);

	// Game Option
	game_option = createDiv(
		"AVISO: SE TE SENTIRES MUITO FAMILIARIZADO COM OS TARGETS<br> POR ORDEM\
		ALFABETICA, CLICA NO BOTAO DIREITO DEPOIS DE<br> CLICARES NO START,\
		CASO CONTRÁRIO IGNORA"
	);
	game_option.id("game_option");
	game_option.position(20,150);


	// Circles
	let colors = ['#800080', '#ff1493', '#430096'];
	let positions = [{x: 190, y: 300}, {x: 350, y: 300}, {x: 510, y: 300}];

	for(let i = 0; i < 3; i++){
		let color = colors[i];
		let position = positions[i];
		let x = position.x;
		let y = position.y;

		fill(color);
		circle(x, y, 50);
	}

	oneWord = createDiv("Uma palavra");
	oneWord.id("oneWord");
	oneWord.position(150, 330);

	twoWord = createDiv("Duas palavras");
	twoWord.id("twoWord");
	twoWord.position(310, 330);

	threeWord = createDiv("Três palavras");
	threeWord.id("threeWord");
	threeWord.position(470, 330);

	// Input forms:
	// 1. Student ID
	let student_ID_pos_y_offset = main_text.size().height + 40; // y offset from previous item

	student_ID_form = createInput(""); // create input field
	student_ID_form.position(200, student_ID_pos_y_offset);

	student_ID_label = createDiv("Student number (int)"); // create label
	student_ID_label.id("input");
	student_ID_label.position(10, student_ID_pos_y_offset);

	// 2. Display size
	let display_size_pos_y_offset = student_ID_pos_y_offset + student_ID_form.size().height + 20;

	display_size_form = createInput(""); // create input field
	display_size_form.position(200, display_size_pos_y_offset);

	display_size_label = createDiv("Display size in inches"); // create label
	display_size_label.id("input");
	display_size_label.position(10, display_size_pos_y_offset);

	// 3. Start button
	start_button = createButton("START");
	start_button.mouseReleased(startTest);
	start_button.position(
		width / 2 - start_button.size().width / 2,
		height / 2 - start_button.size().height / 2
	);
}

// Verifies if the student ID is a number, and within an acceptable range
function validID() {
	if (parseInt(student_ID_form.value()) < 200000 && parseInt(student_ID_form.value()) > 1000)
		return true;
	else {
		alert("Please insert a valid student number (integer between 1000 and 200000)");
		return false;
	}
}

// Verifies if the display size is a number, and within an acceptable range (>13")
function validSize() {
	if (parseInt(display_size_form.value()) <= 50 && parseInt(display_size_form.value()) > 12)
		return true;
	else {
		alert("Please insert a valid display size (between 13 and 50)");
		return false;
	}
}

// Starts the test (i.e., target selection task)
function startTest() {
	if (validID() && validSize()) {
		// Saves student and display information
		student_ID = parseInt(student_ID_form.value());
		display_size = parseInt(display_size_form.value());

		// Deletes UI elements
		main_text.remove();
		description_text.remove();
		game_option.remove();
		oneWord.remove();
		twoWord.remove();
		threeWord.remove();
		student_ID_form.remove();
		student_ID_label.remove();
		display_size_form.remove();
		display_size_label.remove();
		start_button.remove();

		// Goes fullscreen and starts test
		fullscreen(!fullscreen());
	}
}

// Randomize the order in the targets to be selected
function randomizeTrials() {
	trials = []; // Empties the array

	// Creates an array with random items from the "legendas" CSV
	for (var i = 0; i < NUM_OF_TRIALS; i++) trials.push(floor(random(legendas.getRowCount())));

	// print("trial order: " + trials);   // prints trial order - for debug purposes
}
