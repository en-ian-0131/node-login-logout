//備份
const express = require('express');
const server = express();
const db = require('./module/db-connect');
const multer = require('multer');
const session = require('express-session')
const bcrypt = require('bcryptjs');

server.set('view engine','ejs');

//middleware
server.use(express.urlencoded({extended:false}))
server.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'nlrjviljfljnkjmsdo623gb3g3n2t32b',
    cookie:{
        maxAge:120_000
    }
}))
server.use((req,res,next)=>{
    res.locals.session=req.session;
    next();
})


//route
server.get('/',(req,res)=>{
    // res.send(`<h1>Hello world~ </h1>`)
    if(!req.session.admin){
         res.render('main',{name:'請先登入~',title:''});
    }else{
        res.render('main',{name:`${req.session.admin.account}`,title:'歡迎回來~'});
    }
   
})

server.get('/try-db',async (req,res)=>{
    const sql = 'SELECT * from admins';
    const [rows] = await db.query(sql);
    res.json(rows);
})

// const urlencoded = express.urlencoded({extended:false});
server.post('/try-post',(req,res)=>{
    console.log({body:req.body})
    res.json({body:req.body});
})


server.get('/try-sess',(req,res)=>{
    req.session.mysess = req.session.mysess || 0;
    req.session.mysess++;
    res.send(req.session)
})


server.get('/login',(req,res)=>{
    res.render('login')
})


//use URLSearchParams to parse application/x-www-form-urlencoded
server.post('/login',async (req,res)=>{
//    console.log(req.body);
   
   output={
    success:false,
    code:0,
    postData:req.body,
    error:'帳號密碼錯誤!!'
   }
   
   const sql = 'SELECT * FROM admins WHERE account=?';
   const [rows] = await db.query(sql,[req.body.account]);
   if(!rows.length){
    output.code = 401;
    return res.json(output);
   }
//    console.log(rows);
   if(!await bcrypt.compare(req.body.password,rows[0].password_hash)){
    output.code=402;
    output.error='密碼錯誤!!'
    res.json(output);
   }else{
    output.code=200;
    output.success=true;
    output.error='';
    req.session.admin = {
        sid:rows[0].sid,
        account:rows[0].account
    }
    res.json(output);
   }
  
})

//use multer to parse multipart/form-data
const BP = multer();
server.post('/loginFormData',BP.none(),(req,res)=>{
    console.log(req.body);
    res.json(req.body);
})
server.get('/logout',(req,res)=>{
    delete req.session.admin;
    res.redirect('/');
})

server.use(express.static('public'))
server.use(express.static('node_modules/bootstrap/dist'))

server.listen('3002',()=>{
    console.log('3002啟動')
})