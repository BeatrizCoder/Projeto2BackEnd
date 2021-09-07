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
    useUnifiedTipology: true,
  };
  const client = await mongodb.MongoClient.connect(connnectionString, options);
  const db = client.db("blue_db");
  const personagens = db.collection("personagens");

  router.use(function timelog(req, res, next) {
    next();
    console.log("Time: ", Date.now());
  });

  router.delete("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const quantidadePersonagens = await personagens.countDocuments({
      _id: ObjectId(id),
    });

    if (quantidadePersonagens !== 1) {
      res.status(404).send({ error: "personagem nao foi encontrado" });
      return;
    }

    const result = await personagens.deleteOne({
      _id: ObjectId(id),
    });

    if (result.deletedCount !== 1) {
      res
        .status(500)
        .send({ error: "Ocorreu um erro ao tentar deletar o personagem" });
      return;
    }
    res.send(204);
  });
})();
module.exports = router;
