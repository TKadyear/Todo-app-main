export function touchStart(e, itemGrab) {
  e.stopPropagation();
  e.preventDefault();
  itemGrab.classList.add("touch");
  itemGrab.style.top = e.changedTouches[0].clientY + "px"
}
export function touchMove(e, itemGrab) {
  e.stopPropagation();
  e.preventDefault();
  itemGrab.style.top = e.changedTouches[0].clientY + "px"
}
export function touchEnd(e, itemGrab) {
  e.stopPropagation();
  e.preventDefault();
  itemGrab.classList.remove("touch");
  itemGrab.style.top = 0 + "px"

  const elements = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  const DROP = elements.find(element => element.nodeName === "LI")
  if (DROP) {
    DROP.insertAdjacentElement("afterend", itemGrab);
  }
}
