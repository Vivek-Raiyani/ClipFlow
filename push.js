const { exec } = require('child_process');
require('dotenv').config({ path: '.env' });
console.log('Running drizzle-kit push...');
exec('npx drizzle-kit push', { env: process.env }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log(`Stdout: ${stdout}`);
});
