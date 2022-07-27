import { Position, Range } from "vscode";

export function position(line: number, char: number) {
  return new Position(line, char);
}
export function range(startLine: number, startChar: number, endLine: number, endChar: number) {
  return new Range(position(startLine, startChar), position(endLine, endChar));
}

export function getHTMLFromDocument(code: string): string {
  return /\/\*\s*html\s*\*\/\s*`([\s|\S|\r|\n]*?)`/g.exec(code)?.[1] || '';
}

export function getHTMLRange(allCode: string): Range {
  let startLine = 0, startChar = 0, endLine = 0, endChar = 0;
  const lines = allCode.split('\r\n');

  let lineIdx = 0;
  let isFindStartLine = false;
  while(lineIdx++ < lines.length) {
    const line = lines[lineIdx];
    if(/\/\*\s*html\s*\*\/\s*`/.test(line)) {
      startLine = lineIdx;
      startChar = line.length;
      isFindStartLine = true;
    }
    if(isFindStartLine && /^\s*`\s*;?[\s\r\n]*$/.test(line)) {
      endLine = lineIdx;
      endChar = line.indexOf('`');
      break;
    }
  }
  return range(startLine, startChar, endLine, endChar); 
}