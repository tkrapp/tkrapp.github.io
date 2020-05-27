declare function solve(game: string, start_at: number): IterableIterator<string>;
declare function check_item(item: string): Boolean;
declare function get_col(game: string, col_number: number): string;
declare function get_row(game: string, row_number: number): string;
declare function get_square(game: string, x: number, y: number): string;

declare class ItemError {
    constructor(message: string);
}
