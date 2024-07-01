import {
  getFileName,
  getUserCommand,
  selectGridSize,
  selectInputType,
} from "./lib/prompts";
import fs from "fs";
import { InputType, RawCommand } from "./lib/types";
import Command from "./models/Command";
import { createGrid, createGridSizeFromFileHeader } from "./factory/GridFactory";

(async () => {
  const inputType = await selectInputType();
  switch (inputType) {
    case InputType.FILE:
      const filename = await getFileName();
      getFileInput(filename);
      break;
    case InputType.USER:
      await getUserInput();
      break;
    default:
      break;
  }
})();

function getFileInput(filename: string) {
  const file = fs.readFileSync(filename, "utf-8");
  const lines = file.split("\n");
  const gridSize = createGridSizeFromFileHeader(lines[0]);
  if (!gridSize) return;
  const grid = createGrid(gridSize);

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
  const grid = createGrid(gridSize);

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
