import React, { useState } from 'react';
import Config from '../config';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const accessProtectedData = () => {
    const token = localStorage.getItem('authToken');

    if (token === Config.JWT_SECRET) {
      setData({
        username: Config.USERNAME,
        email: Config.SUPPORT_EMAIL,
        secret: 'SensitiveServerDataFromProfile',
      });
    } else {
      alert('Access Denied! Redirecting to Login.');
      navigate('/login');
    }
  };

  return (
    <div>
      <h2>Protected Profile</h2>
      <button onClick={accessProtectedData}>View Profile</button>
      {data && (
        <div>
          <p>Username: {data.username}</p>
          <p>Email: {data.email}</p>
          <p>Secret Data: {data.secret}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
