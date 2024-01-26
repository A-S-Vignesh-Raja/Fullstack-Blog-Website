import Post from "../post";
import { useEffect } from "react";

export default function IndexPage(){
    useEffect(()=>{
        fetch('/post').then(response =>{
            response.json().then(posts =>{
                console.log(posts);
            });
        });
    }, []);
    return(
        <>
            <Post />
            <Post />
            <Post />
        </>
    );
}