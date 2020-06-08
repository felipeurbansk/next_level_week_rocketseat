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

    const seriealizedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.100.193:3333/uploads/profile/${point.image}`,
      };
    });

    return response.json(seriealizedPoints);
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

    const seriealizedPoint = {
      ...point,
      image_url: `http://192.168.100.193:3333/uploads/profile/${point.image}`,
    };

    return response.json({ point: seriealizedPoint, items });
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
        image: request.file.filename,
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

        const pointItems = items
          .split(",")
          .map((item: String) => Number(item.trim()))
          .map((item_id: number) => {
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
