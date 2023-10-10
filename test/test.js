const { NovitaSDK } = require("../dist/index.js");

const TEST_KEY = '650YpEeEBF2H88Z88idG6ZWvWiU2eVG6'

const novitaSdk = new NovitaSDK(TEST_KEY)
novitaSdk.txt2Img({
  model_name: "sd_xl_base_1.0.safetensors",
  prompt: "Glowing jellyfish floating through a foggy forest at twilight",
  negative_prompt: "3d render, smooth,plastic, blurry, grainy, low-resolution,anime, deep-fried, oversaturated",
  width: 512,
  height: 512,
  sampler_name: "DPM++ 2M Karras",
  cfg_scale: 7,
  steps: 20,
  batch_size: 1,
  n_iter: 1,
  seed: -1,
})
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })