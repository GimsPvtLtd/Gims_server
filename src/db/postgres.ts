import { Client } from "pg";

import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PASSWORD,
  port: Number(String(process.env.PGPORT)),
});

client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" ;`, (err) => {
  if (err) {
    console.log(err.stack);
  }
});
client.query(
  "CREATE TABLE IF NOT EXISTS team(id  SERIAL PRIMARY KEY,serialno INT,Name TEXT NOT NULL,Role TEXT NOT NULL,Image TEXT NOT NULL,HeroImg TEXT NOT NULL,IndustryExperience Int,ResearchExperience INT,DesignSkills INT,ProjectManagement INT,Creativity INT,ProgrammingSkills INT,IndustryKnowledge INT,Manufacturing INT,SelfMotivation INT,Stamina INT,Reflex INT,Intelligence INT,HealingFactor INT,Sarcasm INT,Speed INT,email TEXT , linkedin TEXT , number TEXT);",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

// client.query(
//   "CREATE TABLE IF NOT EXISTS image(id UUID NOT NULL PRIMARY KEY,location TEXT NOT NULL);",
//   (err) => {
//     if (err) {
//       console.log(err.stack);
//     }
//   }
// );

client.query(
  "CREATE TABLE IF NOT EXISTS product(id  UUID PRIMARY KEY,	Name TEXT NOT NULL,	type TEXT NOT NULL,	description TEXT NOT NULL,	image TEXT ,	brochure TEXT,technicalspecs TEXT,presentInHomePage boolean , serialno INT,youtubeId TEXT)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS services(id UUID NOT NULL PRIMARY KEY,servicetype TEXT NOT NULL,imglocation TEXT NOT NULL , name TEXT NOT NULL)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS image(id UUID NOT NULL PRIMARY KEY,location TEXT NOT NULL,productId UUID REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS requirements(id UUID NOT NULL PRIMARY KEY,name TEXT,designation TEXT,email TEXT,companyname TEXT,mobile TEXT,address TEXT,fieldofservice TEXT,requirements TEXT,filelocation TEXT,date DATE,serviceid UUID NULL REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE,completedby TEXT NULL REFERENCES usertable(userId),completedOn timestamptz NULL,status TEXT);",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);
client.query(
  "CREATE TABLE IF NOT EXISTS career(id UUID NOT NULL PRIMARY KEY,title TEXT,description TEXT,type TEXT,experience TEXT,domain TEXT,skills TEXT,postedOn DATE,isActive boolean,noOfOpenings INT , totalregistrants INT,location TEXT);",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS faq(id UUID NOT NULL PRIMARY KEY,question TEXT,answer TEXT ,productid UUID REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);
client.query(
  "CREATE TABLE IF NOT EXISTS application(id UUID NOT NULL PRIMARY KEY,name TEXT,email TEXT,mobile TEXT,resumelocation TEXT,careertitle TEXT,careerdomain TEXT,appliedOn DATE,careerid UUID REFERENCES career(id) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS usertable(userId TEXT PRIMARY KEY NOT NULL,emailId TEXT,password TEXT NOT NULL,role TEXT,teammemberId SERIAL REFERENCES team(id) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS timesheet(id UUID NOT NULL PRIMARY KEY,activity TEXT NOT NULL,starttime timestamptz NOT NULL,endtime timestamptz NOT NULL,noOfhours INT NOT NULL,updatedOn timestamptz NOT NULL,userid TEXT REFERENCES usertable(userid) ON DELETE CASCADE ON UPDATE CASCADE,description TEXT)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);

client.query(
  "CREATE TABLE IF NOT EXISTS leave(id UUID NOT NULL PRIMARY KEY,startdate DATE NOT NULL,endDATE DATE NOT NULL,reason TEXT NOT NULL,updatedOn DATE NOT NULL,noOfDays INT NOT NULL,isApproved TEXT,userid TEXT REFERENCES usertable(userid) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err) => {
    if (err) {
      console.log(err.stack);
    }
  }
);
export default client;
