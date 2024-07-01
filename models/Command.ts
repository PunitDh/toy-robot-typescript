import { RawCommand, ValidCommand } from "../lib/types";

export default class Command {
  raw: RawCommand;
  command: ValidCommand | null;
  args: string[];

  constructor(rawCommand: RawCommand) {
    this.raw = rawCommand;
    this.command = null;
    this.args = [];
  }

  static isValidCommand(command: RawCommand): command is ValidCommand {
    return Object.keys(ValidCommand).includes(
      command.split(" ")[0].trim().toUpperCase()
    );
  }

  static parseCommand(rawCommand: RawCommand): Command {
    if (this.isSingleWordCommand(rawCommand)) {
      const command = new Command(rawCommand);
      command.command = rawCommand;
      command.args = [];
      return command;
    }

    const spaceCharacterIndex = rawCommand.indexOf(" ");
    const [cmd, commandArguments] = [
      rawCommand.slice(0, spaceCharacterIndex) as ValidCommand,
      rawCommand.slice(spaceCharacterIndex + 1),
    ];

    const command = new Command(cmd);

    command.args = commandArguments.split(/ |,/g);
    command.raw = `${cmd} ${command.args.join(",")}` as RawCommand;
    command.command = cmd;

    return command;
  }

  private static isSingleWordCommand(
    command: RawCommand
  ): command is ValidCommand {
    return command.indexOf(" ") < 0;
  }
}
