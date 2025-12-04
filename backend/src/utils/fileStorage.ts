import fs from 'fs';
import path from 'path';

// Use absolute path resolution to ensure we're reading from the correct location
// In development (ts-node-dev): __dirname = src/utils, so ../data = src/data
// In production (compiled): __dirname = dist/utils, so ../data = dist/data (wrong!)
// So we need to check if we're in dist and adjust accordingly
let DATA_DIR = path.resolve(__dirname, '../data');

// If running from dist directory, adjust path to point to src/data
if (__dirname.includes('dist')) {
  DATA_DIR = path.resolve(__dirname, '../../src/data');
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readJsonFile<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.error(`[fileStorage] ${filename} does not contain an array`);
      return [];
    }
    return parsed;
  } catch (error) {
    console.error(`[fileStorage] Error reading ${filename}:`, error);
    return [];
  }
}

export function writeJsonFile<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

