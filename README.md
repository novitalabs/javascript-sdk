<!-- @format -->

# Novita.ai Javascript SDK

This SDK is based on the official [novita.ai API reference](https://docs.novita.ai/)

**Join our discord server for help:**

[![](https://dcbadge.vercel.app/api/server/YyPRAzwp7P)](https://discord.gg/YyPRAzwp7P)

## Quick start

1. Sign up on [novita.ai](https://novita.ai) and get an API key. Please follow the instructions at [https://novita.ai/get-started](https://novita.ai/get-started/)

2. Install the [npm package](https://www.npmjs.com/package/novita-sdk) in your project.

```bash
npm i novita-sdk
```

## Version 3.1.0 Update Notes

We've made significant changes in version 3.0.0. We removed some APIs and will not serve them in the future. The APIs deprecated are:

- adetailer
- img2mask
- anymate-anyone
- create-tile
- doodle
- lcm-img2img
- lcm-txt2img
- make-photo
- mix-pose
- relight
- remove-watermark
- replace-sky
- replace-object
- upscale
- img2prompt
- img2video-motion
- outpainting
- reimagine
- restore-face

## Usage

```javascript
import { NovitaSDK } from "novita-sdk";

const novitaClient = new NovitaSDK("your api key");

const params = {
  request: {
    model_name: "majicmixRealistic_v7_134792.safetensors",
    prompt: "1girl,sweater,white background",
    negative_prompt: "(worst quality:2),(low quality:2),(normal quality:2),lowres,watermark,",
    width: 512,
    height: 768,
    sampler_name: "Euler a",
    guidance_scale: 7,
    steps: 20,
    image_num: 1,
    seed: -1,
  },
};
novitaClient
  .txt2Img(params)
  .then((res) => {
    if (res && res.task_id) {
      const timer = setInterval(() => {
        novitaClient
          .progress({
            task_id: res.task_id,
          })
          .then((progressRes) => {
            if (progressRes.task.status === TaskStatus.SUCCEED) {
              console.log("finished!", progressRes.images);
              clearInterval(timer);
              onFinish(progressRes.images);
            }
            if (progressRes.task.status === TaskStatus.FAILED) {
              console.warn("failed!", progressRes.task.reason);
              clearInterval(timer);
            }
            if (progressRes.task.status === TaskStatus.QUEUED) {
              console.log("queueing");
            }
          })
          .catch((err) => {
            console.error("progress error:", err);
          });
      }, 1000);
    }
  })
  .catch((err) => {
    console.error(err);
  });
```

## API list and Sample codes

- [txt2Img](https://github.com/novitalabs/javascript-sdk/blob/main/examples/txt2Img.js)
- [img2Img](https://github.com/novitalabs/javascript-sdk/blob/main/examples/img2Img.js)
- [cleanup](https://github.com/novitalabs/javascript-sdk/blob/main/examples/cleanup.js)
- [outpainting](https://github.com/novitalabs/javascript-sdk/blob/main/examples/outpainting.js)
- [removeBackground](https://github.com/novitalabs/javascript-sdk/blob/main/examples/removebg.js)
- [replaceBackground](https://github.com/novitalabs/javascript-sdk/blob/main/examples/replacebg.js)
- [mergeFace](https://github.com/novitalabs/javascript-sdk/blob/main/examples/merge_face.js)
- [removeText](https://github.com/novitalabs/javascript-sdk/blob/main/examples/removetxt.js)
- [restoreFace](https://github.com/novitalabs/javascript-sdk/blob/main/examples/restore_face.js)
- [reimagine](https://github.com/novitalabs/javascript-sdk/blob/main/examples/reimagine.js)
- [img2video](https://github.com/novitalabs/javascript-sdk/blob/main/examples/controlnet.js)

## Type Definitions

For detailed information on the parameters and return types of each method, please refer to the [types.ts](https://github.com/novitalabs/javascript-sdk/blob/main/src/types.ts) file.

## Playground

You can try all demos at [https://novita.ai/model-api/playground](https://novita.ai/model-api/playground)
