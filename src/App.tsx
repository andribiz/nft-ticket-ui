import React from "react";
import Menu from "./components/menu";
import Content from "./containers/home";
import Event from "./containers/event";
import { Routes, Route } from "react-router-dom";
import WalletProvider from "./contexts/wallet.provider";
import NewEvent from "./containers/newEvent";

const App: React.FC = () => {
  return (
    <WalletProvider>
      <Menu />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="event/:id" element={<Event />} />
        <Route path="newevent/" element={<NewEvent />} />
      </Routes>
    </WalletProvider>
  );
};

export default App;
