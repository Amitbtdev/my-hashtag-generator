import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ➊ Import MUI theming utilities
import { ThemeProvider, createTheme } from '@mui/material/styles';


// ➋ Define your custom theme (colors, typography, etc.)
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },   // MUI blue
    secondary: { main: '#9c27b0' }, // MUI purple
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // ➌ Wrap <App/> so all MUI components see the theme
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
