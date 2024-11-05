import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import { 
  MergeFaceRequest,
  RemoveTextRequest,
  Txt2VideoRequest,
  Img2VideoRequest,
  Img2VideoResizeMode,
  Img2VideoModel,
  InpaintingRequest,
} from "../src/types"
import { fileToBase64, pollTaskStatus } from "./utils"
import path from 'path'

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const testImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/sample.jpeg"))
const face1ImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/face1.png"))
const face2ImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/face2.png"))
const img2VideoImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/face1.png"))

describe("Group 2", () => {

  it("should run mergeFace", async () => {
    const reqBody: MergeFaceRequest = {
      face_image_file: face1ImageBase64,
      image_file: face2ImageBase64,
    }
    const res = await novitaClient.mergeFace(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run removeText", async () => {
    const reqBody: RemoveTextRequest = {
      image_file: testImageBase64
    }
    
    const res = await novitaClient.removeText(reqBody)
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
});
