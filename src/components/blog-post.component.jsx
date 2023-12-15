/* eslint-disable react/prop-types */
import { getFullDay, getDayName } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { profile_img, fullname } = author;
  // console.log("test", publishedAt);

  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
    >
      <div className="aspect-square h-40 bg-grey">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
      <div className="w-full">
        <div className="flex items-center mb-3">
          <img src={profile_img} className="w-8 h-8 rounded-full" />
          <div className="grid items-center pl-4">
            <p className="line-clamp-1">{fullname}</p>
            <p className="line-clamp-1 text-sm opacity-50">
              {getDayName(publishedAt) + " " + getFullDay(publishedAt)}
            </p>
          </div>
        </div>

        <h1 className="blog-title-home">{title}</h1>

        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="mt-4 flex gap-4">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="btn-light py-1 px-4 max-sm:hidden">{tags[1]}</span>
          <span className="btn-light py-1 px-4 max-sm:hidden">{tags[2]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
