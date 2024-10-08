import dotenv from "dotenv"
const fs = require('fs');
const path = require('path');
const { NovitaSDK, TaskStatus } = require("../index.ts");

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY)

export function fileToBase64(filePath: string): string {
  try {
    const fileBuffer = fs.readFileSync(path.resolve(filePath));
    const base64 = fileBuffer.toString('base64');
    // const mimeType = getMimeType(filePath);
    return base64;
  } catch (error) {
    console.error('Error converting file to base64:', error);
    return ""
  }
}

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.bmp':
      return 'image/bmp';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream'; // default mimetype
  }
}

function delay(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export async function pollTaskStatus(taskId: string) {
  async function poll() {
    const progress = await novitaClient.progress({ task_id: taskId })
    if (progress.task.status === TaskStatus.SUCCEED) {
      return progress;
    } else if (progress.task.status === TaskStatus.FAILED) {
      return progress;
    } else {
      await delay(1000);
      return poll(); // Recursively call poll after a delay
    }
  }

  return poll();
}