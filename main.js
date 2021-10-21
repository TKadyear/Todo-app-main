//Toggle for dark mode
let buttonMode = document.querySelector('nav>img')
let darkMode = false;
buttonMode.addEventListener('click',function(){
    document.body.classList.toggle('dark-mode')
    darkMode = !darkMode
    darkMode
        ? buttonMode.src ="./images/icon-sun.svg"
        : buttonMode.src ="./images/icon-moon.svg"
})
//Local Storage for the tasks if you want reload the website
let cacheTask = new Array()
//Dynamic number for items left
function itemsLeft(){
    let undoneTask = document.querySelectorAll('.task').length;
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

    let iconEdit = document.createElement('img');
    iconEdit.className= 'edit';
    iconEdit.src = "./images/icon-edit.svg";
    let iconCross = document.createElement('img');
    iconCross.className = 'delete'
    iconCross.src = "./images/icon-cross.svg";

    content.appendChild(checkbox);
    content.appendChild(item);
    content.appendChild(iconEdit)
    content.appendChild(iconCross)
    todo.insertBefore(content,todo.firstElementChild);
}
//The input which add new task to the list 
input.addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        let task = input.value;
        newTask(task);
        let cache = {
            value: task,
            done: false
        }
        cacheTask.push(cache)
        input.value = '';   
    }
    itemsLeft()
})
//Edit button
let editButton =document.querySelectorAll('img.edit');
let deleteButton =document.querySelectorAll('img.delete');
editButton.forEach(edit=>{
    edit.addEventListener('click',function(){
        let taskToEdit = edit.previousElementSibling
        let textToEdit = taskToEdit.innerHTML
        //The way of create the input to change the task
        let input = document.createElement(`input`)
        input.type = 'text'
        input.value = textToEdit
        input.autofocus = true;
        edit.parentNode.insertBefore(input,edit);
        input.addEventListener('keypress',function(e){
            e.preventDefault()
            if(e.key === 'Enter'){
                let task = input.value;
                let item = document.createElement('p');
                item.textContent = task;
                edit.parentNode.insertBefore(item,edit);
                //After you press enter and insert the edit, the input will be remove
                edit.parentNode.removeChild(input); 
            }
            
        }) 
        taskToEdit.parentNode.removeChild(taskToEdit)
        
    })
})
//Delete Button
deleteButton.forEach(supr =>{
    supr.addEventListener('click',function(){
        supr.parentNode.parentNode.removeChild(supr.parentNode)
        itemsLeft()
    })  
})

//Navigation for All task, active and completed
let active = document.querySelector('.pages>p:nth-child(2)')
let stateAll = true;
active.addEventListener('click',function(){
    stateAll = !stateAll
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
