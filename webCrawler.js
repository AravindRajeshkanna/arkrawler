//Graph Data Structure
function Graph() {
  this.vertices = [
    'http://www.amazon.com',
    'https://stackoverflow.com', 
    'https://en.wikipedia.org/wiki/Main_Page', 
    'https://twitter.com/?lang=en',
    'https://www.microsoft.com/en-in'
  ];
  this.edges = [];
  this.edges['http://www.amazon.com'] = [];
  this.edges['https://stackoverflow.com'] = [];
  this.edges['https://en.wikipedia.org/wiki/Main_Page'] = [];
  this.edges['https://twitter.com/?lang=en'] = [];
  this.edges['https://www.microsoft.com/en-in'] = [];
  this.numberOfEdges = 0;
}

Graph.prototype.getVertices = function() {
  return this.vertices;
};

Graph.prototype.getVertex = function(index) {
  return this.vertices[index];
}

Graph.prototype.addVertex = function(vertex) {
  this.vertices.push(vertex);
  this.edges[vertex] = [];
};

Graph.prototype.addEdge = function(vertex1, vertex2) {
  this.edges[vertex1].push(vertex2);
  this.numberOfEdges++;
};

Graph.prototype.size = function() {
  return this.vertices.length;
};

Graph.prototype.print = function() {
  console.log(this.vertices.map(function(vertex) {
    return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
  }, this).join(' | '));
};

const graph = new Graph();

var index = 0;

//Crawler
const Crawler = require("crawler");
const c = new Crawler({
    maxConnections : 1,
    // This will be called for each crawled page
    callback : function (error, res, done) {
      if(error){
          console.log(error);
      } else{
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
                c.queue(link);
              });
              console.log(graph.size());
          }
      }
      done();
      index++;
    }
});
c.queue(graph.getVertices());