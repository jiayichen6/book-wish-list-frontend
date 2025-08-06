import axios from "axios";

const booksApiControl = {
  async getBooks() {
    const allBooks = (await axios.get("http://127.0.0.1:5000/books/")).data;
    const toReadBooksKeys = (
      await axios.get("http://127.0.0.1:5000/books/my/toReadBooks")
    ).data;
    const finishedBooksKeys = (
      await axios.get("http://127.0.0.1:5000/books/my/finishedBooks")
    ).data;
    const favoriteBooksKeys = (
      await axios.get("http://127.0.0.1:5000/books/my/favoriteBooks")
    ).data;

    return { allBooks, toReadBooksKeys, finishedBooksKeys, favoriteBooksKeys };
  },

  async addBook(bookKey, listName) {
    const api = `http://127.0.0.1:5000/books/my/${listName}/${bookKey}`;

    const resp = await axios.post(api);
    return resp.data;
  },

  async removeBook(bookKey, listName) {
    const api = `http://127.0.0.1:5000/books/my/${listName}/${bookKey}`;

    const resp = await axios.delete(api);
    return resp.data;
  },
};

export { booksApiControl };
