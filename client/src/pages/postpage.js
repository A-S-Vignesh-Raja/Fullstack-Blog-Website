import { useContext, useEffect,useState } from "react";
import { useParams,Link, useNavigate } from "react-router-dom";
import { formatISO9075} from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage(){
    const [postInfo,setPostInfo] = useState(null);
    const {userInfo} =  useContext(UserContext);
    const {id} = useParams();
    const navigate=useNavigate();

    useEffect(()=>{
        fetch(`http://localhost:4040/post/${id}`)
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            });
        });
    },[]);

    function handleDelete(ev){
        ev.preventDefault();
        fetch(`http://localhost:4040/delete/${id}`,{method:'DELETE'})
        .then(response => {
            response.json()
            .then(response =>{
                console.log(response)
            })
        })
        navigate("/");

    }

    if (!postInfo) return '';
    console.log(postInfo.cover);
    return(
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo && userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit this post
                    </Link>
                    <div>
                        <button className="delete" onClick={handleDelete}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>

                </div>
            )}
            <div className="image">
                <img src={`${postInfo.cover}`} alt=""/>
                
            </div>
            
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
        </div>
    );
    
}