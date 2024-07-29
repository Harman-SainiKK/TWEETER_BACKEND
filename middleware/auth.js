const {getuser} = require("../services/auth")

function checkUserLoggedInOrNot(req,res,next){
    const userId = req.cookies?.uid;
    if(!userId) return res.json("you are not loggedIn")
    // console.log(userId)

    const user = getuser(userId)
    if(!user) return res.json("you are not loggedIn")
        req.user = user
        next()
}

module.exports = {
    checkUserLoggedInOrNot
}