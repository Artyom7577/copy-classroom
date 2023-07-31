const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

const url = "mongodb://localhost:27017";
const dbName = "Students";
const collectionName = "StudentsList";
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());
let client;

function formatData(data) {
  const formattedData = {};

  data.forEach((item) => {
    const { _id, name, ...rest } = item;
    const key = name;
    formattedData[key] = rest.timeslots.reduce((acc, curr) => {
      const time = curr.time;
      acc[time] = curr.schedule;
      return acc;
    }, {});
  });

  return formattedData;
}

app.get("/api/classrooms", async (req, res) => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();
    const formattedData = formatData(data);

    res.json(formattedData);

    client.close();
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/classrooms/:person/:time/:day", async (req, res) => {
  const person = req.params.person;
  const time = req.params.time;
  const day = req.params.day;

  try {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(
      {
        name: person,
        [`timeslots.time`]: time,
        [`timeslots.schedule.${day}`]: { $exists: true },
      },
      { $unset: { [`timeslots.$.schedule.${day}`]: 1 } }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }

    res.json({ message: "Schedule entry deleted successfully" });

    client.close();
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/classrooms/:name/:time/:day", async (req, res) => {
  try {
    const name = req.params.name;
    const time = req.params.time;
    const day = req.params.day;

    // Create a new schedule entry object with the updated data
    const newEntry = {
      [`timeslots.$[slot].schedule.${day}`]: {
        group: req.body.group,
        teacher: req.body.teacher,
        rec: req.body.rec,
        reserved: req.body.reserved || false,
      },
    };

    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Update the schedule entry for the specified name, matching the correct timeslot using the $[slot] array filter
    const result = await collection.updateOne(
      {
        name: name,
        "timeslots.time": time,
      },
      { $set: newEntry },
      { arrayFilters: [{ "slot.time": time }] } // Use arrayFilters to match the correct timeslot
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }

    res.json({ message: "Schedule entry updated successfully" });

    client.close();
  } catch (err) {
    console.error("Error updating schedule entry:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
