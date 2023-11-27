/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function upscale(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const params = {
    image: baseImg,
    resize_mode: 0,
    upscaling_resize_w: 0,
    upscaling_resize_h: 0,
    upscaling_resize: 2,
    upscaling_crop: true,
    upscaler_1: "R-ESRGAN 4x+",
    upscaler_2: "R-ESRGAN 4x+",
    extras_upscaler_2_visibility: 0.5,
    gfpgan_visibility: 0.5,
    codeformer_visibility: 0.5,
    codeformer_weight: 0.5,
  };
  novitaClient
    .upscale(params)
    .then((res) => {
      if (res && res.task_id) {
        const timer = setInterval(() => {
          novitaClient
            .progress({
              task_id: res.task_id,
            })
            .then((progressRes) => {
              if (progressRes.status === 2) {
                console.log("finished!", progressRes.imgs);
                clearInterval(timer);
                onFinish(progressRes.imgs);
              }
              if (progressRes.status === 3 || progressRes.status === 4) {
                console.warn("failed!", progressRes.failed_reason);
                clearInterval(timer);
              }
              if (progressRes.status === 1) {
                console.log("progress", progressRes.current_images);
              }
            })
            .catch((err) => {
              console.error("progress error:", err);
            });
        }, 1000);
      }
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

upscale((imgs) => {
  console.log(imgs);
});
