// --- IMPORT MODULE/PACKAGE --
const fs = require("fs");
const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

const ApiLog = chalk.white.bgCyan("API:");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});
//
//
//
/********************************************
 *               ACCOUNT API                *
 ********************************************/
// ======= TAMBAH AKUN BARU =======
app.post("/newuser/:gamertag/:pass/:rank/:money/:xp", (req, res) => {
  const { gamertag, pass, rank, money, xp } = req.params;

  fs.readFile("./assets/database.json", (err, jsonString) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      let data = JSON.parse(jsonString);
      const userExists = data.find((user) => user.gamertag === gamertag);
      if (userExists) {
        res.status(400).json({ error: "Username already exists" });
      } else {
        data.push({
          gamertag: gamertag,
          password: pass,
          rank: rank,
          money: money,
          xp: xp,
        });

        fs.writeFile("./assets/database.json", JSON.stringify(data), (err) => {
          if (err) {
            console.log("Error writing file:", err);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({ message: "Account created successfully" });
          }
        });
      }
    }
  });
});
//
//
// ======= LOGIN =======
app.get("/login/:gamertag/:pass", (req, res) => {
  const { gamertag, pass } = req.params;

  fs.readFile("./assets/database.json", (err, jsonString) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const data = JSON.parse(jsonString);
      const userExists = data.find(
        (user) => user.gamertag === gamertag && user.password === pass
      );
      if (userExists) {
        res.status(200).json({ message: "OK" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});
//
//
// ======= DAPATKAN INFO USER/PLAYER =======
app.get("/user-info/:gamertag", (req, res) => {
  const { gamertag } = req.params;

  fs.readFile("./assets/database.json", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      let jsonData = JSON.parse(data);
      const user = jsonData.find((user) => user.gamertag === gamertag);
      if (user) {
        res
          .status(200)
          .json({ rank: user.rank, money: user.money, xp: user.xp });
      } else {
        res.status(404).json({ error: "Username not found" });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`${ApiLog} Server sedang berjalan di Port ${PORT}`);
});
