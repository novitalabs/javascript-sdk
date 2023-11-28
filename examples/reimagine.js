/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function reimagine(onFinish) {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const params = {
    image_file: baseImg,
  };
  novitaClient
    .reimagine(params)
    .then((res) => {
      console.log("finished!", res);
      onFinish(res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

reimagine((imgs) => {
  console.log(imgs);
});
