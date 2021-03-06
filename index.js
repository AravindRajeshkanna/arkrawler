// TODO: Need to maintain env
const childProcess = require('child_process');
const redis = require('redis');
const fs = require('fs');

// Redis
const redisClient = redis.createClient();

// Store seed URLs in redis
fs.readFile('./seed.json', 'utf8', function(err, data) {
    if (err) {
        return console.error(err);
    }
    const urls = JSON.parse(data);
    redisClient.sadd('seeds', urls, function(err, reply) {
        console.log(`redis init:${reply}`);
    });
});

const respawn = function() {
    var crawler = childProcess.exec(`cd ${__dirname} && node crawler.js`, function(error, stdout, stderr) {
        // TODO: Need to store it in file
        // console.log('stdout: ' + stdout);
        console.log(`stderr:${stderr}`);
        if (error !== null) {
            console.log(`exec error:${error}`);
        }
    });
    crawler.on('exit', function(code, signal) {
        crawler = respawn();
    });
}
respawn();