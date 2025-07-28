![Preview of Books Wish List App](./preview.png)

# Books Wish List

A clean and interactive book wishlist web app built with HTML, CSS, JavaScript, and Alpine.js.  
Users can browse a list of books, switch between reading states, and mark favorites.

## Features

- View all available books with cover, author, description, and subjects
- Click on a book to open a detailed view with full description
- **Search books by keyword (title, author)**
- Tab switching between:
  - **All Books**
  - **To Read**
  - **Finished**
- Mark books as **Favorite** (under Finished list)
- Toggle book status dynamically with responsive UI icons
- Smooth DOM rendering with Alpine.js
- Local mock API using JSON Server (add/remove book status dynamically)

## Tech Stack

- HTML / CSS / JavaScript
- Tailwind CSS / DaisyUI
- Phosphor Icons (inline SVG)
  - Icons are from Phosphor Icons, embedded via inline SVG for easier customization with Tailwind utility classes.DaisyUI's built-in icons were not used to better match the desired visual style and control.
- Alpine.js
- JSON Server
- Git & GitHub

## Getting Started

- Run `npm install` to install all packages.
- Run `npm run all` to launch:
  - Vite development server (default: port `5173`)
  - JSON Server (default: port `3002`)
    - `/allBooksData`
    - `/toReadBooksData`
    - `/finishedBooksData`
    - `/favoriteBooksData`

## Development Tools

- Vite for development server

> 📌 Note:
> This project focuses on practicing JavaScript logic and data control using Alpine.js.
> For simplicity and better logic clarity, the HTML content for the book lists was duplicated instead of dynamically rendered through a single template.  
> The goal was not to optimize HTML structure but to experiment with event binding, state control, and dynamic DOM updates.
