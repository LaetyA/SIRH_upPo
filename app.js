import express from "express";
import bodyParser from "body-parser";

import {dirname} from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2"



const app = express();
const port = 3000;
const  __dirname = dirname(fileURLToPath(import.meta.url));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Utilisateur MySQL
    password: '', // Aucun mot de passe
    database: 'sirh'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à MySQL :', err);
    } else {
      console.log('Connexion à MySQL réussie');
    }
  });

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.get("/",(req,res) =>{
    // res.sendFile(__dirname+"/views/authentification.html");
    res.render("login.ejs")

})
app.get("/register",(req,res) =>{
    res.sendFile(__dirname+"/views/register.html");
    // res.render("login.ejs")
})
app.get("/login",(req,res) =>{
    // res.sendFile(__dirname+"/views/login.html");
    res.render("login.ejs")
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const selectUserQuery = 'SELECT * FROM users WHERE username = ?';

  connection.query(selectUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur :', err);
      res.status(500).send('Erreur lors de la connexion.');
    } else {
      const foundUser = results[0];
      console.log(foundUser)
      if (foundUser && foundUser.password === password) {
        res.render("accueil.ejs");
      } else {
        // res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect.');
        const erreur = "erreur sur le mot de passe ou le username"
        res.render("login.ejs",{erreur:erreur});
      }
    }
  });
});

app.post("/register",(req,res) =>{
    const nom = req.body.nom;
    const poste = req.body.poste;
    const username = req.body.username;
    const password = req.body.password;

  const insertUserQuery = 'INSERT INTO users (nom, poste,username, password) VALUES (?, ?,?,?)';

  connection.query(insertUserQuery, [nom,poste,username, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
      res.status(500).send('Erreur lors de l\'inscription.');
    } else {
      console.log('Utilisateur enregistré avec succès');
      // res.sendFile(__dirname+"/views/login.html");
      res.render("login.ejs")

    }
  });

})

app.get("/dashboard",(req,res) =>{
 
    res.render("accueil.ejs")
})
app.get("/personne",(req,res) =>{
    res.render("personne.ejs")
})

app.get('/ajouter', (req, res) => {
  const typeAjout = req.query.type_ajout;

})
app.get("/historique",(req,res) =>{
  res.render("absence.ejs")
})

app.get("/accueil",(req,res) =>{
  res.render("accueil.ejs")
})
// Définir la route pour le formulaire d'ajout de formation
app.get('/ajouter-formation', (req, res) => {
  res.render('formation.ejs');
})

// Gérer la soumission du formulaire d'ajout de formation
app.post('/ajouter-formation', (req, res) => {
  // Logique de traitement des données du formulaire de formation
  // ...

  // Rediriger vers une autre page ou renvoyer une réponse appropriée
  res.send('Formulaire d\'ajout de formation soumis avec succès');
})

// Définir la route pour le formulaire d'ajout d'absence
app.get('/ajouter-absence', (req, res) => {
  res.render('absence.ejs');
})

// Gérer la soumission du formulaire d'ajout d'absence
app.post('/ajouter-absence', (req, res) => {
  // Logique de traitement des données du formulaire d'absence
  // ...

  // Rediriger vers une autre page ou renvoyer une réponse appropriée
  res.send('Formulaire d\'ajout d\'absence soumis avec succès');
})

app.listen(port,()=>{
    console.log(`listenning on port ${port} `)
})