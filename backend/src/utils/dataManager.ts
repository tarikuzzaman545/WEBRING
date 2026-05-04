import fs from "fs";
import path from "path";

export const readData = (filename: string) => {
  const filepath = path.join(__dirname, `../data/${filename}.json`);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
};

export const writeData = (filename: string, data: any) => {
  const filepath = path.join(__dirname, `../data/${filename}.json`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};
