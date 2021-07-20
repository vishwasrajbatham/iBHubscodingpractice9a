const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

let db = null;
const dbPath = path.join(__dirname, "userData.db");
const initDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, console.log("Server started at port 3000"));
  } catch (error) {
    console.log(`Db Error : ${error.message}`);
    process.exit(1);
  }
};
initDbAndServer();

//Register user API

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = bcrypt.hash(password, 10);
  const selectQuery = `select * from user where username like '${username}';`;
  const dbUser = await db.get(selectQuery);
  if (dbUser === undefined) {
    if (length(password) < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      response.status(200);
      response.send("User created successfully");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

//Login user API

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `select * from user where username like '${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    isValid = await bcrypt.compare(password, dbUser.password);
    if (isValid) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//Change Password API

app.put("/change-password/", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const selectUserQuery = `select * from user where username like '${username}';`;
  const dbUser = await db.get(selectUserQuery);
  isValid = await bcrypt.compare(password, dbUser.password);
  if (isValid) {
    if (length(newPassword) < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      response.status(200);
      response.send("Password updated");
    }
  } else {
    response.status(400);
    response.send("Invalid current password");
  }
});

module.exports = app;
