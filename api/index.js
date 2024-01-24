const express = require('express');
const app=express();
const mongoose=require('mongoose');
const User=require('./models/user');
const Post = require('./models/post')
const bcrypt=require('bcryptjs');
const cors=require('cors');
const jwt=require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const salt= bcrypt.genSaltSync(10);
const secret='kaudg127198iuwdh919edubLDJ';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://asvigneshraja:viki2003@cluster0.xfegulv.mongodb.net/')

app.post('/register', async (req,res)=>{
    const {username,password}=req.body;
    try{
        const userdoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userdoc);
    } catch(e){
        res.status(400).json(e);
    }
});

app.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    console.log(username,password);
    const userdoc=await User.findOne({username});
    const passok=bcrypt.compareSync(password, userdoc.password);
    if(passok){
        jwt.sign({username,id:userdoc._id}, secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token', token).json({
                id:userdoc._id,
                username,
            });
        } );
    }else{
        res.status(400).json("wrong credentials")
    }
});

app.get('/profile',(req,res)=>{
    const token = req.cookies?.token
        if(token){
            jwt.verify(token,secret,{},(err,info)=>{
                if (err) throw err;
                res.json(info);
            });
        } else{
            res.status(401).json("unauthorized");
        }
    
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.post('/post',uploadMiddleware.single('file'), async (req,res)=>{
    const {originalname,path}=req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath=path+'.'+ext;
    fs.renameSync(path, newPath);

    const {title,summary,content} = req.body;
    const Postdoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
    });

    res.json({Postdoc});
})

app.listen(4040,()=>{
    console.log("server started ");
});

//mongodb+srv://asvigneshraja:viki2003@cluster0.xfegulv.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://asvigneshraja:viki2003@cluster0.xfegulv.mongodb.net/