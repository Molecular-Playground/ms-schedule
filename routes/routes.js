var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

//TODO Test and fix.
router.get('/:username', function(req,res,next){
  var username = req.params.username;
  if(username){
    var qString = 'SELECT u.sid,s.metadata FROM users as u, schedule as s WHERE username = $1 AND u.uid=s.uid';
    db.query({text: qString, values: [username]}, function(err, results){
      if(err){
        next(err);
        return;
      }
      if(results.rows[0]){
        var sid = results.rows[0].sid;
        qString = 'SELECT p.pid,p.molecules FROM playlists as p, plays WHERE p.sid = $1 AND p.pid = plays.pid';
        db.query({text: qString, values: [sid]}, function(err, resultsplaylists){
          if(err){
            next(err);
            return;
          }
          res.send({
            schedule: results.rows[0].metadata,
            playlists: resultsplaylists.rows
          });
        });
      } else{
        res.send(new Error('Invalid username'));
      }
    });
  } else{
    res.send(new Error('Did not recieve required information'));
  }
});



module.exports = router;
