import { Router } from "@vaadin/router";
import { state } from "../../state";

export function homePage() {
  class HomePage extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.innerHTML = `
      <header-comp></header-comp>
      <div class="container-title">
        <text-comp class="title">Bienvenido</text-comp>
      </div>
      <div class="container-form">
        <form class="form">
          <text-comp class="label" for="email"> Email </text-comp>
          <input type="email" class="input" id="email" name="email">
          <text-comp class="label" for="name"> Tu nombre </text-comp>
          <input type="text" class="input" id="name" name="nombre">
          <text-comp class="label room-label" for="room"> Room </text-comp>
          <select class="input room-input" id="room" name="select-room">
            <option value="room-existente">Room existente</option>
            <option value="nuevo-room">Nuevo room</option>
          </select>
          <text-comp class="label roomId-label" for="roomId"> Room id </text-comp>
          <input type="text" class="input roomId" id="roomId" name="roomId" placeholder="AXFTR1">
          <button class="button" >Comenzar</button>
        </form>
      </div>  
    `;
      style.innerHTML = `
      .input{
        width: 100%;
        height: 55px;
        margin:0;
        border: solid 2px black;
        box-sizing: border-box;
        font-size: 20px;
      }
      .button{
        width: 100%;
        height: 55px;
        background-color: #9CBBE9;
        margin:0;
        margin-top: 15px;
        padding: 0;
        font-size: 20px;
      }
      text-comp .label{
        margin-top:15px;
      }
      `;

      const form = div.querySelector(".form");
      form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        const data = new FormData(target);
        const value = Object.fromEntries(data.entries());
        //console.log(value);
        state.setEmailAndName({
          email: value.email as string,
          name: value.nombre as string,
          roomId: (value.roomId as string) || "",
        });
        state.signIn();

        Router.go("/chat");
      });
      const select = form?.querySelector(".room-input");
      const inputRoomId = form?.querySelector(".roomId");
      const labelRoomId = form?.querySelector(".roomId-label");
      select?.addEventListener("change", (e) => {
        const target = e.target as any;
        const selectValue = target.value;
        // console.log(selectValue);
        if (selectValue === "nuevo-room") {
          inputRoomId.style.display = "none";
          labelRoomId.style.display = "none";
        } else {
          inputRoomId.style.display = "block";
          labelRoomId.style.display = "block";
        }
      });

      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }
  customElements.define("home-page", HomePage);
}
