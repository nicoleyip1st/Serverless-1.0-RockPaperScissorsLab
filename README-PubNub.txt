Serverless Lab - PubNub integration

******
Optional. When a game is created we can connect to pubnub to publish a message to a channel
This can be set up in 2 ways
	i. As part of the createGame function, publish a message to pubnub
	ii. Set up a DynamoDB stream which will call a lambda function to publish a message to pubnub

	i. To publish to pubnub as part of the create game function:
		> npm install pubnub --save

		In your function add the following to the top (outside of the modules.export.createGame)
		var PubNub = require('pubnub');
		var pubnubmodule = new PubNub({
		      publishKey : 'pub-c-50a538d6-ec6a-44ab-ac29-1bfb5d8ade2a',
		      subscribeKey : 'sub-c-82bcd692-57b3-11e6-a5a4-0619f8945a4f'
		  });

		Then in your createGame function body put the following where you want a message to be sent:
		pubnubmodule.publish({
           channel: 'demo_tutorial',
           message: {"author":"lambda", "message": JSON.stringify(response)}
       	});

    ii. To set up a DynamoDB stream have a look at 
    	- For setting up the mapping in serverless.yml: https://github.com/serverless/serverless/blob/master/docs/guide/overview-of-event-sources.md#dynamodb-streams
    	- For setting up the mapping in cloudformation-resources.json: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html

    	- Refer to here to modify cloudformation-resources.json to enable streaming for the DynamoDB: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html

    	Edit cloudformation-resources.json
    	Add this to the GameDynamo Resource
    	"StreamSpecification" : {
		   "StreamViewType" : String
		}

		Create a Lambda event source mapping resource
		"MapLambdaToStream" :
    	{
		  "Type" : "AWS::Lambda::EventSourceMapping",
		  "Properties" : {
		    "BatchSize" : 10,
		    "Enabled" : true,
		    "EventSourceArn" : { "Fn::GetAtt" : ["GameDynamo","StreamArn"] },
		    "FunctionName" : { "Fn::GetAtt" : ["createGame","Arn"] },
		    "StartingPosition" : "TRIM_HORIZON"
		  }
		}