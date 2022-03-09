let ID = "";

export function touchStart(e) {
  e.stopPropagation();
  e.preventDefault();
  e.currentTarget.classList.add("gu-mirror");
  e.currentTarget.classList.add("gu-transit");
  // e.currentTarget.classList.add("gu-mirror");
  ID = e.currentTarget.id;
}
export function touchMove(e) {
  e.stopPropagation();
  e.preventDefault();
  const DRAGGABLE = document.querySelector(`#${ID}`);
  const touch = e.changedTouches[0]
  // console.log(e.changedTouches[0].clientX,)
  DRAGGABLE.style.left = touch.clientX
  DRAGGABLE.style.right = touch.clientY
  // e.currentTarget.classList.add("gu-transit");
  // e.currentTarget.classList.add("gu-mirror");
  ID = e.currentTarget.id;
}
export function touchEnd(e) {
  e.stopPropagation();
  e.preventDefault();
  e.currentTarget.classList.remove("gu-mirror");
  e.currentTarget.classList.remove("gu-transit");

  const DRAGGABLE = document.querySelector(`#${ID}`);
  DRAGGABLE.style.left = 0;
  DRAGGABLE.style.right = 0;
  const elements = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  const DROP = elements.find(element => element.nodeName === "LI")
  if (DROP) {
    console.log(DRAGGABLE)
    DROP.insertAdjacentElement("afterend", DRAGGABLE);
  }
}
