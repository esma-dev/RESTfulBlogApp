const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");
	  methodOverride = require("method-override");

//APP CONFIG ================================================================================

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public")); //to serve our custom style sheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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

//SHOW ROUTE
app.get("/blogs/:id", (req, res, next) => {
	const blogId = req.params.id;
	//find blog post with that particular id
	Blog.findById(blogId, (err, blogPost) => {
		if(err) res.redirect("/blogs");
		else {
			res.render("show", {blog: blogPost});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res, next) => {
	const blogId = req.params.id;
	//find blog post
	Blog.findById(blogId, (err, foundBlog) => {
		if(err) res.redirect("/blogs/" + blogId);
		else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res, next) => {
	//find blog post by id and update
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err) => {
		if(err) res.redirect("/blogs");
		else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
	//redirect to show page
});

//DESTROY ROUTE
app.delete("/blogs/:id", (req, res, next) => {
	//delete blog
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if(err) res.redirect("/blogs");
		else {
			res.redirect("/blogs");
		}
	});
	//redirect somewhere
});

app.listen(3000, () => {
	console.log("THE SERVER IS UP AND RUNNING!!!");
});