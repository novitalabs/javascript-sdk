/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function doodle(onFinish) {
  const maskImg = await convertImageToBase64(path.join(__dirname, "mask.png"));
  const params = {
    image_file: maskImg,
    prompt: "a bird",
    similarity: 0.75,
  };
  novitaClient
    .doodle(params)
    .then((res) => {
      console.log("finished!", res);
      onFinish(res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

doodle((imgs) => {
  console.log(imgs);
});
