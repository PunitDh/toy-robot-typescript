import Grid from "./models/Grid";
import {
  getFileName,
  getUserCommand,
  selectGridSize,
  selectInputType,
} from "./lib/prompts";
import fs from "fs";
import { RawCommand } from "./lib/types";
import Command from "./models/Command";

(async () => {
  const inputType = await selectInputType();
  switch (inputType) {
    case "FILE":
      const filename = await getFileName();
      getFileInput(filename);
      break;
    case "USER-INPUT":
      await getUserInput();
      break;
    default:
      break;
  }
})();

function getFileInput(filename: string) {
  const file = fs.readFileSync(filename, "utf-8");
  const lines = file.split("\n");
  const gridLine = lines[0].trim().toUpperCase();
  if (!gridLine.startsWith("GRID")) {
    console.error(
      "ERROR: Grid size not specified. The first line of the file must be GRID=h,w."
    );
    return;
  }
  const [_, gridSizeRaw] = gridLine.split("=");
  if (!gridSizeRaw.trim()) {
    console.error("ERROR: Invalid grid size.");
    return;
  }

  const [height, width] = gridSizeRaw.split(/x| |,/gi).map(Number);
  const gridSize = { height, width };

  console.log("Your grid size:", gridSize);
  const grid = new Grid(gridSize);
  console.log(
    `Grid ${grid.width}x${gridSize.height} created. Please PLACE robot.`
  );

  for (const line of lines.slice(1)) {
    const inputCommand = Command.parseCommand(
      line.trim().toUpperCase() as RawCommand
    );
    console.log("You entered:", inputCommand.raw);
    if (inputCommand.command === "EXIT") break;
    const commandResult = grid.processCommand(inputCommand);
    if (!commandResult.success) {
      console.error("ERROR:", commandResult.message);
      continue;
    }
    console.log("SUCCESS:", commandResult.message);
  }
}

async function getUserInput() {
  const gridSize = await selectGridSize();
  console.log("Your grid size:", gridSize);
  const grid = new Grid(gridSize);
  console.log(
    `Grid ${grid.width}x${gridSize.height} created. Please PLACE robot.`
  );

  while (true) {
    const inputCommand = await getUserCommand();
    console.log("You entered:", inputCommand.raw);
    if (inputCommand.command === "EXIT") break;
    const commandResult = grid.processCommand(inputCommand);
    if (!commandResult.success) {
      console.error("ERROR:", commandResult.message);
      continue;
    }
    console.log("SUCCESS:", commandResult.message);
  }
}
