var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');


router.get('/:username', function(req,res,next){
  var username = req.params.username;
  if(username){
    var qString = 'SELECT s.uid, sid, schedule ' +
                  'FROM Users as u, Schedule as s ' +
                  'WHERE username = $1 AND u.uid = s.uid';
    db.query({text: qString, values: [username]}, function(err, results){
      if(err){
        next(err);
        return;
      }
   
      if(results.rows[0]){
        var schedule = results.rows[0].schedule.schedule;
        var playlistObj = {};
        for(var index in schedule){
          if(!playlistObj[ schedule[index].pid ]) 
            playlistObj[ schedule[index].pid ] = schedule[index].pid;
        }
        var uniquePlaylists = new Array;
        for(var p in playlistObj) {
            uniquePlaylists.push(playlistObj[p]);
        }
        if(uniquePlaylists.length > 0){
          qString = 'SELECT pid, playlist ' +
                    'FROM Playlists ' +
                    'WHERE uid = $1 AND pid = ANY (ARRAY[' + uniquePlaylists + '])';
          db.query({text: qString, values: [results.rows[0].uid]}, function(err, playlistResults){
            if(err){
              next(err);
              return;
            }
            res.send({
              schedule: schedule,
              playlists: playlistResults.rows
            });
          });
        } else {
          res.status(400).send({
            error: 'User does not have any playlists'
          });
        }
      } else{
        res.status(400).send({
          error: 'Invalid username'
        });
      }
    });
    
  } else{
    res.status(400).send({
      error: 'Did not receive required information'
    });
  }
});



module.exports = router;
