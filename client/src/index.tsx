import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/main-app/App';
import GetStarted from './components/welcome-page/GetStarted';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route index path="/" element={<GetStarted />} />
      <Route path="/list/:name" element={<App />} />
    </Routes>
  </BrowserRouter>
);

