require('dotenv').config({ path: '.env.local' }) || require('dotenv').config({ path: '.env' });
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { google } = require('googleapis');

async function testDrive() {
  console.log('Testing Google Drive...');
  try {
    const drive = google.drive('v3');
    await drive.files.list({ auth: process.env.DRIVE_CLIENT_ID });
    console.log('Drive connected (or failed with auth, not SSL)');
  } catch (err) {
    console.log('Drive error:', err.message);
  }
}

async function testR2() {
  console.log('Testing R2...');
  try {
    const r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
    await r2.send(new ListBucketsCommand({}));
    console.log('R2 connected');
  } catch (err) {
    console.log('R2 error:', err.message);
  }
}

async function run() {
  await testDrive();
  await testR2();
}

run();
