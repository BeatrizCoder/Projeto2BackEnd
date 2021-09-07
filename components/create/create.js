const express = require("express");
const router = express.Router();
const mongodb = require("mongod");
const ObjectId = mongodb.ObjectId;
(async () => {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const dbChar = process.env.DB_CHAR;
  const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  const options = {
    useUnifiedTipology: true,
  };
  const client = await mongodb.MongoClient.connect(connnectionString, options);
  const db = client.db("blue_db");
  const personagens = db.collection("personagens");

  router.use(function timelog(req, res, next) {
    next();
    console.log("Time: ", Date.now());
  });

  router.post("/personagens", async (req, res) => {
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.status(400).send({
        error:
          "Personagem inválido, verifique se há os campos Nome e ImagemUrl",
      });
      return;
    }
    const insertCount = await personagens.insertOne(objeto);

    console.log(result);

    if (result.acknowledge == false) {
      res.send("Ocorreu um erro");
      return;
    }
    res.status(201).send(objeto);
  });
})();
module.exports = router;
