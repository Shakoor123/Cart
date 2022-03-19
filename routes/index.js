var express = require('express');
var router = express.Router();
var app = express();
const path = require('path');


// database Connection
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shakoor@2786",
  database:"cart"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("db Connected!");
});



/* GET home page. */
router.get('/', function (req, res, next) {
  var sql = `select * from products;`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    else{
      if(req.session.user){
        user=req.session.user;
        res.render('index', { result,user})
      }
    res.render('index', { result })
  }
  })

});
// Get login page
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    let er=req.session.err;
  res.render('login',{er})
  req.session.err=false
}
})
//post login page
router.post('/login',(req,res)=>{
  var sql=`select password,name from users where email="${req.body.email}"`;
  con.query(sql,(err,result)=>{
    if(err) throw err;
    else{
      if(result[0].password==req.body.password){
        console.log(result[0]);
        req.session.loggedIn=true
        req.session.user=result[0]
        res.redirect('/')
      }else{
        req.session.err=true
        res.redirect('/login')
      }

    }
  })
})
//get log out form
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/login')
})

// Get signup page
router.get('/signup',(req,res)=>{
  res.render('signup')
})
//POST sign up page
router.post('/signup', (req, res) => {
  console.log(req.body);
  if (req.body.password == req.body.pass) {
    var sql = `insert into users values("${req.body.email}","${req.body.name}","${req.body.password}")`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      else console.log("insert success");
    })
    res.redirect('/login')
  }else{
    
    res.redirect('/login')
  }
})

module.exports = router;
