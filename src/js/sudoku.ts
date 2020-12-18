import {
    get_col,
    get_row,
    get_square,
    iter_cols,
    iter_rows,
    iter_squares,
    solve,
} from "@t.krapp/sudoku-js";

const VALUE_SPACE = " ";

const EMPTY_GAME = VALUE_SPACE.repeat(81);

const LOADING_GAME =
    "                           " +
    " LOADING    ...            " +
    "                           ";

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

class MaxAttemptsReachedError extends Error {
    message: string = "Maximum number of attempts reached";
}

class SudokuGame {
    solution: string;
    game: string;
    elements: Array<HTMLElement>;
    controls: NodeListOf<HTMLButtonElement>;
    protected selectedElement: keyof Array<HTMLElement>;
    selectFieldListener: { (evt: Event): void };

    constructor(rootElement: HTMLElement) {
        const titleElement: HTMLElement = <HTMLElement>(
            rootElement.querySelector(".title")!
        );
        const gameElement: HTMLElement = <HTMLElement>(
            rootElement.querySelector(".game")!
        );
        const controlsElement: HTMLElement = <HTMLElement>(
            rootElement.querySelector(".controls")!
        );
        this.game = LOADING_GAME;
        this.elements = this.game
            .split("")
            .map(this.generateElement.bind(this));
        this.updateElementAttributes();

        for (let element of this.elements) {
            gameElement.appendChild(element);
        }

        this.drawGame();

        let gameHeight =
            rootElement.offsetHeight -
            titleElement.offsetHeight -
            controlsElement.offsetHeight;
        let gameWidth = gameElement.offsetWidth;
        let widthAndHeight = Math.min(gameWidth, gameHeight);
        gameElement.style.height = `${widthAndHeight}px`;
        gameElement.style.width = `${widthAndHeight}px`;
        gameElement.addEventListener(
            EVENT_TYPE_KEYUP,
            this.setFieldValueViaKeyboard.bind(this)
        );

        controlsElement.style.flexGrow = "1";
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
        this.solution = EMPTY_GAME;
        this.selectFieldListener = this.selectField.bind(this);
        this.selectedElement = 0;
    }

    check_incomplete_item(item: string): boolean {
        let counter = Array.from(item).reduce(
            (acc: Map<string, number>, value: string) => {
                if (value !== " ") {
                    acc.set(value, (acc.get(value) || 0) + 1);
                } else {
                    acc.set(value, 1);
                }

                return acc;
            },
            new Map<string, number>()
        );

        return Array.from(counter.values()).every(
            (value: number) => value === 1
        );
    }

    async init() {
        const MAX_ATTEMPTS = 1000;
        let initialGame: string;
        let error: boolean;
        let attempts = 0;
        do {
            error = false;
            initialGame = this.randomize(EMPTY_GAME, 4, new Set());
            attempts += 1;

            for (let row of iter_rows(initialGame)) {
                error = error || this.check_incomplete_item(row) === false;
            }
            for (let column of iter_cols(initialGame)) {
                error = error || this.check_incomplete_item(column) === false;
            }
            for (let square of iter_squares(initialGame)) {
                error = error || this.check_incomplete_item(square) === false;
            }
        } while (error && attempts < MAX_ATTEMPTS);
        if (attempts >= MAX_ATTEMPTS) {
            throw new MaxAttemptsReachedError();
        }
        let solutionIterator = solve(initialGame, 0);

        this.solution = solutionIterator.next().value;
        try {
            this.game = this.clearSomeFields(this.solution, 50);
        } catch (e) {}
        this.selectedElement = this.game.indexOf(VALUE_SPACE);

        this.updateElementAttributes();
        this.drawGame();
    }

    getXfromPosition(position: number): number {
        return position % ROW_SIZE;
    }

    getYfromPosition(position: number): number {
        return Math.floor(position / ROW_SIZE);
    }

    clearSomeFields(game: string, num_fields: number): string {
        const MAX_ATTEMPTS = 10;
        let moreThanOneSolution = true;
        let newGame: string;
        let visitedPositions: Set<number> = new Set();
        let attempts = 0;

        do {
            let position: number;
            do {
                position = this.getRandomNumber(0, game.length);
            } while (
                game[position] === VALUE_SPACE &&
                visitedPositions.has(position) === false
            );
            let solutionIterator;

            newGame = this.replaceAtPosition(
                this.replaceAtPosition(game, position, VALUE_SPACE),
                game.length - position - 1,
                VALUE_SPACE
            );
            solutionIterator = solve(newGame, 0);

            solutionIterator.next();
            moreThanOneSolution = !solutionIterator.next().done;
            visitedPositions.add(position);
            attempts += 1;
        } while (moreThanOneSolution && attempts < MAX_ATTEMPTS);

        if (attempts > MAX_ATTEMPTS) {
            throw new MaxAttemptsReachedError();
        }

        if (num_fields > 0) {
            return this.clearSomeFields(newGame, num_fields - 2);
        }
        return game;
    }

    generateElement(_value: string, index: number): HTMLDivElement {
        let divElement = document.createElement("div");

        divElement.setAttribute(ATTR_FIELD_INDEX, index.toString());

        divElement.classList.add(CLASS_INPUT);

        return divElement;
    }

    updateElementAttributes() {
        this.game.split("").forEach((value: string, index: number): void => {
            let divElement = this.elements[index];

            if (value !== " ") {
                divElement.setAttribute(ATTR_READONLY, "true");
                divElement.removeAttribute(ATTR_TABINDEX);
                divElement.removeEventListener(
                    EVENT_TYPE_FOCUS,
                    this.selectFieldListener
                );
            } else {
                divElement.removeAttribute(ATTR_READONLY);
                divElement.setAttribute(ATTR_TABINDEX, "0");
                divElement.addEventListener(
                    EVENT_TYPE_FOCUS,
                    this.selectFieldListener
                );
            }
        });
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

    occurresOnce(char: string, item: string): boolean {
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

    randomize(
        game: string,
        depth: number,
        positionsTaken: Set<number>
    ): string {
        let position: number;
        do {
            position = this.getRandomNumber(0, game.length);
        } while (positionsTaken.has(position) === true);
        positionsTaken.add(position);

        let num = this.getRandomNumber(1, 9);

        if (depth > 1) {
            return this.randomize(
                this.replaceAtPosition(game, position, num.toString()),
                depth - 1,
                positionsTaken
            );
        }
        return this.replaceAtPosition(game, 0, num.toString());
    }

    getRandomNumber(min_value: number, max_value: number) {
        let numberArray = new Uint8Array(1);

        window.crypto.getRandomValues(numberArray);
        
        return numberArray[0] % max_value + min_value;
    }

    replaceAtPosition(game: string, position: number, replace: string): string {
        return (
            game.substring(0, position) + replace + game.substring(position + 1)
        );
    }
}

function resizeGame(): void {
    document.body.style.height = `${window.innerHeight}px`;
}

window.addEventListener("resize", resizeGame);

function initSite() {
    resizeGame();
    const game = new SudokuGame(document.body);

    setTimeout(game.init.bind(game), 500);
}

initSite();
