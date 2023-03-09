import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

// Cria os bancos de dados
const localDB = new PouchDB('local-db');
const remoteDB = new PouchDB('http://admin:1234@127.0.0.1:5984/todo_list');

// Configura as bibliotecas PouchDB
PouchDB.plugin(PouchDBFind);

// Cria o servidor Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define a rota para sincronizar os bancos de dados
app.post('/sync', async (req, res) => {
  try {
    const sync = localDB.replicate.to(remoteDB);
    sync.on('error', (error) => console.error(error));
    res.status(200).json({ message: 'Sincronização iniciada' });
    console.log(sync);
    sync.on('complete', () => {
      res.status(200).json({message: 'Sincronização concluída'});
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao sincronizar bancos de dados' });
  }
});

// Define as rotas para as operações CRUD
app.get('/todos', async (req, res) => {
  try {
    const result = await localDB.find({ selector: { type: 'todo' } });
    res.status(200).json(result.docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = { type: 'todo', text: req.body.text };
    const result = await localDB.post(todo);
    res.status(200).json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await localDB.get(req.params.id);
    //@ts-ignore
    todo.text = req.body.text;
    await localDB.put(todo);
    res.status(200).json({ message: 'Todo atualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await localDB.get(req.params.id);
    await localDB.remove(todo);
    res.status(200).json({ message: 'Todo removido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover todo' });
  }
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});