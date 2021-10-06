import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import logo from './images/logo.svg';
import './App.scss';
import Header from './components/Header'
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts'
import Footer from './components/Footer';
import Disconnected from './components/Disconnected';
import Pending from './components/Pending'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        {/* <Disconnected /> */}
        <Dashboard />
        <Accounts />
        <Pending />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
