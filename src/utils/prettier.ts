import { TextEdit, Range } from 'vscode-languageserver-types';
import * as prettier from 'prettier';
import { logger } from './log';

export default function prettierHTML(
  html: string,
  range: Range,
): TextEdit[] {
  try {
    const prettierOptions = {
      arrowParens: "always",
      bracketSpacing: true,
      endOfLine: "lf",
      htmlWhitespaceSensitivity: "css",
      insertPragma: false,
      jsxBracketSameLine: false,
      jsxSingleQuote: false,
      printWidth: 80,
      proseWrap: "preserve",
      quoteProps: "as-needed",
      requirePragma: false,
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      useTabs: false,
      vueIndentScriptAndStyle: false,
      parser: "html"
    };
    logger.logDebug(`Using prettier. Options\n${JSON.stringify(prettierOptions)}`);

    const prettierifiedCode = prettier.format(html, prettierOptions as prettier.Options);
    if (prettierifiedCode === '' && html.trim() !== '') {
      throw Error('Empty result from prettier');
    }

    return [TextEdit.replace(range, prettierIndent(prettierifiedCode))];
  } catch (e) {
    console.log('Prettier format failed');
    console.error((e as Error).stack);
    return [];
  }
}

function prettierIndent(code: string) {
  const indentCode = code.split('\n').map(line => `\t${line}`).join('\n');
  return `\r\n${indentCode}`;
}
