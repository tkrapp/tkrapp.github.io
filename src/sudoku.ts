import {
    check_item,
    get_col,
    get_row,
    get_square,
    solve,
} from "@t.krapp/sudoku-js";

const VALUE_SPACE = " ";

const EMPTY_GAME = VALUE_SPACE.repeat(81);

const POSSIBLE_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const ROW_SIZE = POSSIBLE_VALUES.length;

const CLASS_INPUT = "input-container";
const CLASS_INPUT_SELECTED = "selected";
const CLASS_INPUT_HIGHTLIGHTED = "highlighted";
const CLASS_INPUT_ERRORED = "errored";
const CLASS_INPUT_FILLED = "filled";
const CLASS_BTN_INFO = "btn-outline-info";
const CLASS_BTN_LIGHT = "btn-outline-light";

const ATTR_FIELD_INDEX = "data-field-index";
const ATTR_READONLY = "data-readonly";
const ATTR_TABINDEX = "tabindex";

const EVENT_TYPE_CLICK = "click";
const EVENT_TYPE_FOCUS = "focus";
const EVENT_TYPE_KEYUP = "keyup";

class SudokuGame {
    solution: string;
    game: string;
    elements: Array<HTMLElement>;
    controls: NodeListOf<HTMLButtonElement>;
    protected selectedElement: keyof Array<HTMLElement>;

    constructor(gameElement: HTMLElement, controlsElement: HTMLElement) {
        let solutionIterator = solve(this.randomize(EMPTY_GAME, 1), 0);

        this.solution = solutionIterator.next().value;
        console.log("Got game");
        this.game = this.clearSomeFields(this.solution, 50);
        console.log("Removed fields");
        this.elements = this.game
            .split("")
            .map(this.generateElement.bind(this));

        this.drawGame();

        for (let element of this.elements) {
            gameElement.appendChild(element);
        }

        gameElement.style.height = `${gameElement.offsetWidth}px`;
        gameElement.addEventListener(
            EVENT_TYPE_KEYUP,
            this.setFieldValueViaKeyboard.bind(this)
        );

        controlsElement
            .querySelectorAll<HTMLButtonElement>("button[value]")
            .forEach((buttonElement: HTMLButtonElement) => {
                buttonElement.addEventListener(
                    EVENT_TYPE_CLICK,
                    this.setFieldValueViaButton.bind(this)
                );
            });
        controlsElement
            .querySelector("button.btn-fullscreen")!
            .addEventListener(EVENT_TYPE_CLICK, function (evt) {
                document.documentElement.requestFullscreen();
            });
        controlsElement
            .querySelector("button.btn-check")!
            .addEventListener(EVENT_TYPE_CLICK, this.checkGame.bind(this));

        this.controls = controlsElement.querySelectorAll("button[value]");
        this.selectedElement = this.game.indexOf(VALUE_SPACE);
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
            } while (game[position] === VALUE_SPACE);
            let solutionIterator;

            newGame = this.replaceAtPosition(
                this.replaceAtPosition(game, position, VALUE_SPACE),
                game.length - position - 1,
                VALUE_SPACE
            );
            solutionIterator = solve(newGame, 0);

            solutionIterator.next();
            moreThanOneSolution = !solutionIterator.next().done;
        } while (moreThanOneSolution);

        if (num_fields > 0) {
            return this.clearSomeFields(newGame, num_fields - 2);
        }
        return game;
    }

    generateElement(value: string, index: number): HTMLDivElement {
        let divElement = document.createElement("div");

        value = value.trim();

        divElement.setAttribute(ATTR_FIELD_INDEX, index.toString());

        if (value !== "") {
            divElement.setAttribute(ATTR_READONLY, "true");
        } else {
            divElement.setAttribute(ATTR_TABINDEX, "0");
            divElement.addEventListener(
                EVENT_TYPE_FOCUS,
                this.selectField.bind(this)
            );
        }

        divElement.classList.add(CLASS_INPUT);

        return divElement;
    }

    checkGame() {
        this.solution.split("").forEach((value: string, index: number) => {
            let element = this.elements[index];
            let currentValue = element.innerHTML;

            if (currentValue !== value && currentValue !== VALUE_SPACE) {
                element.classList.add(CLASS_INPUT_ERRORED);
            } else {
                element.classList.remove(CLASS_INPUT_ERRORED);
            }
        });
    }

    drawGame() {
        this.game.split("").forEach((value: string, index: number) => {
            let element = this.elements[index];

            if (element.innerHTML !== value) {
                element.innerHTML = value;
            }
        });
    }

    occurresOnce(char: string, item: string): Boolean {
        return (item.match(new RegExp(char, "g")) || "").length === 1;
    }

    selectField(evt: Event) {
        let element = <HTMLElement>evt.target;

        if (this.selectedElement !== undefined) {
            let previousElement = <HTMLElement>(
                this.elements[this.selectedElement]
            );
            previousElement.classList.remove(CLASS_INPUT_SELECTED);
        }

        element.classList.add(CLASS_INPUT_SELECTED);

        this.selectedElement = parseInt(
            element.getAttribute(ATTR_FIELD_INDEX)!,
            10
        );
        this.highlightFields();
    }

    highlightFields() {
        let highlightValue = this.game[this.selectedElement as number];

        this.elements.forEach((element: HTMLElement) => {
            element.classList.remove(CLASS_INPUT_HIGHTLIGHTED);
        });

        if (highlightValue === VALUE_SPACE) {
            return;
        }

        this.game.split("").forEach((value: string, index: number) => {
            if (value === highlightValue) {
                this.elements[index].classList.add(CLASS_INPUT_HIGHTLIGHTED);
            }
        });
    }

    updateControls() {
        this.controls.forEach((element: HTMLButtonElement) => {
            let value = element.value;

            if (this.game.split(value).length - 1 === 9) {
                element.classList.remove(CLASS_BTN_INFO);
                element.classList.add(CLASS_BTN_LIGHT);
            } else {
                element.classList.remove(CLASS_BTN_LIGHT);
                element.classList.add(CLASS_BTN_INFO);
            }
        });
    }

    setFieldValue(value: string) {
        if (this.selectedElement === undefined) {
            return;
        }
        let element = <HTMLElement>this.elements[this.selectedElement];
        let position = <number>this.selectedElement;
        let errorOccurred = false;
        let x = this.getXfromPosition(position);
        let y = this.getYfromPosition(position);

        if (this.game[position] === value) {
            value = VALUE_SPACE;
        }

        this.game = this.replaceAtPosition(this.game, position, value);

        if (value !== VALUE_SPACE) {
            element.classList.add(CLASS_INPUT_FILLED);

            if (!this.occurresOnce(value, get_col(this.game, x))) {
                element.classList.add(CLASS_INPUT_ERRORED);
                errorOccurred = true;
            }

            if (!this.occurresOnce(value, get_row(this.game, y))) {
                element.classList.add(CLASS_INPUT_ERRORED);
                errorOccurred = true;
            }

            if (!this.occurresOnce(value, get_square(this.game, x, y))) {
                element.classList.add(CLASS_INPUT_ERRORED);
                errorOccurred = true;
            }
        } else {
            element.classList.remove(CLASS_INPUT_FILLED);
        }

        if (errorOccurred === false) {
            console.log(errorOccurred);
            element.classList.remove(CLASS_INPUT_ERRORED);
        }

        this.highlightFields();
        this.updateControls();
        this.drawGame();
    }

    setFieldValueViaKeyboard(evt: KeyboardEvent) {
        if (POSSIBLE_VALUES.indexOf(evt.key) >= 0 || evt.key === "Backspace") {
            let value = evt.key === "Backspace" ? VALUE_SPACE : evt.key;

            this.setFieldValue(value);
        }
    }

    setFieldValueViaButton(evt: MouseEvent) {
        let buttonElement = <HTMLButtonElement>evt.target;
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
        return (
            game.substring(0, position) + replace + game.substring(position + 1)
        );
    }
}

function resizeGame() {
    document.body.style.height = `${window.innerHeight}px`;
}

window.addEventListener("resize", resizeGame);

function initSite() {
    resizeGame();
}

new SudokuGame(
    document.querySelector<HTMLElement>(".game")!,
    document.querySelector<HTMLElement>(".controls")!
);
initSite();
