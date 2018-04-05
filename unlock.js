const readline = require('readline');
const https = require('https');
const line = readline.createInterface(process.stdin, process.stdout);

line.question('Issue ID: ', id => {
  line.question('Password: ', password => {
    console.log('---');
    const body = JSON.stringify({ password });
    const req = https.request({
      host: 'cdk-issues.azurewebsites.net',
      path: `/api/issues/${id}/decrypt?code=${process.env.CDK_ISSUE_KEY}`,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': body.length,
      }
    }, res => {
      res.pipe(process.stdout);
      res.on('end', () => {
        process.stdout.write('\n');
        if (res.statusCode !== 200) {
          console.error(`Unexpected ${res.statusCode} code.\n`);
          process.exit(1);
        } else {
          process.exit(0);
        }
      });
    });

    req.write(body);
    req.end();
  });
});
