const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/course-database");


const app = express();
const { userRouter } = require("./routes/user.js");
const { courseRouter } = require("./routes/courses.js");
const { adminRouter } = require("./routes/admin.js");
app.use(express.json());

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

app.listen(3000);
console.log("listening on port 3000");