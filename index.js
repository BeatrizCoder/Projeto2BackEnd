// abrir o projeto inicia o projeto = npm init |procsso que automatiza npm init  - y//
//npm i instalar
//npm i express
//npm i  nodemon -D ele instala so nas dev dependecs

// baixaro projeto front abrir no cmd
//abrir terminal npm i
//npm i e audit fix por yes

require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

(async () => {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const dbChar = process.env.DB_CHAR;

  const app = express();

  app.use(express.json());

  const port = process.env.PORT || 3000;

  const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  const options = {
    useUnifiedTopology: true,
  };

  const client = await mongodb.MongoClient.connect(connectionString, options);

  const db = client.db("blue_db");
  const personagens = db.collection("personagens");

  const getPersonagensValidas = () => personagens.find({}).toArray();

  const getPersonagemById = async (id) =>
    personagens.findOne({ _id: ObjectId(id) });

  //CORS É MT IMPORTANTE REVISE BIA!//

  app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Methods", "*");

    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
    );

    next();
  });

  app.get("/", (req, res) => {
    res.send({ info: "Olá, Projeto integrado  do Backend ao Front" });
  });

  app.get("/personagens", async (req, res) => {
    res.send(await getPersonagensValidas());
  });

  app.get("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const personagem = await getPersonagemById(id);
    res.send(personagem);
  });

  app.post("/personagens", async (req, res) => {
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.send(
        "a requisicao nao esta valida, verifique se há campo de nome e imagemUrl"
      );
      return;
    }
    const insertCount = await personagens.insertOne(objeto);

    console.log(result);
    if (result.acknowledge == false) {
      res.send("Ocorreu um erro");
      return;
    }
    res.send(objeto);
  });

  app.put("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.send(
        "a requisicao nao esta valida, verifique se há campo de nome e imagemUrl"
      );
      return;
    }
    const quantidadePersonagens = await personagens.countDocuments({
      _id: ObjectId(id),
    });

    if (quantidadePersonagens !== 1) {
      res.send("Personagem nao encontrado");
      return;
    }

    const result = await personagens.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $set: objeto,
      }
    );

    if (result.modifiedCount !== 1) {
      res.send("Ocorreu um erro ao tentar atualizar o personagem");
      return;
    }
    res.send(await getPersonagemById(id));
  });

  app.delete("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const quantidadePersonagens = await personagens.countDocuments({
      _id: ObjectId(id),
    });
	

    if (quantidadePersonagens !== 1) {
      res.send("personagem nao foi encontrado");
      return;
    }

    const result = await personagens.deleteOne({
      _id: ObjectId(id),
    });
    // caso ocorra um erro e o personagem nao seja removido///

    if (result.deletedCount !== 1) {
      res.send("Ocorreu um erro ao tentar deletar o personagem");
      return;
    }
    res.send("Pesonagem removido com sucsso");
  });

//Middleware

app.all("*", function (req, res){
  res.status(404).send({message:"Endepoint was not found"});
});

app.use((error, req, res, next)=>{
  res.status(error.status || 500).send({
   error:{
     status:error.status||500,
     message:error.message ||"internal server error",

  },


  });
});



  app.listen(port, () => {
    console.info(`App rodando em http://localhost:${port}`);
  });
})();
