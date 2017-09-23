// Graph Data Structure
const Graph = require('./graph');
const graph = new Graph();

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
                var branchURL = graph.getVertex(index);
                // $ is Cheerio by default, a lean implementation of core jQuery designed specifically for the server
                var absoluteLinks = $("a[href^='http']");
                absoluteLinks.each(function () {
                    var link = $(this).attr('href');
                    graph.addVertex(link);
                    graph.addEdge(branchURL, link);
                    crawler.queue(link);
                });
                redisClient.sadd(graph.getVertices(), function(err, reply) {
                    console.log(graph.size(), reply);
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
    for (let i = 0; i < urls.length; i++) {
        graph.addVertex(urls[i]);
    }
    crawler.queue(graph.getVertices());

    redisClient.on('connect', function() {
        redisClient.sadd(graph.getVertices(), function(err, reply) {
            console.log(reply);
        });
        redisClient.smembers('http://youtube.com', function(err, reply) {
            console.log(reply);
        });
    });
});