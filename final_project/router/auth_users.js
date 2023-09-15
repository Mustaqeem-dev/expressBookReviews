const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});
//only registered users can login
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format." });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists." });
  }
  // If all checks pass, add the user to the array (you might want to hash the password before saving it)
  users.push({ username, password });

  return res
    .status(201)
    .json({ message: "User successfully registered. You can now log in." });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  const reviewText = req.query.review; // Use query parameter to pass review text

  // Find the book in your books data structure
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has already reviewed this book
  const existingReviewIndex = book.reviews.findIndex(
    (review) => review.username === username
  );

  if (existingReviewIndex !== -1) {
    // If the user has already reviewed the book, modify the existing review
    book.reviews[existingReviewIndex].reviewText = reviewText;
    return res.status(200).json({ message: "Review modified successfully." });
  }

  // If the user hasn't reviewed the book before, add a new review
  const newReview = {
    username,
    reviewText,
  };
  book.reviews.push(newReview);

  return res.status(201).json({ message: "Review added successfully." });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  const existingReviewIndex = book.reviews.findIndex(
    (review) => review.username === username
  );

  if (existingReviewIndex === -1) {
    return res.status(404).json({ message: "You haven't reviewed this book." });
  }

  book.reviews.splice(existingReviewIndex, 1);

  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
