const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

const Posts = require("../../models/Posts");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route POST api/posts
//@ desc  create post
//@access private
router.post(
  "/",
  [auth, [body("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    //incase body is not validated
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //400:bad request, send error message
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //grab user from usersCollection
      const user = await User.findById(req.user.id).select("-password");

      //build newPost object
      const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.send(500).send("Server Error");
    }
  }
);

//@route GET api/posts
//@ desc GET All posts
//@access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@route GET api/posts/:postId
//@ desc GET post by id
//@access private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("server Error");
  }
});

//@route DELETE api/posts/:postId
//@ desc DELETE post by id
//@access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //check if post is made by signed in user
    //req.user.id is a string
    // post.user is not string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized" });
    }

    //remove from data base
    await post.remove();
    res.json({ msg: "Post Removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectID") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("server Error");
  }
});

//@route PUT api/posts/like/:postId
//@ desc like a post
//@access private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    //check if the post is already liked by logged user
    //.filer will return an array ['id']
    // if its length is > 0 (1) is already liked by the user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    //add user to the likes array
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@route PUT api/posts/unlike/:postId
//@ desc unlike a post
//@access private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    //check if the post is already liked by logged user
    //.filter will return an array ['id']
    // if its length is = 0, it was never liked by the user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post was NOT liked" });
    }
    //add user to the likes array
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@route POST api/posts/comment/:postId
//@ desc  create comment
//@access private
router.post(
  "/comment/:id",
  [auth, [body("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    //incase body is not validated
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //400:bad request, send error message
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //grab user and post from users & posts Collections
      const user = await User.findById(req.user.id).select("-password");
      const post = await Posts.findById(req.params.id);

      //build newComment object
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      //add it to the post.comments array
      post.comments.unshift(newComment);
      post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.send(500).send("Server Error");
    }
  }
);

//@route DELETE api/posts/comment/:postId/:comment_id
//@ desc  Delete comment
//@access private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //grab post from users & posts Collections
    const post = await Posts.findById(req.params.id);

    //check if comment was made by logged user
    if (
      post.comments.filter((comment) => comment.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Unauthorized to delete" });
    }
    //get comment index from post.comments array
    const removeIndex = post.comments
      .map((comment) => comment._id.toString())
      .indexOf(req.params.comment_id);
    //delete comment form array
    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.send(500).send("Server Error");
  }
});
module.exports = router;
