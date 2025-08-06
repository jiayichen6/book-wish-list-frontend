import Alpine from "alpinejs";
import { bookListControl } from "./controls/bookListControl";
import { searchControl } from "./controls/searchControl";
import { booksStore } from "./stores/booksStore";
import { uiStore } from "./stores/uiStore";

Alpine.data("bookListControl", bookListControl);
Alpine.data("searchControl", searchControl);
Alpine.store("booksApp", { ...booksStore, ...uiStore });
window.Alpine = Alpine;

Alpine.start();
