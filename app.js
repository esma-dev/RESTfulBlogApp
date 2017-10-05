const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

//APP CONFIG ================================================================================

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public")); //to serve our custom style sheet
app.use(bodyParser.urlencoded({extended: true}));


// MONGOOSE/MODEL CONFIG ====================================================================
const blogSchema = mongoose.Schema({
	title: String,
	image: String, 
	body: String,
	created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES ===========================================================================

app.get("/", (req, res, next) => {
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", (req, res, next) => {
	Blog.find({}, (err, blogs) => {
		if(err) console.log("ERROR: ", err);
		else {
			res.render("index", {blogs: blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", (req, res, next) => {
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", (req, res, next) => {
	//create a new blog post
	const newBlog = req.body.blog;
	Blog.create(newBlog, (err, blog) => {
		if(err) res.render("new");
		else {
			//redirect
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, () => {
	console.log("THE SERVER IS UP AND RUNNING!!!");
});