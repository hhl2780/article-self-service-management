import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import ArticleDetail from '../pages/ArticleDetail';
import ArticleEdit from '../pages/ArticleEdit';
import ArticleList from '../pages/ArticleList';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/articles" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'articles', element: <ArticleList /> },
      { path: 'articles/:id', element: <ArticleDetail /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'articles/new',
        element: (
          <ProtectedRoute>
            <ArticleEdit />
          </ProtectedRoute>
        )
      },
      {
        path: 'articles/:id/edit',
        element: (
          <ProtectedRoute>
            <ArticleEdit />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;
