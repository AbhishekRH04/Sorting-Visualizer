// DOM Elements
const inp_as = document.getElementById('a_size');
const inp_gen = document.getElementById("a_generate");
const inp_aspeed = document.getElementById("a_speed");
const inp_reset = document.getElementById("a_reset");
const butts_algos = document.querySelectorAll(".algos button");
const cont = document.getElementById("array_container");

// State Variables
let array_size = inp_as.value;
let div_sizes = [];
let divs = [];
let margin_size;
let isSorting = false;
let activeAlgorithm = null;
const activeTimeouts = new Set();

// Initialize
cont.style.flexDirection = "row";
window.onload = update_array_size();

// Event Listeners
inp_gen.addEventListener("click", generate_array);
inp_as.addEventListener("input", update_array_size);
inp_reset.addEventListener("click", resetEverything);
butts_algos.forEach(btn => btn.addEventListener("click", runAlgorithm));

// Core Functions
function generate_array() {
    if (isSorting) return;
    
    cont.innerHTML = "";
    div_sizes = [];
    divs = [];
    
    for (let i = 0; i < array_size; i++) {
        div_sizes[i] = Math.floor(Math.random() * 0.5 * (inp_as.max - inp_as.min)) + 10;
        divs[i] = document.createElement("div");
        cont.appendChild(divs[i]);
        margin_size = 0.1;
        divs[i].style.cssText = `
            margin: 0% ${margin_size}%; 
            background-color: blue; 
            width: ${100/array_size - (2*margin_size)}%; 
            height: ${div_sizes[i]}%;
        `;
    }
}

function update_array_size() {
    array_size = inp_as.value;
    generate_array();
}

// Algorithm Control
function runAlgorithm() {
    if (isSorting) return;
    
    disableControls();
    this.classList.add("butt_selected");
    isSorting = true;
    activeAlgorithm = this.textContent;
    
    const algorithms = {
        "Bubble": Bubble,
        "Selection": Selection_sort,
        "Insertion": Insertion,
        "Merge": Merge,
        "Quick": Quick,
        "Heap": Heap
    };
    
    algorithms[activeAlgorithm]().finally(finishSorting);
}

function finishSorting() {
    isSorting = false;
    activeAlgorithm = null;
    enableControls();
}

// Control Management
function disableControls() {
    butts_algos.forEach(btn => {
        btn.disabled = true;
        btn.classList.add("butt_locked");
    });
    inp_as.disabled = true;
    inp_gen.disabled = true;
    inp_aspeed.disabled = true;
}

function enableControls() {
    butts_algos.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("butt_locked", "butt_selected");
    });
    inp_as.disabled = false;
    inp_gen.disabled = false;
    inp_aspeed.disabled = false;
}

// Reset Functionality
function resetEverything() {
    // Cancel all pending operations
    isSorting = false;
    activeTimeouts.forEach(timeout => {
        clearTimeout(timeout);
    });
    activeTimeouts.clear();
    
    // Immediate visual reset
    const bars = document.querySelectorAll(".array-bar");
    bars.forEach(bar => {
        bar.style.backgroundColor = "blue";
    });
    
    // Enable controls without delay
    enableControls();
    
    // Queue array regeneration to ensure clean state
    requestAnimationFrame(() => {
        generate_array();
    });
}

// Animation Control
function delay(time) {
    return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
            activeTimeouts.delete(timeoutId);
            if (isSorting) resolve();
        }, time);
        activeTimeouts.add(timeoutId);
    });
}