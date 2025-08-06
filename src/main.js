import Alpine from "alpinejs";
import { bookListsControl } from "./controls/bookListsControl";
import { searchControl } from "./controls/searchControl";
import { authControl } from "./controls/authControl";
import { booksStore } from "./stores/booksStore";
import { uiStore } from "./stores/uiStore";

Alpine.data("bookListsControl", bookListsControl);
Alpine.data("searchControl", searchControl);
Alpine.data("authControl", authControl);
Alpine.store("booksApp", { ...booksStore, ...uiStore });
window.Alpine = Alpine;

Alpine.start();
