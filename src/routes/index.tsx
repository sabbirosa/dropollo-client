import App from "@/App";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: Login,
    path: "login",
  },
  {
    Component: Registration,
    path: "registration",
  },
]);
