// create express variable
const express = require("express");
// create path variable
const path = require("path");
// need fs to read and write to files/ create fs variable
const fs = require("fs");
// creating an "express" server
const app = express();
// Sets Initial port for listeners
const PORT = process.env.PORT || 3000;

//  Initialize notesData

let notesData = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// Routes

// Gets all the notes, and sends the results to the browser as an array of object
app.get("/api/notes", function(err, res) {
    try {
        // goes to the json file to read the notes
        notesData = fs.readFileSync("./db/db.json", "utf8");
        console.log("Api Notes Works!!! ");
        // parse makes note data into an array of objects
        notesData = JSON.parse(notesData);

        // handles error
    } catch (err) {
        console.log("\n error (in app.get.catch):");
        console.log(err);
    }
    //   send objects to the browser
    res.json(notesData);
});

// Posts the new note to the json file
app.post("/api/notes", function(req, res) {
    try {
        // reads the json file
        notesData = fs.readFileSync("./db/db.json", "utf8");
        console.log(notesData);

        // parse the data to get an array of objects
        notesData = JSON.parse(notesData);
        // Set new notes id
        req.body.id = (notesData.length + 1);
        // add the new note to the array of note objects
        notesData.push(req.body); 
        // uses stringify property to make it into a string, so you can write it to the file
        notesData = JSON.stringify(notesData);
        // writes the new note to file
        fs.writeFile("./db/db.json", notesData, "utf8", function(err) {
            // handles error
            if (err) throw err;
        });
        // change it back to an array of objects and send it back to the browser
        res.json(JSON.parse(notesData));

        // handles error
    } catch (err) {
        throw err;
    }
});

// Delete a note
app.delete("/api/notes/:id", function(req, res) {
    try {
        //  reads the json file
        notesData = fs.readFileSync("./db/db.json", "utf8");
        // parse the data to get an array of the objects
        notesData = JSON.parse(notesData);
        // delete the old note from the array on note objects
        notesData = notesData.filter(function(note) {
            return note.id != req.params.id;
        });
        // make it into a string so you can write it to the file
        notesData = JSON.stringify(notesData);
        // write the new notes to the file
        fs.writeFile("././db/db.json", notesData, "utf8", function(err) {
            // handles error
            if (err) throw err;
        });

        // change it back to an array of objects & send it back to the browser (client)
        res.send(JSON.parse(notesData));

        // handles error
    } catch (err) {
        throw err;
    }
});

// HTML GET Requests
// Web page when the Get started button is clicked
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// If no matching route is found default to home
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", function(req, res) {
    return res.sendFile(path.json(__dirname, "./db/db.json"));
});

// Start the server on the port
app.listen(PORT, function() {
    console.log("SERVER IS NOW LISTENING: " + PORT);
});
