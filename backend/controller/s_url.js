//nanoid to generate shortid
const { nanoid } = require("nanoid")

//Short URL Model
const s_url = require("../models/s_url")

//creates a short url
const genrateSurl = async (req, res) => {
    try {
        const { l_url, name } = req.body
        const s_id = nanoid(10)
        await s_url.create({
            url: l_url,
            short_id: s_id,
            name: name,
            createdBy: req.user.uid
        })
        res.json({ msg: "Short URL successfully created", s_id: s_id })
    } catch (err) {
        console.log(err.message)
        res.json({ msg: "try again" })
        if (err.code === 11000) {
            console.error("URL already present." + err.message);
            res.status(400).json({ msg: "URL exists." })
        } else {
            console.log(err.message)
            res.status(500).json({ msg: "try again" })
        }
    }
}

//Retrives recent 10 Short URL
const getRecent = async (req, res) => {
    try {
        const resp = await s_url.find({ createdBy: req.user.uid }, { url: 1, short_id: 1, name: 1 }).sort({ createdAt: -1 }).limit(5)
        res.json({ data: resp })
    } catch (err) {
        console.log(err.message)
    }
}

//to get toatal url's created by user,total clicks and most clicks for a single url
const analytics = async (req, res) => {
    try {
        const userId = req.user.uid
        const resp = await s_url.find({ createdBy: userId }, { url: 1, name: 1, short_id: 1, clicks: 1 }).sort({ clicks: -1 })
        const totalUrls = resp.length
        if (resp.length > 0) {
            let totalClicks = 0
            resp.forEach((ele, index) => {
                clicks = ele.clicks
                totalClicks += clicks;
            })

            res.json({ urls: totalUrls, clicks: totalClicks, most_clicks: resp[0].clicks, url_data: resp })
        }
        else {
            res.json({ msg: "No data to perform analytics" })
        }

    } catch (err) {
        console.log(err.message)
    }
}

//delete a Short URL
const deletSurl = async (req, res) => {
    try {
        const id = req.body.id
        const resp = await s_url.deleteOne({ _id: id })
        resp.acknowledged == true ? res.json({ msg: "Deleted Succesfully" }) : res.status(500).json({ msg: "Try again" })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ msg: "Try again" })
    }
}

module.exports = { genrateSurl, getRecent, analytics, deletSurl }