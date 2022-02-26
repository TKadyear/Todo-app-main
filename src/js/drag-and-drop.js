//Drag and drop
export function dragStart(e) {
  e.stopPropagation();
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", e.currentTarget.id);
}

export function dragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add("drag-over");
}
export function dragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add("drag-over");
}
export function dragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove("drag-over");
}
export function drop(e) {
  e.currentTarget.classList.remove("drag-over");
  //get the draggable element
  const ID = e.dataTransfer.getData("text/html");
  const DRAGGABLE = document.querySelector(`#${ID}`);
  //get the drop area
  const DROP = document.querySelector(`#${e.currentTarget.id}`)
  DROP.insertAdjacentElement("afterend", DRAGGABLE)
}
