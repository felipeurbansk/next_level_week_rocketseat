import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  return knex("items")
    .del()
    .then(() => {
      return knex("items").insert([
        { image: "lampadas.svg", title: "Lâmpadas" },
        { image: "baterias.svg", title: "Pilhas e Baterias" },
        { image: "papeis-papelao.svg", title: "Papéis e Papelão" },
        { image: "eletronicos.svg", title: "Resíduos Eletrônicos" },
        { image: "oleo.svg", title: "Resíduos Orgânicos" },
        { image: "organico.svg", title: "Oléo de Cozinha" },
      ]);
    });
}
