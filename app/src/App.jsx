// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import Navbar from './Layout/Navbar';
import Footer from './Layout/Footor'; // Note: Typo in filename should be 'Footer.jsx'
import SnippetList from './Pages/SnippetList';
import AddCodeForm from './Pages/AddCodeForm';
import CLIInfo from './Pages/CLIInfo';
import Toast from './Pages/Tost'; // Note: Typo in filename should be 'Toast.jsx'
import SnippetDetail from './Pages/SnippetDetail';
import AuthPage from './Pages/AuthPage';
const theme = createTheme({
  palette: { /* ... your theme settings ... */ },
});

function App() {
  const [toast, setToast] = useState({ open: false, message: '' });

  const showToast = (message) => {
    setToast({ open: true, message });
    setTimeout(() => setToast({ open: false, message: '' }), 3000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar /> 
          <Container sx={{ mt: 3, mb: 3, flex: 1 }}>
            <Routes>
              <Route
                path="/"
                element={<SnippetList showToast={showToast} />} // <-- Use the new component here
              />
              <Route path="/snippets/:id" element={<SnippetDetail />} />
              <Route path="/add" element={<AddCodeForm showToast={showToast} />} />
              <Route path="/cli" element={<CLIInfo />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </Container>
          <Footer />
          <Toast
            open={toast.open}
            message={toast.message}
            onClose={() => setToast({ ...toast, open: false })}
          />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;