import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        {
          username: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('Login successful');
      console.log('Logged in user:', response.data);
      const token = response.data;
      const expiresIn = 3600;
      const expiryTime = new Date().getTime() + expiresIn * 1000;

      localStorage.setItem('token', token);
      localStorage.setItem('expiryTime', expiryTime);

      navigate('/'); // 로그인 성공 후 PostList 페이지로 이동
    } catch (error) {
      console.error('Error logging in', error);
      // Handle login error here
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <Link to={'/register'}>회원가입</Link>
      </form>
    </div>
  );
}

export default LoginPage;
