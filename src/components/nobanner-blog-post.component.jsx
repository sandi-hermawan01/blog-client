/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

export const MinimalBlogPost = ({ blog, index }) => {
  let {
    author: {
      personal_info: { fullname, username: profile_username, profile_img },
    },
    blog_id,
    publishedAt,
    title,
    activity: { total_reads, total_likes },
  } = blog;

  index++;

  return (
    <Link
      to={`/blog/${blog_id}`}
      className="flex border border-grey rounded-3xl gap-5 px-4 pt-4 pb-1 mb-3"
    >
      {/* <h1 className="blog-index ">{index < 10 ? "0" + index : index}</h1> */}
      <div>
        <div className="flex gap-2 items-center mb-4">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{profile_username}
          </p>
          <p className=" min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
        <p className=" min-w-fit opacity-40 mt-1 mb-2">
          {total_reads} reads {total_likes} likes
        </p>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
