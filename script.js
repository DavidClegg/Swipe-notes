/**
 *      Goals
 * [x] Notes on Screen
 * [x] Move notes with mouse/touch
 * [ ] Add notes
 * [ ] Indent, Edit, Delete features
 * [ ] Save and Load
 */

class Note{
    constructor(id){
        id = this.id;
        text = "";
        state = "";
    }
}

// TEST CODE
/*
 * PRINT hello world TO SHOW SCRIPT IS WORKING
 * 
 * COPY NOTE STATE TO NOTE TEXT TO SHOW NOTE STATE IS GETTABLE
 */
function test(){
    let date = new Date();
    console.log(`${date.getFullYear()} ${date.getMonth()+1} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | Hello World!`)
    
    let notes = document.querySelectorAll(".note");
    for (let index = 0; index < notes.length; index++) {
        const note = notes[index];
        console.log({index: index, note:note, notes:notes, text: note.dataset.state})
        let target = note.firstElementChild;
        console.log(target.innerText)
        target.innerText = note.dataset.state;
    }
}

// MOVE NOTES
let maxWidth = document.querySelector(".main").clientWidth;
let currentPosition = 0;
let notes = document.querySelectorAll(".note");
[...notes].forEach( note =>{
    // mousedown / touchstart
    // mousemove / touchmove
    // mouseup / touchend?
    note.addEventListener("mousedown", addMouseListener);
});

function addMouseListener(e){
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
    console.log("Mouse Down")
    console.log(e);
    e.target.style.setProperty("background", `#ddd`)
    currentPosition = e.clientX;
    e.target.addEventListener("mousemove", mousemove);
    e.target.addEventListener("mouseup", mouseup);
}

function mousemove(e){
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
    console.log("Mouse Move");
    let x = (currentPosition - e.clientX)*-1;
    e.target.style.setProperty("left", x+"px");
    //e.target.innerText = e.target.offsetLeft;
    if(e.target.offsetLeft > maxWidth/4){ // move right over 25%
        e.target.style.setProperty("background", `red`)
    }
    if(e.target.offsetLeft < -(maxWidth/4)){ // move left over 25%
        e.target.style.setProperty("background", `blue`)
    }
}

function mouseup(e){
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event
    console.log("Move Up");

    if(e.target.offsetLeft > maxWidth/4){ // move right over 25%
        e.target.style.setProperty("left", maxWidth/4+"px")
        // set state right
    } else if(e.target.offsetLeft < -(maxWidth/4)){ // move left over 25%
        e.target.style.setProperty("left", "0px")//-(maxWidth/4)+"px")
        // set state left
        e.target.style.setProperty("text-decoration","line-through")
    } else {
        e.target.style.setProperty("left", "0px")
    }

    e.target.removeEventListener("mousemove", mousemove);
    e.target.removeEventListener("mouseup", mouseup);
}

//ADD NOTES

/**
 * Click add :: I need an onclick and a function
 * > hide add :: I need style toggle
 * > show input :: Again style toggle
 * On enter or submit :: obivous Key press event listener, but also might need a button
 * > add note to notes :: .push, but I'm missing steps
 * > update html elements :: I could just update all notes, or I could be a bit smarter
 * > hide input :: toggle
 * > show add :: toggle
 */

const addbutton = document.querySelector(".addnote");
const inputnote = document.querySelector(".inputnote");
const inputbox = document.querySelector(".inputnote input");

function addClick(){
    toggleStyles();
    inputbox.focus();
    inputnote.addEventListener("keydown", enterListener);
}
function toggleStyles(){
    addbutton.classList.toggle("hide");
    inputnote.classList.toggle("hide");
}
function submitNote(){
    addNoteToNotes();
    updateHTML(inputbox.value);
    inputnote.removeEventListener("keydown", enterListener)
    inputbox.value = "";
    toggleStyles();
}

function addNoteToNotes(){
    // This is a function to add the note to the notes array.
}

function updateHTML(text){
    let note = document.createElement("div");
    note.classList.add("note");
    note.dataset.state = "New Note";
    note.innerText = text;
    document.querySelector(".main").appendChild(note);
    note.addEventListener("mousedown", addMouseListener);
}

function enterListener(e){
    if(e.key == "Enter"){
        console.log(e)
        console.log("ADD")
        submitNote();
    }
}