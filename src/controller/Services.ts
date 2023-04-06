import { Request, Response } from "express";
import client from "../db/postgres";
import { file } from "src/utils";
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

declare module "express-serve-static-core" {
  export interface Request {
    file: file;
  }
}

export async function addService(req: Request, res: Response) {
  try {
    const { name, type }: any = req.body;
    const imgpath = "./public/services";
    const imgfile = req.files;
    const filenames = name.split("@#$@");
    let imgfiletype;
    const date = Date.now().toString();
    try {
      imgfile.map(async (img: any, ind: any) => {
        imgfiletype = img.mimetype?.split("/")[1];

        await fs.rename(
          `${imgpath}/${img.filename}`,
          `${imgpath}/${
            type + "_" + ind.toString() + date + "." + imgfiletype
          }`,
          () => {}
        );

        await client.query(
          "INSERT INTO services(id,servicetype,imglocation,name) VALUES ($1 ,$2 , $3,$4);",
          [
            uuidv4(),
            type,
            `${
              type + "_" + ind.toString() + date.toString() + "." + imgfiletype
            }`,
            filenames[ind],
          ]
        );
      });
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.json({ message: "Service added" }).end();
}

export async function getService(_: Request, res: Response) {
  const services = await client.query("SELECT * FROM services;");
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Origin','*')
  return res.status(200).json(services.rows);
}

export async function addRequirement(req: Request, res: Response) {
  try {
    const {
      name,
      email,
      designation,
      companyname,
      mobile,
      address,
      fieldofservice,
      requirements,
    } = req.body;

    const filepath = "./public/requirements";
    const file = req.file;
    const filetype = file.mimetype?.split("/")[1];
    const fileloc = `${companyname + "requirement." + filetype}`;
    await fs.rename(
      `${filepath}/${file.filename}`,
      `${filepath}/${companyname + "requirement." + filetype}`,
      () => {}
    );
    try {
      await client.query(
        "INSERT INTO requirements(id,name,email,designation,companyname,mobile,address,fieldofservice,requirements,filelocation,date) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
        [
          uuidv4(),
          name,
          email,
          designation,
          companyname,
          mobile,
          address,
          fieldofservice,
          requirements,
          fileloc,
          new Date().toISOString(),
        ]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }

  return res.json({ message: "Requirement submitted succesfully" }).end();
}

export async function getRequirements(_: Request, res: Response) {
  const requirements = await client.query("SELECT * FROM requirements;");
  return res.status(200).json(requirements.rows);
}
export async function deleteService(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM services WHERE id = $1;", [id]);

    return res.status(200).json({ message: "Service Deleted" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function getRequirement(req: Request, res: Response) {
  const { id } = req.params;
  const requirement = await client.query("SELECT * FROM requirements WHERE id = $1;", [
    id,
  ]);

  return res.status(200).json(requirement.rows[0]);
}
