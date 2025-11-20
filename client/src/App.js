import React, { useState } from 'react';
import Login from './components/Login';

export default function App(){
  const [user, setUser] = useState(null);

  return (
    <div className="container">
      {!user ? (
        <div className="center-card">
          <div className="left">
            <h1>MERN Auth Demo</h1>
            <div className="small">Simple register & login flow with JWT — great to show backend + frontend skills</div>
          </div>
          <div className="right">
            <Login onLogin={setUser} />
          </div>
        </div>
      ) : (
        <div className="center-card">
          <div>
            <h1>Welcome, {user.name}</h1>
            <div className="small">Email: {user.email}</div>
            <div className="welcome">You are authenticated. This is a demo UI for portfolio.</div>
          </div>
        </div>
      )}
    </div>
  );
}
