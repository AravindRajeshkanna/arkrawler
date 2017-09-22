//Graph Data Structure
const Graph = require('./graph');
let graph = new Graph();

var index = 0;

//Crawler
const Crawler = require("crawler");
const crawler = new Crawler({
    maxConnections : 1,
    // This will be called for each crawled page
    callback : function (error, res, done) {
      if(error) {
          console.log(error);
      } else {
          var $ = res.$;
          // Won't allow resource link
          if (typeof $ === "function") {
              var branchURL = graph.getVertex(index);
              // $ is Cheerio by default, a lean implementation of core jQuery designed specifically for the server
              var absoluteLinks = $("a[href^='http']");
              absoluteLinks.each(function() {
                var link = $(this).attr('href');
                // TODO: Check if link already present or not
                graph.addVertex(link);
                graph.addEdge(branchURL, link);
                crawler.queue(link);
              });
              console.log(graph.size());
          }
      }
      done();
      index++;
    }
});
crawler.queue(graph.getVertices());