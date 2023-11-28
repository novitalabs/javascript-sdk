/** @format */

const { NovitaSDK } = require("novita-sdk");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function lcm(onFinish) {
  const params = {
    prompt: "a dog",
    width: 512,
    height: 512,
    image_num: 1,
    steps: 8,
    guidance_scale: 7.5,
  };
  novitaClient
    .lcmTxt2Img(params)
    .then((res) => {
      console.log("finished!", res.images);
      onFinish(res.images);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

lcm((imgs) => {
  console.log(imgs);
});
