import Post from "../post";
import { useEffect } from "react";

export default function IndexPage(){
    const [posts,setPosts]= useState([]);
    useEffect(()=>{
        fetch('http://localhost:4040/post').then(response =>{
            response.json().then(posts =>{
                setPosts(posts);
            });
        });
    }, []);
    return(
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
            ))}
        </>
    );
}