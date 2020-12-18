declare module "@t.krapp/sudoku-js" {
    function solve(game: string, start_at: number): IterableIterator<string>;
    function check_item(item: string): Boolean;
    function get_col(game: string, col_number: number): string;
    function get_row(game: string, row_number: number): string;
    function get_square(game: string, x: number, y: number): string;
    function get_candidates(game: string, x: number, y: number): Set<string>;
    function difference(setA: Set<string>, setB: Set<string>): Set<string>;
    function is_complete(game: string): Boolean;
    function* iter_squares(game: string): IterableIterator<string>;
    function* iter_rows(game: string): IterableIterator<string>;
    function* iter_cols(game: string): IterableIterator<string>;
    function* range(start: number, stop: number, step: number): IterableIterator<number>;

    class ItemError {
        constructor(message: string);
    }
}
