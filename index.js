// TODO: Need to start child process after it is killed
const exec = require('child_process').exec;
exec(`cd ${__dirname} && node crawler.js`, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});