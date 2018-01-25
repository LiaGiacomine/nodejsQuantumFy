var mysql = require("mysql");
var express = require("express");
var login = require('./login');
var blog = require('./blog');
var committee = require('./committee');
var papers = require('./papers');
var router = express.Router();

//Set up connection with database
var db = mysql.createConnection({
    host : "localhost",
    user : "liandragiacomine",
    password : "password",
    port: 3306,
    database : "arxiv_papers"
});


module.exports = function(app) {

    /*
        RENDER ALL PAGES:
        HTML, CSS, JS
    */

    app.get("/", function(req,res, next){
        res.render("pages/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/committee", function(req,res, next){
        res.render("pages/committee", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/committee/individual/:committee", function(req, res, next){
        res.render("pages/individual_committee",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/blog", function(req,res, next){
        res.render("pages/blog", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/blog/news", function(req,res, next){
        res.render("pages/blog/news", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/blog/summaries", function(req,res, next){
        res.render("pages/blog/summaries", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/blog/write_summary", function(req,res, next){
        res.render("pages/blog/write_summary", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });


    app.get("/blog/rankings", function(req,res, next){
        res.render("pages/blog/rankings", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    /*
        LOGIN PAGES
    */

    app.get("/login/user", function(req,res, next){
        res.render("pages/login/user", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None"
        });
        next();
    });

    app.get("/login/author", function(req,res, next){
        res.render("pages/login/author", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None"
        });
        next();
    });

    app.get("/login/admin", function(req,res, next){
        res.render("pages/login/admin", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None"
        });
        next();
    });

    app.get("/login/loginSuccessful", function(req,res, next){
        res.render("pages/login/loginSuccess", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None"
        });
        next();
    });

    /*
        REGISTER PAGES
    */

    app.get("/register/user", function(req,res, next){
        res.render("pages/register/user", {
            err: "none",
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/register/author", function(req,res, next){
        res.render("pages/register/author", {
            err: "none",
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    /*
        PAPER PAGES
    */

    app.get("/papers/index", function(req,res, next){
        res.render("pages/papers/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    app.get("/papers/individual/:paperid", function(req, res, next){
        res.render("pages/papers/show_individual",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type
        });
        next();
    });

    /*
        FUNCTIONS INVOLVING PAPER DATABASE
    */

    //An  ajax call is made to this from the paper page using dynamic_table script
    //to get the json response which is all the papers in order to be
    //outputted in the dynamic table 
    app.get("/paperdata",papers.paperdata);

    //An  ajax call is made to this from the paper page using the individial_paper script
    //to get the json response contains all the information stored in the db about the paper 
    app.get("/papers/get_individual_data/:paperid", papers.individualpaper);

    //Returns the comments made about the paper speficied
    app.get("/papers/get_paper_comments/:paperid", papers.getpapercomments);
  
    //ADD COMMENT
    app.post("/papers/addcomment/:paperid/:username", papers.addcomment);

    //CHECK LIKE EXISTS
    app.get("/papers/does_like_exist/:paperid/:username", papers.checklike);

    //CHECK STAR EXISTS
    app.get("/papers/does_star_exist/:paperid/:username", papers.checkstar);

    //ADD LIKE
    app.post("/papers/addlike/:paperid/:username", papers.addlike);

    //ADD STAR
    app.post("/papers/addstar/:paperid/:username", papers.addstar);

    /*
        FUNCTIONS INVOLVING COMMITTEE DATABASE
    */

    //GET ALL TYPES OF COMMITTES
    app.get("/committee_data", committee.committee_data);

    // An  ajax call is made to this from the individual committee page using the individual_committee script
    // add a member to the committee
    app.post("/committee/addmember/:committee_name/:username", committee.committee_addmember);

    /*
      REGISTER
    */

    //REGISTER USER
    app.post("/register_user", login.register_user);
    
    //REGISTER AUTHOR
    app.post("/register_author", login.register_author);

    /*
      LOGIN
    */

    //USER LOGIN
    app.post("/userlogin", login.userlogin);

    //AUTHOR LOGIN
    app.post("/authorlogin", login.authorlogin);

    //ADMIN LOGIN
    app.post("/adminlogin", login.adminlogin);

    /*
        FUNCTIONS INVOLVING BLOG DATABASE
    */

    //GET ALL BLOGS
    app.get("/blogdata", blog.blogdata);

    //GET SPEFIFIC BLOG
    app.get("/blog/get_blog_post/:blogid", blog.individualblogpost);

    //GET SPECIFIC BLOG COMMENTS
    app.get("/blog/get_blog_comments/:blogid", blog.getblogcomments);

    //ADD BLOG POST
    app.post("/blog/addpost/:username/:date", blog.addpost);

    //ADD COMMENT
    app.post("/blog/add_comment/:blogid/:username", blog.addcomment);

    /*
        FUNCTIONS INVOLVING THE COMMITTEE 
    */

    //LOGOUT
    app.get('/logout',function(req,res,next){
        req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            //Once session is destroyed redirect to Home page
            res.redirect("/");
            next();
        }
        });
    });


}