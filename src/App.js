import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import Landing from './components/Landing';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="routes">
        <Routes>
          <Route path = "/" element={<Landing/>}/>
          <Route path = "/about" element={<About/>}/>
          <Route path = "/login" element={<Login/>}/>
          <Route path = "/register" element={<Register/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;