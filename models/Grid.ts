import { errorMessage, successMessage } from "../lib/messages";
import Robot from "./Robot";
import { CommandResult, GridSize } from "../lib/types";
import Command from "./Command";

export default class Grid {
  height: number;
  width: number;
  robot: Robot | null;
  private grid: number[][];

  constructor(gridSize: GridSize) {
    this.height = gridSize.height;
    this.width = gridSize.width;
    this.robot = null;
    this.grid = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(0));
  }

  printGrid() {
    console.log(this.grid);
  }

  processCommand(inputCommand: Command): CommandResult {
    switch (inputCommand.command) {
      case "PRINT":
        this.printGrid();
        return successMessage();
      case "DESTROY":
        if (this.robot?.placed) {
          this.grid[this.robot.y][this.robot.x] = 0;
          this.robot = null;
          return successMessage("Robot has been destroyed");
        }
        return errorMessage("Robot hasn't been placed yet.");
      case "PLACE": {
        if (this.robot?.placed) {
          return errorMessage("Robot has already been placed.");
        }
        const robot = new Robot(this);
        const x = Number(inputCommand.args[0]);
        const y = Number(inputCommand.args[1]);
        const placeResult = robot.place(x, y);
        if (placeResult.success) {
          this.grid[y][x] = 1;
          this.robot = robot;
        }
        return placeResult;
      }

      default:
        if (this.robot?.placed) return this.robot.executeCommand(inputCommand);
        return errorMessage("Robot hasn't been placed yet.");
    }
  }

  updateGrid(prev_x: number, prev_y: number) {
    this.grid[prev_y][prev_x] = 0;
    if (this.robot?.placed) this.grid[this.robot.y][this.robot.x] = 1;
  }
}
