import * as fs from "fs";
import * as path from "path";

const [fileName] = process.argv.slice(2);

const filePath: string = path.join(__dirname, "../data/", `${fileName}.txt`);

type Instruction = {
  from: number;
  to: number;
  amount: number;
};

function parseInput(inputContent: string): [string[][], Instruction[]] {
  const rows = inputContent.split("\n");

  const structure: string[][] = [];
  const instructions: Instruction[] = [];

  let fillStructureRows = true;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trimEnd();

    // row is empty
    if (!row) {
      fillStructureRows = !fillStructureRows;
      continue;
    }

    if (fillStructureRows) {
      const totalBoxes = Math.ceil(row.length / 4);

      for (let j = 0; j < totalBoxes; j++) {
        const pos = j + 1 + j * 3;
        const letter = row[pos].trim();
        const isCrate = row[pos - 1] === "[" && row[pos + 1] === "]";

        if (!letter || !isCrate) {
          continue;
        }

        if (!structure[j]) {
          structure[j] = [];
        }

        structure[j].unshift(letter);
      }
    } else {
      const match = row.match(
        /move (?<amount>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)/i
      );

      if (!match) {
        console.warn("WARN: invalid instruction at line:", i, `"${row}"`);
        continue;
      }

      const instruction: Instruction = {
        amount: parseInt(match?.groups?.amount as string),
        from: parseInt(match?.groups?.from as string),
        to: parseInt(match?.groups?.to as string),
      };

      instructions.push(instruction);
    }
  }

  return [structure, instructions];
}

const contents: string = fs.readFileSync(filePath, "utf-8");
const [rows, instructions] = parseInput(contents);

console.log(rows, instructions);
