import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json({ points });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point)
      return response
        .status(400)
        .json({ error: "Nenhum ponto encontrado com esse id." });

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    try {
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items,
      } = request.body;

      const point = {
        image:
          "https://images.unsplash.com/photo-1580913428023-02c695666d61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };

      await knex.transaction(async (trx) => {
        const [id] = await trx("points").insert(point);

        const pointItems = items.map((item_id: number) => {
          return {
            point_id: id,
            item_id,
          };
        });

        await trx("point_items").insert(pointItems);

        response.json({
          ...point,
          id,
        });
      });
    } catch (err) {
      console.log({ err });
    }
  }
}

export default PointsController;
