/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function outpainting(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const params = {
    image_file: baseImg,
    width: 512,
    height: 512,
    center_x: 100,
    center_y: 100,
  };
  novitaClient
    .outpainting(params)
    .then((res) => {
      console.log("finished!", res);
      onFinish(res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

outpainting((imgs) => {
  console.log(imgs);
});
