export function inputComp() {
  class InputComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      const div = document.createElement("div");
      const name = this.getAttribute("name");
      div.innerHTML = `
      <form class="form">
      <input type="text" class="input" id="input" name="${name}">
      <button class="button" ></button>
      </form>
      `;

      style.innerHTML = `
      .input{
        width: 100%;
        height: 55px;
        margin:0;
        border: solid 2px black;
        box-sizing: border-box;
        }
        .button{
          width: 100%;
          height: 55px;
          background-color: #9CBBE9;
          margin:0;
          margin-top: 12px;
          padding: 0;
          }
          
          `;
      const button = div.querySelector(".button");
      button.textContent = this.textContent;

      shadow.appendChild(div);
      shadow.appendChild(style);
      const form = div.querySelector(".form");
      form?.addEventListener("submit", (e) => {
        this.dispatchEvent(new CustomEvent("form-clicked"));
        e.preventDefault();
      });
    }
  }
  customElements.define("input-comp", InputComp);
}
