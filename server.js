// API (Application programming interface) is a set of rules and protocols that allows different software applications to communicate with each other.
// APIs are essential because
// 1. Enable different systems to work together
// 2. Allow frontend and backend to communicate
// 3. Facilitate integration with third party services
// 4. Provide a structured way to access data and functionality

// REST API Example
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Middlewares are functions that have access to the req, res object and the next middleware function in the application request-response cycle
// Types of middlewares includes
// 1. Application level middleware - applies to all routes
// 2. Router-level middleware - applies to specific route
// 3. Error-handling middleware
// 4. Built-in middleware
// 5. Third-party middleware

// Built-in middleware to pass JSON requests
app.use(express.json());

// custom application-level middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Sample data
let books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 3, title: "1984", author: "George Orwell" },
];

// Middleware to find book by id
const findBook = (req, res, next) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  req.book = book; // Attach book to request object
  next();
};

// GET - Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Get a specific book
app.get("/books/:id", findBook, (req, res) => {
  res.json(res.json(req.book));
});

// Add a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author)
    return res.status(400).json({ message: "Title and author are required" });
  const newBook = {
    id: books.length + 1,
    title: title,
    author: author,
  };

  books.push(newBook);
  res.status(201).json({ message: "The action was successful" });
});

// update a book - PUT
app.put("/books/:id", findBook, (req, res) => {
  const { title, author } = req.params;
  if (title) req.book.title = title;
  if (author) req.book.author = author;

  res.json({ message: "Update successful" });
});

app.delete("/books/:id", findBook, (req, res) => {
  books = books.filter((b) => b.id !== parseInt(req.params.id));
  res.json({ message: "Book deleted" });
});

// Error handling middleware - catches all errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler - catches undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
