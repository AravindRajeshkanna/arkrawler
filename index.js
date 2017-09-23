// Redis
const redis = require('redis');
const redisClient = redis.createClient();

var index = 0;
// Crawler
const Crawler = require("crawler");
const crawler = new Crawler({
    maxConnections: 1,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // Won't allow resource link
            if (typeof $ === "function") {
                // $ is Cheerio by default, a lean implementation of core jQuery designed specifically for the server
                var absoluteLinks = $("a[href^='http']");
                absoluteLinks.each(function () {
                    var link = $(this).attr('href');
                    crawler.queue(link);
                    redisClient.sadd('seeds', link, function(err, reply) {
                        console.log(link);
                    });
                });
            }
        }
        done();
        index++;
    }
});

// Get seed URLs from json
const fs = require('fs');
fs.readFile('./seed.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const urls = JSON.parse(data);
    crawler.queue(urls);
    redisClient.sadd(urls);
    redisClient.sadd('seeds', urls, function(err, reply) {
        console.log(reply);
    });
});