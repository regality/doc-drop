
/*
 * GET home page.
 */

 var names = require('../names.json').names

exports.index = function(req, res){
  var name = req.query.name || names[~~(names.length * Math.random())];
  res.render('index', {
    title: "Drag n' Drop",
    name: name
  })
};
