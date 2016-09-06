Serverless lab - infra set up

Pre-requisites:
Nodejs installed
Postman or other app that can debug api's

--------------
1. Hello World with Serverless

> cd to/your/project/dir
> npm install serverless -g #--save     I don't think save is required?

This will install serverless globally to allow you to run it on the command line and save it as a dependency in your project in node_modules

To look at the available commands:
> serverless help

Lets create our project in the current directory using aws with nodejs as the runtime environment.
> serverless create --template aws-nodejs

The other available templates are located here: https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates

This creates:
event.json 				#the test event that is input to your lambda function when testing
handler.js 				#the main lambda function code
serverless.env.yml 		#defines environment variables for serverless to apply when deploying your functions
serverless.yml 			#defines the whole configuration of your function(s), their corresponding events, the used plugins, custom resources, and other service configurations

Edit serverless.yml and change the following:
service: #Set this to a unique name for your project so you can identify your functions from others in the lab

Uncomment the defaults section and change to sydney region!
defaults:
 stage: dev
 region: ap-southeast-2

Also change the region in serverless.env.yml to ap-southeast-2

Before we deploy our function we need to connect Serverless to our aws account
If you have an aws profile set up then you don't need to export the following environment variables (use aws configure if you have the awscli installed)
If you don't have aws credentials ask for access to the SMS-Non-bill account.
https://github.com/serverless/serverless/blob/master/docs/guide/provider-account-setup.md#amazon-web-services
> export AWS_ACCESS_KEY_ID=
> export AWS_SECRET_ACCESS_KEY=
> SET AWS_DEFAULT_REGION=ap-southeast-2
Note: These will only last until you close your terminal. If you start a new terminal you will need to re-export these variables.
Note: For command prompt use SET instead of export

Lets deploy the hello {world} function serverless created for us
> serverless deploy

Log into the AWS console and go to the Lambda page
https://smsmt-mel-si-nonbill.signin.aws.amazon.com/console
using one of these guys:
  LabUser1
  LabUser2
  LabUser3
  LabUser4
  LabUser5
  LabUser6

PW: forthewin

You should see your function with the following naming convention:
<Service Name>-<Stage Name>-<Function Name>
Click on your function, hit the big blue Test button, click Save and Test on the default test event.
Your console output should show 
 "Go Serverless v1.0! Your function executed successfully!"

----------------------
2. API Gateway Hello World
https://github.com/serverless/serverless/blob/master/docs/guide/event-sources.md
Lets add an http endpoint called /games which will call our hello lambda function when a GET request is received.

Edit serverless.yml and add the following:
functions:
  hello:
    handler: handler.hello
    events:
      - http:		#Add me
          path: games	#Add me
          method: get 	#Add me

Re-deploy your project
> serverless deploy

Go back to the AWS console and go to the API Gateway page
Find your API with the following naming convention
<Stage>-<Service Name>
Click on your API and go to Resources.
You should now see the /games resource which is accessible through the /games path and an associated GET HTTP method. Click on GET to open up the API endpoint. Click on the lightning icon with the label test.

In the next window click on the blue test button and see the result on the right hand side.

---------------------
3. Adding a Dynamo DB
https://github.com/serverless/serverless/blob/master/docs/guide/custom-provider-resources.md

Edit serverless.yml
Uncomment the resources section and add the following under Resources:
 $ref: ./cloudformation-resources.json
Download the cloudformation-resources.json and save it into your project folder.

In serverless.env.yml add the following under the lowest level vars: (the one after ap-southeast-2: in the regions section)
  stage: dev
  region: ap-southeast-2
  service: <your service name>

cloudformation-resources.json contains cloudformation snippets for each resource we want to include.
They are a custom IAM Role for the lambda function to run as, a custom IAM policy to give the function the permissions it will need to access DynamoDB and the Dynamo DB itself with a hash key specified as the gameid attribute. 
Note: With DynamoDB there are two keys you can specify on creation to help distribute the data in a more efficient way depending on your use case; these are HASH and RANGE keys. The HASH key must be a unique identifier for each object stored and the RANGE key will be used for sharding purposes so you can limit your search to a range of objects for efficiency.

DynamoDB is a schemaless database so there is no need to specify all attributes/columns on creation. You only need to specify the HASH key (and optionally a RANGE key)

Re-deploy your project
> serverless deploy

log into the aws console and go to the DynamoDB service
You shoud see your database with the naming convention <project>-game-<stage>

----------------------
Interim Summary
You have now created a lambda function hooked up to an API gateway with a single endpoint and a DynamoDB on the side
Lets start doing some fun stuff and connect them together in a meaningful way.

Go over to README-Game-1.txt