import axios from "axios";

const bookApiControl = {
  async getBooks() {
    const rawData = (await axios.get("http://localhost:3002/allBooksData"))
      .data;
    const toReadBooksData = (
      await axios.get("http://localhost:3002/toReadBooksData")
    ).data;
    const finishedBooksData = (
      await axios.get("http://localhost:3002/finishedBooksData")
    ).data;
    const favoriteBooksData = (
      await axios.get("http://localhost:3002/favoriteBooksData")
    ).data;

    return { rawData, toReadBooksData, finishedBooksData, favoriteBooksData };
  },

  async addBook(bookKey, listName, rawBooks) {
    const api = `http://localhost:3002/${listName}Data`;

    const targetBook = {
      ...rawBooks.find((b) => b.key === bookKey),
      id: bookKey,
    };

    const resp = await axios.post(api, targetBook);

    return resp.data;
  },

  async removeBook(bookKey, listName) {
    // 安全轉換 URL
    const encodedKey = encodeURIComponent(bookKey);
    const api = `http://localhost:3002/${listName}Data/${encodedKey}`;
    const resp = await axios.delete(api);
    return resp.data;
  },
};

export { bookApiControl };
