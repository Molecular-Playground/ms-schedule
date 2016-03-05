var express = require('express');
var router = express.Router();
var db = require('../../lib/db.js');


router.get('/', function(req,res,next){
  	var userid = req.user.sub;
  	if(userid){
		var qString = 'SELECT pid, name, playlist ' +
		              'FROM Playlists ' +
		              'WHERE uid = $1';
	    db.query({text: qString, values: [userid]}, function(err, results){
	      if(err){
	        next(err);
	        return;
	      }
	      res.send({
	        playlists: results.rows
	      });
	    });
	} else{
		res.status(400).send({
			message: 'Did not receive required information'
		});
	}
});

router.post('/', function(req, res, next){
  	var data = req.body.data;
  	if(data && data.pid && data.playlist){
		var qString = 'UPDATE Playlists ' +
						'SET playlist = $1 ' +
			            'WHERE pid = $2';
	    db.query({text: qString, values: [data.playlist, data.pid]}, function(err, results){
	      if(err){
	        next(err);
	        res.send(err);
	      } else{
	      	res.send({
	      		success: true,
	      		message: 'Updated playlist ' + data.pid
	      	});
	      }
	    });
	} else{
		res.status(400).send({
			message: "Did not receive a playlist"
		});
	}
});

router.post('/rename', function(req, res, next){
  	var data = req.body.data;
  	if(data && data.pid && data.name){
		var qString = 'UPDATE Playlists ' +
						'SET name = $1  ' +
			            'WHERE pid = $2';
	    db.query({text: qString, values: [data.name, data.pid]}, function(err, results){
	      if(err){
	        next(err);
	        res.send(err);
	      } else{
	      	res.send({
	      		success: true,
	      		message: 'Playlist ' + data.pid + ' renamed to ' + data.name
	      	});
	      }
	    });
	} else{
		res.status(400).send({
			message: 'Did not receive required playlist information'
		});
	}
});

router.put('/', function(req, res, next){
  	var data = req.body.data;
  	var userid = req.user.sub;
  	if(userid && data && data.name && data.playlist){
		var qString = 'INSERT INTO Playlists(uid, name, playlist) ' +
					  'Values ($1, $2, $3) RETURNING pid';
	    db.query({text: qString, values: [userid, data.name, data.playlist]}, function(err, results){
	      if(err){
	        next(err);
	        res.send(err);
	      }
	      res.send({
	      	success: true,
	      	message: "Added playlist",
	      	pid: results.rows[0].pid
	      });
	      
	    });
	} else{
		res.status(400).send({
			message: 'Did not receive required playlist information'
		});
	}
});

module.exports = router;
