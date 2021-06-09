const express = require("express");
var dbConn = require("../db-config/db");
const router = express.Router();
dbConn.connect((err) => {
  if (!err) console.log("Connection Established Successfully");
  else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});
//get all actors
router.get("/actors", async (req, res) => {
  await dbConn.query("Select * from actor", function (err, response) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      res.json(response);
    }
  });
});

//get actor by id
router.get("/actors/searchid/:id", async (req, res) => {
  const id = req.params.id;
  await dbConn.query(
    "Select * from actor where actor_id =?",
    [id],
    (err, response) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        if (response.length == 0)
          res
            .status(400)
            .json({ message: "didn't find any actor with the id specified" });
        else res.json(response);
      }
    }
  );
});

//get actor by name for search feature
router.get("/actors/searchname/:name", async (req, res) => {
  const name = req.params.name;
  await dbConn.query(
    "Select * from actor where first_name like ? or last_name like ?",
    [name + "%", name + "%"],
    (err, response) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        if (response.length == 0)
          res
            .status(400)
            .json({ message: "didn't find any actor with the name specified" });
        else res.json(response);
      }
    }
  );
});

//updating actor details
router.put("/actor/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { actor_id, first_name, last_name } = req.body;
  const last_update = new Date().toISOString().slice(0, 19).replace("T", " ");
  await dbConn.query(
    "UPDATE actor SET actor_id =?,first_name=?,last_name=?,last_update=? where actor_id=?",
    [actor_id, first_name, last_name, last_update, id],
    (err, response) => {
      if (err) {
        res.status(404).json({ message: err.sqlMessage });
      } else {
        res.json({ message: `actor updated of id ${actor_id}` });
      }
    }
  );
});

//adding a user
router.post("/actor/add", async (req, res) => {
  const { actor_id, first_name, last_name } = req.body;
  const last_update = new Date().toISOString().slice(0, 19).replace("T", " ");
  await dbConn.query(
    "insert into actor values(?,?,?,?)",
    [actor_id, first_name, last_name, last_update],
    (err, response) => {
      if (err) {
        res.status(404).json({ message: err.sqlMessage });
      } else {
        res.status(200).json({ message: `actor added of id ${actor_id}` });
      }
    }
  );
});

//to delete a actor
router.delete("/actor/delete/:id", async (req, res) => {
  const actor_id = req.params.id;
  await dbConn.query(
    "DELETE FROM actor WHERE actor_id=?;",
    [actor_id],
    (err, response) => {
      if (err) {
        res.status(404).json({ message: err.sqlMessage });
      } else {
        if (response.affectedRows == 0) {
          res
            .status(404)
            .json({ message: `actor with  id ${actor_id} is not found ` });
        } else {
          res
            .status(200)
            .json({ message: `actor with  id ${actor_id} deleted ` });
        }
      }
    }
  );
});

module.exports = router;
