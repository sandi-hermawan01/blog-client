import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";

export const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: { } }
}

export const EditorContext = createContext({});

const Editor = () =>{

    let { blog_id } = useParams();

    const [ editorState, setEditorState ] = useState("editor");
    const [ loading, setLoading ] = useState(true);
    const [blog, setBlog] = useState(blogStructure);
    const [textEditor, setTextEditor] = useState({ isReady: false });

    let { userAuth: { access_token } } = useContext(UserContext);

    useEffect(() => {

        if(!blog_id){
            return setLoading(false);
        } 

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id, draft: true, mode: 'edit' })
        .then(({ data: { blog } }) => {
            setBlog(blog);
            setLoading(false);
        })
        .catch(() => {
            setBlog(null);
            setLoading(false);
        });
        
    }, [])

    
    return (
        <EditorContext.Provider value={{ editorState, setEditorState, blog, setBlog, textEditor, setTextEditor }}>
            {
                loading ? <Loader /> :
                    blog === null ? <Navigate to="/page-not-found" /> :
                        access_token === null ? <Navigate to="/signin" /> :
                            editorState == "editor" ? <BlogEditor /> : <PublishForm /> 
            }
        </EditorContext.Provider>
    )
}

export default Editor;