import { Outlet } from "react-router";
import Header from "./Header";

const RootLayout = () => {
    return (
        <>
            <Header />
            <main className="bg-white dark:bg-gray-900 pb-10 min-h-screen">
                <Outlet />
            </main>
        </>
    );
}

export default RootLayout;
