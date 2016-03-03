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
        var schedule = results.rows[0].schedule;
        var playlistObj = {}
        for(index in schedule){
          if(!playlistObj[ schedule[index].pid ]) 
            playlistObj[ schedule[index].pid ] = schedule[index].pid;
        }
        var uniquePlaylists = new Array;
        for(var p in playlistObj) {
            uniquePlaylists.push(playlistObj[p]);
        }
        qString = 'SELECT pid, molecules ' +
                  'FROM Playlists ' +
                  'WHERE uid = $1 AND pid = ANY (ARRAY[' + uniquePlaylists + '])';
        db.query({text: qString, values: [schedule.uid]}, function(err, playlistResults){
          if(err){
            next(err);
            return;
          }
          res.send({
            schedule: schedule,
            playlists: playlistResults.rows
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
