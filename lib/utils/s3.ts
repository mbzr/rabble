import AWS from 'aws-sdk'

AWS.config.update({
  region: 'me-south-1',
  accessKeyId: process.env.S3_TOKEN,
  secretAccessKey: process.env.S3_SECRET,
  apiVersions: {
    s3: 'latest',
  },
})

const s3Client = new AWS.S3()

export default s3Client
