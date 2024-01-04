/* eslint-disable react/prop-types */
import { getFullDay, getDayName } from "../common/date";
import { Link } from "react-router-dom";

const LatesArticles = ({ content, author }) => {
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
      className="flex gap-5 items-center border-b border-grey pb-2 mb-2"
    >
      <div className="aspect-square h-20 bg-grey">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
      <div className="w-full">
        <div className="flex items-center mb-1">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <div className="grid items-center pl-4">
            <p className="line-clamp-1 text-sm">{fullname}</p>
            <p className="line-clamp-1 text-[9px] opacity-50">
              {getDayName(publishedAt) + " " + getFullDay(publishedAt)}
            </p>
          </div>
        </div>

        <h1 className="blog-title-home text-xl opacity-90">{title}</h1>
      </div>
    </Link>
  );
};

export default LatesArticles;
