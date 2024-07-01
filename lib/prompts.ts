import prompts from "prompts";
import {
  GridSize,
  GridSizePromptChoice,
  InputType,
  InputTypePromptChoice,
  RawCommand,
} from "./types";
import fs from "fs";
import Command from "../models/Command";

const GridSizePromptChoices: GridSizePromptChoice[] = [
  {
    title: "3x3",
    value: { height: 3, width: 3 },
  },
  { title: "4x4", value: { height: 4, width: 4 } },
  { title: "5x5", value: { height: 5, width: 5 } },
  { title: "10x10", value: { height: 10, width: 10 } },
  { title: "Custom", value: "Custom" },
];

const InputTypePromptChoices: InputTypePromptChoice[] = [
  { title: "User Input", value: InputType.USER },
  { title: "File", value: InputType.FILE },
];

export async function selectInputType(): Promise<InputType> {
  const prompt = await prompts({
    type: "select",
    name: "inputType",
    message: "Choose an input type:",
    choices: InputTypePromptChoices,
  });
  return prompt.inputType as InputType;
}

export async function getFileName(): Promise<string> {
  const prompt = await prompts({
    type: "text",
    name: "filename",
    message: "Enter file name:",
    validate: (filename) =>
      fs.existsSync(filename) ||
      `Invalid filename or no such file found: '${filename}'`,
  });
  return prompt.filename;
}

export async function selectGridSize(): Promise<GridSize> {
  const prompt = await prompts({
    type: "select",
    name: "gridSize",
    message: "Choose a grid size:",
    choices: GridSizePromptChoices,
  });

  if (prompt.gridSize === "Custom") {
    return await chooseCustomGridSize();
  }
  return prompt.gridSize as GridSize;
}

async function chooseCustomGridSize(): Promise<GridSize> {
  const heightInput = await prompts({
    type: "number",
    name: "height",
    message: "Enter grid height:",
    validate: (height: string) =>
      Number(height) > 0 || `'${height}' is not a valid grid height`,
  });
  const widthInput = await prompts({
    type: "number",
    name: "width",
    message: "Enter grid width:",
    validate: (width: string) =>
      Number(width) > 0 || `'${width}' is not a valid grid width`,
  });
  return {
    height: heightInput.height,
    width: widthInput.width,
  };
}

export async function getUserCommand(): Promise<Command> {
  const prompt = await prompts({
    type: "text",
    name: "command",
    message: "Enter a command:",
    validate: (command: RawCommand) =>
      Command.isValidCommand(command) || `'${command}' is not a valid command`,
  });
  return Command.parseCommand(prompt.command.toUpperCase());
}
