import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home.page";
import Navbar from "./components/navbar.component";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import UserAuthForm from "./pages/userAuthForm.page";
import ProfilePage from "./pages/profile.page";
import PageNotFound from "./pages/404.page";
import EditProfile from "./pages/edit-profile.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import ManageBlogs from "./pages/manage-blogs.page";
import Editor from "./pages/editor.pages";
import BlogPage from "./pages/blog.page";
import SearchPage from "./pages/search.page";
import Notifications from "./pages/notifications.page";

// Context

export const UserContext = createContext({}); // user information state

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        
        let userInSession = lookInSession("user");
        
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:blog_id" element={<Editor />} />
                <Route path="/" element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path="dashboard" element={<SideNav />}>
                        <Route index element={<Navigate to="blogs" />} />
                        <Route path="blogs" element={<ManageBlogs />} />
                        <Route path="notifications" element={<Notifications />} />
                    </Route>
                    <Route path="settings" element={<SideNav />}>
                        <Route path="edit-profile" element={<EditProfile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>
                    <Route path="signin" element={<UserAuthForm type="sign_in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign_up" />} />
                    {/* <Route path="signin" element={<UserAuthForm type="sign_in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign_up" />} /> */}
                    <Route path="user/:id" element={<ProfilePage />} />
                    <Route path="blog/:blog_id" element={<BlogPage />} />
                    <Route path="search/:query" element={<SearchPage />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    );

}

export default App;
