import seedRandom from "seedrandom";

export const generateISBN = (books, seed) => {
    const rng = new seedRandom(seed);
    //log the tyoe of books
    let isbns = [];
    books.forEach((book) => {
        // isbns must be unique
        let isbn = 978e10 + Math.floor(rng() * 10000000000);
        while (isbns.includes(isbn)) {
            isbn = 978e10 + Math.floor(rng() * 10000000000);
        }
        isbns.push(isbn);
        book.isbn = isbn;
    });
};
