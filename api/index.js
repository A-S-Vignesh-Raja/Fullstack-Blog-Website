const express = require('express');
const app=express();
const mongoose=require('mongoose');
const User=require('./models/user');
const bcrypt=require('bcryptjs');
const cors=require('cors');
const jwt=require('jsonwebtoken'); 

const salt= bcrypt.genSaltSync(10);
const secret='kaudg127198iuwdh919edubLDJ';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

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
    const userdoc=await User.findOne({username});
    const passok=bcrypt.compareSync(password, userdoc.password);
    if(passok){
        jwt.sign({username,id:userdoc._id}, secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token', token).json('ok');
        } );
    }else{
        res.status(400).json("wrong credentials")
    }
});

app.listen(4040,()=>{
    console.log("server started ");
});

//mongodb+srv://asvigneshraja:viki2003@cluster0.xfegulv.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://asvigneshraja:viki2003@cluster0.xfegulv.mongodb.net/