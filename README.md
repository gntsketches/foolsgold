# foolsgold

Foolsgold is a JavaScript library for building user interfaces.

This is a personal project for educational purposes;
it can be useful for simple projects but will not scale.
The library is presently just 102 LOC in three files
and can easily be extended or altered to fit your situation.

I built it as an experiment in a small-scale React or Vue
style UI library. I chose the name because, like the mineral pyrite which looks like gold but isn't,
this library mimics some surface features with the above, but it's "not the real thing".
Components which can receive "props" are created by extending a base class with a "render"
method which defines HTML structure. A "build" method
(analagous to React's "createElement") handles element
creation and assigns properties.
Unlike React or Vue, there is no virtual DOM, 
and re-renders must be managed directly.
Similar to Vuex, the user can directly set and access 'store' data in components;
however the store is defined as a singleton and supports publish/subscribe calls 
rather than truly integrated state management.


## Install
`npm i foolsgold`

`yarn add foolsgold`


## Basic Use
```
import Foolsgold from "foolsgold";

class App extends Foolsgold {
  containerOptions() {
    return {
      className: "main",
    };
  }

  render() {
    this.build(this.container, "h1", {
      className: "title",
      text: 'Hello world!!'
    });
  }
}

const DOMRoot = document.getElementById("root");
const app = new App(DOMRoot, "div");
```

When components are defined they accept a "parent" element and a 
"container" element. In this case, the container is `div` and 
the parent element is the project root,
defined in `index.html`:
```
<body>
    <div id="root"></div>
    <script src="main.js"></script>
</body>
```
The "containerOptions" method can accept `id` (string), `className` (string)
or `classNames` (array of strings). 
Above, the container of the `App` root component is a div, and receives the class "main".

The render method defines one child element via the `build` method,
which similarly receives a parent element, an element type, and an
"options" object. As of the first release, the possible options are:
`id, className, classNames, text, contentEditable, title, onClick, onInput`


## Components and Props
This example adds a second component. It's instantiated using `new` in the render method.
When a component is instantiated it can accept arbitrary data via the third "props" argument of the constructor.
Here the `Counter` component receives the title for its button from props.
```
class Counter extends Foolsgold {
  constructor(...args) {
    super(...args);

    this.count = 0;
    this.clearAndRender();
  }

  containerOptions() {
    return {
      className: "counter",
    };
  }

  addToCount() {
    this.count++;
    this.clearAndRender();
  }

  render() {
    const DOMClicker = this.build(this.container, "button", {
      className: "clicker",
      text: this.props.buttonTitle,
      title: "Click to increment",
      onClick: () => this.addToCount(),
    });

    const DOMCount = this.build(this.container, "p", {
      className: "count",
      text: `Count: ${this.count}`
    });
  }
}

class App extends Foolsgold {
  containerOptions() {
    return {
      className: "main",
    };
  }

  render() {
    const DOMHeader = this.build(this.container, "div", {
      className: "header",
    });
    const DOMTitle = this.build(DOMHeader, "h1", {
      className: "title",
      text: "Here's a clicker",
    });

    const DOMCounter = new Counter(this.container, 'div', { buttonTitle: 'Click me'});
  }
}

const DOMRoot = document.getElementById("root");
const app = new App(DOMRoot, "div");
```
In working with Foolsgold, I adopted a convention of using `DOM + Descriptor` to identify elements in the body of the render method.
Common linting rules protest unused identifiers,
however in this context I found it helped as a way to visually & semantically organize the "markup".

#### Re-render
To re-render a Foolsgold component, call the `clearAndRender` method.
When a value is defined in the constructor, also call `clearAndRender` at the end of the constructor;
without this the `DOMCount` displays `undefined` because the first pass of "render" is called by the constructor of the base class.
`addToCount` also uses calls a rerender.
Note that it is necessary to use an arrow function for the `onClick` method of the `DOMClicker`,
otherwise the `addToCount` method receives the DOM element as its scope.


## Store and State
Foolsgold provides a basic system for centralized state management through the "store".
To use it, pass in a special `initialState` prop during instantiation of the App at the top level.
Here's an alternate way to make our clicker, using the store:
```
class App extends Foolsgold {
  constructor(...args) {
    super(...args);

    this.$store.stateRegister("count", () => {
      this.clearAndRender();
    });
  }

  containerOptions() {
    return {
      className: "main",
    };
  }

  render() {
    const DOMClickerTitle = this.build(this.container, "h1", {
      className: "clicker-title",
      text: "Here's a clicker",
    });
    
    const DOMClicker = this.build(this.container, "button", {
      className: "clicker",
      text: "Click Me",
      title: "Click to increment",
      onClick: () => this.$store.setState('count', this.$store.state.count + 1),
    });

    const DOMCount = this.build(this.container, "p", {
      className: "count",
      text: `Count: ${this.$store.state.count}`
    });
  }
}

const initialState = {
  count: 0
}

const DOMRoot = document.getElementById("root");
const app = new App(DOMRoot, "div", { initialState });
```
The store has a state object and two type of publish/subscribe methods for managing it 
interactively. In this example, the constructor uses the `stateRegister` method to set up `clearAndRender` for the `count` field.
When the store's `setState` method is called in `DOMClicker`, the store performs the callback that has been assigned 
to `count`. (This mimics the reactivity found in popular UI libraries.)

An important note, only one root level app can be defined per project. This is because the store uses "file state",
ie: the class is both defined and instantiated in one file, then exported and attached to the base class.
Therefore, if a second root level app was defined, it would share the same store.
This is certainly an antipattern. The proper way to do it would be to use the "builder pattern" to integrate a unique store at app creation.
(A project for Foolsgold v2! 🎉)


## Listing and Registration

Here's a list to demonstrate a few more options:
```
class List extends Foolsgold {
  constructor(...args) {
    super(...args);

    this.$store.register('addListItem', () => this.clearAndRender())
  }

  containerOptions() {
    return {
      className: "list",
    };
  }

  render() {
    this.$store.state.listItems.forEach((item, index) => {
      const DOMListItem = this.build(this.container, "li", {
        className: 'list-item',
        text: item,
      });
    });
  }
}

class App extends Foolsgold {
  containerOptions() {
    return {
      className: "main",
    };
  }

  updateInputText(e) {
    this.$store.setState("inputText", e.target.value);
  }

  addToList() {
    const newListItems = [...this.$store.state.listItems, this.$store.state.inputText]
    this.$store.setState("listItems", newListItems);
    this.$store.publish('addListItem')
    this.DOMInput.value = '';
  }

  render() {
    const DOMListTitle = this.build(this.container, "h1", {
      className: "list-title",
      text: "Here's a list",
    });
    const DOMInput = this.build(this.container, "input", {
      className: "text-input",
      onInput: (e) => this.updateInputText(e),
    });
    this.DOMInput = DOMInput;

    const DOMAdd = this.build(this.container, "button", {
      className: "add-item",
      text: "Add to List",
      onClick: () => this.addToList(),
    });

    const DOMList = new List(this.container, 'ul', {
      className: "list"
    })
  }
}

const initialState = {
  inputText: '',
  listItems: [],
}

const DOMRoot = document.getElementById("root");
const app = new App(DOMRoot, "div", { initialState });


```
The `initialState` is defined with a field for the input text and list items.
Though `setState` is called when the input text is updated, there is no callback assigned (ie: via `stateRegister`).
The `inputText` state is used when the text is added to the list.

The `List` component iterates over the list items to generate the elements.
`List` registers to `addToList` , which is published
by the click handler on the `DOMAdd` element, so the list re-renders 
at that time. In the render method, the `DOMInput` is assigned as a property for the 
App component, (`this.DOMInput = DOMInput`) so it can be accessed in the `addToList` method to clear
the input field.

These effects could also have been created using a `stateRegister`.
This just presents an alternative. Note again the use of an arrow function
to assign `clearAndRender` to the callback when registering it in the List component's constructor.
With a regular function, `clearAndRender` is called in the scope of the base class.

## Example app
Here's a small app I've built with Foolsgold:
[github.com/gntsketches/personalities](https://github.com/gntsketches/personalities)



