/* eslint-disable no-undef */
import AnimationWrapper from "../common/page-animation";
import InPageNavigation, {
  activeTabRef,
} from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import BlogPostCard from "../components/blog-post.component";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import LoadMoreDataBtn from "../components/load-more.component";
import CarouselComponent from "../components/carousel.component";
import wutheringDanjinMp4 from "../imgs/wuthering-danjin.mp4";
import watches from "../imgs/watches.png";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");
  const slides = [
    "https://test-bucket-123435.s3.ap-south-1.amazonaws.com/08z_vSQFWdw6t0XBl3A03-1702255083547.jpeg",
    "https://test-bucket-123435.s3.ap-south-1.amazonaws.com/kvc6TXigLgIUwP_nMUuy--1702255375098.jpeg",
    "https://test-bucket-123435.s3.ap-south-1.amazonaws.com/6lHa09Q5bdp5jLbSN2HzM-1702255443755.jpeg",
  ];
  const slidMp4 =
    "https://test-bucket-123435.s3.ap-south-1.amazonaws.com/wuthering-danjin.mp4";

  let categories = [
    "personal",
    "programming",
    "government",
    "cooking",
    "technology",
    "finances",
    "travel",
    "games",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    // latest blogs
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          arr: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        // console.log("test", formatedData.totalDocs);
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          arr: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });

        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    //trending blogs
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState != "home") {
      fetchBlogsByCategory(pageState);
      return;
    }

    fetchLatestBlogs({ page: 1 });

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  const TrendingBlogsWrapper = () => {
    return trendingBlogs == null ? (
      <Loader />
    ) : trendingBlogs.length ? (
      trendingBlogs.map((blog, i) => {
        return (
          <AnimationWrapper key={i}>
            <MinimalBlogPost blog={blog} index={i} />
          </AnimationWrapper>
        );
      })
    ) : (
      <NoDataMessage message="No Trending Blogs Found" />
    );
  };

  const loadBlogbyCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="flex min-w-[30%] lg:min-w-[300px] max-w-min border-l border-r border-grey px-3 pt-3 max-md:hidden">
          <div className="flex flex-col gap-5 w-80">
            <div className="mb-4 border-grey text-center ">
              <h1 className="font-medium text-xl ">Advertisement</h1>
              <div className="border border-grey rounded-lg min-h-full mt-3 px-3 pt-3">
                <img src={watches}></img>
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-4 mt-4">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper key={i}>
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No Trending Blogs Found" />
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "Trending Blogs"]}
            defaultHidden={["Trending Blogs"]}
          >
            <>
              {/* carousel state */}
              <div className="max-w-full pb-6">
                <div className="max-w-full">
                  <CarouselComponent autoSlide={true} autoSlideInterval={3000}>
                    {[
                      ...slides.map((s) => <img key={s} src={s} />),
                      <video src={slidMp4} key={slidMp4} autoPlay muted loop />,
                    ]}
                  </CarouselComponent>
                </div>
              </div>
              {/* --------------- */}
              <div className="mb-6 border-b border-grey pb-6">
                <h1 className="font-medium text-xl mb-4">
                  Tags from all interests
                </h1>
                <div
                  className={`flex gap-3 flex-wrap text-center justify-center md:justify-normal`}
                >
                  {categories.map((category, i) => {
                    return (
                      <button
                        key={i}
                        onClick={loadBlogbyCategory}
                        className={
                          "tag " +
                          (pageState == category ? "bg-black text-white" : "")
                        }
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No blogs pushlished" />
              )}
              <LoadMoreDataBtn
                dataArr={blogs}
                fetchDataFunc={
                  pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>

            <TrendingBlogsWrapper />
          </InPageNavigation>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
