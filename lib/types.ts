export enum ValidCommand {
  PLACE = "PLACE",
  MOVE = "MOVE",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  REPORT = "REPORT",
  SHOW = "SHOW",
  DESTROY = "DESTROY",
  PRINT = "PRINT",
  EXIT = "EXIT",
}

export enum Direction {
  EAST,
  NORTH,
  WEST,
  SOUTH,
}

export type GridSize = {
  height: number;
  width: number;
};

export type InputType = "FILE" | "USER-INPUT";

export type GridSizePromptChoice = {
  title: string;
  value: GridSize | "Custom";
};

export type InputTypePromptChoice = {
  title: string;
  value: InputType;
};

export type RawCommand = ValidCommand | `${ValidCommand} ${string}`;

export type CommandResult = {
  success: boolean;
  message: string;
};
