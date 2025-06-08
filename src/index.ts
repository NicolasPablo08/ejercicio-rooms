import { router } from "./router";
import { state } from "./state";
import { homePage } from "./pages/home-page";
import { chatPage } from "./pages/chat-page";
import { headerComp } from "./components/header-comp";
import { textComp } from "./components/text-comp";
import { inputComp } from "./components/input-comp";

router;
state.init();

inputComp();
textComp();
headerComp();
homePage();
chatPage();
