import { state } from "../../state";
type message = {
  from: string;
  message: string;
};
export function chatPage() {
  class ChatPage extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    connectedCallback() {
      this.render();
      state.subscribe(() => {
        const currentState = state.getState();
        this.messages = currentState.messages;
        this.render();
        //console.log(this.messages);
      });
    }
    messages: message[] = state.getState().messages;

    render() {
      this.shadow.innerHTML = ""; // Limpia el contenido anterior
      const style = document.createElement("style");
      const div = document.createElement("div");
      div.innerHTML = `
      <div class="container">
        <div class="container-header">
          <header-comp></header-comp>
          <text-comp class="title">Chat</text-comp>
          <text-comp class="label"> romm id:${state.getState().roomId}</text-comp>
        </div>
        <div class="container-chat">
        ${this.messages
          .filter((m) => m.from && m.message)
          .map((m) => {
            const isCurrentUser = m.from === state.data.nombre;
            return `
            <div class="chat-container">
              <text-comp class="name ${isCurrentUser ? "current-name" : "other-name"}">${
              m.from
            }</text-comp>
              <div class="message-container ${isCurrentUser ? "current-user" : "other-user"}">
                <text-comp class="message">${m.message}</text-comp> 
              </div> 
            </div>
            `;
          })
          .join("")} 
          </div>  
          <div class="container-input">
          <input-comp class="input">Enviar</input-comp>
          </div>  
        </div>
        `;

      style.innerHTML = `
        .container{
          display: grid;
          grid-template-rows: 22% 56% 22%; 
          box-sizing: border-box;
        }
        .container-header{
          grid-row:1;
        }
        .container-chat{
          grid-row:2;
          height: 380px;
          overflow: scroll;

        }    
        .container-input{
          grid-row:3;
          margin:0;
          margin-top:10px;
          
        }  
        .chat-container{
          margin:0;
          padding:0;
          display: flex;
          flex-direction: column;
        }
        .message-container{
          padding:15px;
          margin:0;
          margin-bottom: 10px;
          display:block;
          max-width: 60px;
          border-radius: 5px;
          text-align: center;
          }
          .message-container.current-user{
            background-color: #B9E97C;
            align-self: flex-end;
          }
          .name.current-name{
            display:none;
          }
          .message-container.other-user{
            background-color: #D8D8D8;
          }
          .message{
            margin:0;
            padding:0;
            display:block;
          }
          `;

      const form = div.querySelector(".input");
      form.addEventListener("form-clicked", (e) => {
        const inputComp = e.target; //devuelve el elemento input
        const input = inputComp.shadowRoot.querySelector("input"); //devuelve los datos del input
        const data = input.value; //devuelve lo ingresado en el input
        state.sendMessage(data);
        input.value = "";

        //console.log(data);
      });
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);

      //para que el scroll del chat este siempre abajo con el nuevo mensaje
      const chatContainer = this.shadow.querySelector(".container-chat");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  customElements.define("chat-page", ChatPage);
}
