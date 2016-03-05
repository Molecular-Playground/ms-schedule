var express = require('express');
var router = express.Router();
var db = require('../../lib/db.js');


router.get('/', function(req,res,next){
  var userid = req.user.sub;
  if(userid){
    var qString = 'SELECT schedule ' +
                  'FROM Schedule ' +
                  'WHERE uid = $1';
    db.query({text: qString, values: [userid]}, function(err, results){
      if(err){
        next(err);
        return;
      }
      if(results.rows[0]){
        res.send({
          schedule: results.rows[0].schedule
        });
      } else{
        res.status(400).send({
          error: 'User does not have a schedule'
        });
      } 
    });
    
  } else{
    res.status(400).send({
      error: 'Did not receive required information'
    });
  }
});

router.post('/', function(req, res, next){
  var userid = req.user.sub;
  var schedule = req.body;
  if(userid && schedule){
    var qString = 'UPDATE Schedule ' +
                  'SET schedule = $1 ' +
                  'WHERE uid = $2';
    db.query({text: qString, values: [schedule, userid]}, function(err, results){
      if(err){
        next(err);
        res.send(err);
      } else{
        res.send({
          success: true,
          message: 'Updated schedule for user ' + userid
        });
      }
    });
  } else{
    res.status(400).send({
      error: "Did not receive required information"
    });
  }
});

module.exports = router;
