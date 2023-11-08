import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import Landing from './components/Landing';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import TestMap from './components/TestMap';
import Dobor from './components/Dobor';
import Home from './components/Home';
import ApproveUsers from './components/ApproveUsers';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="routes">
        <Routes>
          <Route path = "/" element={<Landing/>}/>
          <Route path = "/home" element={<Home/>}/>
          <Route path ="/unapprovedusers" element={<ApproveUsers/>}/>
          <Route path = "/about" element={<About/>}/>
          <Route path = "/login" element={<Login/>}/>
          <Route path = "/register" element={<Register/>}/>
          <Route path = "/testmap" element={<TestMap/>}/>
          <Route path = "/dobor" element={<Dobor/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;