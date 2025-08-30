import React from "react";
import axios from "../../api/axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import customHelper from "../../helper/custom-helper";

interface Blog {
    id: number;
    title: string;
    content: string;
    isPublish: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    author: string;
}

const ManageBlogs = () => {
    const [blogs, setBlogs] = React.useState<Blog[]>([]);
    const { checkIfAuthenticated, checkIfAdmin } = useAuthContext();
    const navigate = useNavigate();

    const truncateContent = customHelper.truncateContent;
    const formatDate = customHelper.formatDate;

    const fetchBlogs = async () => {
        try {
            const response = await axios.get("/api/admin/blogs");
            setBlogs(response.data.data || response.data);
        } catch (error: any) {
            console.error("Error fetching blogs:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    React.useEffect(() => {
        checkIfAuthenticated(navigate);
        checkIfAdmin(navigate);
        fetchBlogs();
    }, []);

    const togglePublishStatus = async (blogId: number, currentStatus: number) => {
        try {

            const is_publish = currentStatus == 1 ? 0 : 1;
            await axios.post(`/api/admin/blog/publish/${blogId}`, {
                is_publish
            });

            setBlogs(blogs.map(blog =>
                blog.id === blogId
                    ? { ...blog, isPublish: is_publish }
                    : blog
            ));

            alert(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
        } catch (error: any) {
            console.error("Error updating blog status:", error);
            alert("Failed to update blog status");
        }
    };

    const deleteBlog = async (blogId: number) => {
        if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`/api/admin/blog/delete/${blogId}`);
            setBlogs(blogs.filter(blog => blog.id !== blogId));
            alert("Blog deleted successfully!");
        } catch (error: any) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog");
        }
    };

    const displayAllBlogs = () => {
        return blogs.map((blog: any) => (
            <>
                <tr
                    key={blog.id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="max-w-xs truncate" title={blog.title}>
                            {blog.title}
                        </div>
                    </th>
                    <td className="px-6 py-4">
                        <div className="max-w-sm text-gray-600 dark:text-gray-300">
                            {truncateContent(blog.content)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-gray-700 dark:text-gray-300">
                            {blog.author || `User ${blog.user_id}`}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.isPublish
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                            {blog.isPublish ? 'Published' : 'Draft'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {formatDate(blog.created_at)}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(`/blog/${blog.id}`)}
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                title="View Blog"
                            >
                                View
                            </button>
                            <button
                                onClick={() => navigate(`/admin/edit/blog/${blog.id}`)}
                                className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline"
                                title="Edit Blog"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => togglePublishStatus(blog.id, blog.isPublish)}
                                className={`font-medium hover:underline ${blog.isPublish
                                    ? 'text-orange-600 dark:text-orange-500'
                                    : 'text-green-600 dark:text-green-500'
                                    }`}
                                title={blog.isPublish ? 'Unpublish' : 'Publish'}
                            >
                                {blog.isPublish ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                                onClick={() => deleteBlog(blog.id)}
                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                title="Delete Blog"
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            </>
        ));
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Manage Blogs
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/create")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Add New Blog
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Content Preview
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayAllBlogs()}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ManageBlogs;