import { Router } from "@vaadin/router";

const router = new Router(document.documentElement.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/chat", component: "chat-page" },
  //esta ruta es para capturar las rutas que no existen, y que estan configuradas en la api del backend con "*"
  { path: "(.*)", redirect: "/" }, //Vaadin Router recomienda usar (.*) en vez de "*" para rutas catch-all.
]);

export { router };
