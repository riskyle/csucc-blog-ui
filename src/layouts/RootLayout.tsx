import { Outlet } from "react-router";
import Header from "./Header";

const RootLayout = () => {

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default RootLayout;
