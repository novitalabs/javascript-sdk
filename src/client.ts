import axios from "axios";
import { ERROR_GENERATE_IMG_FAILED } from "./enum";
import {
  GetModelsResponse,
  Img2imgRequest,
  NovitaConfig,
  ProgressRequest,
  ProgressResponse,
  ResponseCodeV2,
  SyncConfig,
  Txt2ImgRequest,
  Txt2ImgResponse,
  UpscaleResponse,
  UpscalseRequest,
  OutpaintingRequest,
  OutpaintingResponse,
  ResponseCodeV3,
  RemoveBackgroundRequest,
  RemoveBackgroundResponse,
  ReplaceBackgroundRequest,
  ReplaceBackgroundResponse,
  CleanupRequest,
  CleanupResponse,
  MixPoseRequest,
  MixPoseResponse,
  DoodleRequest,
  DoodleResponse,
  lcmTxt2ImgRequest,
  lcmTxt2ImgResponse,
} from "./types";
import { addLoraPrompt, generateLoraString, readImgtoBase64 } from "./util";
import NovitaError from "./error";

const Novita_Config: NovitaConfig = {
  BASE_URL: "https://api.novita.ai",
  key: undefined,
};

export function setNovitaKey(key: string) {
  Novita_Config.key = key;
}

export function setBaseUrl(url: string) {
  Novita_Config.BASE_URL = url
}

export function httpFetch({
  url = "",
  method = "GET",
  data = undefined,
  query = undefined,
}: {
  url: string;
  method?: string;
  data?: Record<string, any> | undefined;
  query?: Record<string, any> | undefined;
}) {
  let fetchUrl = Novita_Config.BASE_URL + url;

  if (query) {
    fetchUrl += "?" + new URLSearchParams(query).toString();
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Novita-Source": "js-sdk-novita",
    ...(Novita_Config.key ? { "Authorization": Novita_Config.key } : {}),
  };

  return axios({
    url: fetchUrl,
    method: method,
    headers: headers,
    data: data,
    params: query,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error.response ? error.response.data : error.message);
    });
}

export function httpFetchV3({
  url,
  method = "GET",
  data = undefined,
  query = undefined,
}: {
  url: string;
  method?: string;
  data?: any;
  query?: any;
  opts?: RequestInit;
}) {
  let fetchUrl = Novita_Config.BASE_URL + url;
  if (query) {
    fetchUrl += new URLSearchParams(query).toString();
  }
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Novita-Source": "Novita",
  }
  if (Novita_Config.key) {
    headers["Authorization"] = Novita_Config.key
  } else {
    headers["X-Novita-Auth-Type"] = "anon"
  }

  return axios({
    url: fetchUrl,
    method: method,
    headers: headers,
    data: data,
    params: query,
  })
    .then((response) => {
      if (response.status !== ResponseCodeV3.OK) {
        throw new NovitaError(response.status, response.data.message, response.data.reason, undefined, response.data.metadata)
      }
      return response.data
    })
    .catch((error) => {
      if (error instanceof NovitaError) {
        throw error
      }
      const res = error.response
      throw new NovitaError(res.status, res.data.message, res.data.reason, undefined, res.data.metadata)
    });
}

export function getModels() {
  return httpFetch({
    url: "/v2/models",
  }).then((res: GetModelsResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function txt2Img(params: Txt2ImgRequest) {
  return httpFetch({
    url: "/v2/txt2img",
    method: "POST",
    data: {
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    },
  }).then((res: Txt2ImgResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function img2img(params: Img2imgRequest) {
  return httpFetch({
    url: "/v2/img2img",
    method: "POST",
    data: {
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    },
  }).then((res: Txt2ImgResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function upscale(params: UpscalseRequest) {
  return httpFetch({
    url: "/v2/upscale",
    method: "POST",
    data: {
      ...params,
      upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
      upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
    },
  }).then((res: UpscaleResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function progress(params: ProgressRequest) {
  return httpFetch({
    url: "/v2/progress",
    method: "GET",
    query: {
      ...params,
    },
  }).then((res: ProgressResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function txt2ImgSync(
  params: Txt2ImgRequest,
  config?: SyncConfig
): Promise<any> {
  return new Promise((resolve, reject) => {
    txt2Img({
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    })
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(async () => {
            try {
              const progressResult = await progress({ task_id: res.task_id });
              if (progressResult && progressResult.status === 2) {
                clearInterval(timer);
                let imgs = progressResult.imgs;
                if (config?.img_type === "base64") {
                  imgs = await Promise.all(
                    progressResult.imgs.map((url) => readImgtoBase64(url))
                  );
                }
                resolve(imgs);
              } else if (
                progressResult &&
                (progressResult.status === 3 || progressResult.status === 4)
              ) {
                clearInterval(timer);
                reject(
                  new NovitaError(
                    0,
                    progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED,
                    '',
                    progressResult.status,
                  )
                );
              }
            } catch (error) {
              clearInterval(timer);
              reject(error);
            }
          }, config?.interval ?? 1000);
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function img2imgSync(
  params: Img2imgRequest,
  config?: SyncConfig
): Promise<any> {
  return new Promise((resolve, reject) => {
    img2img({
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    })
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(async () => {
            try {
              const progressResult = await progress({ task_id: res.task_id });
              if (progressResult && progressResult.status === 2) {
                clearInterval(timer);
                let imgs = progressResult.imgs;
                if (config?.img_type === "base64") {
                  imgs = await Promise.all(
                    progressResult.imgs.map((url) => readImgtoBase64(url))
                  );
                }
                resolve(imgs);
              } else if (
                progressResult &&
                (progressResult.status === 3 || progressResult.status === 4)
              ) {
                clearInterval(timer);
                reject(
                  new NovitaError(
                    0,
                    progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED,
                    '',
                    progressResult.status,
                  )
                );
              }
            } catch (error) {
              clearInterval(timer);
              reject(error);
            }
          }, config?.interval ?? 1000);
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function upscaleSync(params: UpscalseRequest, config?: SyncConfig) {
  return new Promise((resolve, reject) => {
    upscale({
      ...params,
      upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
      upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
    })
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(async () => {
            try {
              const progressResult = await progress({ task_id: res.task_id });
              if (progressResult && progressResult.status === 2) {
                clearInterval(timer);
                let imgs = progressResult.imgs;
                if (config?.img_type === "base64") {
                  imgs = await Promise.all(
                    progressResult.imgs.map((url) => readImgtoBase64(url))
                  );
                }
                resolve(imgs);
              } else if (
                progressResult &&
                (progressResult.status === 3 || progressResult.status === 4)
              ) {
                clearInterval(timer);
                reject(
                  new NovitaError(
                    0,
                    progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED,
                    '',
                    progressResult.status,
                  )
                );
              }
            } catch (error) {
              clearInterval(timer);
              reject(error);
            }
          }, config?.interval ?? 1000);
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function cleanup(params: CleanupRequest) {
  return httpFetchV3({
    url: "/v3/cleanup",
    method: "POST",
    data: params,
  }).then((res: CleanupResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}

export function outpainting(params: OutpaintingRequest) {
  return httpFetchV3({
    url: "/v3/outpainting",
    method: "POST",
    data: params,
  }).then((res: OutpaintingResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}

export function removeBackground(params: RemoveBackgroundRequest) {
  return httpFetchV3({
    url: "/v3/remove-background",
    method: "POST",
    data: params,
  }).then((res: RemoveBackgroundResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}

export function replaceBackground(params: ReplaceBackgroundRequest) {
  return httpFetchV3({
    url: "/v3/replace-background",
    method: "POST",
    data: params,
  }).then((res: ReplaceBackgroundResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}

export function mixpose(params: MixPoseRequest) {
  return httpFetchV3({
    url: "/v3/mix-pose",
    method: "POST",
    data: params,
  }).then((res: MixPoseResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}

export function doodle(params: DoodleRequest) {
  return httpFetchV3({
    url: "/v3/doodle",
    method: "POST",
    data: params,
  }).then((res: DoodleResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}

export function lcmTxt2Img(params: lcmTxt2ImgRequest) {
  return httpFetchV3({
    url: "/v3/lcm-txt2img",
    method: "POST",
    data: params,
  }).then((res: lcmTxt2ImgResponse) => {
    if (res.code && res.code !== ResponseCodeV3.OK) {
      throw new NovitaError(res.code, res.message || '', res.reason, undefined, res.metadata);
    }
    return res;
  });
}