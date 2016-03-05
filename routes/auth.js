var express = require('express');
var router = express.Router();
var njwt = require('njwt');
var db = require('../lib/db.js');

var scheduleAuth = require('./auth/schedule');
var playlistsAuth = require('./auth/playlists');

var signingKey = "PLACEHOLDER";

router.use(function(req,res,next) {
  var token = req.headers.token;
  if(token){
    njwt.verify(token,signingKey,function(err,ver){
      if(err){
        res.status(401).send({
          error: 'Invalid token',
        });
      }else{
        req.user = ver.body;
        next();
      }
    });
  } else{
    res.status(401).send({
      error: 'Must be logged in',
    });
  }
});

router.use('/schedule', scheduleAuth);
router.use('/playlists', playlistsAuth);


module.exports = router;
