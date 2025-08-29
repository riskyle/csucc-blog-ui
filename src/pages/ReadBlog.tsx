import React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import axios from "../api/axios";
import customHelper from "../helper/custom-helper";
import type { BlogType } from "../ts-types";

const ReadBlog = () => {
    const [blog, setBlog] = React.useState<BlogType | null>(null);

    const navigate = useNavigate();

    const params = useParams();

    const { user, checkIfAuthenticated } = useAuthContext();

    const truncateContent = customHelper.truncateContent;
    const formatDate = customHelper.formatDate;

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`/api/blog/${params.id}`);
            setBlog(response.data.data);
            console.log(response.data.data);
        } catch (error: any) {
            console.error("Error fetching blogs:", error);
        }
    }

    React.useEffect(() => {
        checkIfAuthenticated(navigate);
        fetchBlogs();
    }, []);

    return (
        <>
            <article className="max-w-4xl mx-auto px-6 py-8">
                <header className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Link to="/">&larr; Back</Link>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{formatDate(blog?.created_at || "")}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {blog?.title}
                    </h1>

                    <div className="flex items-center space-x-4">
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {blog?.author}
                        </p>
                    </div>
                </header>

                <div className="prose prose-lg max-w-none dark:prose-invert dark:text-white">
                    {blog?.content}
                </div>
            </article>
        </>
    );
}

export default ReadBlog;