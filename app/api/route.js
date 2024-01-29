import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "db.json");

export async function GET(request) {
  var url = new URL(request.url);
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData);
  let resData = objectData;

  return NextResponse.json(resData);
}
