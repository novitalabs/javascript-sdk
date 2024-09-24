import dotenv from "dotenv"
import { NovitaSDK } from "../src/class"
import { 
  MixPoseRequest,
  DoodleRequest,
  LcmTxt2ImgRequest,
  LcmImg2ImgRequest,
  ReplaceSkyRequest,
  ReplaceObjectRequest,
  MergeFaceRequest,
  SkyType,
} from "../src/types"
import { pollTaskStatus, fileToBase64 } from "./utils"
import path from 'path'

dotenv.config()

const novitaClient = new NovitaSDK(process.env.API_KEY || "")

const testImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/sample.jpeg"))
const doodleImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/doodle.png"))
const face1ImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/face1.png"))
const face2ImageBase64 = fileToBase64(path.resolve(__dirname, "./assets/face2.png"))

describe("Group 2", () => {
  it("should run mixpose", async () => {
    const reqBody: MixPoseRequest = {
      image_file: testImageBase64,
      pose_image_file: testImageBase64,
    }
    const res = await novitaClient.mixpose(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run doodle", async () => {
    const reqBody: DoodleRequest = {
      image_file: doodleImageBase64,
      prompt: "1 beautiful girl",
      similarity: 0.5,
    }
    
    const res = await novitaClient.doodle(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 120000);

  it("should run lcmTxt2Img", async () => {
    const reqBody: LcmTxt2ImgRequest = {
      prompt: "A beautiful landscape with mountains and a lake",
      width: 512,
      height: 512,
      steps: 8,
      guidance_scale: 1,
      image_num: 1,
    }
    
    const res = await novitaClient.lcmTxt2Img(reqBody)
    expect(res).toHaveProperty("images")
  }, 60000);

  it("should run lcmImg2Img", async () => {
    const reqBody: LcmImg2ImgRequest = {
      model_name: "sd_xl_base_1.0.safetensors",
      input_image: testImageBase64,
      prompt: "Transform the image into a watercolor painting",
      negative_prompt: "photorealistic, sharp details",
      steps: 8,
      guidance_scale: 1,
      strength: 0.5,
      image_num: 1,
      seed: -1,
      sd_vae: "",
    }
    
    const res = await novitaClient.lcmImg2Img(reqBody)
    expect(res).toHaveProperty("images")
  }, 60000);

  it("should run replaceSky", async () => {
    const reqBody: ReplaceSkyRequest = {
      image_file: testImageBase64,
      sky: SkyType.bluesky,
    }
    
    const res = await novitaClient.replaceSky(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

  it("should run replaceObject", async () => {
    const reqBody: ReplaceObjectRequest = {
      image_file: testImageBase64,
      prompt: "a cat",
      negative_prompt: "dog, blurry",
      object_prompt: "a girl",
    }
    
    const res = await novitaClient.replaceObject(reqBody)
    expect(res).toHaveProperty("task_id")
    
    const taskResult = await pollTaskStatus(res.task_id)
    expect(taskResult).toHaveProperty("images")
  }, 120000);

  it("should run mergeFace", async () => {
    const reqBody: MergeFaceRequest = {
      face_image_file: face1ImageBase64,
      image_file: face2ImageBase64,
    }
    const res = await novitaClient.mergeFace(reqBody)
    expect(res).toHaveProperty("image_file")
  }, 60000);

});
