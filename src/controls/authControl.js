const authControl = () => {
  return {
    email: "",
    password: "",

    register() {
      if (this.isAllowToRegister) {
        // 打API

        this.clearInput();
        this.goLogin();
      }
    },

    logIn() {
      if (this.isAllowToLogIn) {
        // 打API
        this.clearInput();
        this.goBookList();
      }
    },

    logOut() {
      this.clearInput();
      this.$store.booksApp.currentPage = "logIn";

      // 打API
    },

    goRegister() {
      this.clearInput();
      this.$store.booksApp.currentPage = "register";
    },

    goLogin() {
      this.clearInput();
      this.$store.booksApp.currentPage = "logIn";
    },

    goBookList() {
      this.$store.booksApp.currentPage = "bookList";
    },

    get isAllowToRegister() {
      return this.email.trim() != "" && this.password.trim() != "";
    },

    get isAllowToLogIn() {
      return this.email.trim() != "" && this.password.trim() != "";
    },

    clearInput() {
      this.email = "";
      this.password = "";
    },
  };
};

export { authControl };
