var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.visited = true;
  res.render('index', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
  if (!req.session.loggedin) {
      return res.send(404);
  }
  req.session.loggedin = false;
  return res.redirect('/');
});

module.exports = router;
