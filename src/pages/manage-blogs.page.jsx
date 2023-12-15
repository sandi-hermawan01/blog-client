import { useContext, useEffect, useState } from "react";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import { ManagePublishedBlogPost, ManageDraftBlogPost } from "../components/manage-blogcard.component";
import AnimationWrapper from "../common/page-animation";
import axios from "axios";
import { UserContext } from "../App";
import NoDataMessage from "../components/nodata.component";
import { Toaster } from "react-hot-toast";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () =>{

    let activePage = useSearchParams()[0].get("tab");

    const [ blogs, setBlogs ] = useState(null);
    const [ drafts, setDrafts ] = useState(null);
    const [ query, setQuery ] = useState();

    let { userAuth: { access_token } } = useContext(UserContext);

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", { 
            page: page, 
            draft,
            query,
            deletedDocCount
        } , {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(async ( { data }) => {

            let formatedData = await filterPaginationData({
                arr: draft ? drafts : blogs, 
                data: data.blogs,
                page,
                user: access_token,
                countRoute: "/user-written-blogs-count",
                data_to_send: { draft, query }
            })

            if (draft) {
                setDrafts(formatedData);
            } else {
                setBlogs(formatedData);
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        
        if(access_token) {
            if(blogs == null){
                getBlogs({ page: 1, draft: false })
            }
            if(drafts == null){
                getBlogs({ page: 1, draft: true })
            }
        }

    }, [access_token, blogs, drafts, query])

    const handleSearch = (e) => {
        let searchQuery = e.target.value

        setQuery(searchQuery);

        if(e.keyCode == 13 && searchQuery.length) { // enter key   
            setBlogs(null);
            setDrafts(null);            
        }

    }

    const handleChange = (e) => {
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDrafts(null);   
        }
    }

    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>

            <Toaster />
            
            <div className="relative max-md:mt-5 md:mt-8 mb-10" id="searchBox">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Blogs"
                    onKeyDown={handleSearch}
                    onChange={handleChange}
                />

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>

            <InPageNavigation routes={["Published Blogs", "Drafts"]} defaultActiveIndex={ activePage != 'draft' ? 0 : 1 } >

                {   // published blog cards
                    blogs == null ? <Loader /> :
                    blogs.results.length ? 
                        <>
                            {
                                blogs.results.map((blog, i) => {
                                return <AnimationWrapper key={i} transition={{delay: i * 0.04}}>
                                            <ManagePublishedBlogPost blog={{ ...blog, setBlogArr: setBlogs, index: i }} />
                                    </AnimationWrapper>
                                })
                            }
                            
                            <LoadMoreDataBtn dataArr={blogs} fetchDataFunc={getBlogs} additionalParams={{ draft: false, deletedDocCount: blogs.deletedDocCount }}/>

                        </>
                    : <NoDataMessage message="No published blogs" /> 
                }


                {   // draft blog cards
                    drafts == null ? <Loader /> :
                    drafts.results.length ? 
                        <>
                            {
                                drafts.results.map((blog, i) => {
                                return <AnimationWrapper key={i} transition={{delay: i * 0.04}}>
                                            <ManageDraftBlogPost blog={{ ...blog, setBlogArr: setDrafts, index: i }} />
                                    </AnimationWrapper>
                                })
                            }
                            
                            <LoadMoreDataBtn dataArr={drafts} fetchDataFunc={getBlogs} additionalParams={{ draft: true, deletedDocCount: drafts.deletedDocCount }}/>

                        </>
                    : <NoDataMessage message="Nothing in draft" /> 
                }

            </InPageNavigation>

        </>
    )
}

export default ManageBlogs;