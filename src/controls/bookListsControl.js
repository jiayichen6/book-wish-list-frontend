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
        const message = err?.response?.data?.error ?? "取得書本資料失敗";
        this.toastify(message, "#972929ff");
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
      this.$store.booksApp.allBooks = this.prepareBooksWithState(
        allBooks,
        toReadBooksKeys,
        finishedBooksKeys,
        favoriteBooksKeys
      );

      const toReadBooks = this.$store.booksApp.allBooks.filter(
        (b) => b.readState === "toRead"
      );
      this.$store.booksApp.toReadBooks = toReadBooks;

      const finishedBooks = this.sortBooks(
        this.$store.booksApp.allBooks.filter((b) => b.readState === "finished"),
        { isFinished: true }
      );
      this.$store.booksApp.finishedBooks = finishedBooks;

      this.$store.booksApp.currentBooks = this.$store.booksApp.allBooks;
    },

    prepareBooksWithState(
      allBooks,
      toReadBooksKeys,
      finishedBooksKeys,
      favoriteBooksKeys
    ) {
      const books = this.sortBooks(this.nomalizeBooks(allBooks));

      books.forEach((book) => {
        if (toReadBooksKeys.includes(book.key)) {
          book.readState = "toRead";
        } else if (finishedBooksKeys.includes(book.key)) {
          book.readState = "finished";
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
          readState: "noRecord",
          isFavorite: false,
          isPending: false,
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
      if (book.isPending) return;

      book.isPending = true;
      const prevState = book.readState;
      const nextState = book.readState != "toRead" ? "toRead" : "noRecord";
      book.readState = nextState;
      this.manageReadState(book, "toReadBooks", prevState);
    },

    setFinished(book) {
      if (book.isPending) return;

      book.isPending = true;
      const prevState = book.readState;
      const nextState = book.readState != "finished" ? "finished" : "noRecord";
      book.readState = nextState;
      this.manageReadState(book, "finishedBooks", prevState);
    },

    async toggleFavorite(book) {
      if (book.isPending) return;

      book.isPending = true;
      const prevState = book.isFavorite;
      const nextState = !prevState;
      book.isFavorite = nextState;
      this.sortBooks(this.$store.booksApp.finishedBooks, {
        isFinished: true,
      });

      try {
        if (nextState) {
          const resp = await booksApiControl.addBook(book.key, "favoriteBooks");
          this.toastify(resp.data.message);
        } else {
          const resp = await booksApiControl.removeBook(
            book.key,
            "favoriteBooks"
          );
          this.toastify(resp.data.message);
        }
      } catch (err) {
        // 回滾 UI
        book.isFavorite = prevState;
        this.sortBooks(this.$store.booksApp.finishedBooks, {
          isFinished: true,
        });

        const message = err?.response?.data?.error ?? "操作失敗";
        this.toastify(message, "#972929ff");
      } finally {
        book.isPending = false;
      }
    },

    async manageReadState(book, listName, prevState) {
      const toReadBooks = this.$store.booksApp.toReadBooks;
      const finishedBooks = this.$store.booksApp.finishedBooks;

      // 先用舊列表判斷原本是否在目標清單
      const targetList =
        listName === "toReadBooks" ? toReadBooks : finishedBooks;

      // 判斷在不在目標清單裡
      const wasInTarget = this.findBook(book, targetList) !== -1;

      // 更新 UI 狀態
      this.updateBookList(book, toReadBooks, book.readState === "toRead");
      this.updateBookList(book, finishedBooks, book.readState === "finished");
      this.sortBooks(toReadBooks);
      this.sortBooks(finishedBooks, { isFinished: true });

      try {
        if (wasInTarget) {
          // 在 -> 打 delete
          const resp = await booksApiControl.removeBook(book.key, listName);
          this.toastify(resp.data.message);
        } else {
          // 不在 -> 打 post
          const resp = await booksApiControl.addBook(book.key, listName);
          this.toastify(resp.data.message);
        }
      } catch (err) {
        const message = err?.response?.data?.error ?? "操作失敗";
        this.toastify(message, "#972929ff");

        // UI 回滾
        book.readState = prevState;
        this.updateBookList(book, toReadBooks, book.readState === "toRead");
        this.updateBookList(book, finishedBooks, book.readState === "finished");
        this.sortBooks(toReadBooks);
        this.sortBooks(finishedBooks, { isFinished: true });
      } finally {
        book.isPending = false;
      }
    },

    updateBookList(book, bookList, state) {
      const index = this.findBook(book, bookList);

      if (state) {
        if (index === -1) {
          bookList.push(book);
        }
      } else {
        if (index !== -1) {
          bookList.splice(index, 1);
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
        gravity: "top",
        style: {
          background: color,
        },
      }).showToast();
    },
  };
};

export { bookListsControl };
