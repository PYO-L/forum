import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';
import PostList from './component/PostList';
import PostDetail from './component/PostDetail';
import PostEdit from './component/PostEdit';
import NavigationBar from './NavigationBar';
import LoginPage from './component/LoginPage';
import RegisterPage from './component/RegisterPage'; // 회원가입 페이지 추가
import { Button, Form } from 'bootstrap';
const Layout = () => {
  return (
    <div>
      <NavigationBar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 회원가입 및 로그인 페이지 */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 로그인 여부에 따라 이동할 경로 */}
            <Route
              path="/"
              element={
                // 로그인 상태를 확인하고 적절한 경로로 리디렉션하는 컴포넌트
                <CheckLogin />
              }
            >
              {/* 로그인 후 이동할 경로 */}
              <Route index element={<PostList />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/:id/edit" element={<PostEdit />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

const CheckLogin = () => {
  const token = localStorage.getItem('token');
  const expiryTime = localStorage.getItem('expiryTime');

  if (!token || (expiryTime && new Date().getTime() > expiryTime)) {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
    alert('다시 로그인 해주세요');
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default App;
