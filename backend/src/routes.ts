import express from "express";
import connection from "./database/connection";

const route = express.Router();

route.get("/", async (request, response) => {
  const items = await connection("items").select("*");
  response.json({ items });
});

export default route;
