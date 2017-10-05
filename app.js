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

app.get("/blogs", (req, res, next) => {
	Blog.find({}, (err, blogs) => {
		if(err) console.log("ERROR: ", err);
		else {
			res.render("index", {blogs: blogs});
		}
	});
});

app.listen(3000, () => {
	console.log("THE SERVER IS UP AND RUNNING!!!");
});