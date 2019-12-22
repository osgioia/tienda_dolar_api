const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    AccessKeyID: 'AKIA44XOM6BBAFGN5LLX',
    SecretAccessKey: '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',
    Region: 'sa-east-1'
});

async function getObject (bucket, objectKey) {
  try {
    const params = {
      Bucket: bucket,
      Key: objectKey 
    }

    const data = await s3.getObject(params).promise();

    return data.Body.toString('utf-8');
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

// To retrieve you need to use `await getObject()` or `getObject().then()`
getObject('products.database.microverse', 'db.json');