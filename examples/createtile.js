/** @format */

const { NovitaSDK } = require("novita-sdk");

const novitaClient = new NovitaSDK(process.env.NOVITA_API_KEY);

async function createTile(onFinish) {
  const params = {
    prompt: "a bird",
    negative_prompt: "",
    width: 128,
    height: 128,
  };
  novitaClient
    .createTile(params)
    .then((res) => {
      console.log("finished!", res);
      onFinish(res);
    })
    .catch((err) => {
      console.error("error:", err);
    });
}

createTile((imgs) => {
  console.log(imgs);
});
