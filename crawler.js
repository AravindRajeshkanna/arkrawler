const crawler = require("crawler");
const redis = require('redis');

// Redis
const redisClient = redis.createClient();

// Crawled page count
var crawledPageCount = 0;

// Crawler
const crawlerInstance = new crawler({
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
                    // TODO: Need to find undefined scenario
                    console.log('seeds:' + reply);
                });
            }
        }
        done();
    }
});

redisClient.srandmember('seeds', 10000, function(err, reply) {
    crawlerInstance.queue(reply);
});