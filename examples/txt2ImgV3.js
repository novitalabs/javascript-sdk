/** @format */

const { NovitaSDK, TaskStatus } = require("novita-sdk");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function txt2img(onFinish) {
  const params = {
    request: {
      model_name: "majicmixRealistic_v7_134792.safetensors",
      prompt: "1girl,sweater,white background",
      negative_prompt: "(worst quality:2),(low quality:2),(normal quality:2),lowres,watermark,",
      width: 512,
      height: 768,
      sampler_name: "Euler a",
      guidance_scale: 7,
      steps: 20,
      image_num: 1,
      seed: -1,
    },
  };
  novitaClient
    .txt2ImgV3(params)
    .then((res) => {
      if (res && res.task_id) {
        const timer = setInterval(() => {
          novitaClient
            .progressV3({
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
      console.error("txt2Img error:", err);
    });
}

txt2img((imgs) => {
  console.log(imgs);
});
