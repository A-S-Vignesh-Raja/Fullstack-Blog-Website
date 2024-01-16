import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'

export default function CreatePost(){
    const [title,setTitle] = useState('');
    const [summary,setSummary]= useState('');
    const [content,setContent]= useState('');
    return(
        <form>
            <input type="title"  
                placeholder={'Title'} 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}/>
            <input type="summary" 
                placeholder={'Summary'} 
                value={summary}
                onChange={ev => setSummary(ev.target.value)}/>
            <input type="file" onChange={ev => setFiles(ev.target.files)} />
            <ReactQuill value={content} />
            <button style={{marginTop:"7px"}}>Create Post</button>
        </form>
    );
}