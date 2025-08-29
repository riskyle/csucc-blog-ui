import React from "react";
import { Link, useNavigate } from "react-router";
import axios from "../api/axios";
import customHelper from "../helper/custom-helper";
import { useAuthContext } from "../contexts/AuthContext";

interface BlogType {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at: string;
    updated_at: string;
}

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

    const showThisButtonIfAdmin = () => user.role === "admin" ? (
        <>
            <li>
                <button type="button" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    <svg className="text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z" /></svg>
                    Edit
                </button>
            </li>
            <li>
                <button type="button" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
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
                            {showThisButtonIfAdmin()}
                        </ul>
                    </div>
                </div>
            </>
        ));
    }

    return (
        <>
            <section>
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">CSUCC Blog</h2>
                        <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">Have fun reading the students and instructors blogs</p>
                    </div>
                    <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                        {displayBlogs()}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Blog;