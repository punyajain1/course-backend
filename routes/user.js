const { Router } = require("express");
const { userModel, courseModel , purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_KEY_user } = require("../config");
const { userMiddleware } = require("../middlewere/user.js");
const { z } = require("zod");
const bcrypt = require("bcrypt");

const userRouter = Router();

userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email: email });
    
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    
    const passmatch = bcrypt.compare(password, user.password);

    if (passmatch) {
        const token = jwt.sign({ id: user._id.toString() }, JWT_KEY_user);
        res.json({ token: token });
    } else {
        res.status(403).json({ msg: "Invalid credentials" });
    }
});

userRouter.post("/signup", async function(req, res) {
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
        const { email, password, firstname, lastname } = req.body;
        const hashedpass = await bcrypt.hash(password, 5);
        await userModel.create({
            email: email,
            password: hashedpass,
            firstname: firstname,
            lastname: lastname
        });
        res.json({ msg: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Server error" });
    }
});

userRouter.get("/allcourses", async function(req, res) {
    const courses = await courseModel.find({});
    res.json({ courses: courses });
});




userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId: userId });
    res.json({ purchases: purchases });
});

module.exports = { userRouter };
