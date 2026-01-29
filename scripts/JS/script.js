import './buttons_script.js';
import { graphs_init } from './cytoscape_script.js'

graphs_init();

window.python_ready = function () 
{
    let ready = document.getElementById('python_ready');
    ready.style.backgroundColor = 'green';
    test();
}

function test()
{
    alert(window.test());
}