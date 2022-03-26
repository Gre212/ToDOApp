import React from 'react';
import ReactDOM from 'react-dom';
import { Box, CssBaseline } from '@mui/material';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import TasksContainer from './components/tasks/Container';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#fafafa" }}>
      <Header />
      <Box component="main" sx={{ flex: "1" }}>
        <TasksContainer />
      </Box>
      <Footer />
    </Box>
  </React.StrictMode>,
  document.getElementById('root')
);

