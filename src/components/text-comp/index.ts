export function textComp() {
  class TextComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const variant = this.getAttribute("class");
      const style = document.createElement("style");
      let element;
      if (variant === "title") {
        element = document.createElement("h1");
      } else if (variant === "label") {
        element = document.createElement("h4");
      } else if (variant === "chat") {
        element = document.createElement("p");
      } else if (variant === "name") {
        element = document.createElement("h6");
      } else {
        element = document.createElement("p");
      }
      element.textContent = this.textContent;
      element.className = variant;

      style.innerHTML = `
        .title{
          font-weight: 700;
          font-size: 52px;
          margin: 0;
        }
        .label{
          font-weight: 500;
          font-size: 24px;
          margin: 0;

        }
        .chat{
          font-weight: 400;
          font-size: 18px;
          margin: 0;
        }
        .name{
          font-weight: 400;
          font-size: 14px;
          color: #A5A5A5;
          margin: 0;
        }
      `;

      shadow.appendChild(element);
      shadow.appendChild(style);
    }
  }
  customElements.define("text-comp", TextComp);
}
