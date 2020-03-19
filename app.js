// variaveis de ambiente
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var router = express.Router()

// controllers xxxx tttttt 888888 
// Estou testando

var produtosController = require('./app/controllers/produtosControllers')
var loginController = require('./app/controllers/usuarioController')


router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

produtosController(router)
loginController(router)
console.log("Recebereis poder dos céus")
console.log("Recebereis poder dos céus")
app.use("/",router)

/*ENDPOINT
app.get("/veiculos",function(request,response){
    response.send("<html><body>Você Chamou a rota de veículos </body></html>")
})
//ENDPOINT
app.get("/clientes",function(request,response){
    let listaClientes = []
    listaClientes.push({ID:1,Nome:"Joaozinho"})
    listaClientes.push({ID:2,Nome:"Mariazinha"})
    listaClientes.push({ID:3,Nome:"Zezin"})
    response.send(listaClientes)
})
//ENDPOINT
app.post("/clientes",(req,res)=>{
    try{
        var newObj = req.body
        newObj.ID = "Novo Id Gerado"
        newObj.UpdateDate = new Date
        //TODO: armazenamento no banco
        res.send(newObj)
    }catch(e){
        res.statusCode=505
        res.send(e)
    }
})
//ENDPOINT
app.put("/clientes/:id",(req,res)=>{
    try{
        var newObj = req.body
        if(newObj.ID == req.params.id){
            newObj.Nome="Darley"
            newObj.UpdateDate= new Date
            newObj.DtNasc=new Date
        }
        res.send(newObj)
    }catch(e){
        res.statusCode=505
        res.send(e)
    }

})
//ENDPOINT
app.delete("/clientes/:id",(req,res)=>{
    try{
        res.send({message: "Registro"+res.params.id+"removido"})
    }catch(e){
        res.statusCode=505
        res.send(e)
    }
})
//ENDPOINT
app.get("/clientes/:id",function(req,res){
    let clientId = req.params.id
    switch(clientId){
        case "1":
            res.send({ID:clientId,Nome:"Joaozinho"})
            break;
        case "2":
            res.send({ID:clientId,Nome:"Zezim"})
            break;
        default:
            res.statusCode = 506
            res.send({error:"Cliente Inválido"})
            //throw "Cliente inválido"
            break;

    }
})
*/
app.listen(3000,function(){
    console.log("Server on")
})
