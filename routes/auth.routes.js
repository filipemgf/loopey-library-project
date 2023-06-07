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

//GET /login
router.get('/login', (req, res, next) => {
	res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (email === '' || password === '') {
			res.status(400).render('auth/login', {
				errorMessage: 'Please enter both, email and password to login.',
			});
			return;
		}

		const user = await User.findOne({ email: email });

		if (!user) {
			//if we find no email like the one we get from the form, that promise returns null
			res.status(400).render('auth/login', {
				errorMessage: 'Email is not registered. Try again.',
			});
			return;
		} else if (bcrypt.compareSync(password, user.passwordHash)) {
			req.session.currentUser = user;
			console.log(req.session.currentUser);
			res.render('auth/user-profile', { user: req.session.currentUser });
		} else {
			res.send('Unexpected error.');
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//GET user-profile
router.get('/user-profile', (req, res) => {
	res.render('auth/user-profile.hbs', req.session.currentUser);
});

//POST logout
router.post('/logout', async (req, res, next) => {
	try {
		req.session.destroy((error) => {
			if (error) next(error);
			res.redirect('/');
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

module.exports = router;
