import { Outlet } from "react-router";
import Header from "./Header";

const RootLayout = () => {
    return (
        <>
            <Header />
            <main className="bg-white dark:bg-gray-900 max-h-full">
                <Outlet />
            </main>
        </>
    );
}

export default RootLayout;
