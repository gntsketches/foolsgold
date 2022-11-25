export function build(parent, el, options) {
  const element = document.createElement(el);
  if (options?.id) element.id = options.id;
  if (options?.className) element.classList.add(options.className);
  if (options?.classNames) {
    options.classNames.forEach((className) => {
      element.classList.add(className);
    });
  }
  if (options?.text) {
    if (el === "input") element.setAttribute("value", options.text);
    else element.innerText = options.text;
  }
  if (options?.contentEditable) element.contentEditable = true;
  if (options?.title) element.title = options.title;

  if (options?.onClick) element.addEventListener("click", options.onClick);
  if (options?.onInput) element.addEventListener("input", options.onInput);
  parent.appendChild(element);

  return element;
}
