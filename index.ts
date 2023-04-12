import * as fs from "fs";
import * as path from "path";

const [moveMultiple = ""] = process.argv.slice(2);
const fileName = process.argv.pop();

const canMoveMultiple = moveMultiple === "--move-multiple";

const filePath: string = path.join(__dirname, "../data/", `${fileName}.txt`);

type Instruction = {
  from: number;
  to: number;
  amount: number;
};

// Visually display all of the stacks.
function printStacks(stacks: string[][]) {
  const maxStackSize = stacks.reduce(
    (prev: number, curr: string[]) => (curr.length > prev ? curr.length : prev),
    0
  );

  for (let y = maxStackSize - 1; y >= 0; y--) {
    console.log(
      stacks
        .map((stack) => (stack.length > y ? `[${stack[y]}]` : "   "))
        .join(" ")
    );
  }
  console.log(stacks.map((_, i) => ` ${i + 1} `).join(" "));
}

// Takes in a file and parses it's structure and instructions input.
function parseInput(inputContent: string): [string[][], Instruction[]] {
  const rows = inputContent.split("\n");

  const stacks: string[][] = [];
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

        if (!stacks[j]) {
          stacks[j] = [];
        }

        stacks[j].unshift(letter);
      }
    } else {
      const match = row.match(
        /move (?<amount>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)/i
      );

      if (!match) {
        console.warn("WARN: invalid instruction at line:", i + 1, `"${row}"`);
        continue;
      }

      const instruction: Instruction = {
        amount: parseInt(match?.groups?.amount as string),
        from: parseInt(match?.groups?.from as string) - 1, // required as array starts at index 0
        to: parseInt(match?.groups?.to as string) - 1, // required as array starts at index 0
      };

      instructions.push(instruction);
    }
  }

  return [stacks, instructions];
}

// Applies the instructions to a clone of the stacks array
function performInstructions(
  stacks: string[][],
  instructions: Instruction[]
): string[][] {
  stacks = structuredClone(stacks);

  for (let i = 0; i < instructions.length; i++) {
    const { from, to, amount } = instructions[i];

    if (stacks[from].length < amount) {
      console.warn(
        "WARN: invalid instruction, can't move",
        amount,
        "from stack",
        from + 1,
        "to stack",
        to + 1
      );
      continue;
    }

    if (!canMoveMultiple) {
      for (let j = 0; j < amount; j++) {
        const crate = stacks[from].pop();

        if (!crate) {
          // should never occur, because of the if statement.
          continue;
        }

        stacks[to].push(crate);
      }
    } else {
      const crates = stacks[from].splice(-amount, amount);
      stacks[to].push(...crates);
    }

    console.log("Instruction #" + (i + 1));
    printStacks(stacks);
    console.log("");
  }

  return stacks;
}

const contents: string = fs.readFileSync(filePath, "utf-8");
const [stacks, instructions] = parseInput(contents);

const result = performInstructions(stacks, instructions);

console.log("The top crates:");
console.log(result.map((stack) => stack[stack.length - 1]).join(""));
