import { Outlet, Link, useNavigate } from "react-router-dom";
import logo from "../imgs/personal-brand-logo.jpg";
import defaultUserProfileImg from "../imgs/personal-brand-logo.jpg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import UserNavigationLinks from "./user-navigation.component";
import axios from "axios";

const AdminNav = () => {
  let [userNavPanel, setUserNavPanel] = useState(false);

  let navigate = useNavigate();

  const {
    userAuth,
    userAuth: { access_token, profile_img, new_notifications_available },
    setUserAuth,
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notifications", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [access_token]);

  const handleClick = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      // enter key
      navigate(`/search/${query}`);
    }
  };

  const handleImageLoadError = (e) => {
    e.target.src = defaultUserProfileImg;
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex w-18 h-10 items-end justify-end">
          <img src={logo} className="w-full" />
          <h1 className="logotitle ml-2">sans</h1>
        </Link>
        <h1 className="max-md:hidden">in development</h1>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button>
            <i className="fi fi-rr-search md:hidden text-2xl bg-grey w-12 h-12 rounded-full flex items-center justify-center"></i>
          </button>

          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-envelope-dot text-2xl block mt-1"></i>
                  {userAuth ? (
                    new_notifications_available ? (
                      <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </button>
              </Link>

              <div
                className="relative"
                tabIndex={0}
                onClick={handleClick}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    onError={handleImageLoadError}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>

                {userNavPanel ? <UserNavigationLinks /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default AdminNav;
