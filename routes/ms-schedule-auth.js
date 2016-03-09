var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var auth = require('../lib/auth.js');

router.get('/', auth, function(req,res,next) {
  var userid = req.user.sub;
  if(userid) {
    var qString = 'SELECT schedule ' +
                  'FROM Schedule ' +
                  'WHERE uid = $1';
    db.query({text: qString, values: [userid]}, function(err, results) {
      if(err) {next(err); return;}
      if(results.rows[0]) {
        res.send({
          schedule: results.rows[0].schedule
        });
      } else {
        var err = new Error("User does not have a schedule");
        err.status_code = 400;
        next(err);
        return;
      }
    });

  } else {
    var err = new Error("Did not receive required information");
    err.status_code = 400;
    next(err);
    return;
  }
});

router.post('/', auth, function(req, res, next) {
  var userid = req.user.sub;
  var schedule = req.body.schedule;
  if(userid && schedule) {
    var qString = 'UPDATE Schedule ' +
                  'SET schedule = $1 ' +
                  'WHERE uid = $2';
    db.query({text: qString, values: [schedule, userid]}, function(err, results) {
      if(err) {next(err); return;}
      else {
        res.send({
          success: true,
          message: 'Updated schedule for user ' + userid
        });
      }
    });
  } else {
    var err = new Error("Did not receive required information");
    err.status_code = 400;
    next(err);
    return;
  }
});

module.exports = router;
