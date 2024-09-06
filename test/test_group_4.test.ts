import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import { 
  RelightRequest,
  AdetailerRequest,
  Img2MaskRequest,
  Img2PromptRequest,
  InpaintingRequest
} from "../src/types"
import { pollTaskStatus, fileToBase64 } from "./utils"
import path from 'path'

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const testImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/sample.jpeg"))

describe("Group 4", () => {

  it("should run inpainting", async () => {
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
    const res = await novitaClient.inpainting(reqBody)
    expect(res).toHaveProperty("task_id")
    const taskId = res.task_id
    
    const taskResult = await pollTaskStatus(taskId)
    expect(taskResult).toHaveProperty("images")
  }, 30000);

  it("should run relight", async () => {
    const reqBody: RelightRequest = {
      image_file: testImageBase64,
      model_name: "realisticVisionV60B1_v60B1VAE_190174.safetensors",
      lighting_preference: "LEFT_LIGHT",
      prompt: "cool man, detailed face, cinematic lighting",
      steps: 20,
      sampler_name: "DPM++ 2M Karras",
      seed: -1,
      guidance_scale: 7,
      strength: 0.7
    }
    
    const res = await novitaClient.relight(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 200000);

  it("should run adetailer", async () => {
    const reqBody: AdetailerRequest = {
      request: {
        model_name: "chilloutmix_NiPrunedFp32Fix.safetensors",
        prompt: "a beautiful girl",
        steps: 20,
        sampler_name: "DPM++ 2M Karras",
        seed: -1,
        guidance_scale: 7,
        strength: 0.6,
        image_assets_ids: ["cjIvbm92aXRhLWFpLWFzc2V0L2ltYWdlL043YUdrRHJRYTVHY0VjYXNYUTJkamV4U1NrUlAzQ3RR"]
      }
    }
    
    const res = await novitaClient.adetailer(reqBody)
    expect(res).toHaveProperty("task_id")
    
    const taskResult = await pollTaskStatus(res.task_id)
    expect(taskResult).toHaveProperty("images")
  }, 90000);

  it("should run img2Mask", async () => {
    const reqBody: Img2MaskRequest = {
      image_file: testImageBase64,
    }
    
    const res = await novitaClient.img2Mask(reqBody)
    expect(res).toHaveProperty("masks")
  }, 60000);

  it("should run img2Prompt", async () => {
    const reqBody: Img2PromptRequest = {
      image_file: testImageBase64
    }
    
    const res = await novitaClient.img2Prompt(reqBody)
    expect(res).toHaveProperty("prompt")
  }, 60000);

});
