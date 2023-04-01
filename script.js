const main = document.querySelector(".main");
const input = document.querySelector(".input");
const addbtn = document.querySelector(".add");

// Placeholder notes for initial users
let notes = [
    "Welcome to my note taker",
    "You can swipe notes right to strike them off",
    "You can swipe notes left to delete them",
    "You can tap notes to edit them",
    "And you can add notes with the button below",
];
let index = 0;
notes.forEach(createNote);

// initial text box input handler
function inputbox(text = ""){
    notes.push(text);
    save();
    input.value = "";
    input.classList.add("hide")
    addbtn.classList.remove("hide")
};
// Added blur event to the input box
// A blur event is called when an element loses focus
input.addEventListener("keydown", e =>{
    if(e.key == "Enter"){
        e.target.blur();
    }
});
input.addEventListener("blur", e=>{
    inputbox(input.value);
})

// Add button handler
addbtn.addEventListener("click", addbtnfunction);
function addbtnfunction(){
    input.classList.remove("hide");
    input.focus();
    addbtn.classList.add("hide");
}

// Create a note element
function createNote(text){
    if(text == ""){
        text = "New Note";
    };
    let note = document.createElement("div");
    note.classList.add("note");
    note.classList.add("text");
    note.innerText = text;
    note.dataset.state = "edit";
    note.dataset.strike = "false";
    note.dataset.moved = "false";
    note.dataset.index = index++;
    // add event listeners
    note.addEventListener("mousedown", mousedown);
    note.addEventListener("touchstart", touchstart);
    main.appendChild(note);
}

// edit note
function edit(element){
    let text = element.innerText;
    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("note");
    input.classList.add("input");
    input.value = text;
    input.dataset.index = element.dataset.index;
    element.before(input);
    input.focus();
    element.remove();
    input.addEventListener("keydown", enterKey);
    // Added blur event
    // A blur event is called when an element loses focus
    input.addEventListener("blur", submit);
}

function enterKey(event){
    if(event.key == "Enter"){
        event.target.blur()
    }
}
function submit(event){
    let element = event.target;
    let text = element.value;
    element.remove();
    notes[element.dataset.index] = text;
    save();
}

// Mouse Event Listeners
function mousedown(event){
    let note = event.target;
    note.dataset.start = event.clientX;
    note.dataset.moved = "false";
    note.addEventListener("mousemove", mousemove);
    note.addEventListener("mouseup", mouseup);
    
    note.classList.remove("strike");
    note.dataset.strike = "false";
    note.dataset.state = "edit"
};
function mousemove(event){
    let note = event.target;
    note.dataset.moved = "true";
    let start = note.dataset.start;
    let current = event.clientX
    let difference = current - start;
    let width = note.offsetWidth;
    note.style.setProperty("left",current-start + "px");
    if(difference < -(width/3)){
        note.style.setProperty("background", "rgb(247, 210, 205)");
        note.dataset.state = "delete"
    } else if(difference > (width/4)){
        note.style.setProperty("background", "rgb(194, 230, 247)");
        note.dataset.state = "strike"
    } else {
        note.style.setProperty("background", "#ffe6b7");
        note.dataset.state = "edit"
    }
};
function mouseup(event){
    let note = event.target;
    let state = note.dataset.state;

    if(state == "delete"){
        // delete
        //note.remove();
        notes.splice(note.dataset.index, 1);
        save();
    }
    if(state == "strike"){
        if(note.dataset.strike == "false"){
            note.classList.add("strike");
            note.dataset.strike = "true";
        } else {
            note.classList.remove("strike");
            note.dataset.strike = "false";
        }
        note.style.setProperty("left", 0)
    }
    if(state == "edit"){
        note.style.setProperty("left", 0)
        //edit
        if(note.dataset.moved == "false"){
            edit(note);
        }
    }
    note.style.setProperty("background", "var(--noteCol)");
    note.removeEventListener("mousemove", mousemove);
    note.removeEventListener("mouseup", mouseup);
};
// Touch Event Listeners
function touchstart(event){
    let note = event.target;
    note.dataset.start = event.touches[0].pageX;
    note.dataset.moved = "false";
    note.addEventListener("touchmove", touchmove);
    note.addEventListener("touchend", touchend);
    
    note.classList.remove("strike");
    note.dataset.strike = "false";
    note.dataset.state = "edit";
};
function touchmove(event){
    let note = event.target;
    note.dataset.moved = "true";
    let start = note.dataset.start;
    let current = event.touches[0].pageX;
    let difference = current - start;
    let width = note.offsetWidth;
    note.style.setProperty("left",current-start + "px");
    if(difference < -(width/3)){
        note.style.setProperty("background", "rgb(247, 210, 205)");
        note.dataset.state = "delete"
    } else if(difference > (width/4)){
        note.style.setProperty("background", "rgb(194, 230, 247)");
        note.dataset.state = "strike"
    } else {
        note.style.setProperty("background", "#ffe6b7");
        note.dataset.state = "edit"
    }
};
function touchend(event){
    let note = event.target;
    let state = note.dataset.state;
    if(state == "delete"){
        // delete
        //note.remove();
        notes.splice(note.dataset.index, 1);
        save();
    }
    if(state == "strike"){
        if(note.dataset.strike == "false"){
            note.classList.add("strike");
            note.dataset.strike = "true";
        } else {
            note.classList.remove("strike");
            note.dataset.strike = "false";
        }
        note.style.setProperty("left", 0)
    }
    if(state == "edit"){
        note.style.setProperty("left", 0)
        //edit
        if(note.dataset.moved == "false"){
            edit(note);
        }
    }
    note.style.setProperty("background", "var(--noteCol)");
    note.removeEventListener("touchmove", touchmove);
    note.removeEventListener("touchend", touchend);
};

// Save and Load functions
function save(){
    localStorage.setItem("notes", notes.join("|||"));
    reload();
}
function load(){
    let array = localStorage.getItem("notes");
    if(array.length != 0){
        notes = array.split("|||");
    }
    reload();
}
function reload(){
    main.innerHTML = "";
    main.appendChild(input);
    main.appendChild(addbtn);
    index = 0;
    notes.forEach(createNote);
}
window.addEventListener("load", load);