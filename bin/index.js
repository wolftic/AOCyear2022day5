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
const [fileName] = process.argv.slice(2);
const filePath = path.join(__dirname, "../data/", `${fileName}.txt`);
function parseInput(inputContent) {
    var _a, _b, _c;
    const rows = inputContent.split("\n");
    const structure = [];
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
                if (!structure[j]) {
                    structure[j] = [];
                }
                structure[j].unshift(letter);
            }
        }
        else {
            const match = row.match(/move (?<amount>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)/i);
            if (!match) {
                console.warn("WARN: invalid instruction at line:", i, `"${row}"`);
                continue;
            }
            const instruction = {
                amount: parseInt((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.amount),
                from: parseInt((_b = match === null || match === void 0 ? void 0 : match.groups) === null || _b === void 0 ? void 0 : _b.from),
                to: parseInt((_c = match === null || match === void 0 ? void 0 : match.groups) === null || _c === void 0 ? void 0 : _c.to),
            };
            instructions.push(instruction);
        }
    }
    return [structure, instructions];
}
const contents = fs.readFileSync(filePath, "utf-8");
const [rows, instructions] = parseInput(contents);
console.log(rows, instructions);
