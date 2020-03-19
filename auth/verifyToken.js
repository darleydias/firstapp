var jwt = require('jsonwebtoken')
// o token será uma key do cabeçalho
module.exports = function verifyToken(req,res,next){
    let token = req.headers["x-access-token"]
    if(!token){
        res.statusCode =403
        res.send({mesage:"Requisção sem token"})
    }else{
        jwt.verify(token,"123456",(err,decoded)=>{
            if(err){
                res.statusCode =401
                res.send({mesage:"Token invalida"})
            }
            //crio uma propriedade no cabeçalho
            res.userId = decoded.userId
            next()
        })
    }
}
  