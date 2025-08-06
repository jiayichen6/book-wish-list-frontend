import { bookApiControl } from "../api/api";

const bookListControl = () => {
  return {
    async getAllBooks() {
      let rawData = [];
      let toReadBooksData = [];
      let finishedBooksData = [];
      let favoriteBooksData = [];
      try {
        const resp = await bookApiControl.getBooks();
        ({ rawData, toReadBooksData, finishedBooksData, favoriteBooksData } =
          resp);
      } catch (err) {
        console.log("取得全部書本失敗", err);
      }

      this.initialBooksStore({
        rawData,
        toReadBooksData,
        finishedBooksData,
        favoriteBooksData,
      });
    },

    initialBooksStore({
      rawData,
      toReadBooksData,
      finishedBooksData,
      favoriteBooksData,
    }) {
      this.$store.booksApp.rawBooks = rawData;

      const getKeys = (list) => list.map((b) => b.key);
      const allBookskeys = getKeys(rawData.booksData.works);
      const toReadBooksKeys = getKeys(toReadBooksData);
      const finishedBooksKeys = getKeys(finishedBooksData);
      const favoriteBooksKeys = getKeys(favoriteBooksData);

      this.$store.booksApp.allBooks = this.prepareBooksWithStatus(
        allBookskeys,
        toReadBooksKeys,
        finishedBooksKeys,
        favoriteBooksKeys
      );

      this.$store.booksApp.toReadBooks = this.$store.booksApp.allBooks.filter(
        (b) => toReadBooksKeys.includes(b.key)
      );

      this.$store.booksApp.finishedBooks = this.$store.booksApp.allBooks.filter(
        (b) => finishedBooksKeys.includes(b.key)
      );

      this.$store.booksApp.currentBooks = this.$store.booksApp.allBooks;
    },

    prepareBooksWithStatus(
      allBookskeys,
      toReadBooksKeys,
      finishedBooksKeys,
      favoriteBooksKeys
    ) {
      const books = this.sortBooks(this.nomalizeBooks(allBookskeys));

      books.forEach((book) => {
        if (toReadBooksKeys.includes(book.key)) {
          book.readStatus = "toRead";
        } else if (finishedBooksKeys.includes(book.key)) {
          book.readStatus = "finished";
        }

        book.isFavorite = favoriteBooksKeys.includes(book.key);
      });

      return books;
    },

    nomalizeBooks(bookKeys) {
      const books = this.$store.booksApp.rawBooks.booksData.works;
      const booksDesc = this.$store.booksApp.rawBooks.booksDescData;

      return bookKeys.map((key) => {
        const book = books.find((b) => b.key === key);
        const desc = booksDesc.find((b) => b.key === key);
        return {
          key: key,
          title: book.title,
          author: book.authors.map((a) => a.name),
          subject: book.subject.slice(0, 2),
          description: desc.description,
          coverId: book.cover_id,
          readStatus: "noRecord",
          isFavorite: false,
        };
      });
    },

    goAll() {
      this.$store.booksApp.searchInput = "";
      this.$store.booksApp.currentBooks = this.$store.booksApp.allBooks;
      this.$store.booksApp.currentBookList = "allBooks";
    },

    goToRead() {
      this.$store.booksApp.searchInput = "";
      this.$store.booksApp.currentBooks = this.$store.booksApp.toReadBooks;
      this.$store.booksApp.currentBookList = "toReadBooks";
    },

    gofinished() {
      this.$store.booksApp.searchInput = "";
      this.$store.booksApp.currentBooks = this.$store.booksApp.finishedBooks;
      this.$store.booksApp.currentBookList = "finishedBooks";
    },

    setToRead(book) {
      book.readStatus = book.readStatus != "toRead" ? "toRead" : "noRecord";
      this.manageReadStatus(book);
    },

    setFinished(book) {
      book.readStatus = book.readStatus != "finished" ? "finished" : "noRecord";
      this.manageReadStatus(book);
    },

    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite;
      this.$store.booksApp.finishedBooks = this.sortBooks(
        this.$store.booksApp.finishedBooks,
        {
          isFinished: true,
        }
      );

      const status = book.isFavorite;
      const rawBooks = this.$store.booksApp.rawBooks.booksData.works;
      if (status) {
        try {
          bookApiControl.addBook(book.key, "favoriteBooks", rawBooks);
        } catch (err) {
          console.log("新增喜愛書本失敗", err);
        }
      } else {
        try {
          bookApiControl.removeBook(book.key, "favoriteBooks", rawBooks);
        } catch (err) {
          console.log("新增喜愛書本失敗", err);
        }
      }
    },

    manageReadStatus(book) {
      const toReadBooks = this.$store.booksApp.toReadBooks;
      const finishedBooks = this.$store.booksApp.finishedBooks;

      this.updateBookList(
        book,
        toReadBooks,
        book.readStatus === "toRead",
        "toReadBooks"
      );
      this.updateBookList(
        book,
        finishedBooks,
        book.readStatus === "finished",
        "finishedBooks"
      );
    },

    async updateBookList(book, bookList, status, listName) {
      const index = this.findBook(book, bookList);
      const rawBooks = this.$store.booksApp.rawBooks.booksData.works;

      if (status) {
        // 加進去時先確認是否存在（避免重複）
        if (index === -1) {
          bookList.push(book);
          bookList = this.sortBooks(bookList);
          try {
            await bookApiControl.addBook(book.key, listName, rawBooks);
          } catch (err) {
            console.log("新增書本失敗", err);
          }
        }
      } else {
        // 拿出來也建議判斷（避免 splice(-1, 1) 錯刪最後一筆）
        if (index !== -1) {
          bookList.splice(index, 1);
          try {
            await bookApiControl.removeBook(book.key, listName);
          } catch (err) {
            console.log("移除書本失敗", err);
          }
        }
      }
    },

    findBook(book, bookList) {
      return bookList.findIndex((b) => b.key === book.key);
    },

    sortBooks(bookList, { isFinished } = {}) {
      return bookList.sort((a, b) => {
        if (isFinished) {
          return b.isFavorite - a.isFavorite || a.title.localeCompare(b.title);
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    },
  };
};

export { bookListControl };
