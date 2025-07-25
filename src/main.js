import Alpine from "alpinejs";
import { wishListControl } from "./app";
import { booksData } from "./data";

Alpine.data("wishListControl", wishListControl);
Alpine.store("booksData", booksData);
window.Alpine = Alpine;

Alpine.start();
