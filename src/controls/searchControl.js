const searchControl = () => {
  return {
    searchBooks() {
      const keyword = this.$store.booksApp.searchInput.trim().toLowerCase();
      const sourceMap = {
        allBooks: this.$store.booksApp.allBooks,
        toReadBooks: this.$store.booksApp.toReadBooks,
        finishedBooks: this.$store.booksApp.finishedBooks,
      };

      const source = sourceMap[this.$store.booksApp.currentBookList];

      if (keyword === "") {
        this.$store.booksApp.searchInput = "";
        this.$store.booksApp.currentBooks = source;
        return;
      } else {
        this.$store.booksApp.currentBooks = source.filter((book) => {
          return (
            book.title.toLowerCase().includes(keyword) ||
            book.authors.join(",").toLowerCase().includes(keyword)
          );
        });
      }
    },
  };
};

export { searchControl };
