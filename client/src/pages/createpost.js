import { useState } from "react";
import ReactQuill from "react-quill";
import {Navigate} from "react-router-dom";
import 'react-quill/dist/quill.snow.css'

export default function CreatePost(){
    const [title,setTitle] = useState('');
    const [summary,setSummary]= useState('');
    const [content,setContent]= useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect]=useState(false);
    async function createNewPost(ev){
        const data = new FormData();
        data.set('title', title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('file',files[0]);

        ev.preventDefault();
        const response = await fetch('http://localhost:4040/post', {
            method:'POST',
            body:data,
        });
        if(response.ok){
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
      }
    return(
        <form onSubmit={createNewPost}>
            <input type="title"  
                placeholder={'Title'} 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}/>
            <input type="summary" 
                placeholder={'Summary'} 
                value={summary}
                onChange={ev => setSummary(ev.target.value)}/>
            <input type="file"
                onChange={ev => setFiles(ev.target.files)} />
            <ReactQuill value={content} onChange={setContent}/>
            <button style={{marginTop:"7px"}}>Create Post</button>
        </form>
    );
}