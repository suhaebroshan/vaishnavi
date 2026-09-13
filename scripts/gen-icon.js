#!/usr/bin/env node
/**
 * Generate a minimal 512x512 solid-color PNG for the app launcher icon.
 * Usage: node scripts/gen-icon.js [color_hex] [output_path]
 * Example: node scripts/gen-icon.js 173F35 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const color = process.argv[2] || '173F35';
const outputPath = process.argv[3] || path.join(__dirname, '../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');

const w = 512, h = 512;
const r = parseInt(color.substring(0, 2), 16) || 23;
const g = parseInt(color.substring(2, 4), 16) || 63;
const b = parseInt(color.substring(4, 6), 16) || 53;

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = (table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0;
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([len, typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(w, 0);
ihdr.writeUInt32BE(h, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
const ihdrChunk = makeChunk('IHDR', ihdr);

// IDAT
const rows = [];
for (let y = 0; y < h; y++) {
  const row = Buffer.alloc(w * 3 + 1);
  for (let x = 0; x < w; x++) {
    row[x * 3 + 1] = r;
    row[x * 3 + 2] = g;
    row[x * 3 + 3] = b;
  }
  rows.push(row);
}
const idatChunk = makeChunk('IDAT', zlib.deflateSync(Buffer.concat(rows)));

// IEND
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  ihdrChunk, idatChunk, iendChunk
]);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, png);
console.log(`✓ Wrote ${outputPath}`);
