var express = require("express");
const Feedback = require("../models/feedback");
var router = express.Router();

router.post('/', async (req, res) => {
    try{
        const getFeedback = new Feedback({
            name: req.body.Name,
            email: req.body.Email,
            subject: req.body.Subject,
            message: req.body.Message
        });
        const received = await getFeedback.save();
        res.redirect('/');
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;