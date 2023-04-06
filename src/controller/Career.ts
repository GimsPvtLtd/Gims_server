import { Request, Response } from "express";
import client from "../db/postgres";
import { file } from "src/utils";
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
declare module "express-serve-static-core" {
  export interface Request {
    file: file;
  }
}

export async function addCareer(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      type,
      experience,
      domain,
      skills,
      noOfOpenings,
      location,
    }: any = req.body;

    try {
      await client.query(
        "INSERT INTO career(id,title,description,type,experience,domain,skills,postedOn,isActive,noOfOpenings ,totalregistrants,location) VALUES ($1 ,$2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 ,$11,$12);",
        [
          uuidv4(),
          title,
          description,
          type,
          experience,
          domain,
          skills,
          new Date().toISOString(),
          true,
          noOfOpenings,
          0,
          location,
        ]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "Career added" });
}

export async function getcareers(_: Request, res: Response) {
  const career = await client.query("SELECT * FROM career;");

  return res.status(200).json(career.rows);
}

export async function getcareer(req: Request, res: Response) {
  const { id } = req.params;
  const career = await client.query("SELECT * FROM career WHERE id = $1;", [
    id,
  ]);

  return res.status(200).json(career.rows);
}
export async function updatecareer(req: Request, res: Response) {
  const { id, status } = req.body;
  try {
    await client.query("UPDATE career SET isactive = $1 WHERE id = $2;", [
      status,
      id,
    ]);

    return res.status(200).json({ message: "Status Updated" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}

export async function uploadresume(req: Request, res: Response) {
  try {
    const {
      name,
      careerId,
      email,
      mobilenumber,
      careertitle,
      careerdomain,
    }: any = req.body;

    const filepath = "./public/applications";
    const file = req.file;
    const filetype = file.mimetype?.split("/")[1];
    const date = Date.now();
    await fs.rename(
      `${filepath}/${file.filename}`,
      `${filepath}/${
        careerId +
        "_" +
        name +
        "_" +
        email +
        "_" +
        date.toString() +
        "." +
        filetype
      }`,
      () => {}
    );

    try {
      await client.query(
        "INSERT INTO application(id,name,email,mobile,resumelocation,careerid,careertitle,careerdomain,appliedOn) VALUES ($1 ,$2 , $3 , $4 , $5 , $6,$7,$8,$9);",
        [
          uuidv4(),
          name,
          email,
          mobilenumber,
          `${
            careerId +
            "_" +
            name +
            "_" +
            email +
            "_" +
            date.toString() +
            "." +
            filetype
          }`,
          careerId,
          careertitle,
          careerdomain,
          new Date().toISOString(),
        ]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "Resume Uploaded" });
}

export async function getApplications(_: Request, res: Response) {
  const applications = await client.query("SELECT * FROM application;");
  return res.status(200).json(applications.rows);
}
