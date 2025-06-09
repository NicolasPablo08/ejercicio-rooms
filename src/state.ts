import { rtdb } from "./frontend-db";
import map from "lodash/map";
import { ref, onValue } from "firebase/database"; // Importa ref y onvalue, con la nueva version de firebase

const API_BASE_URL = process.env.API_URL;

const state = {
  data: {
    email: "",
    nombre: "",
    messages: [],
    userId: "",
    roomId: "",
    rtdbRoomId: "",
  },
  listeners: [], // los callbacks
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado", newState);
  },

  init() {
    const lastStorageState = localStorage.getItem("state");
    if (lastStorageState) {
      const parsedState = JSON.parse(lastStorageState);
      this.setState(parsedState); // Actualizás el estado con los datos del localStorage
      console.log("Estado inicializado desde localStorage", parsedState);
    } else {
      console.log("No hay estado en localStorage, se inicia con valores por defecto");
    }
  },
  listenRoom() {
    const cs = this.getState();
    const chatroomsRef = ref(rtdb, "/rooms/" + cs.rtdbRoomId); //forma de crear la referencia con la ultima version de firebase
    onValue(chatroomsRef, (snapshot) => {
      //forma de leer datos recurrentemente
      const messagesFromServer = snapshot.val();
      //si messagesFromServer tiene mensajes pasa al map y si no pasa a un array vacio
      const messagesList = messagesFromServer ? map(messagesFromServer) : [];
      cs.messages = messagesList;
      this.setState(cs);
      //console.log("soy listenRoom messagesList", messagesList);
    });
  },

  sendMessage(message: string) {
    const cs = this.getState();
    const nombreGuardadoEnState = cs.nombre;
    const idGuardadoEnState = cs.rtdbRoomId;
    // Crear el nuevo mensaje
    const newMessage = { from: nombreGuardadoEnState, message: message };
    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: nombreGuardadoEnState,
        message: message,
        rtdbRoomId: idGuardadoEnState,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("soy sendMessage", data);
        // Agregar el nuevo mensaje al estado
        cs.messages.push(newMessage);
        this.setState(cs); // Notificar a los suscriptores
      });
  },
  setEmailAndName(params: { email: string; name: string; roomId?: string }) {
    const cs = this.getState();
    cs.nombre = params.name;
    cs.email = params.email;
    cs.roomId = params.roomId;
    //console.log("soy setEmailAndName", cs);

    this.setState(cs);
  },
  signIn(callback?) {
    const cs = this.getState();

    if (cs.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cs.email.trim(),
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          cs.userId = data.userId;
          this.setState(cs);
          //console.log("soy singnIn y traigo el userId de la api al state", cs.userId);
          if (cs.roomId) {
            this.accesToRoom();
            //console.log("entre por el accesToRoom teniendo un roomId");
          } else {
            this.askNewRoom();
            //console.log("entre por el askNewRoom para crear un roomId");
          }

          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay email en state");
    }
  },
  askNewRoom(callback?) {
    //pedimos un nuevo room a la api con el email del state
    const cs = this.getState();
    if (cs.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cs.userId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          cs.roomId = data.roomId;
          this.setState(cs);
          this.accesToRoom();
          //console.log("soy askNewRoom y cargue el roomId al state", cs.roomId);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay userId en state");
    }
  },
  accesToRoom(callback?) {
    const cs = this.getState();
    //console.log("soy accesToRoom y utilizpo el roomId", cs.roomId, "y el userId", cs.userId);
    fetch(API_BASE_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId, {
      method: "get",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        //console.log("soy accesToRoom y cargue el rtdbRoomId al state", cs.rtdbRoomId);
        this.listenRoom();
        if (callback) callback();
      });
  },

  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },
};
export { state };
