import {Link} from "react-router-dom";
import {useEffect, useState} from 'react';

export default function Header(){
  const [username,setUsername]=useState(null);
    useEffect(()=>{
      fetch('http://localhost:4040/profile',{
        credentials:'include',
      }).then(response=>{
        response.json().then(userInfo=>{
          setUsername(userInfo.username);
        });
      });

    },[]);

    function logout(){
      fetch('http://localhost:4040/logout',{
        credentials:'include',
        method:'POST',
      });
      setUsername(null);
    }

    return (
        <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav>
          {username &&(
            <>
              <Link to="/create">Create new Post</Link>
              <a onClick={logout}>Logout</a>
            </>
          )}
          {!username &&(
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          
        </nav>
      </header>
    );
}