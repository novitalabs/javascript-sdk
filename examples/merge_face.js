/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function mergeFace(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.jpeg"));
  const faceImg = await convertImageToBase64(path.join(__dirname, "face.png"));
  const params = {
    image_file: baseImg,
    face_image_file: faceImg,
  };
  novitaClient
    .mergeFace(params)
    .then((res) => {
      console.log("finished!", res);
      onFinish(res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

mergeFace((imgs) => {
  console.log(imgs);
});
