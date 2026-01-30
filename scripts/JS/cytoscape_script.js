import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
cytoscape.use(edgehandles);
import { layout, style } from './cy_style_script.js';
import * as graphs from './graphs.js';

const container1 = document.getElementById('graph_container1');
const container2 = document.getElementById('graph_container2');

let cy1 = cytoscape({
    container: container1,
    layout: layout,
    style: style,
});
let eh1 = cy1.edgehandles();
let first_graph_list = [];
let first_graph_n = 0;

let cy2 = cytoscape({
    container: container2,
    layout: layout,
    style: style,
});
let eh2 = cy2.edgehandles();
let second_graph_list = [];

/* 
==================================================================================
                            HELP FUNCTIONS
==================================================================================
*/

function add_edge(addedEdge) 
{
    let input = prompt("Zadej váhu hrany (číslo):", "1");
    if (input !== null) {
        let weight = Number(input);

        if (!isNaN(weight) && weight > 0) {
            addedEdge.data('weight', weight);
        } else {
            alert("To není platné číslo!");
            addedEdge.remove();
        }
    }
}

cy1.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => add_edge(addedEdge));
cy2.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => add_edge(addedEdge));

function find_new_vertex_id(cy) 
{
    const sortedVertexes = cy.nodes().sort((a, b) => {
        return a.id().localeCompare(b.id(), undefined, {numeric: true, sensitivity: 'base'});
    });
    let new_index = -1;
    sortedVertexes.forEach(v => {
        if (v.id() != new_index) return new_index;
        new_index++;
    });
    return new_index;
}

function remove_from_selected_vertexes(cy)
{
    cy.forEach(v => {
        if (v.id() === '0' || v.id() === '-1') alert("Nelze odstranit počáteční/koncový vrchol");
        else {
            v.remove();
        }
    });
}

function remove_from_selected_edges(cy)
{
    cy.forEach(e => {
        e.remove();
    });
}

function add_vertex(event)
{  
    const cy = event.cy;
    if (event.target === cy) {
        let pos = event.position;
        let new_index = find_new_vertex_id(cy);
        cy.add({
            group: 'nodes',
            data: { 
                id: new_index,
                label: new_index.toString(),
            },
            position: { x: pos.x, y: pos.y }
        });
    }
}

function clean_data(cy)
{
    let nodes = cy.nodes().map(node => {
        return {
            id: node.id(),
        }
    });
    let edges = cy.edges().map(edge => {
        return {
            source: edge.source().id(),
            target: edge.target().id(),
            weight: edge.data('weight')
        };
    });
    let graph = {
        nodes: nodes,
        edges: edges
    };
    return graph;
}

function createGraph(cy, elements) 
{ 
    let nodes = JSON.parse(elements.nodes);
    let edges = JSON.parse(elements.edges);
    
    cy.remove(cy.elements());
    cy.add(nodes);
    cy.add(edges);
    cy.layout(layout).run();
    cy.fit();
}

/*
==================================================================================
                            EXPORT FUNCTIONS
==================================================================================
*/ 

export function graphs_init() {
    cy1.add(graphs.basic_graph);
    cy1.layout(layout).run();
    cy1.fit();
    cy2.add(graphs.basic_graph);
    cy2.layout(layout).run();
    cy2.fit();
}

export function enableVertexAdding()
{
    cy1.on('tap', add_vertex);
    cy2.on('tap', add_vertex);
}

export function disableVertexAdding()
{
    cy1.off('tap', add_vertex);
    cy2.off('tap', add_vertex);
}

export function remove_vertex() 
{
    let selected_vertex1 = cy1.$('node:selected');
    if (selected_vertex1) remove_from_selected_vertexes(selected_vertex1);

    let selected_vertex2 = cy2.$('node:selected');
    if (selected_vertex2) remove_from_selected_vertexes(selected_vertex2);
}

export function remove_edge()
{
    let selected_edge1 = cy1.$('edge:selected');
    if (selected_edge1) remove_from_selected_edges(selected_edge1);

    let selected_edge2 = cy2.$('edge:selected');
    if (selected_edge2) remove_from_selected_edges(selected_edge2);
}

export function reset() {
    cy1.layout(layout).run();
    cy1.fit();
    cy2.layout(layout).run();
    cy2.fit();
}

export function enableEdgeAdding() {
    eh1.enableDrawMode();
    eh2.enableDrawMode();
}

export function disableEdgeAdding() {
    eh1.disableDrawMode();
    eh2.disableDrawMode();
}


export function getcy1Elements() {
    return clean_data(cy1);
}

export function getcy2Elements() {
    return clean_data(cy2);
}

export function calculate(json)
{
    let result = window.run(json)
    const data = JSON.parse(result)
    const first_part = data.part_one
    const first_steps = first_part.steps;
    const first_path = first_part.path;
    const first_graph_json_list = JSON.parse(first_steps).graph;

    first_graph_json_list.forEach(e => {
        first_graph_list.push(JSON.parse(e).elements)
    });
    console.log(first_graph_list);
    createGraph(cy1, first_graph_list[first_graph_n]);
}

export function move(next)
{
    if (next) {
        try {
            if (first_graph_n == first_graph_list.length) 
            {
                throw "End of algorithm";
            } 
            else 
            {
                first_graph_n++;
                createGraph(cy1, first_graph_list[first_graph_n])
            }
        } catch (error) 
        {
            alert(error)
        }
    } 
    else {
        try {
            if (first_graph_n == 0) 
            {
                throw "End of algorithm";
            } 
            else 
            {
                first_graph_n--;
                createGraph(cy1, first_graph_list[first_graph_n])
            }
        } catch (error) 
        {
            alert(error)
        }
    }
}
