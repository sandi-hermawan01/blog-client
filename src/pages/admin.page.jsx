import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../App";

const AdminPage = () => {
  // contexts
  let {
    userAuth: { access_token, new_notifications_available },
  } = useContext(UserContext);

  // page location
  let page = location.pathname.split("/")[2] || "blogs";

  // states
  const [sideNav, setSideNav] = useState(false);
  const [pageState, setPageState] = useState(page.replace("-", " "));

  // references
  let activeTabLine = useRef();
  let dashboardNavIcon = useRef();
  let dashboardActiveTabBtn = useRef();

  const changePageState = (e) => {
    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if (e.target == dashboardNavIcon.current) {
      setSideNav(true);
    } else {
      setSideNav(false);
    }
  };

  useEffect(() => {
    setSideNav(false);
    dashboardActiveTabBtn.current.click();
  }, [pageState]);
  return access_token === null ? (
    <Navigate to="/signin" />
  ) : (
    <>
      <section className="h-cover flex gap-10 py-0 m-0 max-md:flex-col">
        {/* sidebar */}

        <div className="sticky top-[80px]">
          <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
            <button
              ref={dashboardNavIcon}
              className="p-5 capitalize"
              onClick={changePageState}
            >
              <i className="fi fi-br-bars-staggered pointer-events-none"></i>
            </button>
            <button
              ref={dashboardActiveTabBtn}
              className="p-5 capitalize"
              onClick={changePageState}
            >
              {pageState}
            </button>
            <hr
              ref={activeTabLine}
              className="absolute bottom-0 duration-500"
            />
          </div>

          <div
            className={
              "min-w-[200px] h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
              (!sideNav
                ? "max-md:opacity-0 max-md:pointer-events-none"
                : "opacity-100 pointer-events-auto")
            }
          >
            <h1 className="text-xl text-dark-grey mb-3">Admin Page</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />
            <NavLink
              to="/admin/admin-dashboard"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-dashboard"></i>
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/user-manager"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <div className="relative">
                <i className="fi fi-rr-users-alt"></i>
                {new_notifications_available ? (
                  <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
                ) : (
                  ""
                )}
              </div>
              User Manager
            </NavLink>
            <NavLink to="/admin/blog-manager" className="sidebar-link">
              <i className="fi fi-rr-blog-pencil"></i>
              Blog Manager
            </NavLink>

            <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />

            <NavLink
              to="/admin/carousel-manager"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rs-copy"></i>
              Carousel Manager
            </NavLink>

            <NavLink
              to="/admin/ads-manager"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-apps-sort"></i>
              Side Ads Manager
            </NavLink>
          </div>
        </div>
        <div className="max-md:-mt-8 mt-5 w-full">
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default AdminPage;
