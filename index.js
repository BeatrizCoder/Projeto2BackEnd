// abrir o projeto inicia o projeto = npm init |procsso que automatiza npm init  - y//
//npm i instalar
//npm i express
//npm i  nodemon -D ele instala so nas dev dependecs

// baixaro projeto front abrir no cmd
//abrir terminal npm i
//npm i e audit fix por yes

//npm install express-async-errors --save//

require("dotenv").config();
const express = require("express");
require("express-async-errors");
var cors = require("cors");
const home = require("./components/home/home");
const readAll = require("./components/read-all/read-all");
const readById = require("./components/read-by-id/read-by-id");
const update = require("./components/update/update");
const create = require("./components/create/create");
const del = require("./components/delete/delete");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

// OLD CORS.
//NOTE: É MT IMPORTANTE REVISE BIA!//

// app.all("/*", (req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");

// 	res.header("Access-Control-Allow-Methods", "*");

// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
// 	);

// 	next();//
// });

//NOVO CORS//
app.use(cors());
app.options("*", cors());

// app.get("/", (req, res) => {
//   res.send({ info: "Olá, Projeto integrado  do Backend ao Front" });
// });//
// app.get("/personagens", async (req, res) => {
// 	res.send(await getPersonagensValidas());
// });

//OLD GET BY ID //
// app.get("/personagens/:id", async (req, res) => {
// 	const id = req.params.id;
// 	const personagem = await getPersonagemById(id);
// 	if (!personagem) {
// 		res
// 			.status(404)
// 			.send({ error: "o personagem especificado nao foi encontrado" });
// 		return;
// 	}
// 	res.send(personagem);
// });

//NEW ROTA POR PASTINHAS -ROTAS: HOME, UPDATE, CREATE, DELETE, READ ALL AND READY BY ID

app.use("/home", home);
app.use("/personagens/read-all", readAll);
app.use("/personagens/read-by-id", readById);
app.use("/personagens/update", update);
app.use("/personagens/create", create);
app.use("/personagens/delete", del);

// OLD POST- NOVO CREATE
// app.post("/personagens", async (req, res) => {
// 	const objeto = req.body;

// 	if (!objeto || !objeto.nome || !objeto.imagemUrl) {
// 		res.status(400).send({
// 			error:
// 				"Personagem inválido, verifique se há os campos Nome e ImagemUrl",
// 		});
// 		return;
// 	}
// 	const insertCount = await personagens.insertOne(objeto);

// 	console.log(result);

// 	if (result.acknowledge == false) {
// 		res.send("Ocorreu um erro");
// 		return;
// 	}
// 	res.status(201).send(objeto);
// });

// OLD PUT //
// app.put("/personagens/:id", async (req, res) => {
// 	const id = req.params.id;
// 	const objeto = req.body;

// 	if (!objeto || !objeto.nome || !objeto.imagemUrl) {
// 		res.status(400);
// 		send({
// 			error: "Requisicao inválida, verifique se há campo de nome e imagemUrl",
// 		});

// 		return;
// 	}
// 	const quantidadePersonagens = await personagens.countDocuments({
// 		_id: ObjectId(id),
// 	});

// 	if (quantidadePersonagens !== 1) {
// 		res.send("Personagem nao encontrado");
// 		return;
// 	}

// 	const result = await personagens.updateOne(
// 		{
// 			_id: ObjectId(id),
// 		},
// 		{
// 			$set: objeto,
// 		}
// 	);

// 	if (result.acknowledged == "undefined") {
// 		res
// 			.status(500)
// 			.send({ error: "Ocorreu um erro ao tentar atualizar o personagem" });
// 		return;
// 	}
// 	res.send(await getPersonagemById(id));
// });

//OLD DELETE//- manter para  referencia de estudos

// app.delete("/personagens/:id", async (req, res) => {
// 	const id = req.params.id;
// 	const quantidadePersonagens = await personagens.countDocuments({
// 		_id: ObjectId(id),
// 	});

// 	if (quantidadePersonagens !== 1) {
// 		res.status(404).send({ error: "personagem nao foi encontrado" });
// 		return;
// 	}

// 	const result = await personagens.deleteOne({
// 		_id: ObjectId(id),
// 	});
// 	// caso ocorra um erro e o personagem nao seja removido///

// 	if (result.deletedCount !== 1) {
// 		res
// 			.status(500)
// 			.send({ error: "Ocorreu um erro ao tentar deletar o personagem" });
// 		return;
// 	}
// 	res.send(204);
// });

//Middleware

app.all("*", function (req, res) {
  res.status(404).send({ message: "Endpoint was not found" });
});

//Middleware e erros//

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "internal server error",
    },
  });
});

app.listen(port, () => {
  console.info(`App rodando em http://localhost:${port}/home`);
});
