import { faker } from '@faker-js/faker';
import mysql from 'mysql2/promise';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});


let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};


app.get("/", async (req, res) => {

  let q = `SELECT count(*) FROM user`;
  try {
    const [result] = await connection.query(q);
    let count = result[0]["count(*)"];
    res.render("home.ejs", { count });
  } catch (err) {
    res.status(500).send("some error");
  }
});


app.post("/user", async (req, res) => {
  let {username, email, password} = req.body;
  if (!username?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).send('Username, email, and password are all required!');
  }

  let q = `SELECT username, email FROM user WHERE email = ? OR username = ? LIMIT 1`;
  try {
    const [result] = await connection.query(q, [email, username]);
    if(result.length>0) {
      return res.status(409).send('Username or email already exists!');
    } else {
      let q2 = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;
      let values = [uuidv4(), username.trim(), email.trim(), password];
      const [result] = await connection.query(q2, values);
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).send("some error");
  }
});


app.get("/user", async (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    const [users] = await connection.query(q);
    // let count = result[0]["count(*)"];
    res.render("showuser.ejs", {users});
  } catch (err) {
    res.status(500).send("some error");
  }
});


app.get("/user/:id/edit", async (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    const [result] = await connection.query(q);
    let user = result[0];
    res.render("edit.ejs", {user});
  } catch (err) {
    res.status(500).send("some error");
  }
});


app.get("/user/:id/delete", async (req, res) => {
  let {id} = req.params;
  let q = `DELETE FROM user WHERE id = ?`;
  try {
    await connection.query(q, [id]);
    res.redirect("/user");
  } catch (err) {;
    res.status(500).send("some error");
  }
});


app.patch("/user/:id", async (req,res) => {
  let {id} = req.params;
  let {password: formPass, username: newUser} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    const [result] = await connection.query(q);
    let user = result[0];
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (formPass !== user.password) {
      return res.status(401).send("Wrong Password");
    }
    await connection.query("UPDATE user SET username = ? WHERE id = ?", [newUser, id]);
    res.redirect("/user");
  } catch (err) {
    res.status(500).send("some error");
  }
});


app.listen("8080", () => {
  console.log("Server is up and listening port: 8080");
});
