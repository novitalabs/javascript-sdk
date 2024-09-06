import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import { 
  RemoveTextRequest,
  RemoveWatermarkRequest,
  RestoreFaceRequest,
  ReimagineRequest,
  CreateTileRequest,
  Txt2VideoRequest,
  Img2VideoRequest,
  Img2VideoMotionRequest,
  AnimateAnyoneRequest,
  Img2VideoResizeMode,
  Img2VideoModel
} from "../src/types"
import { fileToBase64 } from "./utils"
import path from 'path'

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const testImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/sample.jpeg"))
const img2VideoImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/face1.png"))

describe("Group 3", () => {

  it("should run removeText", async () => {
    const reqBody: RemoveTextRequest = {
      image_file: testImageBase64
    }
    
    const res = await novitaClient.removeText(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run removeWatermark", async () => {
    const reqBody: RemoveWatermarkRequest = {
      image_file: testImageBase64
    }
    
    const res = await novitaClient.removeWatermark(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run restoreFace", async () => {
    const reqBody: RestoreFaceRequest = {
      image_file: testImageBase64,
      fidelity: 0.9,
    }
    
    const res = await novitaClient.restoreFace(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run reimagine", async () => {
    const reqBody: ReimagineRequest = {
      image_file: testImageBase64,
    }
    
    const res = await novitaClient.reimagine(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run createTile", async () => {
    const reqBody: CreateTileRequest = {
      prompt: "black and white squares",
      negative_prompt: "",
      width: 128,
      height: 128,
    }
    
    const res = await novitaClient.createTile(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run txt2Video", async () => {
    const reqBody: Txt2VideoRequest = {
      model_name: "darkSushiMixMix_225D_64380.safetensors",
      width: 640,
      height: 480,
      seed: -1,
      steps: 20,
      prompts: [
        {
          prompt: "A girl, baby, portrait, 5 years old",
          frames: 16,
        },
        {
          prompt: "A girl, child, portrait, 10 years old",
          frames: 16,
        },
        {
          prompt: "A girl, teen, portrait, 20 years old",
          frames: 16,
        },
        {
          prompt: "A girl, woman, portrait, 30 years old",
          frames: 16,
        },
        {
          prompt: "A girl, woman, portrait, 50 years old",
          frames: 16,
        },
        {
          prompt: "A girl, old woman, portrait, 70 years old",
          frames: 16,
        },
      ],
      guidance_scale: 10,
    }
    
    const res = await novitaClient.txt2Video(reqBody)
    expect(res).toHaveProperty("task_id")
  }, 120000);

  it("should run img2Video", async () => {
    const reqBody: Img2VideoRequest = {
      model_name: Img2VideoModel.SVD,
      image_file: img2VideoImageBase64,
      frames_num: 14,
      frames_per_second: 6,
      seed: -1,
      image_file_resize_mode: Img2VideoResizeMode.ORIGINAL_RESOLUTION,
      steps: 20,
    }
    
    const res = await novitaClient.img2Video(reqBody)
    expect(res).toHaveProperty("task_id")
  }, 120000);

  it("should run img2VideoMotion", async () => {
    const reqBody: Img2VideoMotionRequest = {
      image_assets_id: "cjIvbm92aXRhLWFpLWFzc2V0L2ltYWdlLzREV0ZjZjh3R2U2WEpUWE1GZUg2aHNTRkRwekd5dzNF",
      motion_video_assets_id: "cjIvbm92aXRhLWFpLWFzc2V0L3ZpZGVvL1FFcmphdGJCOFI3ODdhR0gzajVUSkJZbTNkaHIzNzRu",
      seed: -1,
    }
    
    const res = await novitaClient.img2VideoMotion(reqBody)
    expect(res).toHaveProperty("task_id")
  }, 120000);

  it("should run animateAnyone", async () => {
    const reqBody: AnimateAnyoneRequest = {
      image_assets_id: "cjIvbm92aXRhLWFpLWFzc2V0L2ltYWdlL043YUdrRHJRYTVHY0VjYXNYUTJkamV4U1NrUlAzQ3RR",
      pose_video_assets_id: "cjIvbm92aXRhLWFpLWFzc2V0L3ZpZGVvL0NoWld5Y013dE1OZDJCY1hTd1NmWGVuM2FZaVhGY0t0",
      seed: -1,
      width: 512,
      height: 768,
      steps: 20,
    }
    
    const res = await novitaClient.animateAnyone(reqBody)
    expect(res).toHaveProperty("task_id")
  }, 180000);

});
