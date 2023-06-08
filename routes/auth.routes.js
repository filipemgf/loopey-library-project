const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

router.get('/signup', async (req, res, next) => {
	res.render('auth/signup.hbs');
const router = express.Router();

const saltRounds = 10;


//GET /signup 
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
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

//GET /login (display login form)
router.get('/login', (req, res, next) => {
	res.render('auth/login');
});

//POST /login (process login form)
router.post('/login', (req, res, next) => {
	const { email, password } = req.body;

	if (email === '' || password === '') {
		res
			.status(400)
			.render('auth/login', {
				errorMessage: 'Please enter both, email and password to login.',
			});
		return;
	}

	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				//user doesn't exist (mongoose returns "null")
				res
					.status(400)
					.render('auth/login', {
						errorMessage: 'Email is not registered. Try with other email.',
					});
				return;
			} else if (bcryptjs.compareSync(password, user.passwordHash)) {
				//login successful
				req.session.currentUser = user; // store info in req.session (will be available in further requests)
				res.render('auth/user-profile', { userDetails: user });
			} else {
				//login failed
				res
					.status(400)
					.render('auth/login', { errorMessage: 'Incorrect credentials.' });
			}
		})
		.catch((error) => {
			console.log('error trying to login...', error);
			next(error);
		});
});

//POST /logout
router.post('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if (err) next(err);
		res.redirect('/'); // if logout sucessful, redirect to homepage
	});
});


//GET /login (display login form)
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});



//POST /login (process login form)
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return;
    }

    User.findOne({email: email})
        .then( user => {
            if (!user) {
                //user doesn't exist (mongoose returns "null")
                res.status(400).render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)){
                //login successful
                req.session.currentUser = user; // store info in req.session (will be available in further requests)
                res.render("auth/user-profile", {userDetails: user});
            } else {
                //login failed
                res.status(400).render('auth/login', { errorMessage: 'Incorrect credentials.' });
            }
        })
        .catch(error => {
            console.log("error trying to login...", error);
            next(error);
        });

});


//POST /logout
router.post("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/'); // if logout sucessful, redirect to homepage
    });
})


//GET user-profile
router.get('/user-profile', (req, res) => {
	res.render('auth/user-profile.hbs', req.session.currentUser);
});
router.get('/user-profile', (req, res) => {
    res.render("auth/user-profile", {userDetails: req.session.currentUser});
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

module.exports = router
