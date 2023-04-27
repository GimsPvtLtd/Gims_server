import { Request, Response } from "express";
import client from "../db/postgres";
import jwt from "jsonwebtoken";

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

declare module "express-serve-static-core" {
  export interface Request {
    user: any;
  }
}
export async function addUser(req: Request, res: Response) {
  try {
    const { email, role, password, teammemberId }: any = req.body;
    let userId: string;
    try {
      const { rows } = await client.query("SELECT COUNT(*) FROM usertable");
      console.log(rows[0].count, email, role, password, teammemberId);
      var UID = ("000" + (parseInt(rows[0].count) + 1)).slice(-3);
      userId = `GIMS${UID}`;
      bcrypt.hash(password, 10).then(async (hash: any) => {
        await client.query(
          "INSERT INTO usertable(userid,emailid,password,role,teammemberid) VALUES($1,$2,$3,$4,$5);",
          [userId, email, hash, role, teammemberId]
        );
      });
      return res.status(200).json({ message: "User added", userId: userId });
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM usertable WHERE userid = $1;", [id]);

    return res.status(200).json({ message: "User Deleted" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function getUsers(_: Request, res: Response) {
  const users = await client.query(
    "SELECT userId,name,usertable.role,team.role as jobtitle FROM usertable INNER JOIN team ON usertable.teammemberId = team.Id;"
  );

  return res.status(200).json(users.rows);
}

export async function login(req: Request, res: Response) {
  try {
    const { userId, password, email } = req.body;
    if (!((userId || email) && password)) {
      return res
        .json({ message: "Some Error occured Please Try Again Later" })
        .end();
    }
    let user: any;
    if (userId) {
      const { rows } = await client.query(
        "SELECT userId , role , password FROM usertable WHERE userId = $1",
        [userId]
      );
      user = rows[0];
    }
    if (email) {
      const { rows } = await client.query(
        "SELECT userId,role , password FROM usertable WHERE emailid = $1",
        [email]
      );
      user = rows[0];
    }
    if (!user) {
      return res.json({ message: "Account Not Found" }).end();
    }
    if (user) {
      const checkPass = await bcrypt.compare(password, user?.password);
      if (!checkPass) {
        return res.json({ message: "Invalid Credentials" }).end();
      }

      let token = jwt.sign({ user }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
      });
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   sameSite: "none",
      //   maxAge: 1000 * 60 * 60 * 24 * 365,
      //   secure: true,
      // });
      return res.json({ message: "User logged in", user: user, token }).end();
    }
    return res.end();
  } catch (error) {
    return res.json({ message: error.message }).end();
  }
}

export async function uploadTimesheet(req: Request, res: Response) {
  try {
    const {
      starttime,
      endtime,
      noOfhours,
      description,
      updatedOn,
      activity,
    }: any = req.body;
    try {
      await client.query(
        "INSERT INTO timesheet(id,activity,starttime,endtime,noofhours,updatedOn,userid,description) VALUES ($1 ,$2 , $3 , $4 , $5 , $6,$7,$8);",
        [
          uuidv4(),
          activity,
          starttime,
          endtime,
          noOfhours,
          updatedOn,
          req.user.userid,
          description,
        ]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "TimeSheet Uploaded" });
}
export async function deletetimesheet(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM timesheet WHERE id = $1;", [id]);

    return res.status(200).json({ message: "timesheet Deleted" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function applyLeave(req: Request, res: Response) {
  try {
    const { startDate, endDate, noOfDays, userId, reason, updatedOn }: any =
      req.body;

    try {
      await client.query(
        "INSERT INTO leave(id,startDate,endDate,noofdays,updatedOn,userid,reason,isapproved) VALUES ($1 ,$2 , $3 , $4 , $5 , $6,$7,$8);",
        [
          uuidv4(),
          startDate,
          endDate,
          noOfDays,
          updatedOn,
          userId,
          reason,
          "PENDING",
        ]
      );
    } catch (err) {
      return res.json({ message: err.message }).end();
    }
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
  return res.status(200).json({ message: "Leave Applied" });
}
export async function deleteleave(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM leave WHERE id = $1;", [id]);

    return res.status(200).json({ message: "Leave Deleted" });
  } catch (err) {
    return res.json({ message: err.message }).end();
  }
}
export async function getTimesheet(req: Request, res: Response) {
  const { id } = req.params;
  const timesheet = await client.query(
    "SELECT * FROM timesheet WHERE userid = $1 ORDER BY starttime DESC;",
    [id]
  );

  return res.status(200).json(timesheet.rows);
}

export async function getTimesheetActivity(req: Request, res: Response) {
  const { id } = req.params;
  const timesheet = await client.query(
    "SELECT activity,sum(noofhours) as hours FROM timesheet WHERE userid = $1  GROUP BY activity ;",
    [id]
  );

  return res.status(200).json(timesheet.rows);
}
export async function getLeave(req: Request, res: Response) {
  const { id } = req.params;
  const leave = await client.query(
    "SELECT * FROM leave WHERE userid = $1 ORDER BY startDate DESC;",
    [id]
  );

  return res.status(200).json(leave.rows);
}
export async function getLeaves(_: Request, res: Response) {
  const leave = await client.query(
    "SELECT * FROM leave INNER JOIN usertable ON usertable.userid = leave.userid ORDER BY startDate DESC;"
  );

  return res.status(200).json(leave.rows);
}
export async function ApproveLeave(req: Request, res: Response) {
  const { id, status } = req.body;
  await client.query("UPDATE leave SET isapproved = $1 WHERE id = $2", [
    status,
    id,
  ]);
  return res.status(200).json({ message: "Leave status updated" });
}

export async function ChangePass(req: Request, res: Response) {
  const { password } = req.body;
  bcrypt.hash(password, 10).then(async (hash: any) => {
    await client.query("UPDATE usertable SET password = $1 WHERE userid = $2", [
      hash,
      req.user.userid,
    ]);
  });

  return res.status(200).json({ message: "Password Updated" });
}
