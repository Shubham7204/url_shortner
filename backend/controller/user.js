//model
const users = require("../models/user")

const jwt = require("jsonwebtoken")

//signup route handler
const signup = async (req, res) => {
    const { username, email, password } = req.body
    // console.log("POST : /signup " + username, email, password)
    if (!email || !username || !password) {
        res.status(400).json({ msg: "username email password required" })
    }
    else {
        try {
            const resp = await users.create({
                username: username, email: email, password: password
            })
            res.status(200).json({ msg: "SignUp Successfull" })
        }
        catch (err) {
            if (err.code === 11000) {
                console.error("User already present." + err.message);
                res.status(400).json({ msg: "User exsists please SignIn" })
            } else {
                console.log(err.message)
                res.status(500).json({ msg: "Try again" })
            }
        }
    }
}

//signin route handler
const signin = async (req, res) => {
    const { email, password } = req.body
    // console.log("POST : /signin " + email, password)
    if (!email || !password) {
        res.status(400).json({ msg: "email password required" })
    } else {
        try {
            const resp = await users.matchPassword(email, password)
            if (resp) {
                if (resp != -1) {
                    const options = { secure: true, sameSite: 'none', httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 };
                    res.cookie("token", resp, options).json({ msg: "Log in Succesfull", token: resp })
                }
                else {
                    res.status(400).json({ msg: "Incorrect Password" })
                }

            }
            else {
                res.status(400).json({ msg: "User not Found." })
            }
        }
        catch (err) {
            console.error("Error", err.message);
            res.status(500).json({ msg: "Try again" })
        }
    }
}

const signout = (req, res) => {
    const options = { secure: true, sameSite: 'none', httpOnly: true }
    res.clearCookie("token", options).json({ msg: "done" })
}

module.exports = { signup, signin, signout }