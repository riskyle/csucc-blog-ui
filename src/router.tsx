import { createBrowserRouter } from "react-router";
import RootLayout from './layouts/RootLayout.tsx';
import Blog from './pages/Blogs.tsx';
import CreateBlog from './pages/CreateBlog.tsx';
import ReadBlog from './pages/ReadBlog.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import ManageBlogs from './pages/admin/ManageBlogs.tsx';
import EditBlog from './pages/admin/EditBlog.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: Blog },
            { path: "/blog/:id", Component: ReadBlog },
            { path: "/create", Component: CreateBlog },
            { path: "/login", Component: Login },
            { path: "/register", Component: Register },
            { path: "/admin/manage-blogs", Component: ManageBlogs },
            { path: "/admin/edit/blog/:id", Component: EditBlog },
        ]
    },
]);

export default router;