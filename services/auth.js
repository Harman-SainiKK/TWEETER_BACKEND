const jwt = require("jsonwebtoken")
const secretKey = "_harman13@#43"

function setuser(email){
    const payload = jwt.sign({
        email
    },secretKey)
    return payload
}

function getuser(token){
    return jwt.verify(token,secretKey)
}

module.exports = {
    setuser,getuser
}