import QRCode from 'qrcode';
import type { AsciiCell } from '../types';

export async function generateQrAscii(
  text: string,
  blockChar: '█' | '#' | '@' = '█'
): Promise<{ text: string; grid: AsciiCell[][] }> {
  const content = text.trim() || 'https://asciicraft.com';
  
  // Generate raw matrix using qrcode
  const qrData = QRCode.create(content, { errorCorrectionLevel: 'M' });
  const modules = qrData.modules;
  const size = modules.size;
  const data = modules.data;

  const doubleBlock = blockChar + blockChar;
  const doubleSpace = '  ';

  const lines: string[] = [];
  const grid: AsciiCell[][] = [];

  // Add 1 quiet zone border row
  const borderRow: AsciiCell[] = [];
  for (let c = 0; c < size + 2; c++) {
    borderRow.push({ char: ' ' });
    borderRow.push({ char: ' ' });
  }
  grid.push(borderRow);
  lines.push(doubleSpace.repeat(size + 2));

  for (let r = 0; r < size; r++) {
    const rowCells: AsciiCell[] = [
      { char: ' ' },
      { char: ' ' }
    ];
    let lineStr = doubleSpace;

    for (let c = 0; c < size; c++) {
      const isDark = data[r * size + c];
      if (isDark) {
        rowCells.push({ char: blockChar, color: '#e6f2e4' });
        rowCells.push({ char: blockChar, color: '#e6f2e4' });
        lineStr += doubleBlock;
      } else {
        rowCells.push({ char: ' ' });
        rowCells.push({ char: ' ' });
        lineStr += doubleSpace;
      }
    }

    rowCells.push({ char: ' ' }, { char: ' ' });
    lineStr += doubleSpace;

    grid.push(rowCells);
    lines.push(lineStr);
  }

  // Bottom quiet zone border row
  grid.push([...borderRow]);
  lines.push(doubleSpace.repeat(size + 2));

  return {
    text: lines.join('\n'),
    grid
  };
}

