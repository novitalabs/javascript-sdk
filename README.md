<!-- @format -->

# Novita.ai Javascript SDK

This SDK is based on the official [novita.ai API reference](https://docs.novita.ai/)

**Join our discord server for help:**

[![](https://dcbadge.vercel.app/api/server/2SFYcfajN7)](https://discord.gg/a3vd9r3uET)

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

- [txt2Img](./examples/txt2img.js)
- [img2img](./examples/img2img.js)
- [upscale](./examples/upscale.js)
- [cleanup](./examples/cleanup.js)
- [outpainting](./examples/outpainting.js)
- [removeBackground](./examples/removebg.js)
- [replaceBackground](./examples/replacebg.js)
- [mixPose](./examples/mixpose.js)
- [doodle](./examples/doodle.js)
- [lcmTxt2Img](./examples/lcm_txt2img.js)
- [replaceSky](./examples/replace_sky.js)
- [replaceObject](./examples/replace_object.js)
- [mergeFace](./examples/merge_face.js)
- [removeText](./examples/removetxt.js)
- [restoreFace](./examples/restore_face.js)
- [reimagine](./examples/reimagine.js)
- [createTile](./examples/createtile.js)
- [LoRA](./examples/lora.js)
- [controlNet](./examples/controlnet.js)

## Type Definitions

For detailed information on the parameters and return types of each method, please refer to the [types.ts](./src/types.ts) file.

## Playground

You can try all demos at [https://novita.ai/playground](https://novita.ai/playground)
