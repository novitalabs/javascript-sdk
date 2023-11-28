/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function mixpose(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const faceImg = await convertImageToBase64(path.join(__dirname, "face.jpeg"));
  const params = {
    image_file: baseImg,
    pose_image_file: faceImg,
  };
  novitaClient
    .mixpose(params)
    .then((res) => {
      console.log("finished!", res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

mixpose((imgs) => {
  console.log(imgs);
});
