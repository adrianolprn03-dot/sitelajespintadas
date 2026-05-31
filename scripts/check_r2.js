const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

s3Client.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, MaxKeys: 10 }))
  .then(data => {
      console.log("R2 files:");
      data.Contents.forEach(c => console.log(c.Key));
  })
  .catch(console.error);
