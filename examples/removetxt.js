/** @format */

const { NovitaSDK } = require("novita-sdk");
const path = require("path");
const { convertImageToBase64 } = require("./utils.js");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function removetxt() {
  const baseImg = await convertImageToBase64(path.join(__dirname, "test.png"));
  const params = {
    image_file: baseImg,
  };
  novitaClient
    .removeText(params)
    .then((res) => {
      console.log("finished!", res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

removetxt((imgs) => {
  console.log(imgs);
});
