// Redis
const redis = require('redis');
const redisClient = redis.createClient();

// Process
// TODO: Need to handle heap memory size exceed issue
const process = require('process');
if (process.pid) {
  console.log('This process is your pid ' + process.pid);
}

// Crawler
const Crawler = require("crawler");
const crawler = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // Won't allow resource link
            if (typeof $ === "function") {
                // $ is Cheerio by default, a lean implementation of core jQuery designed specifically for the server
                var absoluteLinks = [];
                $("a[href^='http']").each(function () {
                    var link = $(this).attr('href');
                    absoluteLinks.push(link);
                });
                crawler.queue(absoluteLinks);
                redisClient.sadd('seeds', absoluteLinks, function(err, reply) {
                    console.log(reply);
                });
            }
        }
        done();
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