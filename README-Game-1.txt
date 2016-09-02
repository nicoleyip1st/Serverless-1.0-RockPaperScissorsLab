Serverless Lab -  Rock Paper Scissors - Part 1

----------------------
4. Lets create a game! Rock Paper Scissors to be precise...
https://github.com/kobmic/serverless-rps-lab

########
a. Write a new lambda function createGame that consumes and produces JSON. Upload and test.

example Json in:

{
    "email": "player1@gmail.com"
}

example Json out:

{
    "gameId": "a7f7615c-c385-457c-93a5-1267dfe8787e",
    "state": "created",
    "player1": "mike@gmail.com"
}

Hints:
Write your createGame function in handler.js and add the new function name to serverless.yml
event contains the input json
context.{done,fail,succeed}(data) and cb(err,data) will all end lambda execution and output the message passed to it
To generate a uuid (unique universal ID) https://www.npmjs.com/package/uuid 
    > npm install uuid --save
    var uuid = require('uuid');
    uuid.v1(); //time based or
    uuid.v4(); //random 
    
######
b. Create a new game and store it in DynamoDB

Input and output should be the same as in 4a.

The schema of a game should have the following fields
    String gameId;
    String state;
    String player1;
    String player2;
    String winner;
    String player1Move;
    String player2Move;

Hints:
The AWS SDK is automatically available to lambda functions.
Refer here for the Nodejs AWS SDK: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
To include the AWS SDK put the following at the top of the file:
var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

To initialise a new DynamoDB instance use the following:
var dynamo = new AWS.DynamoDB();

######
c. Call createGame when a POST request is receved to the /games endpoint

Hints:
Update the events associated with your function in serverless.yml

######
Interim Summary
You have now created a Lambda Function which creates a new game and stores it to the DynamoDB when a POST request is receved to the /games endpoint
From here you can choose where you want to go
Check out README-PubNub.txt to learn about integrating with PubNub and creating DynamoDB streams
Check out README-Game-2.txt to finish off the rest of the rock-paper-scissors game