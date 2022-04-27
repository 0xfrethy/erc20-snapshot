"use strict";

const fs = require("fs");
const path = require("path");

const { promisify } = require("util");

const Parameters = require("../parameters").get();

const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

const getMinimal = (pastEvents) => {
  return pastEvents.map((tx) => {
    return {
      blockNumber: tx.blockNumber,
      transactionHash: tx.transactionHash,
      from: tx.returnValues["0"],
      to: tx.returnValues["1"],
      value: tx.returnValues["2"],
      type: tx.event
    };
  });
};

module.exports.getEvents = async (symbol) => {
  const directory = Parameters.eventsDownloadFolder.replace(/{token}/g, symbol);
  const files = await readdirAsync(directory);
  let events = [];

  console.log("Parsing files.");

  for await (const file of files) {
    console.log("Parsing ", file);

    const contents = await readFileAsync(path.join(directory, file));
    const parsed = JSON.parse(contents.toString());
    console.log("parsed: ", parsed);
    events = events.concat(getMinimal(parsed));
  }

  console.log("events: ", events);

  return events;
};
