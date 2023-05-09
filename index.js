const express = require('express');

const server = express();
const db = require('./module/db-connect');
const multer = require('multer');

server.set('view engine','ejs');

server.get('/',(req,res)=>{
    // res.send(`<h1>Hello world~ </h1>`)
    res.render('main',{name:'請先登入~'});
})

server.get('/try-db',async (req,res)=>{
    const sql = 'SELECT * from admins';
    const [rows] = await db.query(sql);
    res.json(rows);
})

const urlencoded = express.urlencoded({extended:false});
server.post('/try-post',urlencoded,(req,res)=>{
    console.log({body:req.body})
    res.json({body:req.body});
})


server.get('/login',(req,res)=>{
    res.render('login')
})


//use URLSearchParams to parse application/x-www-form-urlencoded
server.post('/login',urlencoded,(req,res)=>{
    console.log(req.body);
    res.json(req.body);
})

//use multer to parse multipart/form-data
const BP = multer();
server.post('/loginFormData',BP.none(),(req,res)=>{
    console.log(req.body);
    res.json(req.body);
})
server.get('/logout',(req,res)=>{
    
})

server.use(express.static('public'))
server.use(express.static('node_modules/bootstrap/dist'))

server.listen('3002',()=>{
    console.log('3002啟動')
})