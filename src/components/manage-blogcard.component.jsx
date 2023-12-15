import { useContext, useState } from "react";
import { getDay, getDayName } from "../common/date";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";

export const ManageDraftBlogPost = ({ blog }) => {
  let { title, blog_id, des, index } = blog;
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  index++;

  return (
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
      <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? "0" + index : index}
      </h1>
      <div>
        <h1 className="blog-title mb-3">{title}</h1>
        <p className="line-clamp-2 font-gelasio">
          {des.length ? des : "No Description-"}
        </p>

        <div className="flex gap-6 mt-3">
          <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
            Edit
          </Link>
          <button
            className="pr-4 py-2 underline text-red"
            onClick={(e) => deleteBlog(blog, access_token, e.target)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogStats = ({ stats }) => {
  return (
    <div className="flex gap-2">
      {Object.keys(stats).map((info, i) => {
        return !info.includes("parent") ? (
          <div
            key={i}
            className={
              "flex flex-col items-center w-full h-full justify-center p-4 px-6" +
              (i == 1 ? " border-grey border-r border-l " : "")
            }
          >
            <h1 className="text-xl lg:text-2xl mb-2">
              {stats[info].toLocaleString()}
            </h1>
            <p className="max-lg:text-dark-grey capitalize">
              {" "}
              {info.split("_")[1]}{" "}
            </p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};

const deleteBlog = (blog, access_token, target) => {
  let { index, blog_id, setBlogArr } = blog;

  target.setAttribute("disabled", true);

  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog",
      { blog_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(({ data }) => {
      target.removeAttribute("disabled");
      setBlogArr((preVal) => {
        let { deletedDocCount, totalDocs, results } = preVal;

        results.splice(index, 1);

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return {
          ...preVal,
          totalDocs: totalDocs - 1,
          deletedDocCount: deletedDocCount + 1,
        };
      });
    })
    .catch((err) => {
      try {
        if (err.response.data.error) {
          toast.error(err.response.data.error);
        }
      } catch (err) {
        //
      }
      console.log(err);
    });
};

export const ManagePublishedBlogPost = ({ blog }) => {
  let { title, banner, publishedAt, blog_id, activity } = blog;
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const [showState, setShowState] = useState(false);
  //   console.log("test", activity.total_likes);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link to={`/blog/${blog_id}`}>
              <h1 className="blog-title mb-4 hover:underline">{title}</h1>
            </Link>
            <p className="line-clamp-1">
              Published on {getDay(publishedAt)}, {getDayName(publishedAt)}{" "}
            </p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>
            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowState((preVal) => !preVal)}
            >
              Stats
            </button>
            <button
              className="pr-4 py-2 underline text-red"
              onClick={(e) => deleteBlog(blog, access_token, e.target)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>
      {showState ? (
        <div className="lg:hidden">
          <BlogStats stats={activity} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
