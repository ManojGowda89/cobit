// App.jsx
import React from "react";

import AddCodeComponent from "./Pages/AddCodeComponent.jsx"
import CodeListComponent from './Pages/CodeListComponent.jsx';
import CliComponent from './Pages/CliComponent.jsx';
import Navbar from './Layout/Navbar.jsx';
import Footer from './Layout/Footor.jsx';
import { CreateRouter } from "../../mjs/AppRouter.jsx";

export default function App() {
  const routes = [
    {
      path: "/",
      element: <AddCodeComponent />,
    },
    {
      path: "/list",
      element: <CodeListComponent />,
    },
    {
      path: "/cli",
      element: <CliComponent />,
    },
  ];

  return (
  
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flexGrow: 1 }}>
          {CreateRouter(routes)}
        </div>
        <Footer />
      </div>
    
  );
}
