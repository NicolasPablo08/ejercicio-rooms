import { rtdb, fsdb } from "./backend-db";
import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const userCollection = fsdb.collection("users");
const roomsCollection = fsdb.collection("rooms");

//enviar mensajes a la rtdb
app.post("/messages", (req, res) => {
  //aqui recibe los mensajes del fornt
  const { rtdbRoomId } = req.body;
  const { from } = req.body;
  const { message } = req.body;

  const chatroomRef = rtdb.ref("/rooms/" + rtdbRoomId); //aqui es donde se guardan los mensajes en la db
  chatroomRef.push({ from, message }, function () {
    res.json("todo ok");
  });
});

//obtener el userId registrado con el mail
app.post("/auth", (req, res) => {
  const { email } = req.body;

  userCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({ message: "usuario inexistente" });
      } else {
        res.json({ userId: searchResponse.docs[0].id });
        //console.log("soy post /auth y este es el userId", searchResponse.docs[0].id);
      }
    });
});

//crear un nuevo room, partiendo con el userId
app.post("/rooms", (req, res) => {
  const { userId } = req.body;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + uuid());
        roomRef
          .set({
            messages: [],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  roomId: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({ message: "usuario inexistente" });
      }
    });
});

//pedir el id largo de un room a la rtdb, conociendo el id corto
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query; //se pasa por la url (eso es query)
  const { roomId } = req.params;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsCollection
          .doc(roomId.toString())
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({ message: "usuario no autenticado" });
      }
    });
});

const path = require("path");
// Subir un nivel desde la carpeta backend, ya que de la otra forma
//no puedo salir de la carpeta backend para ir a la carpeta dist
const indexPath = path.join(__dirname, "..", "dist", "index.html");

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(
    `conectate a ${process.env.API_URL || `http://localhost:${port}`}`
  );
});
