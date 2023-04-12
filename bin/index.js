"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const [moveMultiple = ""] = process.argv.slice(2);
const fileName = process.argv.pop();
const canMoveMultiple = moveMultiple === "--move-multiple";
const filePath = path.join(__dirname, "../data/", `${fileName}.txt`);
// Visually display all of the stacks.
function printStacks(stacks) {
    const maxStackSize = stacks.reduce((prev, curr) => (curr.length > prev ? curr.length : prev), 0);
    for (let y = maxStackSize - 1; y >= 0; y--) {
        console.log(stacks
            .map((stack) => (stack.length > y ? `[${stack[y]}]` : "   "))
            .join(" "));
    }
    console.log(stacks.map((_, i) => ` ${i + 1} `).join(" "));
}
// Takes in a file and parses it's structure and instructions input.
function parseInput(inputContent) {
    var _a, _b, _c;
    const rows = inputContent.split("\n");
    const stacks = [];
    const instructions = [];
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
        }
        else {
            const match = row.match(/move (?<amount>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)/i);
            if (!match) {
                console.warn("WARN: invalid instruction at line:", i + 1, `"${row}"`);
                continue;
            }
            const instruction = {
                amount: parseInt((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.amount),
                from: parseInt((_b = match === null || match === void 0 ? void 0 : match.groups) === null || _b === void 0 ? void 0 : _b.from) - 1,
                to: parseInt((_c = match === null || match === void 0 ? void 0 : match.groups) === null || _c === void 0 ? void 0 : _c.to) - 1, // required as array starts at index 0
            };
            instructions.push(instruction);
        }
    }
    return [stacks, instructions];
}
// Applies the instructions to a clone of the stacks array
function performInstructions(stacks, instructions) {
    stacks = structuredClone(stacks);
    for (let i = 0; i < instructions.length; i++) {
        const { from, to, amount } = instructions[i];
        if (stacks[from].length < amount) {
            console.warn("WARN: invalid instruction, can't move", amount, "from stack", from + 1, "to stack", to + 1);
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
        }
        else {
            const crates = stacks[from].splice(-amount, amount);
            stacks[to].push(...crates);
        }
        console.log("Instruction #" + (i + 1));
        printStacks(stacks);
        console.log("");
    }
    return stacks;
}
const contents = fs.readFileSync(filePath, "utf-8");
const [stacks, instructions] = parseInput(contents);
const result = performInstructions(stacks, instructions);
console.log("The top crates:");
console.log(result.map((stack) => stack[stack.length - 1]).join(""));
