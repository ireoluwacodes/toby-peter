const jwt = require("jsonwebtoken")
const secret = process.env.JWT_KEY


const signToken = async (id)=>{
try {
    const payload = {
        id
    }
    const token =  jwt.sign(payload, secret, {
        expiresIn : "1 day"
    })
    return token
} catch (error) {
    throw new Error(error)
}
}

const signRefreshToken = async (id)=>{
    try {
        const payload = {
            id
        }
        const token =  jwt.sign(payload, secret, {
            expiresIn : "3 days"
        })
        return token
    } catch (error) {
        throw new Error(error)
    }
    }

const verifyToken = async (token)=>{
try {
    const payload = jwt.verify(token, secret)
return payload.id
} catch (error) {
    throw new Error(error)
}
}

module.exports = {
    signToken, verifyToken, signRefreshToken
}