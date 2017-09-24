const childProcess = require('child_process');
const redis = require('redis');
const fs = require('fs');

// Redis
const redisClient = redis.createClient();

// Store seed URLs in redis
fs.readFile('./seed.json', 'utf8', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const urls = JSON.parse(data);
    redisClient.sadd('seeds', urls, function(err, reply) {
        console.log('redis init:' + reply);
    });
});

// TODO: Need to resume from last crawled url or random crawling, need to handle initial crawler queueing separately and need to handle heap memory issue
const respawn = () => {
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