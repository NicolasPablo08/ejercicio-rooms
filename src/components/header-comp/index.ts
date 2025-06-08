export function headerComp() {
  class HeaderComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const div = document.createElement("div");
      div.style.height = "60px";
      div.style.backgroundColor = "#FF8282";
      this.appendChild(div);
    }
  }
  customElements.define("header-comp", HeaderComp);
}
