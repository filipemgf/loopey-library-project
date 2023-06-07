const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

router.get('/signup', async (req, res, next) => {
	res.render('auth/signup.hbs');
});

router.post('/signup', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);
		const newUser = {
			email: email,
			passwordHash: passwordHash,
		};
		await User.create(newUser);
		res.redirect('/user-profile');
	} catch (error) {
		res.send('error creating user', error);
	}
});

module.exports = router;
