import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BlogPageContext } from "../pages/blog.page";
import { UserContext } from "../App";
import axios from "axios";

const BlogInteraction = () => {

    let { blog, blog: { title, _id, blog_id, activity, activity: { total_likes, total_comments }, author : { personal_info: { username: aurthorUsername } } }, setBlog, likedByUser, setLikedByUser, setCommentWrapper } = useContext(BlogPageContext);
    
    let { userAuth: { username, access_token } } = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {

        if(username){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { blog_id: _id }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({data: { result }}) => {
                setLikedByUser(Boolean(result));
            })
            .catch(err => {
                console.log(err)
            })
        }
        
    }, [username])

    const handleLike = () => {

        if ( access_token ) {
            setLikedByUser(Boolean(!likedByUser));

            !likedByUser ? total_likes++ : total_likes-- ;

            setBlog({ ...blog, activity: { ...activity, total_likes } });

            // like the post
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id , likedByUser: Boolean(likedByUser) }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`, 
                }
            })
            .then(({data}) => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            navigate("/signin")
        }

    }

    return (
        <>
            <hr className="border-grey my-2" />
            <div className="w-full p-1 px-5 flex items-center justify-between">

                <div className="flex gap-6">
                    <div className="flex gap-3 items-center">
                        <button onClick={handleLike} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${ likedByUser ? "bg-red/20 text-red" : "bg-grey/80" }`}>
                        <i className={`fi ${ likedByUser ? "fi-sr-heart" : "fi-rr-heart" } text-xl mt-2 pointer-events-none`}></i>
                        </button>
                        <p className="text-xl text-dark-grey">{total_likes}</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={() => setCommentWrapper(preVal => !preVal)}>
                        <i className="fi fi-rr-comment-dots text-xl mt-2"></i>
                        </button>
                        <p className="text-xl text-dark-grey">{total_comments}</p>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    { username == aurthorUsername ? 
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank" className="pt-2"><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
                </div>

            </div>
            <hr className="border-grey my-2" />
        </>
    )
}

export default BlogInteraction;