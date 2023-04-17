import express, { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import client from "./db/postgres";
import { addmember, deleteMember, getMembers } from "./controller/team";
import {
  addImage,
  addfaq,
  addproduct,
  deletefaq,
  deleteproduct,
  getImages,
  getfaq,
  getproduct,
  getproducts,
} from "./controller/product";
import {
  addRequirement,
  addService,
  deleteService,
  getRequirement,
  getRequirements,
  getService,
} from "./controller/Services";
import {
  addCareer,
  getApplications,
  getcareer,
  getcareers,
  updatecareer,
  uploadresume,
} from "./controller/Career";
import {
  ApproveLeave,
  addUser,
  applyLeave,
  deleteUser,
  deleteleave,
  deletetimesheet,
  getLeave,
  getLeaves,
  getTimesheet,
  getTimesheetActivity,
  getUsers,
  login,
  uploadTimesheet,
} from "./controller/User";
import { authMiddleware } from "./utils";

dotenv.config();

const app = express();
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "./public/images/" });

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Add team member
const whitelist = ["https://gimsindia.in", "http://www.gimsindia.in"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/service", getService);
app.get("/teammembers", getMembers);
app.get("/product", getproducts);
app.get("/product/:id", getproduct);
app.get("/faq/:id", getfaq);
app.get("/image/:id", getImages);
app.get("/careers", getcareers);
app.get("/career/:id", getcareer);

app.post(
  "/addrequirement",
  multer({ dest: "./public/requirements" }).single("requirement"),
  addRequirement
);
app.post(
  "/uploadresume",
  multer({ dest: "./public/applications" }).single("resume"),
  uploadresume
);
app.get("/users", getUsers);
app.post("/login", login);

app.post(
  "/addservice",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  multer({ dest: "./public/services" }).any("serviceImg", 10),
  addService
);
app.get(
  "/requirement",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getRequirements
);
app.get(
  "/requirement/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getRequirement
);
app.post(
  "/addcareer",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  addCareer
);
app.put(
  "/career",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  updatecareer
);
app.get(
  "/application",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getApplications
);
app.post(
  "/uploadtimesheet",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  uploadTimesheet
);
app.delete(
  "/timesheet/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  deletetimesheet
);
app.get(
  "/timesheet/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getTimesheet
);
app.get(
  "/timesheetactivity/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getTimesheetActivity
);
app.post(
  "/applyleave",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  applyLeave
);
app.get(
  "/leave/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getLeave
);
app.delete(
  "/leave/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  deleteleave
);
app.get(
  "/leaves",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  getLeaves
);
app.post(
  "/approveleave",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  ApproveLeave
);
app.delete(
  "/faq/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  deletefaq
);
app.delete(
  "/product/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  deleteproduct
);
app.post(
  "/addproduct",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  multer({ dest: "./public/products" }).any("uploadedproduct", 2),
  addproduct
);
app.post(
  "/upload/faq",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  addfaq
);
app.post(
  "/upload/image",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  multer({ dest: "./public/products" }).any("uploadedImg", 10),
  addImage
);
app.delete(
  "/service/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN", "ENGINEER"]);
  },
  deleteService
);
app.post(
  "/addmember",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN"]);
  },
  upload.any("uploadedImages", 2),
  addmember
);
app.delete(
  "/deletemember/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN"]);
  },
  deleteMember
);
app.post(
  "/adduser",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN"]);
  },
  addUser
);
app.delete(
  "/user/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next, ["ADMIN"]);
  },
  deleteUser
);

client.connect().then(() => {
  console.log("Connected to database");
  app.listen(process.env.PORT, () =>
    console.log("Listening on port " + process.env.PORT)
  );
});
