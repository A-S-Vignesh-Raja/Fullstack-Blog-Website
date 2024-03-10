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
const dotenv=require('dotenv');
dotenv.config();
const salt= bcrypt.genSaltSync(10);
const secret='kaudg127198iuwdh919edubLDJ';
const cloudinary=require('cloudinary');


app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+ '/uploads'));

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

mongoose.connect(process.env.MONGO_URI)

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

/*app.post('/post',uploadMiddleware.single('file'), async (req,res)=>{
    const {originalname,path}=req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath=path+'.'+ext;
    fs.renameSync(path, newPath);

    const token = req.cookies?.token
    jwt.verify(token,secret,{},async (err,info)=>{
        if (err) throw err;
        const {title,summary,content} = req.body;
        const Postdoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id
        });
        res.json({Postdoc});
    });
})*/
app.post('/post',uploadMiddleware.single('file'), async (req,res)=>{
    const {path}=req.file;
    const response=await cloudinary.uploader.upload(path);
    const {url} = response;
    console.log(url);
    // const parts = originalname.split('.');
    // const ext = parts[parts.length - 1];
    // const newPath=path+'.'+ext;
    // fs.renameSync(path, newPath);

    const token = req.cookies?.token
    jwt.verify(token,secret,{},async (err,info)=>{
        if (err) throw err;
        const {title,summary,content} = req.body;
        const Postdoc = await Post.create({
            title,
            summary,
            content,
            cover:url,
            author:info.id
        });
        fs.unlink(path,(err)=>{
            if(err){
                throw err;
            }
            console.log("file goneeeee")    
        });
        res.json({Postdoc});
    });
})

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {path} = req.file;
      const response=await cloudinary.uploader.upload(path);
      const {url} = response;
      newPath=url;
    //   const parts = originalname.split('.');
    //   const ext = parts[parts.length - 1];
    //   newPath = path+'.'+ext;
    //   fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
    
      if(newPath==null){
        await Post.findByIdAndUpdate(id,{title,summary,content})
      }
      else{
        await Post.findByIdAndUpdate(id,{title,summary,content,cover:newPath})
      }
  

      res.json(postDoc);
    });
  
  });
  

app.get('/post',async(req,res)=>{ 
    res.json(
        await Post.find()
        .populate('author' , ['username'])
        .sort({createdAt:-1})
        .limit(20)
        );
})

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

app.get('/delete/:id',async(req,res)=>{
    const {id}=req.params;
    await Post.findByIdAndDelete(id)
    res.status(204);
})
  
app.listen(4040,()=>{
    console.log("server started ");
});

