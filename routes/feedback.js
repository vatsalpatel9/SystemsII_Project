var express = require("express");
const Feedback = require("../models/feedback");
var router = express.Router();

router.post('/', async (req, res) => {
  // REGEX for email validation
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.Email)) {
    console.log("emailcheckworking");
    return res.redirect(`/?status=fail`);
  }
  try {
    const getFeedback = new Feedback({
      name: req.body.Name,
      email: req.body.Email,
      subject: req.body.Subject,
      message: req.body.Message,
    });
    const received = await getFeedback.save();
    res.redirect("/?status=success");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/delete/:id', async (req,res) => {
    console.log(req.params.id);
    try{
        await Feedback.deleteOne({_id: req.params.id}, function(req, res, err){
            if(err){
                throw err;
            }
        });
        res.redirect("/secret/feedback");
    }catch(err){
        res.status(400).send(error);
    }
})

module.exports = router;