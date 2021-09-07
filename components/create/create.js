const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
(async () => {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const dbChar = process.env.DB_CHAR;
  const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.${dbChar}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  const options = {
    useUnifiedTopology: true,
  };
  const client = await mongodb.MongoClient.connect(connectionString, options);
  const db = client.db("blue_db");
  const personagens = db.collection("personagens");
  router.use((req, res, next) => {
    next();
  });

  router.post("/", async (req, res) => {
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.status(400).send({
        error:
          "Personagem inválido, verifique se há os campos Nome e ImagemUrl",
      });
      return;
    }
    const result = await personagens.insertOne(objeto);


    if (result.acknowledge == false) {
      res.send("Ocorreu um erro");
      return;
    }
    res.status(201).send(objeto);
  });
})();
module.exports = router;
