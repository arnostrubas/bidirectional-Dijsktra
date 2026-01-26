import networkx as nx
from pyscript import window
import json
from networkx.readwrite.json_graph import cytoscape_data
import heapq
from enum import Enum

#region custom_classes
class Node:
    def __init__(self, d, id, state):
        self.d = d
        self.id = id
        self.state = state
    
    def __lt__(self, other):
        if self is None or other is None:
            return NotImplemented
        return self.id < other.id
    
    def __str__(self):
        return str(self.id)


class Queue(list):
    def __init__(self):
        self.count = 0

    def insert(self, element):
        heapq.heappush(self, (element.d, element))
        self.count += 1
    
    def update(self, element):
        heapq.heappush(self, (element.d, element))

    def extractMin(self):
        d, element = heapq.heappop(self)
        while element.d != d:
            if len(self) == 0:
                return None
            d, element = heapq.heappop(self)
        self.count -= 1
        return element
    
    def isEmpty(self):
        return self.count == 0

#endregion

#region json_func
def node_from_graph(G, id):
    for node in G.nodes:
        if node.id == id:
            return node

def json_to_graph(JSON):
    json_dict = json.loads(JSON)
    json_elements = json_dict["elements"]
    json_nodes = json_elements["nodes"]
    json_edges = json_elements["edges"]
    graph = nx.DiGraph()
    for json_node in json_nodes:
        data = json_node["data"]
        node = Node(d = data["d"], id = data["id"], state = data["state"])
        graph.add_node(node)

    for json_edge in json_edges:
        data = json_edge["data"]
        source = node_from_graph(graph, data["source"])
        target = node_from_graph(graph, data["target"])
        graph.add_edge(source, target, weight=data["weight"])
    return graph


def graph_to_json(G):
    nodes = []
    for node in G.nodes:
        nodes.append({
            "data": {
                "id": node.id, 
                "d": node.d,
                "state": node.state,
                "label": node.id
            }
        })

    edges = []
    for u, v, data in G.edges(data=True):
        edges.append({
            "data": {
                "source": u.id, 
                "target": v.id,  
                "weight": data['weight']
            }
        })

    json_data = {
        "elements": {
            "nodes": nodes,
            "edges": edges
        }
    }
    return json.dumps(json_data)
#endregion

#region graph_functions
def edgeWeight(graph, u, v):
    return graph[u][v]['weight']

def Dijkstra_one_relax(G, A):
    Q = Queue()
    Q.insert(A)
    yield 
    while not Q.isEmpty():
        v = Q.extractMin()
        v.state = "CLOSED"
        for u in list(G.successors(v)):
            if u.state == "UNVISITED":
                u.d = v.d + edgeWeight(G, v, u)
                u.state = "OPEN"
                Q.insert(u)
            elif u.state == "OPEN":
                if v.d + edgeWeight(G, v, u) < u.d:
                    u.d = v.d + edgeWeight(G, v, u)
                    Q.update(u)
            yield 
    return None
   

def Dijkstra_one_step(graph, a):
    G = json_to_graph(graph)
    A = node_from_graph(G, a) 
    runner = Dijkstra_one_relax(G, A)
    result = []
    for _ in runner:
        result.append(graph_to_json(G))
    res =  {
        "graph": result
    }
    return json.dumps(res)
    
#endregion

#region graphs
def simpleGraph():
    G = nx.DiGraph()
    B = Node(1000, "B", "UNVISITED")
    A = Node(0, "A", "OPEN")
    D = Node(1000, "D", "UNVISITED")
    E = Node(1000, "E", "UNVISITED")
    C = Node(1000, "C", "UNVISITED")
    G.add_nodes_from([A, B, C, D, E])
    G.add_weighted_edges_from([(A, B, 1), (A, C, 2), (A, D, 6), (A, E, 4), (C, D, 1)])
    result = {
        "graph": graph_to_json(G),
        "first": "A"
    }
    return json.dumps(result)

def complicatedGraph():
    G = nx.DiGraph()
    A = Node(0, "A", "OPEN")
    B = Node(1000, "B", "UNVISITED")
    C = Node(1000, "C", "UNVISITED")
    D = Node(1000, "D", "UNVISITED")
    E = Node(1000, "E", "UNVISITED")
    F = Node(1000, "F", "UNVISITED")
    G_node = Node(1000, "G", "UNVISITED")
    H = Node(1000, "H", "UNVISITED")
    I = Node(1000, "I", "UNVISITED")
    J = Node(1000, "J", "UNVISITED")
    K = Node(1000, "K", "UNVISITED")
    L = Node(1000, "L", "UNVISITED")
    M = Node(1000, "M", "UNVISITED")
    N = Node(1000, "N", "UNVISITED")

    G.add_nodes_from([A, B, C, D, E, F, G_node, H, I, J, K, L, M, N])

    G.add_weighted_edges_from([
        (A, B, 1), (A, C, 3), (A, D, 6), (A, E, 4),
        (B, F, 2), (B, G_node, 5),
        (C, F, 1), (C, H, 3), (C, I, 5),
        (D, G_node, 1), (D, I, 7),
        (E, H, 2), (E, J, 5),
        (F, K, 3), (F, L, 4),
        (G_node, K, 1), (G_node, J, 6),
        (H, L, 2), (H, M, 8),
        (I, M, 1), (I, J, 3),
        (J, N, 1),
        (K, M, 1),
        (L, N, 3),
        (M, N, 1)
    ])

    result = {
        "graph": graph_to_json(G),
        "first": "A"
    }
    
    return json.dumps(result)
#endregion



window.complicatedGraph = complicatedGraph
window.simpleGraph = simpleGraph
window.Dijkstra_one_step = Dijkstra_one_step
window.startApp()
