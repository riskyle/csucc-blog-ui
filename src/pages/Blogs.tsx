import React from "react";
import { Link, useNavigate } from "react-router";
import axios from "../api/axios";
import customHelper from "../helper/custom-helper";
import { useAuthContext } from "../contexts/AuthContext";
import type { BlogType } from "../ts-types";

const Blog = () => {
    const [blogs, setBlogs] = React.useState<BlogType[]>([]);

    const navigate = useNavigate();

    const { user, checkIfAuthenticated } = useAuthContext();

    const truncateContent = customHelper.truncateContent;
    const formatDate = customHelper.formatDate;

    const fetchBlogs = async () => {
        try {
            const response = await axios.get("/api/blogs");
            setBlogs(response.data.data);
        } catch (error: any) {
            console.error("Error fetching blogs:", error);
        }
    }

    React.useEffect(() => {
        checkIfAuthenticated(navigate);
        fetchBlogs();
    }, []);

    const deleteBlog = async (blogId: number) => {
        if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`/api/admin/blog/delete/${blogId}`);
            setBlogs(blogs.filter(blog => blog.id !== blogId));
            alert("Blog deleted successfully!");
        } catch (err: any) {
            console.error("Error deleting blog:", err);
            alert("Failed to delete blog");
        }
    };

    const showThisButtonIfAdmin = (id: any) => user.role === "admin" ? (
        <>
            <li>
                <button onClick={() => navigate(`admin/edit/blog/${id}`)} type="button" className="text-gray-500 hover:text-gray-900 dark:hover:text-yellow-500">
                    Edit
                </button>
            </li>
            <li>
                <button onClick={() => deleteBlog(id)} type="button" className="text-gray-500 hover:text-gray-900 dark:hover:text-red-600">
                    Delete
                </button>
            </li>
        </>
    ) : "";

    const displayBlogs = () => {
        return blogs.map((blog: any) => (
            <>
                <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-5">
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <a href="#">{blog.title}</a>
                        </h3>
                        <span className="text-gray-500 dark:text-gray-400">{formatDate(blog.created_at)}</span>
                        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">{truncateContent(blog.content, 500)}</p>
                        <ul className="flex space-x-4 sm:mt-0">
                            <li>
                                <Link to={`/blog/${blog.id}`} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    Read More
                                </Link>
                            </li>
                            {showThisButtonIfAdmin(blog.id)}
                        </ul>
                    </div>
                </div>
            </>
        ));
    }

    return (
        <>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">CSUCC Blog</h2>
                    <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">Have fun reading the students and instructors blogs</p>
                </div>
                <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                    {displayBlogs()}
                </div>
            </div>
        </>
    );
}

export default Blog;