import { Route, Routes } from "react-router-dom";

import React from "react";
import FlashCard from "./layouts/FlashCard";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FlashCard />}></Route>
      </Routes>
    </div>
  );
};

export default App;
