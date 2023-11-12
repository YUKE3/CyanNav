import './App.css';
import APITester from './components/APITester.jsx';
import Map from './components/Map.jsx'
import React from 'react';
import AppBanner from './components/AppBanner.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import RegisterScreen from './components/RegisterScreen.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import ForgetPswdScreen from './components/ForgetPswdScreen.jsx'
import ProfileScreen from './components/ProfileScreen.jsx';
import MUIChangeUsernameModal from './components/modals/MUIChangeUsernameModal.jsx';
import MUIChangeEmailModal from './components/modals/MUIChangeEmailModal.jsx';
import MUIChangePasswordModal from './components/modals/MUIChangePasswordModal.jsx';
import MUIDeleteAccountModal from './components/modals/MUIDeleteAccountModal.jsx';
import MUICreateMapModal from './components/modals/MUICreateMapModal.jsx'
import MUIDeleteMapModal from './components/modals/MUIDeleteMapModal.jsx';
import MUIPublishMapModal from './components/modals/MUIPublishMapModal.jsx';
import MUIAddFieldModal from './components/modals/MUIAddFieldModal.jsx';
import MUIExportMapModal from './components/modals/MUIExportMapModal.jsx';
import MUICommentModal from './components/modals/MUICommentModal.jsx';
import MUIAddTagModal from './components/modals/MUIAddTagModal.jsx';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
    ].join(','),
  },
});

const App = () => {
  return (
    <BrowserRouter>
      {/* <AuthContextProvider> */}
      {/* <GlobalStoreContextProvider> */}
      <ThemeProvider theme={theme}>
        <AppBanner />
        <ProfileScreen />
        {/* <MUIChangeUsernameModal /> */}
        {/* <MUIChangeEmailModal /> */}
        {/* <MUIChangePasswordModal /> */}
        {/* <MUIDeleteAccountModal /> */}
        {/* <MUICreateMapModal /> */}
        {/* <MUIDeleteMapModal /> */}
        {/* <MUIPublishMapModal /> */}
        {/* <MUIAddFieldModal /> */}
        {/* <MUIExportMapModal /> */}
        {/* <MUICommentModal /> */}
        {/* <MUIAddTagModal /> */}
        {/* <Routes>
          <Route path="/login/" element={<LoginScreen />} />
          <Route path="/register/" element={<RegisterScreen />} />
          <Route path="/forget/" element={<ForgetPswdScreen />} />
        </Routes> */}
      </ThemeProvider>

      {/* </GlobalStoreContextProvider> */}
      {/* </AuthContextProvider> */}
    </BrowserRouter>
  )
}

export default App;
