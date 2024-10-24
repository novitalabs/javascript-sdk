import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import {
  Txt2ImgRequest, 
  Img2ImgRequest,
  CleanupRequest,
  OutpaintingRequest,
  RemoveBackgroundRequest,
  ReplaceBackgroundRequest,
} from "../src/types"
import { pollTaskStatus, fileToBase64 } from "./utils"
import path from 'path'

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const testImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/sample.jpeg"))
const maskImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/mask.png"))

describe("Group 1", () => {
  it("should run txt2img", async () => {
    const reqBody: Txt2ImgRequest = {
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
    const res = await novitaClient.txt2Img(reqBody)
    expect(res).toHaveProperty("task_id")
    const taskId = res.task_id
    
    const taskResult = await pollTaskStatus(taskId)
    expect(taskResult).toHaveProperty("images")
  }, 30000);
  
  it("should run img2Img", async () => {
    const reqBody: Img2ImgRequest = {
      request: {
        model_name: "sd_xl_base_1.0.safetensors",
        image_base64: testImageBase64,
        image_num: 1,
        seed: -1,
        prompt: "A futuristic cityscape",
        negative_prompt: "old, vintage, blurry",
        width: 768,
        height: 768,
        steps: 30,
        sampler_name: "DPM++ 2M Karras",
        guidance_scale: 7.5,
        strength: 0.75,
      }
    }
    
    const res = await novitaClient.img2Img(reqBody)
    expect(res).toHaveProperty("task_id")
    
    const taskResult = await pollTaskStatus(res.task_id)
    expect(taskResult).toHaveProperty("images")
  }, 30000);

  it("should run cleanup", async () => {
    const reqBody: CleanupRequest = {
      image_file: testImageBase64,
      mask_file: maskImageBase64,
    }
    
    const res = await novitaClient.cleanup(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run outpainting", async () => {
    const reqBody: OutpaintingRequest = {
      image_file: testImageBase64,
      width: 512,
      height: 512,
      center_x: 0,
      center_y: 0,
    }
    
    const res = await novitaClient.outpainting(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run removeBackground", async () => {
    const reqBody: RemoveBackgroundRequest = {
      image_file: testImageBase64,
    }
    
    const res = await novitaClient.removeBackground(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run replaceBackground", async () => {
    const reqBody: ReplaceBackgroundRequest = {
      image_file: testImageBase64,
      prompt: "A serene beach at sunset",
    }
    
    const res = await novitaClient.replaceBackground(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);
});