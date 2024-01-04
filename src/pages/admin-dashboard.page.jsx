import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import LatesArticles from "../components/admin-latest-articles.component";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader.component";
import { filterPaginationData } from "../common/filter-pagination-data";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState(null);
  const [pageState] = useState("home");
  const totalDocs = blogs?.totalDocs;

  const fetchLatestBlogs = ({ page = 1 }) => {
    // latest blogs
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs-admin", {
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          arr: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log("test", dataUsers);

  useEffect(() => {
    fetchLatestBlogs({ page: 1 });
  }, [pageState]);

  return (
    <div className="pl-5 pr-5">
      <h1 className="text-xl text-dark-grey mb-3 pb-3 border-b-2 border-grey">
        Dashboard
      </h1>

      <div className="flex max-sm:flex-col gap-10 justify-center items-center mt-10">
        <div className="flex items-center p-4 w-72 h-32 border-2 border-grey rounded-xl shadow-sm shadow-gray-50">
          <i className="fi fi-rr-user text-5xl mt-3 opacity-70"></i>
          <ul className="ml-3">
            <h1 className=" text-2xl text-dark-grey font-light">1.234</h1>
            <h1 className=" text-xl text-dark-grey">Total User</h1>
          </ul>
        </div>
        <div className="flex items-center p-4 w-72 h-32 border-2 border-grey rounded-xl shadow-sm shadow-gray-50">
          <i className="fi fi-rr-users-alt text-5xl mt-3 opacity-70"></i>
          <ul className="ml-4">
            <h1 className=" text-2xl text-dark-grey font-light">999</h1>
            <h1 className=" text-xl text-dark-grey">Total Members</h1>
          </ul>
        </div>
        <div className="flex items-center p-4 w-72 h-32 border-2 border-grey rounded-xl shadow-sm shadow-gray-50">
          <i className="fi fi-rr-blog-pencil text-5xl mt-3 opacity-70"></i>
          <ul className="ml-4">
            <h1 className=" text-2xl text-dark-grey font-light">{totalDocs}</h1>
            <h1 className=" text-xl text-dark-grey">Total Articles</h1>
          </ul>
        </div>
      </div>
      <div className="flex max-sm:flex-col w-full h-[42vh] mt-5  p-2 pl-4 pr-4 gap-8">
        <div className="w-full h-full border-2 border-grey p-3">
          <h1 className="text-xl text-dark-grey border-b-2 border-grey pb-2">
            Latest Users
          </h1>
          <div className="flex mt-3">
            <i className="fi fi-rr-user text-3xl mt-1 opacity-70"></i>
            <ul className="ml-2">
              <h1 className="opacity-80">username1</h1>
              <p className=" text-sm opacity-50">Saturday 16 Dec 2023</p>
            </ul>
          </div>
          <div className="flex mt-3">
            <i className="fi fi-rr-user text-3xl mt-1 opacity-70"></i>
            <ul className="ml-2">
              <h1 className="opacity-80">username2</h1>
              <p className=" text-sm opacity-50">Saturday 10 Dec 2023</p>
            </ul>
          </div>
          <div className="flex mt-3">
            <i className="fi fi-rr-user text-3xl mt-1 opacity-70"></i>
            <ul className="ml-2">
              <h1 className="opacity-80">username3</h1>
              <p className=" text-sm opacity-50">Saturday 3 Dec 2023</p>
            </ul>
          </div>
        </div>
        <div className="w-full h-auto border-2 border-grey p-3">
          <h1 className="text-xl text-dark-grey border-b-2 border-grey pb-2">
            Latest Articles
          </h1>
          <div className="flex flex-col mt-3 gap-3">
            {blogs == null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                    <LatesArticles
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No blogs pushlished" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
