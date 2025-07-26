import axios from "axios";
import { booksData } from "./data";

const wishListControl = () => {
  return {
    url: "http://localhost:3002/allbooksData",

    async getAllBooks() {
      try {
        const resp = await axios.get(this.url);
        const rawData = resp.data;
        this.$store.booksData.allBooks = rawData;

        const newData = this.nomalizeBooks(rawData);
        console.log(newData);
        console.log(this.$store.booksData.control);
        this.$store.booksData.allBooks = this.sortBooks(newData);
        this.$store.booksData.currentBooks = this.$store.booksData.allBooks;
      } catch (err) {
        console.log(err);
      }
    },

    nomalizeBooks(rawData) {
      const books = rawData.booksData[0].works;
      const booksDesc = rawData.booksDescData;

      return books.map((book) => {
        return {
          key: book.key,
          title: book.title,
          author: book.authors.map((a) => a.name),
          subject: book.subject.slice(0, 2),
          description: booksDesc.find((b) => b.book === book.title).description,
          coverId: book.cover_id,
          readStatus: "noRecord",
          isFavorite: false,
        };
      });
    },

    goAll() {
      this.$store.booksData.currentBooks = this.$store.booksData.allBooks;
      this.$store.booksData.currentPage = "all";
    },

    goToRead() {
      this.$store.booksData.currentBooks = this.$store.booksData.toReadBooks;
      this.$store.booksData.currentPage = "toRead";
    },

    gofinished() {
      this.$store.booksData.currentBooks = this.$store.booksData.finishedBooks;
      this.$store.booksData.currentPage = "finished";
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
      this.$store.booksData.finishedBooks = this.sortBooks(
        this.$store.booksData.finishedBooks,
        {
          isFinished: true,
        }
      );
    },

    manageReadStatus(book) {
      const toReadBooks = this.$store.booksData.toReadBooks;
      const finishedBooks = this.$store.booksData.finishedBooks;

      this.updateBookList(book, toReadBooks, book.readStatus === "toRead");
      this.updateBookList(book, finishedBooks, book.readStatus === "finished");
    },

    updateBookList(book, bookList, status) {
      const index = this.findBook(book, bookList);
      if (status) {
        // 加進去時先確認是否存在（避免重複）
        if (index === -1) {
          bookList.push(book);
          bookList = this.sortBooks(bookList);
        }
      } else {
        // 拿出來也建議判斷（避免 splice(-1, 1) 錯刪最後一筆）
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
  };
};

const searchControl = () => {
  return {
    searchInput: "",
    searchBooks() {
      const keyword = this.searchInput.trim().toLowerCase();
      const sourceMap = {
        all: this.$store.booksData.allBooks,
        toRead: this.$store.booksData.toReadBooks,
        finished: this.$store.booksData.finishedBooks,
      };

      const source = sourceMap[(this.$store, booksData.currentPage)];

      if (keyword === "") {
        this.searchInput = "";
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

export { wishListControl, searchControl };
