Serverless Lab - Rock Paper Scissors - Part 2

######
You should have got the hang of this by now - for the next steps follow the same process as 4a,b,c in README-Game-1.txt
Create the required lambda function, hook it up the the DynamoDB and add the appropriate event source in serverless.yml

d. Create a GetGame lambda function that is called when a GET request is received on the /games endpoint.

Json in:

{
    "gameId": "c89dc950-141e-46ea-9f99-b1f54fb9c46d",
}

Json out:

{
    "gameId": "c89dc950-141e-46ea-9f99-b1f54fb9c46d",
    "state": "ended",
    "player1": "player1@gmail.com",
    "player2": "player2@gmail.com",
    "player1Move": "rock",
    "player2Move": "rock",
    "winner": "tie""
}

Hint:
Your function should call getItem on the DynamoDB object.

######
e. Create a JoinGame lambda function that is called when a PUT request is received on the games/{gameid} endpoint.

Json in:

{
    "gameId": "c89dc950-141e-46ea-9f99-b1f54fb9c46d",
    "email": "player2@gmail.com"
}
Json out:

{
    "gameId": "c89dc950-141e-46ea-9f99-b1f54fb9c46d",
    "state": "ready",
    "player1": "player1@gmail.com",
    "player2": "player2@gmail.com"
}   

To complete this step, you need to add more advanced functionality onto your API gateway.
Have a look at https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#input-variable-reference

Request templates allow your API gateway to modify the json input that is passed on to your lambda function.
https://github.com/serverless/serverless/blob/master/lib/plugins/aws/deploy/compile/events/apiGateway/README.md

Mapping for {gameid} and add back remaining JSON properties in request body:

{ 
    "gameId" : "$input.params('gameid')",
    "email": "$input.json('$.email')"
}

Hint:
Write your function first with the expected json
	Update player2 and state
Then create your http event in serverless.yml with a request template
request:
    template:
      application/json: { "gameId" : "$input.params('gameid')", "email": "$input.json('$.email')" }

######
f. Create a MakeMove lambda function that is called when a POST request is received on the games/{gameid} endpoint.
Json in:

{
    "gameId": "c89dc950-141e-46ea-9f99-b1f54fb9c46d",
    "email": "player1@gmail.com",
    "move": "rock"
}
Json out:

{
    "gameId": "c89dc950-141e-46ea-9f99-b1f54fb9c46d",
    "state": "waiting",
    "player1": "player1@gmail.com",
    "player2": "player2@gmail.com",
    "player1Move": "rock",
}   

Request Template
{ 
    "gameId" : "$input.params('gameid')",
    "email": "$input.path('$.email')",
    "move": "$input.path('$.move')"
}

######
g. Create a GetGames lambda function that is called when a GET request is received on the /games endpoint with a query parameter, ie. /games?state=ended
(This is similar to getGame in 4d. just with a different search parameter - you'll have to use query or scan rather than getItem)

Json in:

{
    "state": "created"
}

Json out:

[
  {
    "gameId": "a6e1efd2-952d-4ea2-982a-663a12ac3a24",
    "state": "created",
    "player1": "mike@gmail.com"
  },
  {
    "gameId": "b5c9be16-5633-40ae-950c-a8b33a171d48",
    "state": "created",
    "player1": "mike@gmail.com"
  }
]   

Request Template
{ 
    "state" : "$input.params('state')"
}

######
Final Summary
Hopefully you now have a fully function rock paper scissors game!