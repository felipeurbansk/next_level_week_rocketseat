import knex from "../database/connection";
import { Request, Response } from "express";

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex("items").select("*");

    const itemsSerialzed = items.map((item) => ({
      id: item.id,
      name: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    }));

    return response.json(itemsSerialzed);
  }
}

export default ItemsController;
