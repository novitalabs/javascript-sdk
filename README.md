<!-- @format -->

# Novita.ai Javascript SDK

This SDK is based on the official [novita.ai API reference](https://docs.novita.ai/)

**Join our discord server for help:**

[![](https://dcbadge.vercel.app/api/server/Mqx7nWYzDF)](https://discord.gg/Mqx7nWYzDF)

## Quick start

1. Sign up on [novita.ai](https://novita.ai) and get an API key. Please follow the instructions at [https://novita.ai/get-started](https://novita.ai/get-started/)

2. Install the [npm package](https://www.npmjs.com/package/novita-sdk) in your project.

```bash
npm i novita-sdk
```

## Usage

#### 1. Functional usage

```javascript
import { txt2ImgSync, setNovitaKey } from "novita-sdk";

setNovitaKey("your api key");

const params = {
  model_name: "sd_xl_base_1.0.safetensors",
  prompt: "1 girl",
};
txt2ImgSync(params)
  .then((res) => {
    console.log("imgs", res);
  })
  .catch((err) => {
    console.error(err);
  });
```

#### 2. Class-based usage

```javascript
import { NovitaSDK } from "novita-sdk";

const novitaClient = new NovitaSDK("your api key");

const params = {
  model_name: "sd_xl_base_1.0.safetensors",
  prompt: "1 girl",
};
novitaClient
  .txt2ImgSync(params)
  .then((res) => {
    console.log("imgs", res);
  })
  .catch((err) => {
    console.error(err);
  });
```

## API list and Sample codes

- [txt2Img](https://github.com/novitalabs/javascript-sdk/blob/main/examples/txt2img.js) **Deprecated**, recommend using [txt2ImgV3](https://github.com/novitalabs/javascript-sdk/blob/main/examples/txt2ImgV3.js)
- [img2img ](https://github.com/novitalabs/javascript-sdk/blob/main/examples/img2img.js) **Deprecated**, recommend using [img2ImgV3](https://github.com/novitalabs/javascript-sdk/blob/main/examples/img2ImgV3.js)
- [txt2ImgV3](https://github.com/novitalabs/javascript-sdk/blob/main/examples/txt2ImgV3.js)
- [img2ImgV3](https://github.com/novitalabs/javascript-sdk/blob/main/examples/img2ImgV3.js)
- [upscale ](https://github.com/novitalabs/javascript-sdk/blob/main/examples/upscale.js) **Deprecated**, recommend using [upscaleV3 ](https://github.com/novitalabs/javascript-sdk/blob/main/examples/upscaleV3.js)
- [upscaleV3 ](https://github.com/novitalabs/javascript-sdk/blob/main/examples/upscaleV3.js)
- [cleanup](https://github.com/novitalabs/javascript-sdk/blob/main/examples/cleanup.js)
- [outpainting](https://github.com/novitalabs/javascript-sdk/blob/main/examples/outpainting.js)
- [removeBackground](https://github.com/novitalabs/javascript-sdk/blob/main/examples/removebg.js)
- [replaceBackground](https://github.com/novitalabs/javascript-sdk/blob/main/examples/replacebg.js)
- [mixPose](https://github.com/novitalabs/javascript-sdk/blob/main/examples/mixpose.js)
- [doodle](https://github.com/novitalabs/javascript-sdk/blob/main/examples/doodle.js)
- [lcmTxt2Img](https://github.com/novitalabs/javascript-sdk/blob/main/examples/lcm_txt2img.js)
- [replaceSky](https://github.com/novitalabs/javascript-sdk/blob/main/examples/replace_sky.js)
- [replaceObject](https://github.com/novitalabs/javascript-sdk/blob/main/examples/replace_object.js)
- [mergeFace](https://github.com/novitalabs/javascript-sdk/blob/main/examples/merge_face.js)
- [removeText](https://github.com/novitalabs/javascript-sdk/blob/main/examples/removetxt.js)
- [restoreFace](https://github.com/novitalabs/javascript-sdk/blob/main/examples/restore_face.js)
- [reimagine](https://github.com/novitalabs/javascript-sdk/blob/main/examples/reimagine.js)
- [createTile](https://github.com/novitalabs/javascript-sdk/blob/main/examples/createtile.js)
- [LoRA](https://github.com/novitalabs/javascript-sdk/blob/main/examples/lora.js)
- [controlNet](https://github.com/novitalabs/javascript-sdk/blob/main/examples/controlnet.js)
- [img2video](https://github.com/novitalabs/javascript-sdk/blob/main/examples/controlnet.js)

## Type Definitions

For detailed information on the parameters and return types of each method, please refer to the [types.ts](https://github.com/novitalabs/javascript-sdk/blob/main/src/types.ts) file.

## Playground

You can try all demos at [https://novita.ai/playground](https://novita.ai/playground)
