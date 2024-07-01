import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import { Txt2ImgV3Request } from "../src/types"
import { pollTaskStatus } from "./utils"

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const reqBody: Txt2ImgV3Request = {
  request: {
    model_name: "sd_xl_base_1.0.safetensors",
    prompt: "Glowing jellyfish floating through a foggy forest at twilight",
    negative_prompt: "3d render, smooth,plastic, blurry, grainy, low-resolution,anime, deep-fried, oversaturated",
    width: 512,
    height: 512,
    sampler_name: "DPM++ 2M Karras",
    guidance_scale: 7,
    steps: 20,
    image_num: 1,
    seed: -1,
  }
}

describe("txt2img", () => {
  it("should run", async () => {
    const res = await novitaClient.txt2ImgV3(reqBody)
    expect(res).toHaveProperty("task_id")
    const taskId = res.task_id
    
    const taskResult = await pollTaskStatus(taskId)
    expect(taskResult).toHaveProperty("images")
  });
});
