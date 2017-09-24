const process = require('process');
const exec = require('child_process').exec;

// Process
if (process.pid) {
  console.log('pid:' + process.pid);
}

// TODO: Need to start child process after it is stopped
exec(`cd ${__dirname} && node crawler.js`, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});