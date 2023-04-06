import { Request, Response } from "express";
import client from "../db/postgres";
import { file } from "../utils";
const fs = require("fs");

declare module "express-serve-static-core" {
  export interface Request {
    files: file[];
  }
}

export async function addmember(req: Request, res: Response) {
  const {
    name,
    role,
    serialno,
    industryexperience,
    researchexperience,
    designskills,
    projectmanagement,
    creativity,
    programmingskills,
    industryknowledge,
    manufacturing,
    selfmotivation,
    stamina,
    reflex,
    intelligence,
    healingfactor,
    sarcasm,
    speed,
    email,
    linkedin,
    number,
  }: any = req.body;
  const imgpath = "./public/images";
  const imgfile = req.files[0];
  const herofile = req.files[1];
  const imgfiletype = imgfile.mimetype?.split("/")[1];
  const heroimgfiletype = herofile.mimetype?.split("/")[1];
  const imgloc = `${name + "." + imgfiletype}`;
  const heroimgloc = `${name + "hero." + heroimgfiletype}`;
  await fs.rename(
    `${imgpath}/${imgfile.filename}`,
    `${imgpath}/${name + "." + imgfiletype}`,
    () => {}
  );
  await fs.rename(
    `${imgpath}/${herofile.filename}`,
    `${imgpath}/${name + "hero." + heroimgfiletype}`,
    () => {}
  );

  try {
    await client.query(
      "INSERT INTO Team(name,serialno,role,image,heroimg,industryexperience,researchexperience,designskills,projectmanagement,creativity,programmingskills,industryknowledge,manufacturing,selfmotivation,stamina,reflex,intelligence,healingfactor,sarcasm,speed,email,linkedin,number) VALUES ($1 ,$2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 ,$11 ,$12 , $13 , $14 , $15,$16 , $17 , $18 , $19,$20,$21,$22 ,$23);",
      [
        name,
        serialno,
        role,
        imgloc,
        heroimgloc,
        industryexperience,
        researchexperience,
        designskills,
        projectmanagement,
        creativity,
        programmingskills,
        industryknowledge,
        manufacturing,
        selfmotivation,
        stamina,
        reflex,
        intelligence,
        healingfactor,
        sarcasm,
        speed,
        email,
        linkedin,
        number,
      ]
    );
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "Team Member added" });
}

export async function getMembers(_: Request, res: Response) {
  const team = await client.query("SELECT * FROM Team ORDER BY serialno ASC;");

  return res.status(200).json(team.rows);
}

export async function deleteMember(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM Team WHERE id = $1;", [id]);
  } catch (err) {
    return res.json({ message: err.message }).end();
  }

  return res.status(200).json({ message: "Team Member Deleted" });
}
