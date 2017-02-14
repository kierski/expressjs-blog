var express = require('express');
var router = express.Router();
var fs = require('fs');
var posts;

fs.readFile('app/data/blog.json', 'utf-8', (err, data) => {
  if (err) console.log(err);
  posts = JSON.parse(data);
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Home',
    posts: posts
  });
});

module.exports = router;
