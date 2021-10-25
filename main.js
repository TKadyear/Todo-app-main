//Toggle for dark mode
let themeButton = document.querySelector('nav>img')
let darkMode = false;
themeButton.addEventListener('click',theme)

function theme(){
    document.body.classList.toggle('dark-mode')
    darkMode = !darkMode
    localStorage.setItem('darkMode',`${darkMode}`)
    darkMode
        ? themeButton.src ="./images/icon-sun.svg"
        : themeButton.src ="./images/icon-moon.svg"
}

//Variables for LocalStorage
let cacheTask = new Array()
let indexedCache;
const indexingCache = () => indexedCache = cacheTask.reduce((acc,el) =>({
    ...acc,
    [el.value]: el
}),{})



//Dynamic number for items left
function itemsLeft(){
    let undoneTask = document.querySelectorAll('.task').length;
    let taskDone = document.querySelectorAll('.task-done').length;
    let itemsLeft = undoneTask - taskDone;
    document.querySelector('#itemsLeft').innerHTML= `${itemsLeft} items left`;
}

//Function for create new tasks
let todo = document.querySelector('.list'); 
let input = document.getElementById('todo');

function newTask(data){
    let content = document.createElement('div');
    content.className = 'task';
    content.draggable = true;
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
        localStorage.setItem('task',JSON.stringify(cacheTask))
        input.value = '';   
    }
    allPropertys()
})
function editDelButtons(){ 
    //Buttons for edit and delete
    let editButton =document.querySelectorAll('img.edit');
    let deleteButton =document.querySelectorAll('img.delete');
    //Delete Button
    deleteButton.forEach(supr =>{
        supr.addEventListener('click',function(){
            supr.parentNode.parentNode.removeChild(supr.parentNode)
            itemsLeft()
        })  
    })
    //Edit
    editButton.forEach(edit=>{
        edit.addEventListener('click',function(event){
            event.stopPropagation()
            event.preventDefault()
            let taskToEdit = edit.previousElementSibling
            let textToEdit = taskToEdit.innerHTML
            //The way of create the input to change the task
            let input = document.createElement(`input`)
            input.type = 'text'
            input.value = textToEdit;
            input.autofocus = true;
            edit.parentNode.insertBefore(input,edit);
            taskToEdit.parentNode.removeChild(taskToEdit);
        
            input.addEventListener('keypress',function(e){
                if(e.key === 'Enter'){
                    let task = input.value;
                    let item = document.createElement('p');
                    item.textContent = task;
                    edit.parentNode.insertBefore(item,edit);
                    //After you press enter and insert the edit, the input will be remove
                    edit.parentNode.removeChild(input); 
                }
            })
        })   
    })
}


//Navigation for All task, active and completed
let active = document.querySelector('.pages>p:nth-child(2)')
let stateAll = true;

active.addEventListener('click',function(){
    stateAll = !stateAll
    hideDoneTask()
    active.classList.toggle('active')
    let all = document.querySelector('.pages>p:first-child')
    all.classList.toggle('active')
})
function hideDoneTask(){
    let okTask= document.querySelectorAll('.task-done')
    stateAll 
        ? okTask.forEach(task => task.style.display = 'flex') 
        : okTask.forEach(task => task.style.display = 'none')
}

//Checkbox
//This is NOT WORKING because querySelector takes the data one time from the DOM of the html
/*function taskDone(task){
    //Technically the next line will be only available in the function of making new tasks
    //In this way we keep it the array updated
    indexingCache()
    let state = indexedCache[task].done
    let sample = indexedCache[task].done = !state
}
function checkTheCheckbox(task){
    let state = indexedCache[task].done
   
}*/
function doneCheckbox(){
    let checkbox = document.querySelectorAll('.checkbox');
    checkbox.forEach(box =>{
        box.addEventListener('click',function(){
            box.parentNode.classList.toggle('task-done'); 
            let task = box.parentNode.innerText
            taskDone(task)
            itemsLeft();
            hideDoneTask();
        })
    })
}
//Function to change state of done in the cacheTask fOR Local Storage
function cacheDoneTask(task){
    cacheDoneTask.find
    cacheTask(replace)
}


//Button for Clear completed task
let clearCompleted = document.getElementById('clear')
clearCompleted.addEventListener('click',function(){
    let taskCompleted = document.querySelectorAll('.task-done')
    taskCompleted.forEach(taskDone => taskDone.parentNode.removeChild(taskDone))
})
//Drag and drop
function dragAndDrop(){
    let taskAll =document.querySelectorAll('.task')
    taskAll.forEach(task =>{
        task.addEventListener('dragstart',dragStart)
        task.addEventListener('dragenter',dragEnter)
        task.addEventListener('dragover',dragOver)
        task.addEventListener('dragend',dragEnd)
        task.addEventListener('dragleave',dragLeave)
        task.addEventListener('drop',drop)
    })
}
let dragSrcEl;
let check;
function dragStart(e){
    e.stopPropagation()
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    //e.target.classList.add('hide');
}

function dragEnter(e){
    e.preventDefault();
    e.stopPropagation()
    //e.target.classList.add('hide');
    e.currentTarget.classList.add('drag-over');
}
function dragOver(e){
    e.preventDefault();
    e.stopPropagation();
    //e.target.classList.add('hide');
    e.currentTarget.classList.add('drag-over');
}
function dragEnd(e){
    e.preventDefault();
    e.stopPropagation();
    //e.target.classList.remove('hide');
}
function dragLeave(e){
    e.preventDefault();
    e.stopPropagation();
    //e.target.classList.remove('hide');
    e.currentTarget.classList.remove('drag-over');
}
function drop(e){
    e.preventDefault();
    e.stopPropagation();
    //e.target.classList.remove('hide');
    e.currentTarget.classList.remove('drag-over');
    if(dragSrcEl !== this){
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
      }
    return false; 
}
function allPropertys(){
    itemsLeft()
    dragAndDrop()
    editDelButtons()
    doneCheckbox()
}
allPropertys()

//Local Storage 
document.addEventListener('DOMContentLoaded',function(){
    if(localStorage.getItem('darkMode') === null){
        localStorage.setItem('darkMode','false')
    }
    if(localStorage.getItem('darkMode') === 'true'){
        theme()
    }
    if(localStorage.getItem('task') != null){
        let uploadTask= JSON.parse(localStorage.getItem('task'))
        for(let i = 0; i < uploadTask.length; i++){
            let task = uploadTask[i].value
            newTask(task)
        }
        allPropertys()
    }
})