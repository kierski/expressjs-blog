const express = require('express');
const router = express.Router();

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


router.use('/:slug', (req, res, next) => {

var postsList = json2array(posts);

postsList.forEach((post) => {

  if (req.params.slug === post.slug) {

    var data = post.updatedAt;
    data = data.substring(0, data.indexOf("T") - 1);

    res.render('post', {
      type: 'post',
      author: post.author,
      title: post.title,
      subtitle: post.subtitle,
      article: post.body,
      when: data
    });

  }
});

});

module.exports = router;
