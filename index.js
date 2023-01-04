// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// Functions to make the converstion of date to timestamp and toUTCString.
const convertToTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

const convertToUTCString = (date) => {

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // console.log(new Date(2015 - 04 - 07).toLocalString());
  return new Date(date).toString();
};

// Gets timestamp and utc string of provided date

app.get("/api/:date", (req, res, next) => {
  const { date } = req.params;
  const checkIfDateDoesNotOnlyHasNumbers = /^\d+$/.test(date);

  if (Date.parse(new Date(date)) && !checkIfDateDoesNotOnlyHasNumbers) {
    const dateToTimestamp = convertToTimestamp(date);
    const dateToUTC = convertToUTCString(date);
    res.json({
      unix: + dateToTimestamp,
      utc: dateToUTC
    });

    return next();
  }

  // Checks Whether the passed Date is really Valid and if not valid it sends an error

  if (!Date.parse(new Date(date)) && !checkIfDateDoesNotOnlyHasNumbers) {
    res.json({
      error: "Invalid Date",
    });

    return next();
  }

  return next();
});

// Runs when date param is not provided and therefore use the current date
app.get("/api", async (req, res, next) => {
  try {
    let date = new Date();
    res.json({

      unix: convertToTimestamp(date),
      utc: convertToUTCString(date),
    });
  } catch (err) {
    res.json({
      status: "Failed",
      message: err.message,
    });
  }

  return next();
});

// Sends Get Request from the provided timestamp when its valid and returns the corresponding "UTC" if not return error
app.get("/api/:timestamp", (req, res, next) => {
  const { timestamp } = req.params;

  const convertTimestampToNumber = +timestamp;
  const checkIfTimestampHasNumbersOnly = /^\d+$/.test(timestamp);

  if (
    Date.parse(new Date(convertTimestampToNumber)) &&
    checkIfTimestampHasNumbersOnly
  ) {
    res.json({
      unix: convertTimestampToNumber,
      utc: convertToUTCString(new Date(convertTimestampToNumber)),
    });
    return next();
  } else {
    res.json({
      error: "Timestamp Not Valid",
    });
  }

  return next();
});

// listen for requests :)
var listener = app.listen(5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
