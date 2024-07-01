import path from "path"
import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import { InpaintingRequest } from "../src/types"
import { fileToBase64, pollTaskStatus } from "./utils"

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const reqBody: InpaintingRequest = {
  request: {
    clip_skip: 3,
    embeddings: [{
      model_name: "OverallDetail_74591.pt"
    }],
    guidance_scale: 7,
    image_base64: fileToBase64(path.resolve(__dirname, "./assets/sample.jpeg")),
    image_num: 1,
    initial_noise_multiplier: 0.14,
    inpainting_full_res: 1,
    inpainting_full_res_padding: 10,
    inpainting_mask_invert: 0,
    loras: [{model_name: "gender_slider_v1_87782.safetensors", strength: 0.7}],
    model_name: "realisticVisionV51_v51VAE-inpainting_94324.safetensors",
    mask_blur: 5,
    mask_image_base64: fileToBase64(path.resolve(__dirname, "./assets/mask.png")),
    negative_prompt: "cat",
    prompt: "a cute dog",
    sampler_name: "DPM++ 2S a",
    sd_vae: "klF8Anime2VAE_klF8Anime2VAE_207314.safetensors",
    seed: -1,
    steps: 20,
    strength: 1,
  }
}

describe("inpainting", () => {
  it("should run", async () => {
    const res = await novitaClient.inpainting(reqBody)
    expect(res).toHaveProperty("task_id")
    const taskId = res.task_id
    
    const taskResult = await pollTaskStatus(taskId)
    expect(taskResult).toHaveProperty("images")
  });
});
