import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 react-router-dom 的 useNavigate 钩子
import '../styles/login.css';
import Account from '../assets/icons/account.svg';
import Password from '../assets/icons/password.svg';

interface LoginProps {
  setAuth: (status: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 使用 useNavigate 钩子

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // 假设后端返回 token 字段
        setAuth(true);
        navigate('/browse'); // 登录成功后跳转到浏览页面
      } else {
        alert("登录失败");
      }
    } catch (error) {
      console.error("登录请求失败: ", error);
      alert("登录请求失败");
    }
  };

  return (
    <div className="background-image">
      <div className="login-container">
        <h1 className="login-title">登录</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <img src={Account} alt="account-icon" className="login-icon" />
            <input 
              type="text"
              placeholder='用户名'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <img src={Password} alt="password-icon" className="login-icon" />
            <input
              type="password"
              placeholder='密码'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">SIGN IN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;