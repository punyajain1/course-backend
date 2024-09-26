const {Router} = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middlewere/user");
const courseRouter = Router();

courseRouter.get("/preview",async function(req,res){
    const course = await courseModel.find();
    res.json({
        course: course
    })

});

courseRouter.post("/purchase",userMiddleware,async function(req,res){
    const userId = req.userId;
    const title=req.body.title;
    await purchaseModel.create({
        userId: userId,
        title: title
    });
    res.json({msg: "succesfully pruchased"});
});
    
    



module.exports = { courseRouter}