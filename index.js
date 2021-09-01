//  abrir o projeto inicia o projeto = npm init |procsso que automatiza npm init  - y//
//npm i instalar
//npm i express
//npm i  nodemon -D ele instala so nas dev dependecs

require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

(async () => {
	const dbhost= process.env.DB_HOST;
	const dbport= process.env.DB_PORT;
	const dbname=process.env.DB_NAME;

	const app = express();

	app.use(express.json());
	const port = process.env.PORT|| 3000;

	const connectionString = `mongodb://${dbhost}:${dbport}/${dbname}`;

	const options = {
		useUnifiedTopology: true,
	};

	const client = await mongodb.MongoClient.connect(connectionString, options);

	const db = client.db("blue_db");
	const personagens = db.collection("personagens");

	const getPersonagensValidas = () => personagens.find({}).toArray();

	const getPersonagemById = async (id) =>

		personagens.findOne({ _id: ObjectId(id) });

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

app.get("/personagens/:id", async(req, res) =>{
const id = req.params.id;
const personagem=await getPersonagemById(id);
res.send(personagem);

});

app.post("/personagens", async(req, res)=> {
	const objeto= req.body;

	if(!objeto || !objeto.nome|| !objeto.imagemUrl){
		res.send("Objeto invalid");
		return;
	}
	const insertCount= await personagens.insertOne(objeto);
	console.log(insertCount);
	if(!insertCount){
		res.send("Ocorreu um erro");
		return;
	}
	res.send(objeto);
});

app.put("/personagens/:id", async (req, res) => {
	const id= req. params.id;
	const objeto=req.body;
	res.send(
		await personagens.updateOne(
			{
				_id:ObjectId(id),
			},
			{
				$set:objeto,
			}
		)
	);

});

app.delete("/personagens/:id", async (req, res) => {
	const id = req.params.id;

	res.send(
		await personagens.deleteOne({
			_id:ObjectId(id),
		})
	);

});

	app.listen(port, () => {
		console.info(`App rodando em http://localhost:${port}`);
	});
})();