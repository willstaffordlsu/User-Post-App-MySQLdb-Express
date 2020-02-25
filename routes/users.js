var express = require('express');
var router = express.Router();
var models = require('../models');
const authService = require('../services/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

// Create new user if one doesn't exist
router.post('/signup', function(req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password) //<--- Change to this code here
      }
    })
    .spread(function(result, created) {
      if (created) {
        res.send('User successfully created!');
      } else {
        res.send('This user already exists.');
      }
    });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

// Login user and return JWT as cookie
router.post('/login', function(req, res, next) {
  models.users
    .findOne({
      where: {
        Username: req.body.username
      }
    })
    .then(user => {
      if (!user) {
        console.log('User not found');
        return res.status(401).json({
          message: 'Login Failed'
        });
      } else {
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.Password
        );
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie('jwt', token);
          res.redirect('profile');
        } else {
          console.log('Wrong password');
          res.send('Wrong password');
        }
      }
    });
});

router.get('/profile', function(req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user) {
        models.users
          .findAll({
            where: { UserId: user.UserId },
            include: [{ model: models.posts }]
          })
          .then(result => {
            console.log(result);
            res.render('profile', { user: result[0] });
          });
      } else {
        res.status(401);
        res.send('Invalid authentication token');
      }
    });
  } else {
    res.status(401);
    res.send('Must be logged in');
  }
});

router.get('/logout', function(req, res, next) {
  res.cookie('jwt', '', { expires: new Date(0) });
  res.redirect('login');
});

router.get('/admin', function(req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        models.users
          .findAll({ where: { Deleted: false }, raw: true })
          .then(usersFound => res.render('adminView', { users: usersFound }));
      } else {
        res.send('unauthorized');
      }
    });
  }
});

router.get('/admin/editUser/:id', function(req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        models.users
          .findOne({ where: { UserId: userId }, raw: true })
          .then(user => res.render('editUser', { user: user }));
      } else {
        res.send('unauthorized');
      }
    });
  }
});

router.delete('/admin/editUser/:id', function(req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        models.users
          .update({ Deleted: true }, { where: { UserId: userId }, raw: true })
          .then(user => res.redirect('/users/admin'));
      } else {
        res.send('unauthorized');
      }
    });
  }
});

module.exports = router;
