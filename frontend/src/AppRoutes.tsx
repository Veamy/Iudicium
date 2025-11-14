import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ChatPage from './pages/Сhat/ChatPage';
import Home from './pages/Home/HomePage';

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/chat/:idchat' element={<ChatPage />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
  );
};

export default AppRoutes;