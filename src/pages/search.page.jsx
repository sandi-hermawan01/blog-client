import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import UserCard from "../components/usercard.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const SearchPage = () => {

    let { query } = useParams();

    const [ blogs, setBlogs ] = useState(null);
    const [ users, setUsers ] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
        .then(async ({data}) => {

            let formatedData = await filterPaginationData({
                arr: blogs, 
                data: data.blogs, 
                page,
                create_new_arr,
                countRoute: "/search-blogs-count",
                data_to_send: { query }
            })

            setBlogs(formatedData)

        })
        .catch(err => {
            console.log(err);
            toast.error("Not able to search blogs at this moment");
        })

    }

    useEffect(() => {

        resetPage()

        searchBlogs({ create_new_arr: true });

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
        .then(({ data: { users }}) => {
            setUsers(users)
        })
        .catch(err => {
            toast.error("Not able to search users at this moment");
            console.log(err);
        })

    }, [query])

    const resetPage = () => {
        setBlogs(null);
        setUsers(null);
    }

    const UserCardsWrapper = () => {
        return (
            <>
                {   
                    users == null ? <Loader /> : 
                        users.length ? 
                            users.map((user, i) => {
                                return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }} ><UserCard user={user} /></AnimationWrapper>
                            })
                        :  <NoDataMessage message="No Users Found" />
                } 
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <Toaster/>
            
            <div className="w-full">
                <InPageNavigation routes={ [`Search Results for "${query}"`, "Accounts Matched"] } defaultHidden={["Accounts Matched"]}>
                    
                    <>
                        {   
                            blogs == null ? <Loader /> : 
                                blogs.results.length ? 
                                    blogs.results.map((blog, i) => {
                                        return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }} ><BlogPostCard content={blog} author={blog.author.personal_info} /></AnimationWrapper>
                                    })
                                :  <NoDataMessage message="No blogs pushlished" />
                        } 

                        <LoadMoreDataBtn dataArr={blogs} fetchDataFunc={searchBlogs} />
                    </>

                    <UserCardsWrapper />
                

                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                <h1 className="font-medium text-xl mb-8">Users related to search <i className="fi fi-rr-user ml-2 mt-1"></i></h1>

                <UserCardsWrapper />

            </div>

        </section>
    )
}

export default SearchPage;