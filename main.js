//How to know what mode is active
let darkMode= false;

let buttonMode = document.querySelector('nav>img')

buttonMode.addEventListener('click',function(){
    if(darkMode ===false){
        darkMode = true;
        buttonMode.src ="./images/icon-sun.svg"
        document.querySelector('.day-list').className = 'night-list';
        document.querySelector('.day-text-input').className = 'night-text-input';
        
    }else if(darkMode === true){
        darkMode = false;
        buttonMode.src ="./images/icon-moon.svg"
        document.querySelector('.night-list').className = 'day-list';
        document.querySelector('.night-text-input').className = 'day-text-input';
    }
})
function lightOrDark(){
    if(darkMode === false){
        return 'day'
    }
    return 'night'
}
let todo = document.querySelector('.day-list'); 
let input = document.getElementById('todo');
let numOfTask = 0;

input.addEventListener('keypress',function(e){
    if(e.key === 'Enter'){
        numOfTask++;
        let task = input.value;
        let content = document.createElement('div')
        //Same as the next line
        content.className = 'task'
        /*let sep = document.createElement('div')
        //Hay que poner un condicional para saber si es el primer task o no para poder poner un separador al principio por orden
        sep.className = lightOrDark() +'-separador'*/
        let checkbox = document.createElement('div')
        checkbox.className = 'checkbox'
        let item = document.createElement('p');
        item.textContent = task;
        input.value = '';
        content.appendChild(checkbox);
        content.appendChild(item);
        todo.appendChild(content);
        //todo.appendChild(sep);
    }
})
let verificar = new Promise((resolve,reject) => {
    resolve()

})
let stateOfCheckbox = document.getElementsByClassName('checkbox')[0]
stateOfCheckbox.addEventListener('click',function(){
    let done = false;
    if(done === false){
        stateOfCheckbox.style.background= 'aqua';
        stateOfCheckbox.style.border= 'none';
        done = true;
    }else if(done === true){
        stateOfCheckbox.style.background= 'none';
        stateOfCheckbox.style.border= '1.5px solid rgb(192,88,243)';
        done = false;
    }
})
