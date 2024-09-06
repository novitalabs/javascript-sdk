import dotenv from "dotenv"
const fs = require('fs');
const path = require('path');
const { NovitaSDK } = require("../src/class.ts")
const { V3TaskStatus, V2TaskStatus } = require("../src/types.ts")

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

export async function pollTaskStatus(taskId: string, version: "v3" | "v2" = "v3") {
  async function poll() {
    if (version === "v3") {
      const progress = await novitaClient.progressV3({ task_id: taskId })
      if (progress.task.status === V3TaskStatus.SUCCEED) {
        return progress;
      } else if (progress.task.status === V3TaskStatus.FAILED) {
        return progress;
      } else {
        await delay(1000);
        return poll(); // Recursively call poll after a delay
      }
    } else {
      const progress = await novitaClient.progress({ task_id: taskId })
      if (progress.status === 2) {
        return progress;
      } else if (progress.status === 3 || progress.status === 4) {
        return progress;
      } else {
        await delay(1000);
        return poll();
      }
    }
  }

  return poll();
}