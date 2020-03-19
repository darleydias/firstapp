var dbConnection = require("../../config/dbConnection")
var verifyToken = require("../../auth/verifyToken")
module.exports = (router)=>{
 // #######   lista todos produtod no banco  ################
    router.get("/produtos",verifyToken,(req,res)=>{
        try{
            var conn = dbConnection()
            conn.query("select * from produtos", (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                    res.send({result})
            });
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }
    })
// #################### LISTA DETERMINADO PRODUTO ##############
    router.get("/produtos/:id",verifyToken,(req,res)=>{
        try{
            let id  = req.params.id
            var conn = dbConnection()
            conn.query("SELECT * FROM produtos WHERE ID = " + id, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                result(result[0])
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }
    })

//#################    GRAVA UM PRODUTO
//
    router.post("/produtos",(req,res)=>{
        try{
            let produto  = req.body
            // como conn está reornando uma função, 
            //ao abrir e fechar parenteses executo a função
            // o que ela retorna é uma conexão com banco
            // pelo fato do banco ser instavel temos que traar a exceção
            var conn = dbConnection()
            conn.query("INSERT INTO produtos (NOME, DESCRICAO, PRECO, QUANT, QUANT_MINIMA) VALUES ('" + produto.nome + "', '" + produto.descricao + "', " + produto.preco + ", " + produto.quant + ", " + produto.quant_minima + ")", (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                if(result.affectedRows>0){
                 res.send({message:`Produto ${produto.nome} Gravado com sucesso`})   
                }
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }
         
    })
// ##################### ALTERA UM APRODUTO ##################
    router.put("/produtos/:id",(req,res)=>{
        try{
            let idProduto = req.params.id
            let produto = req.body
            var conn = dbConnection()
            conn.query("UPDATE produtos set NOME='"+produto.nome+"',"+
                        "DESCRICAO='"+produto.descricao+"',"+
                        "PRECO="+produto.preco+","+
                        "QUANT="+produto.quant+","+
                        "QUANT_MINIMA="+produto.quant_minima +
                        " where ID= "+idProduto, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
               res.send({ message: "Seu produto [" + idProduto + "] foi atualizado com sucesso!" })
 
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }

    })
    // ###################   DELETA UM PRODUTO #####################
    router.delete("/produtos/:id",(req,res)=>{
        try{
            let idProduto  = req.params.id
            var conn = dbConnection()
            var selQuery = "delete from produtos where ID= "+idProduto
            conn.query(selQuery, (err,result)=>{
                if(err){
                    res.stausCode = 505
                    res.send(err)
                }
                res.send({ message: "O produto [" + idProduto + "] foi excluído com sucesso" })
            })
        }catch(e){
            res.stausCode = 505
            res.send(e)
        }

    })
    
}