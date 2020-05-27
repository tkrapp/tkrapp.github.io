import { check_item, get_col, get_row, get_square, solve } from "@t.krapp/sudoku-js";


const CLASS_INPUT = "input-container";
const EMPTY_GAME = " ".repeat(81);
const POSSIBLE_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ROW_SIZE = POSSIBLE_VALUES.length;
const CLASS_INPUT_SELECTED = "input-container-selected";

class SudokuGame {
    solution: string;
    game: string;
    elements: Array<HTMLElement>;
    protected selectedElement: keyof Array<HTMLElement>;

    constructor(gameElement: HTMLElement, controlsElement: HTMLElement) {
        let solutionIterator = solve(this.randomize(EMPTY_GAME, 1), 0);

        this.solution = solutionIterator.next().value;
        console.log("Got game");
        this.game = this.clearSomeFields(this.solution, 50);
        console.log("Removed fields");
        this.elements = Array.prototype.map.call(this.game, this.generateElement.bind(this));

        this.drawGame();

        for (let element of this.elements) {
            gameElement.appendChild(element);
        }

        gameElement.style.height = `${gameElement.offsetWidth}px`;
        gameElement.addEventListener("keyup", this.setFieldValueViaKeyboard.bind(this));

        controlsElement.querySelectorAll("button").forEach((buttonElement: HTMLButtonElement) => {
            buttonElement.addEventListener("click", this.setFieldValueViaButton.bind(this));
        });
    }

    getXfromPosition(position: number): number {
        return position % ROW_SIZE;
    }

    getYfromPosition(position: number): number {
        return Math.floor(position / ROW_SIZE);
    }

    clearSomeFields(game: string, num_fields: number): string {
        let moreThanOneSolution = true;
        let newGame: string;

        do {
            let position: number;
            do {
                position = this.getRandomNumber(0, game.length);
            } while (game[position] === " ");
            let solutionIterator;

            newGame = this.replaceAtPosition(
                this.replaceAtPosition(game, position, " "),
                game.length - position - 1,
                " "
            );
            solutionIterator = solve(newGame, 0);

            solutionIterator.next();
            moreThanOneSolution = !solutionIterator.next().done;
        } while (moreThanOneSolution)

        if (num_fields > 0) {
            return this.clearSomeFields(newGame, num_fields - 2);
        }
        return game;
    }

    generateElement(value: string, index: number): HTMLDivElement {
        let divElement = document.createElement("div");

        value = value.trim();

        divElement.setAttribute("data-field-index", index.toString());

        if (value !== "") {
            divElement.setAttribute("data-readonly", "true");
        } else {
            divElement.setAttribute("tabindex", "0");
            divElement.addEventListener("focus", this.selectField.bind(this));
        }

        divElement.classList.add(CLASS_INPUT);

        return divElement;
    }

    drawGame() {
        let self = this;

        Array.prototype.forEach.call(
            this.game,
            function (item: string, index: number) {
                let element = self.elements[index];

                if (element.innerHTML !== item) {
                    element.innerHTML = item;
                }
            });
    }

    occurresOnce(char: string, item: string): Boolean {
        return (item.match(new RegExp(char, "g")) || "").length === 1;
    }

    selectField(evt: Event) {
        let element = <HTMLElement> evt.target;

        if (this.selectedElement !== undefined) {
            let previousElement = <HTMLElement> this.elements[this.selectedElement];
            previousElement.classList.remove(CLASS_INPUT_SELECTED);
        }

        element.classList.add(CLASS_INPUT_SELECTED);

        this.selectedElement = parseInt(element.getAttribute("data-field-index"), 10);
    }

    setFieldValue(value: string) {
        if (this.selectedElement === undefined) {
            return;
        }
        let element = <HTMLElement> this.elements[this.selectedElement];
        let position = <number> this.selectedElement;
        let errorOccurred = false;
        let x = this.getXfromPosition(position);
        let y = this.getYfromPosition(position);

        this.game = this.replaceAtPosition(this.game, position, value);

        if (!this.occurresOnce(value, get_col(this.game, x))) {
            element.classList.add('error');
            errorOccurred = true;
        }

        if (!this.occurresOnce(value, get_row(this.game, y))) {
            element.classList.add('error');
            errorOccurred = true;
        }

        if (!this.occurresOnce(value, get_square(this.game, x, y))) {
            element.classList.add('error');
            errorOccurred = true;
        }

        if (errorOccurred === false) {
            console.log(errorOccurred);
            element.classList.remove("error");
        }

        this.drawGame();
    }

    setFieldValueViaKeyboard(evt: KeyboardEvent) {
        if (POSSIBLE_VALUES.indexOf(evt.key) >= 0 || evt.key === "Backspace") {
            let value = evt.key === "Backspace" ? " " : evt.key;

            this.setFieldValue(value);
        }
    }

    setFieldValueViaButton(evt: MouseEvent) {
        let buttonElement = <HTMLButtonElement> evt.target;
        let value = buttonElement.value;

        this.setFieldValue(value);
    }

    randomize(game: string, depth: number): string {
        let position = this.getRandomNumber(0, game.length);
        let num = this.getRandomNumber(1, 9);

        if (depth) {
            return this.randomize(
                this.replaceAtPosition(game, position, num.toString()),
                depth - 1
            );
        }
        return this.replaceAtPosition(game, 0, num.toString());
    }

    getRandomNumber(min_value: number, max_value: number) {
        return Math.floor(Math.random() * max_value + min_value);
    }

    replaceAtPosition(game: string, position: number, replace: string): string {
        return game.substring(0, position) + replace + game.substring(position + 1);
    }
}

function initSite() {
    document.body.style.height = `${window.screen.height}px`;
}

new SudokuGame(document.querySelector(".game"), document.querySelector('.controls'));
initSite();
