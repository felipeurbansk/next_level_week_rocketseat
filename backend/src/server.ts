import express from "express";

const app = express();

app.get("/users", (request, response) => {
  console.log("Listagem de usuário");

  response.json({ title: "Entrou" });
});

app.listen(3333);
