const{ Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require('jsonwebtoken');
const { JWT_KEY_admin } = require("../config.js");
const { adminMiddleware } = require("../middlewere/admin.js");
const {default: mongoose} = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const {z} = require("zod");
const bcrypt = require("bcrypt");



adminRouter.post("/signin",async function(req,res){
    const {email, password} = req.body;

    const admin = await adminModel.findOne({email: email});

    if (!admin) {
        return res.status(404).json({ msg: "admin not found" });
    }

    const passmatch = bcrypt.compare(password, admin.password);

    try{
        if(passmatch){
            const token = jwt.sign({id: admin._id },JWT_KEY_admin);
            res.json({token: token});
        }else{
            res.status(403).json({msg:"error while signin"});
        }
    }catch(e){
        res.status(403).json({msg:"error"});
    }
});


adminRouter.post("/signup",async function(req,res){
    const requirebody = z.object({
        email: z.string().email(),
        password: z.string(),
        firstname: z.string(),
        lastname: z.string()
    });

    const parsed = requirebody.safeParse(req.body);
    if (!parsed.success) {
        return res.json({ msg: "Invalid input" });
    }
    try{
        const {email, password, firstname, lastname} = req.body;
        const hashedpass = await bcrypt.hash(password, 5);
        await adminModel.create({
            email:email,
            password:hashedpass,
            firstname:firstname,
            lastname:lastname
        });
        res.json({ msg:"signup done" });
    }catch(r){
        res.status(403).json({msg:"error"});
    }
});


//creating course
adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })

});


//updating course
adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;

    const { title, description, imageUrl, price , courseId} = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })
    res.json({message: "Course updated",courseId: course._id});

});


adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    try{
        const userid = req.userId;
        const courses = await courseModel.find({creatorId: userid});
        res.json({courses});
    }catch(e){
        res.status(403).json({ msg: "no course found"});
    }
});

module.exports = { adminRouter };