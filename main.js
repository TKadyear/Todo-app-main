//Toggle for dark mode
let buttonMode = document.querySelector('nav>img')

buttonMode.addEventListener('click',function(){
    document.body.classList.toggle('dark-mode')
    buttonMode.src ="./images/icon-sun.svg"
   
    
    /*
    document.querySelector('.list').classList.toggle('dark-list');
    document.querySelector('.text-input').classList.toggle('dark-text-input');
    //Revisar classlist
    document.getElementsByClassName('.separador').classList.toggle('dark-separador');
    document.getElementsByTagName('p').classList.toggle('dark-p')*/
        
    
})
//Dynamic number for items left
function itemsLeft(){
    let itemsLeft = document.querySelectorAll('.checkbox').length - document.querySelectorAll('.ok-checkbox').length;
    document.querySelector('#itemsLeft').innerHTML= `${itemsLeft} items left`;
}
itemsLeft()

let todo = document.querySelector('.list'); 
let input = document.getElementById('todo');

input.addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        let task = input.value;
        //Hay que sacar esta parte para funcion
        let content = document.createElement('div')
        content.className = 'task'
        let sep = document.createElement('div')
        //Hay que poner un condicional para saber si es el primer task o no para poder poner un separador al principio por orden
        sep.className = 'separador'
        let checkbox = document.createElement('div')
        checkbox.className = 'checkbox'
        let item = document.createElement('p');
        item.textContent = task;
        input.value = '';
        content.appendChild(checkbox);
        content.appendChild(item);
        todo.insertBefore(sep,todo.firstElementChild);
        todo.insertBefore(content,todo.firstElementChild);  
    }
    itemsLeft()
})
//Checkbox
let checkbox = document.querySelectorAll('.checkbox')
checkbox.forEach(box =>{
    box.addEventListener('click',function(e){
        box.classList.toggle('ok-checkbox')
        itemsLeft()
    })
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