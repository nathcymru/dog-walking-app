import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ContactPage from './pages/Contact';

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/contact" component={ContactPage} />
    </Switch>
  );
};

export default AppRoutes;