import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const booksApiControl = {
  async getMe() {
    const api = `${API_URL}/users/check`;

    const resp = await axios.post(api);
    return resp;
  },

  async getBooks() {
    const allBooks = (await axios.get(`${API_URL}/books/`)).data;
    const toReadBooksKeys = (await axios.get(`${API_URL}/books/my/toReadBooks`))
      .data;
    const finishedBooksKeys = (
      await axios.get(`${API_URL}/books/my/finishedBooks`)
    ).data;
    const favoriteBooksKeys = (
      await axios.get(`${API_URL}/books/my/favoriteBooks`)
    ).data;

    return { allBooks, toReadBooksKeys, finishedBooksKeys, favoriteBooksKeys };
  },

  async addBook(bookKey, listName) {
    const api = `${API_URL}/books/my/${listName}/${bookKey}`;

    const resp = await axios.post(api);
    return resp;
  },

  async removeBook(bookKey, listName) {
    const api = `${API_URL}/books/my/${listName}/${bookKey}`;

    const resp = await axios.delete(api);
    return resp;
  },
};

export { booksApiControl };
