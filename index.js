const process = require('process');
const childProcess = require('child_process');

// Process
if (process.pid) {
  console.log('pid:' + process.pid);
}

// TODO: Need to resume from last crawled url and need to handle initial crawler queueing separately
respawn = () => {
    var crawler = childProcess.exec(`cd ${__dirname} && node crawler.js`, function(error, stdout, stderr) {
        // TODO: Need to store it in file
        // console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
    crawler.on('exit', function (code, signal) {
        console.log('exit code: ', code);
        console.log('exit signal: ', signal);
        console.warn('\nCNTL-C to exit.\n');
        crawler = respawn();
    });
}
respawn();