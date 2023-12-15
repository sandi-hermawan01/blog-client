/* eslint-disable react-refresh/only-export-components */
import { useContext } from "react";
import { BlogPageContext } from "../pages/blog.page";
import CommentCard from "./comment-card.component";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";
import CommentField from "./comment-field.component";
import axios from "axios";

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFunc, arr = null}) => {

    let res;
    
    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip })
    .then(async ({ data }) => {
        
        data.map(comment => {
            comment.childrenLevel = 0;
        })

        setParentCommentCountFunc(preVal => preVal + data.length)

        if(arr == null){
            res = { results: data };
        } else{
            res = { results: [ ...arr, ...data ] }
        }

    })
    .catch(err => {
        console.log(err)
        res = { err: "Got error while fetching comments" }
    })

    return res;
}

const CommentsContainer = () => {

    let { commentWrapper, setCommentWrapper, blog, blog: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setBlog } = useContext(BlogPageContext);

    const loadMoreComments = async () => {

        let newCommentsArr = await fetchComments({ skip: totalParentCommentsLoaded, blog_id: _id, setParentCommentCountFunc: setTotalParentCommentsLoaded , arr: commentsArr})

        setBlog({ ...blog, comments: newCommentsArr })
    }
    
    return (

        <div className={`max-sm:w-full fixed ${ commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]" } duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-10 overflow-y-auto overflow-x-hidden`}>
        
            <div className="relative">
                <h1 className="text-xl font-medium "> Comments </h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1"> {title} </p>

                <button className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={() =>  setCommentWrapper(false)}><i className="fi fi-br-cross-small text-2xl mt-1"></i></button>
            </div>

            <hr className="border-grey my-8 w-[120%] -ml-10" />
            
            <CommentField action="Comment" />

            {
                commentsArr && commentsArr.length ? 
                commentsArr.map((comment, i) => {
                    return <AnimationWrapper key={i}><CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} /></AnimationWrapper>;
                }) : <NoDataMessage message="No Comments" />
            }

            {
                total_parent_comments > totalParentCommentsLoaded ?
                <button onClick={loadMoreComments} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"> Load More </button>
                : ""
            }

        </div>
    )
}

export default CommentsContainer;