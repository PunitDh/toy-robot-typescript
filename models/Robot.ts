import { errorMessage, successMessage } from "../lib/messages";
import Grid from "./Grid";
import { CommandResult, Direction } from "../lib/types";
import Command from "./Command";

export default class Robot {
  x: number;
  y: number;
  placed: boolean;
  direction: Direction;
  private grid: Grid;

  constructor(grid: Grid) {
    this.x = -1;
    this.y = -1;
    this.direction = Direction.EAST;
    this.placed = false;
    this.grid = grid;
  }

  place(x: number, y: number): CommandResult {
    if (isNaN(x) || isNaN(y)) {
      return errorMessage(`Invalid PLACE arguments: ${x}, ${y}`);
    }

    if (x > this.grid.width || x < 0 || y > this.grid.height || y < 0) {
      return errorMessage(`Robot cannot be placed at: ${x},${y}.`);
    } else {
      this.x = x;
      this.y = y;
      this.placed = true;
      return successMessage(
        `Robot has been placed at: ${x},${y} facing ${
          Direction[this.direction]
        }.`
      );
    }
  }

  executeCommand(inputCommand: Command): CommandResult {
    switch (inputCommand.command) {
      case "LEFT":
        return this.turnLeft();
      case "RIGHT":
        return this.turnRight();
      case "REPORT":
        return this.report();
      case "SHOW":
        return this.show();
      case "MOVE":
        const length = Number(inputCommand.args[0]);
        return this.move(isNaN(length) ? 1 : length);
      default:
        break;
    }

    return successMessage(inputCommand.raw);
  }

  private move(steps: number): CommandResult {
    let success: boolean = false;
    const [prev_x, prev_y] = [this.x, this.y];

    switch (this.direction) {
      case Direction.EAST:
        if (this.x + steps >= this.grid.width) {
          success = false;
          break;
        }
        this.x += steps;
        success = true;
        break;
      case Direction.WEST:
        if (this.x - steps < 0) {
          success = false;
          break;
        }
        this.x -= steps;
        success = true;
        break;
      case Direction.NORTH:
        if (this.y - steps < 0) {
          success = false;
          break;
        }
        this.y -= steps;
        success = true;
        break;
      case Direction.SOUTH:
        if (this.y + steps >= this.grid.height) {
          success = false;
          break;
        }
        this.y += steps;
        success = true;
        break;
      default:
        break;
    }

    if (success) {
      this.grid.updateGrid(prev_x, prev_y);
      return successMessage(
        `Robot has moved ${steps} steps to ${this.x},${this.y} facing ${
          Direction[this.direction]
        }.`
      );
    }
    return errorMessage(
      `Robot cannot move ${steps} steps ${Direction[this.direction]}`
    );
  }

  private turnLeft(): CommandResult {
    this.direction =
      this.direction === Direction.SOUTH ? Direction.EAST : this.direction + 1;
    return successMessage(`Robot is now facing ${Direction[this.direction]}.`);
  }

  private turnRight(): CommandResult {
    this.direction =
      this.direction === Direction.EAST ? Direction.SOUTH : this.direction - 1;
    return successMessage(`Robot is now facing ${Direction[this.direction]}.`);
  }

  private report(): CommandResult {
    return successMessage(
      `Robot is at ${this.x},${this.y} facing ${Direction[this.direction]}.`
    );
  }

  private show(): CommandResult {
    this.grid.printGrid();
    return successMessage(
      `Robot is at ${this.x},${this.y} facing ${Direction[this.direction]}.`
    );
  }
}
