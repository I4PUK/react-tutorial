import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context';
import Login from '../pages/Login';
import Posts from '../pages/Posts';
import { publicRoutes, privateRoutes } from '../route/router';
import Loader from './UI/loader/loader';

const AppRouter = () => {
  const { isAuth, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  return isAuth ? (
    <Routes>
      {privateRoutes.map((route) => (
        <Route
          element={route.element}
          path={route.path}
          key={route.path}
          exact={route.exact}
        />
      ))}
      <Route element={<Posts />} path={'/'} key={'/posts'} exact={true} />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          element={route.element}
          path={route.path}
          key={route.path}
          exact={route.exact}
        />
      ))}
      <Route element={<Login />} path={'/'} key={'/login'} exact={true} />
    </Routes>
  );
};

export default AppRouter;
