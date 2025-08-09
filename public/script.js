const booksContainer = document.getElementById("booksContainer");
const addBookForm = document.getElementById("addBookForm");
const API_URL = "/books";

// fetch and display all the books
async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error("Error fetching books: ", error);
  }
}

function displayBooks(books) {
  booksContainer.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book-card";
    bookElement.innerHTML = `
      <div>
        <h3>${book.title}</h3>
        <p>By ${book.author}</p>
      </div>
      <div class="book-actions">
        <button class="edit-btn" onclick="editBookPromt(${book.id})">Edit</button>
        <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
      </div>
    `;
    booksContainer.appendChild(bookElement);
  });
}

// Add a new book
addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author }),
    });
    if (response.ok) {
      addBookForm.reset();
      fetchBooks(); // Refreshes the list
    }
  } catch (error) {
    console.error("Error adding book: ", error);
  }
});

// Delete a book
async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) fetchBooks();
  } catch (error) {
    console.error("Error deleting book: ", error);
  }
}

// Edit a book
async function editBookPromt(id) {
  const newTitle = prompt("Enter new title: ");
  const newAuthor = prompt("Enter new author: ");

  if (newTitle && newAuthor) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({
          title: newTitle,
          author: newAuthor,
        }),
      });
      if (response.ok) fetchBooks();
    } catch (error) {
      console.error("Error updating the book: ", error);
    }
  }
}

// Initialize
fetchBooks();
