var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
app.use(fileUpload());



const multer=require('multer');
const storage=multer.diskStorage({
  destination:'./public/images',
  filename:(req,file,cb)=>{
    return cb(null,`pic_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload=multer({
  storage:storage
});
//app.use(express.static(path.join(__dirname, 'public/images')));
//app.use('/profile',express.static('./public/images'));
// database Connection
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shakoor@2786"
});

con.connect(function(err) {
  if (err) throw err;
  // con.query("CREATE DATABASE cart", function (err, result) {
  //   if (err) throw err;
  //});
  con.query("use cart", function (err, result) {
    if (err) throw err;

  });
  // var sql = "CREATE TABLE product(id int NOT NULL,title VARCHAR(255),discription VARCHAR(255),price int NOT NULL)";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });
});
//admin login
router.get('/', function(req, res, next) {
  res.render('admin/loginA');
});
//admin checking
router.post('/loginA',(req, res)=>{
  if(req.body.aname=="shakoor" && req.body.apassword=="chachu"){
    req.session.admin="ADMIN";
    res.redirect('/users/home')
  }
  res.redirect('/users/')
});
router.get('/home', function(req, res, next) {
  var sql=`select * from products`;
  con.query(sql,(err,result)=>{
    if(err) throw err
    else
    res.render('admin/home',{result});
    
  })
  
});

//add product-page
router.get('/insert', function(req, res, next) {
  res.render('admin/insert');
});
//get all orders
router.get('/all_orders',(req,res)=>{
  res.render('admin/all_orders')
})

//get all users
router.get('/all_users',(req,res)=>{
  var sql=`select * from users`;
  con.query(sql,(err,result)=>{
    if(err) throw err;
    else {
      console.log(result);
      res.render('admin/all_users',{result})
    }
  })
  
})



app.use('/profile',express.static('public/images'));
// inserting the product items
router.post('/insert',upload.single('pic'),(req,res)=>{
var sql=`insert into products values("${req.body.title}","${req.body.discription}","${req.body.price}","${req.file.filename}")`
con.query(sql,(err,result)=>{
  if(err) throw err;
  else {
    console.log("insert success");
    req.session.insert=true;
  }
})
res.redirect('/users/insert')
})

// delete the product item
router.get('/delete-product/:name',(req,res)=>{
  let proName=req.params.name;
  var sql=`delete from products where title="${proName}"`;
  con.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      res.redirect('/users/home')
    }
  })
})











module.exports = router;

