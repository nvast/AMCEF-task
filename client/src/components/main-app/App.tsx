import React, { useState } from "react";
import Main from "./Main";
import TemporaryDrawer  from "./drawer/Drawer";
import Footer from "../reusable/footer/Footer";



function App() {

  const [listNames, setListNames] = useState<string[]>([])

  const updateListNames = (newListNames: React.SetStateAction<string[]>) => {
    setListNames(newListNames);
  };

  return (
    <div id="app">
      <Main  setListNames={updateListNames} />
      <TemporaryDrawer  listNames={listNames} setListNames={updateListNames} />
      <Footer/>
      
    </div>
  );
}

export default App;
