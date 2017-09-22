class Graph {
    
	constructor() {
        this.vertices = [];
		this.edges = [];
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