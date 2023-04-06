	const model = {
			boardSize: 7,
			numShips: 3,
			shipLength: 3,
			shipsSunk: 0,
	
	ships: [
			{ locations: [0, 0, 0], hits: ["", "", ""] },
			{ locations: [0, 0, 0], hits: ["", "", ""] },
			{ locations: [0, 0, 0], hits: ["", "", ""] }
		],

	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			const ship = this.ships[i];
			let index = ship.locations.indexOf(guess);

// Sprawdzenie, czy okręt nie został już trafiony, wyświetlanie komunikatu i zakończenie działania.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Ups, już wcześnej trafiłeś to pole!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("TRAFIONY!");

				if (this.isSunk(ship)) {
					view.displayMessage("Zatopiłeś mój okręt!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Spudłowałeś.");
		return false;
	},

	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},
// Generowanie położenia okrętów
	generateShipLocations: function() {
		let locations;
		for (let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Tablica okrętów: ");
		console.log(this.ships);
	},

	generateShip: function() {
		let direction = Math.floor(Math.random() * 2);
		let row, col;

		if (direction === 1) { // W poziomie.
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else { // W pionie.
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
};


const view = {
	displayMessage: function(msg) {
		const messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		const cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		const cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

};

const controller = {
	guesses: 0,

	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
               view.displayMessage("Zatopiłeś wszystkie moje okręty, w " +
                        this.guesses + " próbach.");
			}
		}
	}
}


// Funkcja przetwarzająca współrzędne wpisane przez użytkownika.

function parseGuess(guess) {
	const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Ups, proszę wpisać literę i cyfrę.");
	} else {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Ups, to nie są współrzędne!");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Ups, pole poza planszą!");
		} else {
			return row + column;
		}
	}
	return null;
}


// Funkcje obsługi zdarzeń.

function handleFireButton() {
	const guessInput = document.getElementById("guessInput");
	let guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	const fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}


// Funkcja init - wywoływana po zakończeniu wczytywania strony.

window.onload = init;

function init() {
	// Procedura obsługi przycisku Ognia!
	const fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// Obsługa naciśnięcia klawisza "Enter".
	const guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// Umieszczenie okrętów na planszy.
	model.generateShipLocations();
}
