let editing = false;
//Toggle for dark mode
const darkModeBtn = document.querySelector("#btn-dark-mode");
darkModeBtn.addEventListener("click", activeDarkMode);

function activeDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkModeActive = document.body.classList.contains("dark-mode")
  localStorage.setItem("darkMode", `${isDarkModeActive}`);
}
//Variables for LocalStorage
let cacheTask = [];
class ObjTask {
  constructor(value, done = false) {
    this.value = value;
    this.done = done;
  }
}
//Functions for LocalStorage
const saveOrder = () => {
  let allTask = document.querySelectorAll(".task");
  cacheTask = [];
  allTask.forEach(task => {
    const nameTask = task.textContent
    const isDone = task.className.includes("done")
    cacheTask.push(new ObjTask(nameTask, isDone))
  })
  saveLocalStorage();
};
const saveLocalStorage = () => localStorage.setItem("task", JSON.stringify(cacheTask));

//Dynamic number for items left
function itemsLeft() {
  if (document.querySelector("#itemsLeft")) {
    const doneTask = cacheTask.filter((task) => task.done === true)
    const itemsLeft = cacheTask.length - doneTask.length;
    document.querySelector("#itemsLeft").innerHTML = `${itemsLeft} items left`;
  }
}

//Function for create new tasks
let todo = document.querySelector(".list");
let randomNumber = (n = 0) => Math.floor(Math.random() * 500 + n);

function newTask(data, done = false, i = randomNumber(cacheTask.length)) {
  let content = document.createElement("li");
  content.className = "task";
  if (done === true) content.classList.add("task-done");
  content.id = "task-" + i;
  content.draggable = true;
  dragAndDrop(content);
  let checkbox = document.createElement("div");
  checkbox.className = "checkbox";
  checkbox.addEventListener("click", () => {
    content.classList.toggle("task-done");
    const index = cacheTask.findIndex(task => task.value === data)
    cacheTask[index].done = !cacheTask[index].done
    const pageActive = document.querySelector(".active").textContent
    if (pageActive != "All") {
      statusPages()
    }
    saveLocalStorage();
    itemsLeft();
  });

  let item = document.createElement("p");
  item.textContent = data;

  let iconEdit = document.createElement("img");
  iconEdit.className = "edit";
  iconEdit.src = "./images/icon-edit.svg";
  iconEdit.addEventListener("click", () => {
    if (!editing) {
      editing = true;
      item.classList.add("hidden")
      //The way of create the input to change the task
      let input = document.createElement(`input`);
      input.type = "text";
      input.value = data;
      input.autofocus = true;
      content.classList.remove("task-done");
      // BUG If the checkbox was marked. While You're editing the task, the check shows empty.
      item.insertAdjacentElement("beforebegin", input);
      /*  BUG
       ! main.js:64 Uncaught TypeError: Cannot read properties of undefined (reading 'done')
       ! at HTMLDivElement.<anonymous
       */
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          item.innerHTML = input.value;
          item.classList.remove("hidden");
          //After you press enter and insert the edit, the input will be remove
          content.removeChild(input);
          content.classList.add("task-done");
          const index = cacheTask.findIndex(task => task.value === data)
          cacheTask[index].value = input.value
        }
        editing = false;
        saveLocalStorage();
      });
    }
  })
  let iconCross = document.createElement("img");
  iconCross.className = "delete";
  iconCross.src = "./images/icon-cross.svg";
  iconCross.addEventListener("click", () => {
    content.remove();
    cacheTask = cacheTask.filter(task => task.value != data);
    saveLocalStorage();
    itemsLeft();
  });

  content.appendChild(checkbox);
  content.appendChild(item);
  content.appendChild(iconEdit);
  content.appendChild(iconCross);
  todo.insertAdjacentElement("beforeend", content)

  itemsLeft();
}
const inputForNewTask = document.getElementById("todo");
//The input which add new task to the list
inputForNewTask.addEventListener("keypress", (e) => {
  const task = inputForNewTask.value;
  if (e.key === "Enter" && task != "") {
    newTask(task);
    cacheTask.push(new ObjTask(task));
    saveLocalStorage();
    inputForNewTask.value = "";
  }
});

//Navigation for All task, active and completed
function addEventPages() {
  let pages = document.querySelectorAll(".pages p");
  pages.forEach((page) => page.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active")
    page.classList.add("active");
    statusPages();
  }));
}
// TODO While page "active" is selected,if a task is done.Make a refresh for the page.

function statusPages() {
  const page = document.querySelector(".active").textContent
  const resetList = document.querySelector('ul.list')
  resetList.innerHTML = " ";
  let listTask = [...cacheTask];
  if (page != "All") {
    const done = (page === "Completed");
    listTask = listTask.filter((task) => task.done === done)
  }
  listTask.forEach(task => newTask(task.value, task.done))
}

//Drag and drop
function dragAndDrop(task) {
  task.addEventListener("dragstart", dragStart);
  task.addEventListener("dragenter", dragEnter);
  task.addEventListener("dragover", dragOver);
  task.addEventListener("dragleave", dragLeave);
  task.addEventListener("drop", drop);
}

function dragStart(e) {
  e.stopPropagation();
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", e.currentTarget.id);
}

function dragEnter(e) {
  e.preventDefault();
  e.stopPropagation();

  e.currentTarget.classList.add("drag-over");
}
function dragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add("drag-over");
}
function dragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove("drag-over");
}
function drop(e) {
  e.currentTarget.classList.remove("drag-over");
  //get the draggable element
  const ID = e.dataTransfer.getData("text/html");
  const DRAGGABLE = document.querySelector(`#${ID}`);
  //get the drop area
  const DROP = document.querySelector(`#${e.currentTarget.id}`)
  DROP.insertAdjacentElement("afterend", DRAGGABLE)
  saveOrder();
}

function responsiveToolsBar() {
  const container = document.querySelector(".style-list");
  const templateDesktop = /*html*/
    `<div class="tools">
    <p id="itemsLeft"></p>
    <div class="pages">
      <p class="active">All</p>
      <p class>Active</p>
      <p class>Completed</p>
    </div>
    <p id="clear">Clear Completed</p>
  </div>`
  const templateMobile = /*html*/
    `<div class="style-list tools pages">
      <p class="active">All</p>
      <p class>Active</p>
      <p class>Completed</p>
    </div>`
  if (window.innerWidth > 620) {
    container.insertAdjacentHTML("beforeend", templateDesktop)
    //Button for Clear completed task
    let clearCompleted = document.getElementById("clear");
    clearCompleted.addEventListener("click", () => {
      cacheTask = cacheTask.filter(task => task.done === false)
      statusPages();
      saveLocalStorage();
    });

  } else {
    container.insertAdjacentHTML("afterend", templateMobile)
  }
  addEventPages();
}

//Local Storage
document.addEventListener("DOMContentLoaded", function () {
  responsiveToolsBar()
  if (localStorage.getItem("darkMode") === "true") {
    activeDarkMode();
  }
  if (localStorage.getItem("task") != null) {
    let uploadTask = JSON.parse(localStorage.getItem("task"));
    cacheTask = uploadTask;
  } else {
    cacheTask = [
      { value: "Complete online JavaScript course", done: true },
      { value: "Jog around the park 3x", done: false },
      { value: "Read for 1 hour", done: false },
      { value: "Pick up groceries", done: false },
      { value: "10 minutes meditation", done: false },
      { value: "Complete Todo App on Frontend Mentor", done: false }
    ]
  }
  cacheTask.forEach(task => newTask(task.value, task.done))
});
