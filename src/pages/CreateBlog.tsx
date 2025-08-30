import React from "react";
import axios from "../api/axios";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

const CreateBlog = () => {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { user, checkIfAuthenticated } = useAuthContext();

    const navigate = useNavigate();

    React.useEffect(() => {
        checkIfAuthenticated(navigate);
    }, [user]);

    const handleSubmitNewBlog = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);

        try {
            await axios.post("/api/blog/store", { title, content });
            if (user.role !== "admin") {
                alert("Blog created successfully. Please wait for the admin to published your blog.");
            } else {
                alert("Blog created successfully!");
            }
            setTitle("");
            setContent("");
            navigate("/");
        } catch (error: any) {
            console.error("Error creating blog:", error);
            if (error.response?.status === 422) {
                alert("Validation error: " + JSON.stringify(error.response.data.errors));
            } else {
                alert("Error creating blog. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new blog</h2>
                <form onSubmit={handleSubmitNewBlog}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label id="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog title</label>
                            <input onChange={(e) => setTitle(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label id="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Description</label>
                            <textarea onChange={(e) => setContent(e.target.value)} id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-lg focus:ring-4 bg-green-700 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800`}
                    >
                        {isSubmitting ? 'Creating...' : 'Add Blog'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default CreateBlog;