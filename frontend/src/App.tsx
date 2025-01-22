import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './components/Login';
import Player from './pages/Player';
import './App.css';

function App() {
  // 检查是否已登录(从localStorage中获取token)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token')
  );

  return (
    <Router>
      <Routes>
        {/* 登录页面 */}
        <Route 
          path="/login"
          element={<Login setAuth={setIsAuthenticated} />}
        />
        {/* 受保护的页面, 未登录跳转到登录页 */}
        <Route 
          path="/browse"
          element={isAuthenticated ? <Browse /> : <Navigate to="/login" />}
        />
        <Route
          path="/browse/:dirType?/:currentDir/*"
          element={isAuthenticated ? <Browse /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/player"
          element={isAuthenticated ? <Player /> : <Navigate to="/login" />}
        />
        {/* 未匹配的页面跳转 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;