import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import "aos/dist/aos.css";
import StoreProvider from "./redux/storeProvider.tsx";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
    <ToastContainer autoClose={3000} />
  </StrictMode>
);
