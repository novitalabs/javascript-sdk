const { NovitaSDK } = require("../dist/index.js");

const TEST_KEY = '787ee3fd-ff97-4aac-936e-1b09cf74a559'

const novitaSdk = new NovitaSDK(TEST_KEY)
novitaSdk.adetailer({
  request: {
    model_name: "chilloutmix_NiPrunedFp32Fix.safetensors",
    prompt: "Glowing jellyfish floating through a foggy forest at twilight",
    negative_prompt: "3d render, smooth,plastic, blurry, grainy, low-resolution,anime, deep-fried, oversaturated",
    guidance_scale: 7.5,
    sampler_name: "DPM++ 2M Karras",
    steps: 20,
    seed: -1, 
  }
})
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })