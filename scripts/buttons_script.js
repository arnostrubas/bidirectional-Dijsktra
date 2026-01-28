import { add_vertex } from './cytoscape_script.js'

const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const nextBtn = document.getElementById('next_step');
const addBtn = document.getElementById('add_vertex');
const left_graph_checkbox = document.getElementById('left_graph_enabled');
const right_graph_checkbox = document.getElementById('right_graph_enabled');

startBtn.addEventListener('click', () => {
    try {
        startBtn.disabled = true;
        nextBtn.disabled = false;
        resetBtn.disabled = false;
    }
    catch (error) {
        alert(error.message)
    }
});

resetBtn.addEventListener('click', () => {
    try {
        resetBtn.disabled = true;
        nextBtn.disabled = true;
        startBtn.disabled = false;
    }
    catch (error) {
        alert(error.message)
    }
});

addBtn.addEventListener('click', () => {
    try {
        add_vertex(left_graph_checkbox.checked, right_graph_checkbox.checked);
    }
    catch (error) {
        alert(error.message)
    }
});

left_graph_checkbox.addEventListener('click', () => {
    try {
        if (!left_graph_checkbox.checked && !right_graph_checkbox.checked) {
            addBtn.disabled = true;
        } else {
            addBtn.disabled = false;
        }
    }
    catch (error) {
        alert(error.message)
    }
});

right_graph_checkbox.addEventListener('click', () => {
    try {
        if (!left_graph_checkbox.checked && !right_graph_checkbox.checked) {
            addBtn.disabled = true;
        } else {
            addBtn.disabled = false;
        }
    }
    catch (error) {
        alert(error.message)
    }
});