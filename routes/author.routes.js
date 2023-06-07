const express = require('express');
const router = express.Router();

const Book = require('../models/Book.model');
const Author = require('../models/Author.model');

module.exports = router;

// GET /authors

router.get('/authors', async (req, res, next) => {
	const authors = await Author.find();
	res.render('authors/authors-list', { authors });
});

module.exports = router;
