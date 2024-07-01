import { GridSize } from "../lib/types";
import Grid from "../models/Grid";

export function createGrid(gridSize: GridSize): Grid {
  console.log("Your grid size:", gridSize);
  const grid = new Grid(gridSize);
  console.log(
    `Grid ${grid.width}x${gridSize.height} created. Please PLACE robot.`
  );
  return grid;
}

export function createGridSizeFromFileHeader(header: string) {
  const gridLine = header.trim().toUpperCase();
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
  return { height, width };
}
