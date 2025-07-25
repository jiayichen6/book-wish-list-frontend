import axios from "axios";

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
        this.$store.booksData.allBooks = newData;
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
        };
      });
    },

    goAll() {
      this.$store.booksData.currentBooks = this.$store.booksData.allBooks;
    },

    goToRead() {
      this.$store.booksData.currentBooks = this.$store.booksData.toReadBooks;
    },

    goReaded() {
      this.$store.booksData.currentBooks = this.$store.booksData.readedBooks;
    },

    setToRead(book) {
      book.readStatus = book.readStatus != "toRead" ? "toRead" : "noRecord";
      this.manageReadStatus(book);
    },

    setReaded(book) {
      book.readStatus = book.readStatus != "readed" ? "readed" : "noRecord";
      this.manageReadStatus(book);
    },

    manageReadStatus(book) {
      const toReadBooks = this.$store.booksData.toReadBooks;
      const readedBooks = this.$store.booksData.readedBooks;

      this.updateBookList(book, toReadBooks, book.readStatus === "toRead");
      this.updateBookList(book, readedBooks, book.readStatus === "readed");
    },

    updateBookList(book, bookList, status) {
      const index = this.findBook(book, bookList);
      if (status) {
        // 加進去時先確認是否存在（避免重複）
        if (index === -1) bookList.push(book);
      } else {
        // 拿出來也建議判斷（避免 splice(-1, 1) 錯刪最後一筆）
        if (index !== -1) bookList.splice(index, 1);
      }
    },

    findBook(book, bookList) {
      return bookList.findIndex((b) => b.key === book.key);
    },
  };
};

export { wishListControl };
