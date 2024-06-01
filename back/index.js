const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gusSql123',
  database: 'juno'
});

app.use("/assets", (req, res, next) => {
  // setting the response headers
  res.setHeader("Cache-Control", "public, max-age=3600"); 
  // cache control header
  // next middleware or route handler
  next();
});
// serving static assets from the 'public' directory
app.use("/assets", express.static("public"));

app.use(express.json());
app.use(cors());

app.listen(3001, () => {
  console.log('rodando servidor');
})


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------


app.post('/cadastrar', (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const genero = req.body.genero;
  const estado = req.body.estado;
  const cidade = req.body.cidade;
  const endereco = req.body.endereco;
  const telefone = req.body.telefone;
  const senha = req.body.senha;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email],
  (err, result) => {
    if(err){
      throw new Error("Erro no servidor");
      res.send({msg: "Erro no servidor", r: false}); // Erro no servidor
    }
    if (result.length === 0) { // cadastrar normalmente
      bcrypt.hash(senha, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO usuarios (nome, email, genero, estado, cidade, endereco, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [nome, email, genero, estado, cidade, endereco, telefone, hash],
          (err, result) => {
            if(err) {
              //throw new Error("Erro no servidor ao cadastrar");
              res.send(err); // Erro no servidor
            }

            //-------------------
            res.send({ msg: "Cadastrado com sucesso", r: true, c: result }); // Cadastro feito com sucesso
            //-------------------

          });
      });
    }
    else {
      res.send({ msg: "Email já cadastrado", r: false }); // Email já cadastrado
    }
  });
});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------


app.get('/login', (req, res) => {
  const email = req.query.email;
  const senha = req.query.senha;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, result) => {
      if(err) {
        res.send(err);
      }
      if(result.length > 0) {
        bcrypt.compare(senha, result[0].senha, (erro,resultado) => {
          if(erro) {
            res.send({msg: 'Problema de autenticação no sistema', r: false});
          }
          if(resultado) {
            res.send({msg: 'login sucesso', r: true, c: result[0]});
          } else {
            res.send({msg: 'Senha incorreta', r: false});
          }
        })
      } 
      else {
        res.send({msg: 'Conta não encontrada', r: false});
      }
  });
});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------


app.get('/produtos', (req,res) => {
  const tipo = req.query.tipo;

  db.query(
    "SELECT * FROM produtos WHERE tipo = ?",
    [tipo],
    (err,result) => {
      if(err) {
        res.send(err);
      }

      res.send(result);
  });
});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------


app.get('/item', (req,res) => {
  const id = req.query.id;

  db.query(
    "SELECT * FROM produtos WHERE id_prod = ?",
    [id],
    (err,result) => {
      if(err) {
        res.send(err);
      }

      res.send(result);
  });
});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------


app.post('/finalizarcompra', (req,res) => {
  const data = req.body.data;
  const hora = req.body.hora;
  const compra = req.body.compra;
  const preco = req.body.preco;
  const idUsuario = req.body.idUsuario;

  db.query(
    "INSERT INTO compras (data, hora, compra, preco, id_usuario) VALUES (?, ?, ?, ?, ?)",
    [data, hora, compra, preco, idUsuario],
    (err,result) => {
      if(err) {
        res.send({msg: 'Problema na realização da compra', r: false, c: err});
      }

      res.send({msg: 'Compra realizada com sucesso', r: true, c: result});
    }
  )
});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

app.get('/compras', (req,res) => {
  const id = req.query.id;

  db.query(
    "SELECT * FROM compras WHERE id_usuario = ?",
    [id],
    (err,result) => {
      if(err) {
        res.send({msg: 'Problema ao carregar compras', r: false, c: err});
      }

      res.send({msg: 'Compras carregadas com sucesso', r: true, c: result});
    }
  )
})


