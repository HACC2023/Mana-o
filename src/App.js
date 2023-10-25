import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="routes">
        <Routes>
          <Route path = "/login" element={<Login/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;