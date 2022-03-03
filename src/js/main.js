import { dragStart, dragEnter, dragOver, dragLeave, drop } from "./drag-and-drop.js"
//Toggle for dark mode
const darkModeBtn = document.querySelector("#btn-dark-mode");
darkModeBtn.addEventListener("click", activeDarkMode);

function activeDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkModeActive = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", `${isDarkModeActive}`);
}

//Variables for LocalStorage
let listTask = []; //Se tiene que ver como tratarlo para poder modificar el valor según se trabaja en ello.
class ObjTask {
  constructor(value, done = false) {
    this.value = value;
    this.done = done;
  }
}
const saveOrder = () => {
  const allTask = document.querySelectorAll("input[type=checkbox]");
  listTask = [];
  allTask.forEach((task, index) => {
    if (index != 0) {
      const nameTask = task.value;
      const isDone = task.checked;
      listTask.push(new ObjTask(nameTask, isDone));
    }
  })
  saveLocalStorage();
};
const saveLocalStorage = () => localStorage.setItem("task", JSON.stringify(listTask));

//Dynamic number for items left
function itemsLeft() {
  const doneTask = listTask.filter(task => task.done)
  const itemsLeft = listTask.length - doneTask.length;
  document.querySelector("#itemsLeft").innerHTML = `${itemsLeft} items left`;
}
//Function for create new tasks
let randomNumber = (n = 0) => Math.floor(Math.random() * 500 + n);

function newTask(data, done = false, i = randomNumber(listTask.length)) {
  const todo = document.querySelector(".list");
  const template = /* html */`
  <li class="task" id=${"task-" + i} draggable="true" tabindex="0">
  <input type="checkbox" value="${data}">
  <label for="${data}">${data}</label>
    <button class="edit"><img src="./images/icon-edit.svg" alt="Button for edit the task"></button>
    <button class="delete"><img  src="./images/icon-cross.svg" alt="Button for remove the task"></button>
  </li>
  `
  const range = document.createRange();
  const DocumentTemplate = range.createContextualFragment(template);
  const checkbox = DocumentTemplate.querySelector("input[type=checkbox]");
  checkbox.checked = done;
  const label = DocumentTemplate.querySelector("li >label");
  done ? label.classList.add("task-done") : label.classList.remove("task-done");

  addEventListenerForEachTask(DocumentTemplate, data);
  todo.appendChild(DocumentTemplate);
  itemsLeft();
}

function statusPages() {
  const page = document.querySelector(".active").textContent
  const resetList = document.querySelector('ul.list')
  resetList.innerHTML = " ";
  let listTaskTemporal = [...listTask];
  if (page != "All") {
    const done = (page === "Completed");
    listTaskTemporal = listTask.filter((task) => task.done === done)
  }
  listTaskTemporal.forEach(task => newTask(task.value, task.done))
}


function addEventListenerForEachTask(template, data) {
  const task = template.querySelector("li");
  const checkbox = template.querySelector("input[type=checkbox]");
  const removeBtn = template.querySelector("button.delete");
  const editBtn = template.querySelector("button.edit");
  const label = template.querySelector("li >label");
  // ? Checkbox
  checkbox.addEventListener("change", () => {
    if (checkbox.type === 'checkbox') {
      const index = listTask.findIndex(task => task.value === data);
      listTask[index].done = !listTask[index].done;
      listTask[index].done ? label.classList.add("task-done") : label.classList.remove("task-done");
      statusPages();
      saveLocalStorage();
      itemsLeft();
    }
  });
  // ? Edit button
  editBtn.addEventListener("click", (e) => {
    if (checkbox.type === 'checkbox') {
      e.stopPropagation();
      label.classList.add("hidden");
      checkbox.type = 'text';
      checkbox.focus();
      window.addEventListener("click", (pointer) => {
        if (pointer.target != checkbox) {
          checkbox.type = 'checkbox';
          label.classList.remove("hidden");
        }
      }, { once: true })
    }
  })
  checkbox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const editValue = checkbox.value;
      label.innerText = editValue;
      checkbox.type = 'checkbox';
      checkbox.value = editValue;
      label.classList.remove("hidden");
      const index = listTask.findIndex(task => task.value === data);
      listTask[index].value = editValue;
      saveLocalStorage();
    }
  })
  // ? Remove Button
  removeBtn.addEventListener("click", () => {
    task.remove();
    listTask = listTask.filter(task => task.value != data);
    saveLocalStorage();
    itemsLeft();
  });
  // ? Drag and Drop
  task.addEventListener("dragstart", dragStart);
  task.addEventListener("touchmove", dragStart);
  task.addEventListener("dragenter", dragEnter);
  task.addEventListener("dragover", dragOver);
  task.addEventListener("dragleave", dragLeave);
  task.addEventListener("drop", (e) => {
    drop(e);
    saveOrder();
  });
  task.addEventListener("touchend", (e) => {
    drop(e);
    saveOrder();
  });
}

const inputForNewTask = document.getElementById("todo");
//The input which add new task to the list
inputForNewTask.addEventListener("keypress", (e) => {
  const task = inputForNewTask.value;
  if (e.key === "Enter" && task != "") {
    newTask(task);
    listTask.push(new ObjTask(task));
    saveLocalStorage();
    inputForNewTask.value = "";
  }
});

//Navigation for All task, active and completed
const pages = document.querySelectorAll(".pages p");
pages.forEach((page) => page.addEventListener("click", () => {
  pages.forEach(activepage => (activepage.textContent === page.textContent) ? activepage.classList.add("active") : activepage.classList.remove("active"))
  statusPages();
}));
//Button for Clear completed task
const clearCompleted = document.getElementById("clear");
clearCompleted.addEventListener("click", () => {
  listTask = listTask.filter(task => task.done === false);
  statusPages();
  saveLocalStorage();
});

//Local Storage
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    activeDarkMode();
  }
  if (localStorage.getItem("task") != null) {
    let uploadTask = JSON.parse(localStorage.getItem("task"));
    listTask = uploadTask;
  } else {
    listTask = [
      { value: "Complete online JavaScript course", done: true },
      { value: "Jog around the park 3x", done: false },
      { value: "Read for 1 hour", done: false },
      { value: "Pick up groceries", done: false },
      { value: "10 minutes meditation", done: false },
      { value: "Complete Todo App on Frontend Mentor", done: false }
    ]
  }
  listTask.forEach(task => newTask(task.value, task.done))
});
