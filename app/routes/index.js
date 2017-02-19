var express = require('express');
var router = express.Router();
var fs = require('fs');
var posts;

fs.readFile('app/data/blog.json', 'utf-8', (err, data) => {
  if (err) console.log(err);
  posts = JSON.parse(data);
});

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Home',
    posts: json2array(posts)
  });
});

module.exports = router;
