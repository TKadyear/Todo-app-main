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

const saveLocalStorage = () => localStorage.setItem('task',JSON.stringify(cacheTask))

//Functions for LocalStorage


//Dynamic number for items left
function itemsLeft(){
    let undoneTask = document.querySelectorAll('.task').length;
    let changeStatusTask = document.querySelectorAll('.task-done').length;
    let itemsLeft = undoneTask - changeStatusTask;
    document.querySelector('#itemsLeft').innerHTML= `${itemsLeft} items left`;
}

//Function for create new tasks
let todo = document.querySelector('.list'); 
let input = document.getElementById('todo');

function newTask(data){
    let i = Math.round(Math.random() * 200)
    let content = document.createElement('div');
    content.className = 'task';
    content.id = 'task-' + i;
    content.draggable = true;
    dragAndDrop(content)
    let checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    checkbox.addEventListener('click', btnCheckbox)

    let item = document.createElement('p');
    item.textContent = data;

    let iconEdit = document.createElement('img');
    iconEdit.className= 'edit';
    iconEdit.src = "./images/icon-edit.svg";
    iconEdit.addEventListener('click', btnEditTask)

    let iconCross = document.createElement('img');
    iconCross.className = 'delete'
    iconCross.src = "./images/icon-cross.svg";
    iconCross.addEventListener('click',btnDelete); 

    content.appendChild(checkbox);
    content.appendChild(item);
    content.appendChild(iconEdit)
    content.appendChild(iconCross)
    todo.insertBefore(content,todo.firstElementChild);
    
    itemsLeft()
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
        indexingCache()
        saveLocalStorage()
        input.value = '';   
    }
     
})
function btnDelete(){
    this.parentNode.parentNode.removeChild(this.parentNode)
    itemsLeft()
}
function btnEditTask(event){
    event.stopPropagation()
    event.preventDefault()
    let p = this.previousElementSibling
    p.classList.add('hidden')
    //The way of create the input to change the task
    let input = document.createElement(`input`)
    input.type = 'text'
    input.value = p.innerHTML;
    input.autofocus = true;
    this.parentNode.insertBefore(input,this);
    
    input.addEventListener('keypress',function(e){
        if(e.key === 'Enter' && input.value != ''){
            p.innerHTML = input.value
            p.classList.remove('hidden')
            //After you press enter and insert the edit, the input will be remove
            this.parentNode.removeChild(input); 
        }else if(e.key === 'Enter' && input.value === ''){
            btnDelete()
        }
    })
}  
//Navigation for All task, active and completed
let pages = document.querySelectorAll('.pages p')
pages.forEach(page => page.addEventListener('click', visibleTask))
let stateAll = true;
function visibleTask(){
    let btnKey = this.innerText
    pages.forEach(p => p.classList.remove('active'))
    this.classList.add('active')
    switch (btnKey) {
        case "All":
            stateAll = true;
            hideDoneTask()
            break;
        case "Active":
            stateAll = !stateAll
            hideDoneTask()
            break;
        case "Completed":
            stateAll = !stateAll
            hideDoneTask()
            console.log(btnKey)
            break;
        default:
            console.error('Not working..')
            break;
    }
}
function hideDoneTask(){
    let okTask= document.querySelectorAll('.task-done')
    stateAll 
        ? okTask.forEach(task => task.classList.remove('hidden')) 
        : okTask.forEach(task => task.classList.add('hidden'))
}

//Checkbox
function btnCheckbox(){
    this.parentNode.classList.toggle('task-done'); 
    let nameOfTask = this.parentNode.textContent
    //changeStatusTask(nameOfTask)
    itemsLeft();
    hideDoneTask();
}
//Button for Clear completed task
let clearCompleted = document.getElementById('clear')
clearCompleted.addEventListener('click',function(){
    let taskCompleted = document.querySelectorAll('.task-done')
    taskCompleted.forEach(tDone => tDone.parentNode.removeChild(tDone))
})
//Drag and drop
function dragAndDrop(task){
    task.addEventListener('dragstart',dragStart)
    task.addEventListener('dragenter',dragEnter)
    task.addEventListener('dragover',dragOver)
    task.addEventListener('dragleave',dragLeave)
    task.addEventListener('drop',drop)
}
function dragStart(e){
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.id);
}

function dragEnter(e){
    e.preventDefault();
    e.stopPropagation()
    
   e.currentTarget.classList.add('drag-over');
}
function dragOver(e){
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}
function dragLeave(e){
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}
function drop(e){
    e.currentTarget.classList.remove('drag-over');
    //get the draggable element
    const ID = e.dataTransfer.getData('text/html');
    const DRAGGABLE = document.getElementById(ID);
    
    //add to the drop currentTarget but only insert the "task" before current target
    e.currentTarget.parentNode.insertBefore(DRAGGABLE,this);
}
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
        cacheTask = uploadTask
        
    }
})