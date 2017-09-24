// Redis
const redis = require('redis');
const redisClient = redis.createClient();

// Process
// TODO: Need to resume the process
const process = require('process');
if (process.pid) {
  console.log('This process is your pid ' + process.pid);
}

// Garbage collection statistics
const gc = (require('gc-stats'))();
gc.on('stats', function (stats) {
    console.log('Used heap size:' + stats.after.usedHeapSize);
});

// Crawled page count
var crawledPageCount = 0;

// Crawler
const Crawler = require("crawler");
const crawler = new Crawler({
    maxConnections: 100,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            crawledPageCount++;
            console.log('page count:' + crawledPageCount);
            redisClient.hset("crawler", "pageCount", crawledPageCount);
            // Won't allow resource link
            if (typeof $ === "function") {
                // $ is Cheerio by default, a lean implementation of core jQuery designed specifically for the server
                var absoluteLinks = [];
                $("a[href^='http']").each(function () {
                    var link = $(this).attr('href');
                    absoluteLinks.push(link);
                });
                redisClient.sadd('seeds', absoluteLinks, function(err, reply) {
                    console.log('seeds:' + reply);
                });
                // Stop queueing to resolve heap memory issue
                if (crawledPageCount <= 2000 ) {
                    crawler.queue(absoluteLinks);
                }
            }
        }
        done();
    }
});

// Get seed URLs from json
const fs = require('fs');
fs.readFile('./seed.json', 'utf8', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const urls = JSON.parse(data);
    crawler.queue(urls);
    redisClient.sadd(urls);
    redisClient.sadd('seeds', urls, function(err, reply) {
        console.log('redis init:' + reply);
    });
});