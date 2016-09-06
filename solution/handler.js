'use strict';

var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

var uuid = require('uuid');

// Your first function handler
module.exports.createGame = function(event, context, cb) { 

	var gameId = uuid.v1();
	var output = {
	    "gameId": gameId,
	    "state": "created",
	    "player1": event.email
  	};

  	var dynamodb = new AWS.DynamoDB();

  	var params = {
	  Item: { /* required */
	    gameId: {     
	      S: gameId
	    },
	    state: {     
	      S: "created"
	    },
	    player1: {     
	      S: event.email
	    },
	    player2: {     
	      S: ""
	    },
	    winner: {     
	      S: ""
	    },
	    player1Move: {     
	      S: ""
	    },
	    player2Move: {     
	      S: ""
	    }
	  },
	  TableName: 'aws-nodejs-game-dev', /* required */
	  ReturnConsumedCapacity: 'NONE',
	  ReturnItemCollectionMetrics: 'NONE',
	  ReturnValues: 'ALL_NEW'
	};
	dynamodb.putItem(params, function(err, data) {
	  	if (err) console.log(err, err.stack); // an error occurred
	  	else
	  		cb(null, data);	  	
	});	
}