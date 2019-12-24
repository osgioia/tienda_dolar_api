
var express = require('express');
//const AWS = require('aws-sdk');


var app = express();

/*
const s3 = new AWS.S3({
    AccessKeyID: 'AKIA44XOM6BBAFGN5LLX',
    SecretAccessKey: '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',
    Region: 'sa-east-1'
});

async function UpdateDB () {
    try {
      const params = {
        Bucket: 'products.database.microverse',
        Key: 'db.json' 
      }
  
      const data = await s3.getObject(params).promise();
  
      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
  }
*/

app.get('/', function(req, res, next) {
  /*    UpdateDB(); */
  res.send("I'm a creep, I'm a weirdo.")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
