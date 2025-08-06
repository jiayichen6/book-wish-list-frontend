const searchControl = () => {
  return {
    searchBooks() {
      const keyword = this.$store.booksData.searchInput.trim().toLowerCase();
      const sourceMap = {
        allBooks: this.$store.booksData.allBooks,
        toReadBooks: this.$store.booksData.toReadBooks,
        finishedBooks: this.$store.booksData.finishedBooks,
      };

      const source = sourceMap[this.$store.booksData.currentBookList];

      if (keyword === "") {
        this.$store.booksData.searchInput = "";
        this.$store.booksData.currentBooks = source;
        return;
      } else {
        this.$store.booksData.currentBooks = source.filter((book) => {
          return (
            book.title.toLowerCase().includes(keyword) ||
            book.author.join(",").toLowerCase().includes(keyword)
          );
        });
      }
    },
  };
};

export { searchControl };
