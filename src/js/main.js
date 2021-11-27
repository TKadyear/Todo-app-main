//Add two variables with the values "task" and "-done" because it's a very repetitive
//also prevent the errors if I need to change the name of the class
const TASK = "task";
const TASKDONE = "-done";
//Toggle for dark mode
let themeButton = document.querySelector("nav>img");
let darkMode = false;
themeButton.addEventListener("click", theme);
function theme() {
  document.body.classList.toggle("dark-mode");
  darkMode = !darkMode;
  localStorage.setItem("darkMode", `${darkMode}`);
  darkMode
    ? (themeButton.src = "./images/icon-sun.svg")
    : (themeButton.src = "./images/icon-moon.svg");
}
//Variables for LocalStorage
let cacheTask = new Array();
class ObjTask {
  constructor(value, done = false) {
    this.value = value;
    this.done = done;
  }
}
//Functions for LocalStorage
const saveChangeForLS = () => {
  let allTask = document.querySelectorAll(".task");
  cacheTask = [];
  for (let i = allTask.length - 1; i >= 0; i--) {
    let valueOfTask = allTask[i].textContent;
    let statusOfTask = allTask[i].className.includes("done");
    cacheTask.push(new ObjTask(valueOfTask, statusOfTask));
  }
  saveLocalStorage();
};
const saveLocalStorage = () =>
  localStorage.setItem("task", JSON.stringify(cacheTask));

//Dynamic number for items left
function itemsLeft() {
  let undoneTask = document.querySelectorAll(".task").length;
  let changeStatusTask = document.querySelectorAll(".task-done").length;
  let itemsLeft = undoneTask - changeStatusTask;
  document.querySelector("#itemsLeft").innerHTML = `${itemsLeft} items left`;
}

//Function for create new tasks
let todo = document.querySelector(".list");
let input = document.getElementById("todo");
let randomNumber = (n = 0) => Math.floor(Math.random() * 500 + n);

function newTask(data, done = false, i = randomNumber(cacheTask.length)) {
  let content = document.createElement("div");
  content.className = "task";
  if (done === true) content.classList.add("task-done");
  content.id = "task-" + i;
  content.draggable = true;
  dragAndDrop(content);
  let checkbox = document.createElement("div");
  checkbox.className = "checkbox";
  checkbox.addEventListener("click", btnCheckbox);

  let item = document.createElement("p");
  item.textContent = data;

  let iconEdit = document.createElement("img");
  iconEdit.className = "edit";
  iconEdit.src = "./images/icon-edit.svg";
  iconEdit.addEventListener("click", btnEditTask);

  let iconCross = document.createElement("img");
  iconCross.className = "delete";
  iconCross.src = "./images/icon-cross.svg";
  iconCross.addEventListener("click", btnDelete);

  content.appendChild(checkbox);
  content.appendChild(item);
  content.appendChild(iconEdit);
  content.appendChild(iconCross);
  todo.insertBefore(content, todo.firstElementChild);

  itemsLeft();
}
//The input which add new task to the list
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    let task = input.value;
    newTask(task);
    cacheTask.push(new ObjTask(task));
    saveLocalStorage();
    input.value = "";
  }
});
function btnDelete() {
  this.parentNode.parentNode.removeChild(this.parentNode);
  itemsLeft();
  saveChangeForLS();
}
// IMPROVE Only show one time the edit input, and also make a focus required.
function btnEditTask(event) {
  event.stopPropagation();
  event.preventDefault();
  let p = this.previousElementSibling;
  p.classList.add("hidden");
  //The way of create the input to change the task
  let input = document.createElement(`input`);
  input.type = "text";
  input.value = p.innerHTML;
  input.autofocus = true;
  this.parentNode.classList.remove("task-done");
  // BUG If the checkbox was marked. While You're editing the task, the check shows empty.
  this.parentNode.insertBefore(input, this);

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && input.value != "") {
      p.innerHTML = input.value;
      p.classList.remove("hidden");
      //After you press enter and insert the edit, the input will be remove
      this.parentNode.removeChild(input);
      this.parentNode.classList.add("task-done");
      editing = false;
    } else if (e.key === "Enter" && input.value === " ") {
      // BUG If the input is empty, delete it.
      btnDelete();
    }
    saveChangeForLS();
  });
}
//Navigation for All task, active and completed
let pages = document.querySelectorAll(".pages p");
pages.forEach((page) => page.addEventListener("click", visibleTask));
// TODO While page "active" is selected,if a task is done.Make a refresh for the page.

function visibleTask() {
  let btnKey = this.innerText;
  pages.forEach((p) => p.classList.remove("active"));
  this.classList.add("active");
  let okTask = document.querySelectorAll(".task-done");
  let allUndoneTask = document.querySelectorAll(".task");
  switch (btnKey) {
    case pages[0].textContent: //All
      okTask.forEach((t) => t.classList.remove("hidden"));
      allUndoneTask.forEach((t) => t.classList.remove("hidden"));
      break;
    case pages[1].textContent: //Active
      allUndoneTask.forEach((t) => t.classList.remove("hidden"));
      okTask.forEach((t) => t.classList.add("hidden"));
      break;
    case pages[2].textContent: //Completed
      okTask.forEach((t) => t.classList.remove("hidden"));
      allUndoneTask.forEach((t) => {
        if (t.className.includes("done") === false) t.classList.add("hidden");
      });
      break;
    default:
      console.error("Not working..");
      break;
  }
}

//Checkbox
function btnCheckbox() {
  this.parentNode.classList.toggle("task-done");
  saveChangeForLS();
  itemsLeft();
}
//Button for Clear completed task
let clearCompleted = document.getElementById("clear");
clearCompleted.addEventListener("click", function () {
  let taskCompleted = document.querySelectorAll(".task-done");
  taskCompleted.forEach((tDone) => tDone.parentNode.removeChild(tDone));
  saveChangeForLS();
});
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
  const DRAGGABLE = document.getElementById(ID);
  //add to the drop currentTarget but only insert the "task" before current target
  e.currentTarget.parentNode.insertBefore(DRAGGABLE, this);

  saveChangeForLS();
}
//Local Storage
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("darkMode") === null) {
    localStorage.setItem("darkMode", "false");
  }
  if (localStorage.getItem("darkMode") === "true") {
    theme();
  }
  if (localStorage.getItem("task") != null) {
    let uploadTask = JSON.parse(localStorage.getItem("task"));
    cacheTask = uploadTask;
    for (let i = 0; i < uploadTask.length; i++) {
      let task = uploadTask[i].value;
      let taskDone = uploadTask[i].done;
      newTask(task, taskDone, i);
    }
  } else if (localStorage.getItem("task") === null) {
    alert("This app have a localStorage,create some task and test it.");
  }
});
