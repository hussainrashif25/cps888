var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/registerAsCustomer', async function(req, res) {
  res.render('registerAsCustomer', { title: 'Register as a Customer'})
});

router.get('/login', async function(req, res) {
  res.render('login', { title: 'Login' })
});

router.post('/login', async function(req, res){
  var { username, password, register } = req.body;
  console.log('logging in...');

  if (register) {
    await db.register(username, password);
  } else  {
    await db.login(username, password);
  }

  req.session.username = username;
  res.redirect('/');

});


function ensureLoggedIn(req, res, next) {
  if (!req.session.username) {
    res.redirect('/login');
  } else {
    next();
  }
}
router.use(ensureLoggedIn);

router.get('/', async function(req, res) {
  var { username } = req.session;
  res.render('index', { 
    username,
    items: await db.getListItems(username), 
  });
});

router.post('/', async function(req, res) {
  var { username } = req.session;

  if (req.body.delete) {
    await db.deleteListItems(username, req.body.delete);
  }else {
    await db.addListItem(username, req.body.text);
  }

  res.redirect('/');
})

router.post('/logout', async function(req, res) {
  req.session.username = '';
  res.redirect('/');
})

module.exports = router;
