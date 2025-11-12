import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';


const Home = lazy(() => import('./pages/Home/HomePages'));

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
  );
};

export default AppRoutes;