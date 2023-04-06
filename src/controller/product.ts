import { Request, Response } from "express";
import client from "../db/postgres";
import { file } from "../utils";
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

declare module "express-serve-static-core" {
  export interface Request {
    files: file[];
  }
}

export async function addproduct(req: Request, res: Response) {
  try {
    const { name, type, description, technicalspecs }: any = req.body;
    const imgpath = "./public/products";
    const brochurepath = "./public/products";
    const imgfile = req.files[0];
    const brochurefile = req.files[1];
    const imgfiletype = imgfile.mimetype?.split("/")[1];
    const brochureimgfiletype = brochurefile.mimetype?.split("/")[1];
    const imgloc = `${name + "." + imgfiletype}`;
    const brochureimgloc = `${name + "brochure." + brochureimgfiletype}`;
    await fs.rename(
      `${imgpath}/${imgfile.filename}`,
      `${imgpath}/${name + "." + imgfiletype}`,
      () => {}
    );
    await fs.rename(
      `${brochurepath}/${brochurefile.filename}`,
      `${brochurepath}/${name + "brochure." + brochureimgfiletype}`,
      () => {}
    );

    try {
      await client.query(
        "INSERT INTO product(name,type,description,image,brochure,technicalspecs) VALUES ($1 ,$2 , $3 , $4 , $5 , $6);",
        [name, type, description, imgloc, brochureimgloc, technicalspecs]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "Product added" });
}

export async function getproducts(_: Request, res: Response) {
  const team = await client.query("SELECT * FROM product;");
  return res.status(200).json(team.rows);
}

export async function getproduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await client.query("SELECT * FROM product WHERE id = $1;", [
    id,
  ]);

  return res.status(200).json(product.rows);
}
export async function deleteproduct(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM product WHERE id = $1;", [id]);

    return res.status(200).json({ message: "Product Deleted" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function getfaq(req: Request, res: Response) {
  const { id } = req.params;
  const faq = await client.query("SELECT * FROM faq WHERE productId = $1;", [
    id,
  ]);

  return res.status(200).json(faq.rows);
}

export async function addfaq(req: Request, res: Response) {
  try {
    const { question, answer, productId } = req.body;
    console.log(req.body);
    try {
      await client.query(
        "INSERT INTO faq(id,question,answer,productId) VALUES ($1 ,$2 , $3 , $4 );",
        [uuidv4(), question, answer, productId]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "FAQ added" });
}
export async function deletefaq(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM faq WHERE id = $1;", [id]);

    return res.status(200).json({ message: "faq Deleted" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function addImage(req: Request, res: Response) {
  try {
    const { productId } = req.body;
    const imgpath = "./public/products";
    const imgfile = req.files;

    const product = await client.query(
      "SELECT name FROM product where id = $1",
      [productId]
    );
    let imgfiletype;
    const date = Date.now().toString();
    try {
      imgfile.map(async (img: any, ind: any) => {
        imgfiletype = img.mimetype?.split("/")[1];

        await fs.rename(
          `${imgpath}/${img.filename}`,
          `${imgpath}/${
            product.rows[0].name +
            "_" +
            ind.toString() +
            date +
            "." +
            imgfiletype
          }`,
          () => {}
        );

        await client.query(
          "INSERT INTO image(id,location,productId) VALUES ($1 ,$2 , $3);",
          [
            uuidv4(),
            `${
              product.rows[0].name +
              "_" +
              ind.toString() +
              date.toString() +
              "." +
              imgfiletype
            }`,
            productId,
          ]
        );
      });
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.json({ message: "Images uploaded" }).end();
}

export async function getImages(req: Request, res: Response) {
  const { id } = req.params;
  const faq = await client.query("SELECT * FROM image WHERE productId = $1;", [
    id,
  ]);

  return res.status(200).json(faq.rows);
}
