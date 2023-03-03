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
let multiple = maxWidth/9; 
// The edit and delete functions are revealed at some division of the max width
// default is 4. this means that they appear when a note is moved 25% across the screen
let currentPosition = 0;
let notes = document.querySelectorAll(".note");
[...notes].forEach( note =>{
    // mousedown / touchstart
    // mousemove / touchmove
    // mouseup / touchend?
    note.addEventListener("mousedown", addMouseListener);
    note.addEventListener("click", e=>{
        e.target.classList.toggle("crossoff")
    })
});

function addMouseListener(e){
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
    console.log("Mouse Down")
    console.log(e);
    //e.target.style.setProperty("background", `#ddd`)
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
    if(e.target.offsetLeft > multiple){ // move right over 25%
        e.target.style.setProperty("background", `cyan`) 
        //e.target.classList.toggle("editing") // should be pale
    }
    if(e.target.offsetLeft < -(multiple)){ // move left over 25%
        e.target.style.setProperty("background", `brown`) // should be pale
        //e.target.classList.toggle("deleting")
    }
}

function mouseup(e){
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event
    console.log("Move Up");
    console.log(e.target.offsetLeft)
    if(e.target.offsetLeft > multiple){ // move right over 25%
        e.target.style.setProperty("left", multiple+"px")
        // set state right
        e.target.dataset.state = "Right"
    } else if(e.target.offsetLeft < -(multiple)){ // move left over 25%
        e.target.style.setProperty("left", -(multiple)+"px")
        // set state left
        e.target.dataset.state = "Left"
    } else if (e.target.offsetLeft < Math.abs(10) && e.target.dataset.state == "Center") {
        // trigger this based on state
        e.target.classList.toggle("crossoff")
        e.target.style.setProperty("left", "0px")
    } else {
        e.target.style.setProperty("left", "0px")
        // set state center
        e.target.dataset.state = "Center"
        //e.target.classList.toggle("crossoff");
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
    if(text == ""){
        text = "New Note";
    };
    let container = document.createElement("div");
    container.classList.add("container");
    // note element
    let note = document.createElement("div");
    note.classList.add("note");
    note.dataset.state = "Center";
    note.innerText = text;
    container.appendChild(note);
    // buttons
    let buttons = document.createElement("div");
    buttons.classList.add("subitem");
    buttons.classList.add("before");
    // edit 
    let edit = document.createElement("div");
    edit.classList.add("edit");
    //edit.attributes.onclick = "badedit(this)";
    edit.addEventListener("click", badedit);
    edit.innerText = "Edit"
    buttons.appendChild(edit);
    // delete elemenet : delele
    let delele = document.createElement("div"); 
    delele.classList.add("del");
    //delele.attributes.onclick = "baddelete(this)";
    delele.addEventListener("click", baddelete);
    delele.innerText = "Delete"
    buttons.appendChild(delele);
    container.appendChild(buttons);
    document.querySelector(".main").appendChild(container);
    note.addEventListener("mousedown", addMouseListener);
    addTouchEvent(note)
    //note.addEventListener("click", e=>{
    //    e.target.classList.toggle("crossoff")
    //})
}

function enterListener(e){
    if(e.key == "Enter"){
        console.log(e)
        console.log("ADD")
        submitNote();
    }
}

function loadNotes(){
    let notes = localStorage.getItem("notes");
    notes = notes.split(",");
    notes.forEach(note => {updateHTML(note)});
}

function saveNotes(notesArray){
    let notes = notesArray.join(",");
    localStorage.setItem("notes", notes);
}

function naiveReloader(){
    // This is a pretty petty way to manage the syncing of the visual notes and the notes array in memory
    /// Basically I just delete the entire visual list and then regenerate it
    /// This seems like a bad solution because 
    let notes = [
        "You can click notes to mark them off",
        "You can swipe a note to the right to reveal the Edit button",
        "Or swipe right to Delete",
        "And you can add your own notes with the green button below"
    ];

    for (let index = 0; index < notes.length; index++) {
        const text = notes[index];
        updateHTML(text)
    }
}

function badedit(ele){
    // !!! This is a temporary script to test a bad idea for editing
    let parent = ele.target.parentElement.parentElement;
    let target = parent.children[0];
    let inputNode = document.createElement("input");
    inputNode.value = target.innerText;
    inputNode.classList.add("input");
    inputNode.classList.add("note");
    inputNode.classList.add("inputBackground");
    target.before(inputNode);
    inputNode.focus();
    inputNode.addEventListener("keydown", badenterlistener)
    target.remove();
}

function badenterlistener(e){
    // This is basically my enter listener, but update for my badedit input
    if(e.key == "Enter"){
        console.log(e)
        console.log("ADD")
        let inputNode = e.target;
        let parent = inputNode.parentElement;
        let target = document.createElement("div");
        target.classList.add("note");
        target.dataset.state = "Newly Edited";
        target.innerText = inputNode.value;
        inputNode.before(target);
        inputNode.remove();
        target.addEventListener("mousedown", addMouseListener);
    }
}

function baddelete(ele){
    let parent = ele.target.parentElement.parentElement;
    parent.remove();
}

naiveReloader()

// touch events
function addTouchEvent(element){
        console.log("Added Touch Events")
    element.addEventListener("touchstart", touchstartfunction);
}

function touchstartfunction(e){
    e.preventDefault()
    console.log("Touch Start");
    console.log(e);
    const start = e.touches[0].pageX;
    e.target.addEventListener("touchmove", (event)=>{
        event.preventDefault()
        console.log("Touch Move");
        console.log(event);
        let x = event.changedTouches[0].pageX - start;
        event.target.style.setProperty("left", x+"px");
        
        if(e.target.offsetLeft > multiple){ // move right over 25%
            console.log("move right")
            e.target.style.setProperty("background", "#00f")
        } else if(e.target.offsetLeft < -(multiple)){ // move left over 25%
            console.log("move left")
            e.target.style.setProperty("background", "#f00")
        } else {
            console.log("move center")
            e.target.style.setProperty("background", "#0f0")
        }
        
    });
    e.target.addEventListener("touchend", (event) => {
        event.preventDefault()
        console.log(event);
        let difference = event.changedTouches[0].pageX - start;
        console.log(difference);
        if(difference > multiple){ // move right over 25%
            console.log("stick right")
            e.target.style.setProperty("left", multiple+"px")
            // set state right
            e.target.dataset.state = "Right"
        } else if(difference < -(multiple)){ // move left over 25%
            console.log("stick left")
            e.target.style.setProperty("left", -(multiple)+"px")
            // set state left
            e.target.dataset.state = "Left"
        } else if (difference < Math.abs(10) && e.target.dataset.state == "Center") {
            console.log("no move")
            // trigger this based on state
            e.target.classList.toggle("crossoff");
            e.target.style.setProperty("left", "0px")
        } else {
            console.log("stick center")
            e.target.style.setProperty("left", "0px")
            // set state center
            e.target.dataset.state = "Center"
        }

    });

}
/*
// This is my previous listener from an older project
box.addEventListener("touchstart", e=>{
    // Starting X value
    var initX = e.touches[0].pageX;
    var endX = initX;

    e.target.addEventListener("touchmove", e=>{
        // This is the constant moving div effect
        var i;
        var x;
        for(i in e.changedTouches)
        {
            x = e.changedTouches[i].pageX;
            if(i%3==0)
            {
            endX = x;
            e.target.style.setProperty("left", `${x-initX}px`)
            let cx = e.target.offsetLeft;
            let cw = {p:e.target.offsetWidth*0.3, n:-(e.target.offsetWidth*0.3)};
            if(cx > cw.p){"right"} 
            else if( cx < cw.n){"left"}
            else {"center"}
            }
        }
    });

    e.target.addEventListener("touchend", e=>{
        // And this is for the logic once the touch has ended
        let thisBox = e.target;
        let offset = thisBox.offsetLeft;
        let boxWidth = thisBox.offsetWidth;
        if(initX == endX)
        {
            // not moved
        }
        if(offset > boxWidth*0.3 || offset < -(boxWidth*0.3))
        {
            thisBox.remove();
        } else {
            thisBox.style.left = 0;
        }
    });
})*/