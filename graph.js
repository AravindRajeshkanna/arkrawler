class Graph {

	constructor() {
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

	getVertices() {
	  	return this.vertices;
	}

	getVertex(index) {
		return this.vertices[index];
	}

	addVertex(vertex) {
	  this.vertices.push(vertex);
	  this.edges[vertex] = [];
	}

	addEdge(vertex1, vertex2) {
	  this.edges[vertex1].push(vertex2);
	  this.numberOfEdges++;
	}

	size() {
	  return this.vertices.length;
	}

	print() {
	  console.log(this.vertices.map(function(vertex) {
	    return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
	  }, this).join(' | '));
	}

}

module.exports = Graph;