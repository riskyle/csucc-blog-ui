import { useNavigate, useParams } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "../../api/axios";
import React from "react";

const EditBlog = () => {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [isPublish, setIsPublish] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const { checkIfAuthenticated, checkIfAdmin } = useAuthContext();

    const params = useParams();

    const fetchSpecificBlog = async () => {
        try {
            const response = await axios.get(`/api/admin/blog/edit/${params.id}`);
            setTitle(response.data.title);
            setContent(response.data.content);
            setIsPublish(response.data.is_publish);
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        checkIfAuthenticated(navigate);
        checkIfAdmin(navigate);
        fetchSpecificBlog();
    }, []);

    const handleUpdateBlog = async (e: React.FormEvent<HTMLFormElement>, blogId: number) => {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.patch(`/api/admin/blog/update/${blogId}`, {
                title: title,
                content: content,
                is_publish: isPublish
            });

            alert("Blog updated successfully!");

            navigate("/admin/manage-blogs");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteBlog = async (blogId: number) => {
        if (blogId === 0) return alert("Invalid blog ID");

        if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`/api/admin/blog/delete/${blogId}`);
            alert("Blog deleted successfully!");
            navigate("/admin/manage-blogs");
        } catch (error: any) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog");
        }
    };

    return (
        <>
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update blog</h2>
                <form onSubmit={(e) => handleUpdateBlog(e, parseInt(params.id || "0"))}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label id="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Title</label>
                            <input onChange={(e) => setTitle(e.target.value)} defaultValue={title} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type your title blog" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label id="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                            <textarea onChange={(e) => setContent(e.target.value)} defaultValue={content} id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write your content here..."></textarea>
                        </div>
                        <div>
                            <label id="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <select onChange={(e) => setIsPublish(parseInt(e.target.value))} id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option selected={isPublish === 0 ? true : false} value={0}>Draft</option>
                                <option selected={isPublish === 1 ? true : false} value={1}>Publish</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" disabled={loading}>
                            {loading ? "Updating..." : "Update blog"}
                        </button>
                        <button onClick={() => handleDeleteBlog(parseInt(params.id || "0"))} type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                            <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditBlog;