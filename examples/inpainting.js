/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function inpainting(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const maskImg = await convertImageToBase64(path.join(__dirname, "mask.png"));
  const params = {
    model_name: "majicmixRealistic_v7_134792.safetensors",
    init_images: [baseImg],
    mask: maskImg,
    prompt: "1girl,sweater,white background",
    negative_prompt: "(worst quality:2),(low quality:2),(normal quality:2),lowres,watermark,",
    width: 512,
    height: 768,
    sampler_name: "Euler a",
    cfg_scale: 7,
    steps: 20,
    batch_size: 1,
    n_iter: 1,
    seed: -1,
    denoising_strength: 0.7,
    inpainting_fill: 0,
  };
  novitaClient
    .img2img(params)
    .then((res) => {
      if (res && res.task_id) {
        const timer = setInterval(() => {
          novitaClient
            .progress({
              task_id: res.task_id,
            })
            .then((res) => {
              if (res.status === 2) {
                console.log("finished!", res.imgs);
                clearInterval(timer);
                onFinish(res.imgs);
              }
              if (res.status === 3 || res.status === 4) {
                console.warn("failed!", res.failed_reason);
                clearInterval(timer);
              }
              if (res.status === 1) {
                console.log("progress", res.current_images);
              }
            })
            .catch((err) => {
              console.error("progress error:", err);
            });
        }, 1000);
      }
    })
    .catch((err) => {
      console.error("img2img error:", err);
    });
}

inpainting((imgs) => {
  console.log(imgs);
});
