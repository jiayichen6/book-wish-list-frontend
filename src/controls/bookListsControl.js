import { booksApiControl } from "../api/api";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const bookListsControl = () => {
  return {
    async getAllBooks() {
      let allBooks = [];
      let toReadBooksKeys = [];
      let finishedBooksKeys = [];
      let favoriteBooksKeys = [];

      try {
        const resp = await booksApiControl.getBooks();

        ({ allBooks, toReadBooksKeys, finishedBooksKeys, favoriteBooksKeys } =
          resp);
      } catch (err) {
        console.log(err);

        this.toastify(err.response.data.error);
      }

      this.initialBooksStore({
        allBooks,
        toReadBooksKeys,
        finishedBooksKeys,
        favoriteBooksKeys,
      });
    },

    initialBooksStore({
      allBooks,
      toReadBooksKeys,
      finishedBooksKeys,
      favoriteBooksKeys,
    }) {
      this.$store.booksApp.allBooks = this.prepareBooksWithStatus(
        allBooks,
        toReadBooksKeys,
        finishedBooksKeys,
        favoriteBooksKeys
      );

      const toReadBooks = this.$store.booksApp.allBooks.filter(
        (b) => b.readStatus === "toRead"
      );
      this.$store.booksApp.toReadBooks = toReadBooks;

      const finishedBooks = this.sortBooks(
        this.$store.booksApp.allBooks.filter(
          (b) => b.readStatus === "finished"
        ),
        { isFinished: true }
      );
      this.$store.booksApp.finishedBooks = finishedBooks;

      this.$store.booksApp.currentBooks = this.$store.booksApp.allBooks;
    },

    prepareBooksWithStatus(
      allBooks,
      toReadBooksKeys,
      finishedBooksKeys,
      favoriteBooksKeys
    ) {
      const books = this.sortBooks(this.nomalizeBooks(allBooks));

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

    nomalizeBooks(allBooks) {
      const books = allBooks.allBooksData.booksData.works;
      const booksDesc = allBooks.allBooksData.booksDescData;

      const nomalizedBooks = books.map((book) => {
        const desc = booksDesc.find((b) => b.key === book.key);
        return {
          key: book.key,
          title: book.title,
          authors: book.authors.map((a) => a.name),
          subject: book.subject.slice(0, 2),
          description: desc.description,
          coverId: book.cover_id,
          readStatus: "noRecord",
          isFavorite: false,
        };
      });
      return nomalizedBooks;
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
      if (status) {
        try {
          booksApiControl.addBook(book.key, "favoriteBooks");
        } catch (err) {
          console.log("新增喜愛書本失敗", err);
        }
      } else {
        try {
          booksApiControl.removeBook(book.key, "favoriteBooks");
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

      if (status) {
        if (index === -1) {
          bookList.push(book);
          bookList = this.sortBooks(bookList);
          try {
            await booksApiControl.addBook(book.key, listName);
          } catch (err) {
            console.log("新增書本失敗", err);
          }
        }
      } else {
        if (index !== -1) {
          bookList.splice(index, 1);
          try {
            await booksApiControl.removeBook(book.key, listName);
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

    toastify(message, color = "#96c93d") {
      return Toastify({
        text: message,
        position: "center",
        duration: 3000,
        close: true,
        gravity: top,
        style: {
          background: color,
        },
      }).showToast();
    },
  };
};

export { bookListsControl };
