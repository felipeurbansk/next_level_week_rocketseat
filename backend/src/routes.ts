import express from "express";

const route = express.Router();

route.get("/", (request, response) => {
  response.json({ success: "Entrou" });
});

export default route;
