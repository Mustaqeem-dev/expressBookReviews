const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
async function fetchBooks() {
    try {
      const response = await axios.get('https://mustaqeemahm-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Endpoint to get the list of books
  users.get('/', async (req, res) => {
    try {
      const books = await fetchBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  });
  

// Get book details based on ISBN
async function fetchBookByISBN(isbn) {
    try {
      const response = await axios.get(`https://mustaqeemahm-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/isbn/${isbn}`); 
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Endpoint to get book details by ISBN
  users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const book = await fetchBookByISBN(isbn);
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details by ISBN' });
    }
  });
 
  
// Get book details based on author
async function fetchBooksByAuthor(author) {
    try {
      const response = await axios.get(`https://mustaqeemahm-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/author/${author}`); 
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Endpoint to get book details by author
  users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const books = await fetchBooksByAuthor(author);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details by author' });
    }
  });

// Get all books based on title
async function fetchBooksByTitle(title) {
    try {
      const response = await axios.get(`https://mustaqeemahm-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/title/${title}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Endpoint to get book details by title
  users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const books = await fetchBooksByTitle(title);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details by title' });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.isbn;
  res.send(books[review])
});

module.exports.general = public_users;


