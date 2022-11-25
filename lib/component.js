import { build } from "./build";
import store from "./store";

export default class Foolsgold {
  constructor(parent, rootElement, props={}) {
    this.parent = parent;
    this.rootElement = rootElement;
    this.props = props;

    this.build = build;

    this.$store = store;

    if (this.props.initialState) {
      this.$store.initState(this.props.initialState);
    }

    this.init();
  }

  init() {
    const container = document.createElement(this.rootElement);
    this.container = container;
    this.parent.appendChild(container);

    this.applyContainerOptions();

    this.clearAndRender();
  }

  applyContainerOptions = () => {
    const options = this.containerOptions();
    if (options?.id) this.container.id = options.id;
    if (options?.className) this.container.classList.add(options.className);
    if (options?.classNames) {
      options.classNames.forEach(className => {
        this.container.classList.add(className);
      })
    }
  };

  containerOptions() {
    return {}
  }

  clearAndRender() {
    this.container.innerHTML = ''
    this.render()
  }

  render() {
    console.error("This is the component base, extend it with something...");
  }
}
