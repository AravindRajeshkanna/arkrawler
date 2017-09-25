const crawler = require("crawler");
const redis = require('redis');
const process = require('process');

// Redis
const redisClient = redis.createClient();

// Crawled page count for single child process
var crawledPageCount = 0;

// Crawler
const crawlerInstance = new crawler({
    maxConnections: 100,
    // This will be called for each crawled page
    callback: function(error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            crawledPageCount++;
            console.log(`page count:${crawledPageCount}`);
            // Won't allow resource link
            if (typeof $ === "function") {
                // $ is Cheerio by default, a lean implementation of core jQuery designed specifically for the server
                var absoluteLinks = [];
                $("a[href^='http']").each(function() {
                    var link = $(this).attr('href');
                    absoluteLinks.push(link);
                });
                // TODO: Need to find undefined scenario
                if(absoluteLinks.length) {
                    redisClient.sadd('seeds', absoluteLinks, function(err, reply) {
                        console.log(`seeds:${reply}`);
                    });
                }
            }
        }
        done();
        if(crawledPageCount === 1000) {
            process.exit();
        }
    }
});

redisClient.srandmember('seeds', 1000, function(err, reply) {
    crawlerInstance.queue(reply);
});