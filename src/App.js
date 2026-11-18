import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import XssComplex from './pages/Xss';
import XssAllExamples from './pages/XssAll';
import PrototypePollution from './pages/ProtoPollution';
import OpenRedirect from './pages/OpenRedirect';
import Profile from './pages/Profile';
import LoginSession from './pages/Login';
import Login from './pages/nosql/Login';
import PrivateRoute from './pages/nosql/PrivateRoute';
import ProtectedPage from './pages/nosql/ProtectedPage';
import Register from './pages/nosql/Register';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/xss" element={<XssComplex />} />
          <Route path="/xssall" element={<XssAllExamples />} />
          <Route path="/protopol" element={<PrototypePollution />} />
          <Route path="/redirect" element={<OpenRedirect />} />
          <Route path="/loginses" element={<LoginSession />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<PrivateRoute />}>
          <Route path="/protected" element={<ProtectedPage />} />
        </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
