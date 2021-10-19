//Toggle for dark mode
let buttonMode = document.querySelector('nav>img')
let darkMode = false;
buttonMode.addEventListener('click',function(){
    document.body.classList.toggle('dark-mode')
    if(darkMode === true){
        darkMode = false;
        buttonMode.src ="./images/icon-moon.svg";
    }else if(darkMode ===false){
        darkMode= true;
        buttonMode.src ="./images/icon-sun.svg";
    }   
})
//Local Storage for the tasks if you want reload the website
class valuesTask{
    constructor(value){
        this.value = value;
        this.done = false;
    }
}
let cacheTask = new Array()
//Dynamic number for items left
function itemsLeft(){
    let undoneTask = document.querySelectorAll('.checkbox').length;
    let taskDone = document.querySelectorAll('.task-done').length;
    let itemsLeft = undoneTask - taskDone;
    document.querySelector('#itemsLeft').innerHTML= `${itemsLeft} items left`;
}
itemsLeft()
//Function for create new tasks
let todo = document.querySelector('.list'); 
let input = document.getElementById('todo');

function newTask(data){
    let content = document.createElement('div');
    content.className = 'task';
    let checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    let item = document.createElement('p');
    item.textContent = data;
    content.appendChild(checkbox);
    content.appendChild(item);
    todo.insertBefore(content,todo.firstElementChild);
}
//The input which add new task to the list 
input.addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        let task = input.value;
        newTask(task);
        cacheTask.push(new valuesTask(task))
        input.value = '';   
    }
    itemsLeft()
})
//Navigation for All task, active and completed

let active = document.querySelector('.pages>p:nth-child(2)')
let stateAll = true;
active.addEventListener('click',function(){
    stateAll
        ? stateAll= false  
        : stateAll = true
    hideDoneTask()
    active.classList.toggle('active')
})
function hideDoneTask(){
    let okTask= document.querySelectorAll('.task-done')
    stateAll 
        ? okTask.forEach(task => task.style.display = 'flex') 
        : okTask.forEach(task => task.style.display = 'none')
}

//Checkbox
//This is NOT WORKING because querySelector takes the data one time from the DOM of the html
let checkbox = document.querySelectorAll('.checkbox');
checkbox.forEach(box =>{
    box.addEventListener('click',function(){
        box.parentNode.classList.toggle('task-done');
        itemsLeft();
        hideDoneTask();
    })
})

//Button for Clear completed task
let clearCompleted = document.getElementById('clear')
clearCompleted.addEventListener('click',function(){
    let taskCompleted = document.querySelectorAll('.task-done')
    taskCompleted.forEach(taskDone => taskDone.parentNode.removeChild(taskDone))
})
//Drag and drop
//https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
let allTask = document.querySelectorAll('.task>p')
allTask.forEach(task =>{
    task.addEventListener('dragenter', dragEnter)
    task.addEventListener('dragover', dragOver);
    task.addEventListener('dragleave', dragLeave);
    task.addEventListener('drop', drop);
})
function dragEnter(e) {

    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');
    
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // add it to the drop target
    e.target.appendChild(draggable);

    // display the draggable element
    draggable.classList.remove('hide');
}