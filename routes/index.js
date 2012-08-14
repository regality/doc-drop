
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: "Drag n' Drop",
    name: req.query.name || ''
  })
};
