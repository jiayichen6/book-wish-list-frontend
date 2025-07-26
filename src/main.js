import Alpine from "alpinejs";
import { wishListControl, searchControl } from "./app";
import { booksData } from "./data";

Alpine.data("wishListControl", wishListControl);
Alpine.data("searchControl", searchControl);
Alpine.store("booksData", booksData);
window.Alpine = Alpine;

Alpine.start();
