const crawler = require("crawler");
const redis = require('redis');
const fs = require('fs');

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
                    console.log('seeds:' + reply);
                });
            }
        }
        done();
    }
});

// TODO: Need to get from redis
fs.readFile('./seed.json', 'utf8', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const urls = JSON.parse(data);
    crawlerInstance.queue(urls);
});