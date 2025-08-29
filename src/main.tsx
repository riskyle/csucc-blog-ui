import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from './layouts/RootLayout.tsx';
import Blog from './pages/Blogs.tsx';
import CreateBlog from './pages/CreateBlog.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import AuthProvider from "./contexts/AuthContext.jsx";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Blog },
      { path: "/create", Component: CreateBlog },
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />,
    </AuthProvider>
  </StrictMode>,
)
