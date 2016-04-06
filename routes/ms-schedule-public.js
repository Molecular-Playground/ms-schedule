var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

router.get('/:username', function(req,res,next) {
  var username = req.params.username;
  if(username) {
    //first get the schedule object
    var qString = 'SELECT s.uid, sid, schedule ' +
                  'FROM Users as u, Schedule as s ' +
                  'WHERE username = $1 AND u.uid = s.uid';
    db.query({text: qString, values: [username]}, function(err, results) {
      if(err) {next(err); return;}

      if(results.rows[0]) {
        var schedule = results.rows[0].schedule.schedule;
        var playlistObj = {};
        for(var index in schedule) {
          if(!playlistObj[ schedule[index].pid ])
            playlistObj[ schedule[index].pid ] = schedule[index].pid;
        }
        var uniquePlaylists = new Array;
        for(var p in playlistObj) {
            uniquePlaylists.push(playlistObj[p]);
        }
        if(uniquePlaylists.length > 0) {
          //then get each unique playlist in the schedule
          qString = 'SELECT pid, playlist ' +
                    'FROM Playlists ' +
                    'WHERE uid = $1 AND pid = ANY (ARRAY[' + uniquePlaylists + '])';
          db.query({text: qString, values: [results.rows[0].uid]}, function(err, playlistResults) {
            if(err) {next(err); return;}

            //find all unique molecule IDs
            var uniqueMolecules = new Array;
            moleculesObj = {};
            for(var p in playlistResults.rows){
              for(var m in playlistResults.rows[p].playlist){
                if(!moleculesObj[m]){
                  moleculesObj[m] = m;
                }
              }
            }
            for(var m in moleculesObj){
              uniqueMolecules.push(m);
            }
            
            if(uniqueMolecules.length > 0){
              //then get each unqiue molecule that is played in the schedule
              qString = 'SELECT mid, link ' +
                    'FROM Molecules ' +
                    'WHERE mid = ANY (ARRAY[' + uniqueMolecules + '])';
              db.query({text: qString}, function(err, moleculeResults) {
                if(err) {next(err); return;}

                //format the data

                var playlists = {};
                for(var p in playlistResults.rows){
                  p = playlistResults.rows[p];
                  playlists[p.pid] = p.playlist;
                }

                var molecules = {};
                for(var m in moleculeResults.rows){
                  m = moleculeResults.rows[m];
                  molecules[m.mid] = m.link;
                }


                res.send({
                  schedule: schedule,
                  playlists: playlists,
                  molecules: molecules
                });

              });
            } else {
              var err = new Error("Molecules within playlists do not exist");
              err.status = 400;
              next(err);
              return;
            }
          });
        } else {
          var err = new Error("User does not have any playlists");
          err.status = 400;
          next(err);
          return;
        }
      } else {
        var err = new Error("Invalid username");
        err.status = 400;
        next(err);
        return;
      }
    });

  } else {
    var err = new Error("Did not receive required information");
    err.status = 400;
    next(err);
    return;
  }
});

module.exports = router;
