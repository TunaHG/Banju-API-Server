const aws = require('aws-sdk');
aws.config.update({ region: 'ap-northeast-2'});

const sqs = new aws.SQS({ apiVersion: '2012-11-05' });

var params = {
    // Remove DelaySeconds parameter and value for FIFO queues
//    DelaySeconds: 10,
   MessageAttributes: {
    //  "Title": {
    //    DataType: "String",
    //    StringValue: "The Whistler"
    //  },
    //  "Author": {
    //    DataType: "String",
    //    StringValue: "John Grisham"
    //  },
    //  "WeeksOn": {
    //    DataType: "Number",
    //    StringValue: "6"
    //  }
   },
   MessageBody: JSON.stringify({
    'url' : 'https://www.youtube.com/watch?v=2qtKMC5wzkU'
   }),
   // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
   // MessageGroupId: "Group1",  // Required for FIFO queues
   QueueUrl: "https://sqs.ap-northeast-2.amazonaws.com/756420011247/AIEngineQueue"
 };
 
 sqs.sendMessage(params, function(err, data) {
   if (err) {
     console.log("Error", err);
   } else {
     console.log("Success", data.MessageId);
   }
 });