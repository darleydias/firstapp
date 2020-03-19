var dbConnection = require("../../config/dbConnection")
var verifyToken = require("../../auth/verifyToken")
var bcryptjs =require("bcryptjs")
var jwt = require("jsonwebtoken")
module.exports = (router)=>{
    //rota de registro do usuario
    router.post("/register",verifyToken,(req,res)=>{
        try{
            let usuario  = req.body
            var conn = dbConnection()
            conn.query("select UUID() NEW_ID",(err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
               let uuid = result[0].NEW_ID
               hashPassword = bcryptjs.hashSync(usuario.password,8)
               conn.query("INSERT INTO USUARIO VALUES('"+uuid+"','"+usuario.nome+"','"+usuario.login+"','"+hashPassword+"',NOW(),NOW())", (err,result)=>{
                   if(err){
                       res.stausCode = 505
                       res.send(err)
                   }
                   res.send({NEW_ID:uuid})
               })
            })
            
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }
    })
    // login
    router.post("/login",(req,res)=>{
        try{
            let usuario  = req.body
            var conn = dbConnection()

            var selQuery = "select ID,PASSWORD from USUARIO WHERE LOGIN='"+usuario.login+"'"
            conn.query(selQuery, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                if(Array.isArray(result)){
                    if(result.length > 0){
                        // pegar a senha
                        let pass = result[0].PASSWORD
                        let validPassword = bcryptjs.compareSync(usuario.password,pass)
                        if(validPassword){
                            // se a senha está no banco vamos gerar um token
                            // ao inves de escrever um key string, poderia gerar um
                            // hash para cada token
                            // tempo de expiração do token
                            // em toda requisição enviaremos o token 
                            var token = jwt.sign({id:result[0].ID},"123456", {
                                expiresIn:86400
                            })

                            res.send({message:"Usuario ['"+result[0].ID+"'] logado",token:token})
                        }else{
                            res.send({message:"Usuario ou senhas inválidos"})
                        }
                        
                    }else{
                        res.send({message:"Usuário ou senha inexistente"})
                    }
                }
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }
    })
    // ###################   DELETA UM usuario #####################
    router.delete("/register/:id",verifyToken,(req,res)=>{
        try{
            let idUser  = req.params.id
            var conn = dbConnection()
            var selQuery = "delete from usuario where ID= '"+idUser+"'"
            conn.query(selQuery, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                res.send({ message: "O usuário [" + idUser + "] foi excluído com sucesso" })
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }

    })
    // ###################   lista usuarios #####################
    router.get("/usuarios",verifyToken,(req,res)=>{
        try{
            var conn = dbConnection()
            var selQuery = "select * from USUARIO "
            conn.query(selQuery, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                res.send({result})
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }

    })
    // ##################### ALTERA usuario (nome e login)##################
    router.patch("/usuarios",(req,res)=>{
        try{
            //let idUsuario = req.params.id
            let usuario = req.body
            var conn = dbConnection()
            var sql ="UPDATE USUARIO set NOME='"+usuario.nome+"',"+ "LOGIN='"+usuario.login+"' where ID= '"+usuario.id+"'"
            conn.query(sql, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
               res.send({ message: "Dados de usuário [" + usuario.id + "] foi atualizado com sucesso!" })
 
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }

    })
    // ##################### ALTERA  SENHA ##################
    // passar:
    // password ; senhaNova ; login
    router.patch("/trocarSenha",(req,res)=>{
        try{
            var usuario = req.body
            var token = ""
            //PRIMEIRO CONFIRO SE A SENHA ATUAL ESTÁ VÁLIDA
            var conn = dbConnection()
            var selQuery = "select ID,PASSWORD from USUARIO WHERE LOGIN='"+usuario.login+"'"
            conn.query(selQuery, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                if(Array.isArray(result)){
                    if(result.length > 0){
                        // pegar a senha que está gravada no banco
                        var pass = result[0].PASSWORD
                        //comparo com a senha que veio no formulário
                        var validPassword = bcryptjs.compareSync(usuario.password,pass)
                            if(validPassword){
                            // JÁ QUE VALIDOU, TROCAREI A SENHA
                            hashPassword = bcryptjs.hashSync(usuario.senhaNova,8)
                            var idBanco = result[0].ID
                                var sql ="UPDATE USUARIO set PASSWORD='"+hashPassword+"' where ID= '"+idBanco+"'"
                                conn.query(sql, (err,result)=>{
                                    if(err){
                                        res.stausCode = 505
                                        res.send(err)
                                    }
                                // se troquei a senha, gero novo token
                                token = jwt.sign({id:idBanco},"123456", {
                                   expiresIn:86400
                               })
                               res.send({message:"Senha nova: '"+hashPassword+"'"})
                            })
                            // FIM DA TROCA DA SENHA 
                            }else{
                                res.send({message:"senha atual errada",})
                            }
                    }else{
                        res.send({message:"Usuário inexistente"})
                    }
                }
            })
            //ATUALIZO A NOVA SENHA
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }
    })
}