import fs from 'fs';
import path from 'path';
import questions from '../src/questions.js';

function isCodeLine(line) {
  const trimmed = line.trim();
  return /[{};=]/.test(trimmed) || /^\s*(const|let|var|function|class)\b/.test(trimmed) || /<.*?>/.test(trimmed);
}

questions.forEach(q => {
  if (!q.explanation) return;
  const lines = q.explanation.split('\n');
  const out = [];
  let inCode = false;
  lines.forEach(line => {
    const codeLike = isCodeLine(line);
    if (codeLike && !inCode) {
      out.push('```js');
      inCode = true;
    }
    if (!codeLike && inCode) {
      out.push('```');
      inCode = false;
    }
    out.push(line);
  });
  if (inCode) out.push('```');
  q.explanation = out.join('\n');
});

const output = 'const questions = ' + JSON.stringify(questions, null, 2) + ';\nexport default questions;\n';
fs.writeFileSync(path.join('src', 'questions.js'), output);
