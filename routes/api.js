/*
 * Serve JSON to our AngularJS client
 */

var scores = [];
exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.add_score = function (req, res) {
  scores.push(req.body);
  res.json({
    result: 'success'
  });
};

exports.scores = function (req, res) {
  res.json(scores);
};