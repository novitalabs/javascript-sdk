/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function img2img(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const params = {
    request: {
      model_name: "majicmixRealistic_v7_134792.safetensors",
      image_base64: baseImg,
      prompt: "1girl,sweater,white background",
      negative_prompt: "(worst quality:2),(low quality:2),(normal quality:2),lowres,watermark,",
      width: 512,
      height: 768,
      sampler_name: "Euler a",
      guidance_scale: 7,
      steps: 20,
      image_num: 1,
      seed: -1,
      strength: 0.5,
    },
  };
  novitaClient
    .img2Img(params)
    .then((res) => {
      if (res && res.task_id) {
        const timer = setInterval(() => {
          novitaClient
            .progress({
              task_id: res.task_id,
            })
            .then((progressRes) => {
              if (progressRes.task.status === TaskStatus.SUCCEED) {
                console.log("finished!", progressRes.images);
                clearInterval(timer);
                onFinish(progressRes.images);
              }
              if (progressRes.task.status === TaskStatus.FAILED) {
                console.warn("failed!", progressRes.task.reason);
                clearInterval(timer);
              }
              if (progressRes.task.status === TaskStatus.QUEUED) {
                console.log("queueing");
              }
            })
            .catch((err) => {
              console.error("progress error:", err);
            });
        }, 1000);
      }
    })
    .catch((err) => {
      console.error("img2Img error:", err);
    });
}

img2img((imgs) => {
  console.log(imgs);
});
