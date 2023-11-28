/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function cleanup(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const maskImg = await convertImageToBase64(path.join(__dirname, "mask.png"));
  const params = {
    image_file: baseImg,
    mask_file: maskImg,
  };
  novitaClient
    .cleanup(params)
    .then((res) => {
      console.log("finished!", res);
      onFinish(res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

cleanup((imgs) => {
  console.log(imgs);
});
