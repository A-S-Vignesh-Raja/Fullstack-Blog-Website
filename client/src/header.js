import {Link} from "react-router-dom";
import { useContext, useEffect, useState} from 'react';
import { UserContext } from "./UserContext";
import logo from "./logo.png";


export default function Header(){
    const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(()=>{
      fetch(`${process.env.REACT_APP_API_URL}/profile`,{
        credentials:'include',
      }).then(response=>{
        response.json().then(userInfo=>{
          setUserInfo(userInfo);
        });
      });

    },[]);
    

    function logout(){
      fetch(`${process.env.REACT_APP_API_URL}/logout`,{
        credentials:'include',
        method:'POST',
      });
      setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header>
        <Link to="/" className="logo"><img src={logo}></img></Link>
        <nav>
          {username &&(
            <>
              <Link to="/create" className="create">Create new Post</Link>
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
