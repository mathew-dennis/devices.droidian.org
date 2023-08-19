import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Theme, { App as BaseApp, GlobalStyle } from './components/customs';
import theme from './components/customs/theme';
import Navbar from './components/generic/views/Navbar';
import Router from './Rotuer';
import { Footer } from './components';
import Notifications from './components/notifications/views/Component';

const App: React.FC = () => {
  return (
    <Theme theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        <BaseApp>
          <Notifications />
          <Navbar />
          <Router />
        </BaseApp>
      </BrowserRouter>
      <Footer />
    </Theme>
  );
};

export default App;
