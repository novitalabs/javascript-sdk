/** @format */

import axios from "axios";
import { ERROR_GENERATE_IMG_FAILED, ERROR_GENERATE_VIDEO_FAILED, UPLOAD_URL } from "./enum";
import {
  RequestOpts,
  GetModelsResponse,
  Img2imgRequest,
  Img2imgV3Request,
  Img2imgV3Response,
  NovitaConfig,
  ProgressRequest,
  ProgressResponse,
  ProgressV3Response,
  V3TaskStatus,
  ResponseCodeV2,
  SyncConfig,
  Txt2ImgRequest,
  Txt2ImgResponse,
  Txt2ImgV3Request,
  Txt2ImgV3Response,
  UpscaleResponse,
  UpscaleRequest,
  UpscaleV3Request,
  UpscaleV3Response,
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
  LcmTxt2ImgRequest,
  LcmTxt2ImgResponse,
  ReplaceSkyRequest,
  ReplaceSkyResponse,
  ReplaceObjectRequest,
  ReplaceObjectResponse,
  MergeFaceRequest,
  MergeFaceResponse,
  RemoveTextRequest,
  RemoveTextResponse,
  RestoreFaceRequest,
  RestoreFaceResponse,
  ReimagineRequest,
  ReimagineResponse,
  CreateTileRequest,
  CreateTileResponse,
  Upscalers,
  Img2VideoRequest,
  Img2VideoResponse,
  LcmImg2ImgRequest,
  LcmImg2ImgResponse,
  RemoveWatermarkRequest,
  RemoveWatermarkResponse,
  Img2VideoMotionRequest,
  Img2VideoMotionResponse,
  UploadRequest,
  UploadResponse,
  Txt2VideoRequest,
  Txt2VideoResponse,
} from "./types";
import { addLoraPrompt, generateLoraString, readImgtoBase64 } from "./util";
import { NovitaError } from "./error";

const Novita_Config: NovitaConfig = {
  BASE_URL: "https://api.novita.ai",
  key: undefined,
};

export function setNovitaKey(key: string) {
  Novita_Config.key = key;
}

export function setBaseUrl(url: string) {
  Novita_Config.BASE_URL = url;
}

function httpFetch({
  url = "",
  method = "GET",
  data = undefined,
  query = undefined,
  opts = undefined,
}: {
  url: string;
  method?: string;
  data?: Record<string, any> | undefined;
  query?: Record<string, any> | undefined;
  opts?: RequestOpts;
}) {
  const fetchUrl = Novita_Config.BASE_URL + url;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Novita-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
  };
  if (Novita_Config.key) {
    headers["Authorization"] = Novita_Config.key;
  }

  return axios({
    url: fetchUrl,
    method: method,
    headers: headers,
    data: data,
    params: query,
    signal: opts?.signal,
  })
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.response ? error.response.data : error.message);
      }
      throw new NovitaError(-10, error.message, error.code, undefined, error);
    });
}

function httpFetchV3({
  url,
  method = "GET",
  data = undefined,
  query = undefined,
  opts = undefined,
}: {
  url: string;
  method?: string;
  data?: any;
  query?: any;
  opts?: RequestOpts;
}) {
  const fetchUrl = Novita_Config.BASE_URL + url;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Novita-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
  };
  if (Novita_Config.key) {
    headers["Authorization"] = Novita_Config.key;
  } else {
    return Promise.reject(new NovitaError(-1, "Novita API key is required"));
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
        throw new NovitaError(response.status, response.data.message, response.data.reason, response.data.metadata);
      }
      return response.data;
    })
    .catch((error) => {
      if (error instanceof NovitaError) {
        throw error;
      }
      const res = error.response;
      if (res) {
        throw new NovitaError(res.status, res.data.message, res.data.reason, res.data.metadata, error);
      }
      throw new NovitaError(-10, error.message, "", undefined, error);
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

export function txt2Img(params: Txt2ImgRequest, opts?: RequestOpts) {
  const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
  params.prompt = prompt;
  delete params.lora;
  return httpFetch({
    url: "/v2/txt2img",
    method: "POST",
    data: params,
    opts,
  }).then((res: Txt2ImgResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function txt2img(params: Txt2ImgRequest, opts?: RequestOpts) {
  return txt2Img(params, opts);
}

export const txt2ImgV3: (p: Txt2ImgV3Request, opts?: any) => Promise<Txt2ImgV3Response> = apiRequestV3<
  Txt2ImgV3Request,
  Txt2ImgV3Response
>("/v3/async/txt2img");
export const txt2imgV3 = txt2ImgV3;

export function img2img(params: Img2imgRequest, opts?: RequestOpts) {
  const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
  params.prompt = prompt;
  delete params.lora;
  return httpFetch({
    url: "/v2/img2img",
    method: "POST",
    data: params,
    opts,
  }).then((res: Txt2ImgResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export function img2Img(params: Img2imgRequest, opts?: RequestOpts) {
  return img2img(params, opts);
}

export const img2ImgV3: (p: Img2imgV3Request, opts?: any) => Promise<Img2imgV3Response> = apiRequestV3<
  Img2imgV3Request,
  Img2imgV3Response
>("/v3/async/img2img");
export const img2imgV3 = img2ImgV3;

export function upscale(params: UpscaleRequest, opts?: RequestOpts) {
  return httpFetch({
    url: "/v2/upscale",
    method: "POST",
    data: {
      ...params,
      upscaler_1: params.upscaler_1 ?? Upscalers.R_ESRGAN_4x_plus,
      upscaler_2: params.upscaler_2 ?? Upscalers.R_ESRGAN_4x_plus,
    },
    opts,
  }).then((res: UpscaleResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg);
    }
    return res.data;
  });
}

export const upscaleV3: (p: UpscaleV3Request, opts?: any) => Promise<UpscaleV3Response> = apiRequestV3<
  UpscaleV3Request,
  UpscaleV3Response
>("/v3/async/upscale");

export function progress(params: ProgressRequest, opts?: RequestOpts) {
  return httpFetch({
    url: "/v2/progress",
    method: "GET",
    query: {
      ...params,
    },
    opts,
  }).then((res: ProgressResponse) => {
    if (res.code !== ResponseCodeV2.OK) {
      throw new NovitaError(res.code, res.msg, "", { ...res.data, task_id: params.task_id });
    }
    return res.data;
  });
}

export function txt2ImgSync(params: Txt2ImgRequest, config?: SyncConfig, opts?: RequestOpts): Promise<any> {
  const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
  params.prompt = prompt;
  delete params.lora;
  return new Promise((resolve, reject) => {
    txt2Img(params, opts)
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(
            async () => {
              try {
                const progressResult = await progress({ task_id: res.task_id }, opts);
                if (progressResult && progressResult.status === 2) {
                  clearInterval(timer);
                  let imgs = progressResult.imgs;
                  if (config?.img_type === "base64") {
                    imgs = await Promise.all(progressResult.imgs.map((url) => readImgtoBase64(url)));
                  }
                  resolve(imgs);
                } else if (progressResult && (progressResult.status === 3 || progressResult.status === 4)) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                      task_id: res.task_id,
                      task_status: progressResult.status,
                    }),
                  );
                }
              } catch (error: any) {
                if (!error.reason || error.reason !== "ERR_NETWORK") {
                  clearInterval(timer);
                  reject(error);
                }
              }
            },
            config?.interval ?? 1000,
          );
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function txt2imgSync(params: Txt2ImgRequest, config?: SyncConfig, opts?: RequestOpts): Promise<any> {
  return txt2ImgSync(params, config, opts);
}

export function img2imgSync(params: Img2imgRequest, config?: SyncConfig, opts?: RequestOpts): Promise<any> {
  const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
  params.prompt = prompt;
  delete params.lora;
  return new Promise((resolve, reject) => {
    img2img(params, opts)
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(
            async () => {
              try {
                const progressResult = await progress({ task_id: res.task_id }, opts);
                if (progressResult && progressResult.status === 2) {
                  clearInterval(timer);
                  let imgs = progressResult.imgs;
                  if (config?.img_type === "base64") {
                    imgs = await Promise.all(progressResult.imgs.map((url) => readImgtoBase64(url)));
                  }
                  resolve(imgs);
                } else if (progressResult && (progressResult.status === 3 || progressResult.status === 4)) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                      task_id: res.task_id,
                      task_status: progressResult.status,
                    }),
                  );
                }
              } catch (error: any) {
                if (!error.reason || error.reason !== "ERR_NETWORK") {
                  clearInterval(timer);
                  reject(error);
                }
              }
            },
            config?.interval ?? 1000,
          );
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function img2ImgSync(params: Img2imgRequest, config?: SyncConfig, opts?: RequestOpts): Promise<any> {
  return img2imgSync(params, config, opts);
}

export function upscaleSync(params: UpscaleRequest, config?: SyncConfig, opts?: RequestOpts) {
  return new Promise((resolve, reject) => {
    upscale(
      {
        ...params,
        upscaler_1: params.upscaler_1 ?? Upscalers.R_ESRGAN_4x_plus,
        upscaler_2: params.upscaler_2 ?? Upscalers.R_ESRGAN_4x_plus,
      },
      opts,
    )
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(
            async () => {
              try {
                const progressResult = await progress({ task_id: res.task_id }, opts);
                if (progressResult && progressResult.status === 2) {
                  clearInterval(timer);
                  let imgs = progressResult.imgs;
                  if (config?.img_type === "base64") {
                    imgs = await Promise.all(progressResult.imgs.map((url) => readImgtoBase64(url)));
                  }
                  resolve(imgs);
                } else if (progressResult && (progressResult.status === 3 || progressResult.status === 4)) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                      task_id: res.task_id,
                      task_status: progressResult.status,
                    }),
                  );
                }
              } catch (error: any) {
                if (!error.reason || error.reason !== "ERR_NETWORK") {
                  clearInterval(timer);
                  reject(error);
                }
              }
            },
            config?.interval ?? 1000,
          );
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

function apiRequestV3<T, R>(url: string): (p: T, o?: RequestOpts) => Promise<R> {
  return (params: T, opts?: any): Promise<R> => {
    return httpFetchV3({
      url: url,
      method: "POST",
      data: params,
      opts,
    });
  };
}

export function progressV3(params: ProgressRequest, opts?: RequestOpts): Promise<ProgressV3Response> {
  return httpFetchV3({
    url: "/v3/async/task-result",
    method: "GET",
    query: params,
    opts,
  }).catch((error) => {
    if (error.metadata) {
      error.metadata.task_id = params.task_id;
    } else {
      error.metadata = { task_id: params.task_id };
    }
    throw error;
  });
}

export const cleanup: (p: CleanupRequest, opts?: any) => Promise<CleanupResponse> = apiRequestV3<
  CleanupRequest,
  CleanupResponse
>("/v3/cleanup");

export const outpainting: (p: OutpaintingRequest, opts?: any) => Promise<OutpaintingResponse> = apiRequestV3<
  OutpaintingRequest,
  OutpaintingResponse
>("/v3/outpainting");

export const removeBackground: (p: RemoveBackgroundRequest, opts?: any) => Promise<RemoveBackgroundResponse> =
  apiRequestV3<RemoveBackgroundRequest, RemoveBackgroundResponse>("/v3/remove-background");

export const replaceBackground: (p: ReplaceBackgroundRequest, opts?: any) => Promise<ReplaceBackgroundResponse> =
  apiRequestV3<ReplaceBackgroundRequest, ReplaceBackgroundResponse>("/v3/replace-background");

export const mixpose: (p: MixPoseRequest, opts?: any) => Promise<MixPoseResponse> = apiRequestV3<
  MixPoseRequest,
  MixPoseResponse
>("/v3/mix-pose");

export const doodle: (p: DoodleRequest, opts?: any) => Promise<DoodleResponse> = apiRequestV3<
  DoodleRequest,
  DoodleResponse
>("/v3/doodle");

export const lcmTxt2Img: (p: LcmTxt2ImgRequest, opts?: any) => Promise<LcmTxt2ImgResponse> = apiRequestV3<
  LcmTxt2ImgRequest,
  LcmTxt2ImgResponse
>("/v3/lcm-txt2img");

export const lcmImg2Img: (p: LcmImg2ImgRequest, opts?: any) => Promise<LcmImg2ImgResponse> = apiRequestV3<
  LcmImg2ImgRequest,
  LcmImg2ImgResponse
>("/v3/lcm-img2img");

export const replaceSky: (p: ReplaceSkyRequest, opts?: any) => Promise<ReplaceSkyResponse> = apiRequestV3<
  ReplaceSkyRequest,
  ReplaceSkyResponse
>("/v3/replace-sky");

export const replaceObject: (p: ReplaceObjectRequest, opts?: any) => Promise<ReplaceObjectResponse> = apiRequestV3<
  ReplaceObjectRequest,
  ReplaceObjectResponse
>("/v3/async/replace-object");

export const replaceObjectSync: (params: ReplaceObjectRequest, config?: SyncConfig, opts?: any) => Promise<string[]> = (
  params: ReplaceObjectRequest,
  config?: SyncConfig,
  opts?: any,
) => {
  return new Promise((resolve, reject) => {
    replaceObject(params, opts)
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(
            async () => {
              try {
                const progressResult = await progressV3(
                  {
                    task_id: res.task_id,
                  },
                  opts,
                );
                if (progressResult.task.status === V3TaskStatus.SUCCEED && progressResult.images) {
                  clearInterval(timer);
                  let imgsBase64: string[] = [];
                  if (config?.img_type === "base64") {
                    imgsBase64 = await Promise.all(progressResult.images.map((img) => readImgtoBase64(img.image_url)));
                  } else {
                    imgsBase64 = progressResult.images.map((img) => img.image_url);
                  }
                  resolve(imgsBase64);
                } else if (progressResult.task.status === V3TaskStatus.FAILED) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                      task_id: progressResult.task.task_id,
                      task_status: progressResult.task.status,
                    }),
                  );
                } else if (
                  progressResult.task.status !== V3TaskStatus.QUEUED &&
                  progressResult.task.status !== V3TaskStatus.PROCESSING
                ) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                      task_id: progressResult.task.task_id,
                      task_status: progressResult.task.status,
                    }),
                  );
                }
              } catch (error: any) {
                if (!error.reason || error.reason !== "ERR_NETWORK") {
                  clearInterval(timer);
                  reject(error);
                }
              }
            },
            config?.interval ?? 1000,
          );
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
};

export const mergeFace: (p: MergeFaceRequest, opts?: any) => Promise<MergeFaceResponse> = apiRequestV3<
  MergeFaceRequest,
  MergeFaceResponse
>("/v3/merge-face");

export const removeText: (p: RemoveTextRequest, opts?: any) => Promise<RemoveTextResponse> = apiRequestV3<
  RemoveTextRequest,
  RemoveTextResponse
>("/v3/remove-text");

export const removeWatermark: (p: RemoveWatermarkRequest, opts?: any) => Promise<RemoveWatermarkResponse> =
  apiRequestV3<RemoveWatermarkRequest, RemoveWatermarkResponse>("/v3/remove-watermark");

export const restoreFace: (p: RestoreFaceRequest, opts?: any) => Promise<RestoreFaceResponse> = apiRequestV3<
  RestoreFaceRequest,
  RestoreFaceResponse
>("/v3/restore-face");

export const reimagine: (p: ReimagineRequest, opts?: any) => Promise<ReimagineResponse> = apiRequestV3<
  ReimagineRequest,
  ReimagineResponse
>("/v3/reimagine");

export const createTile: (p: CreateTileRequest, opts?: any) => Promise<CreateTileResponse> = apiRequestV3<
  CreateTileRequest,
  CreateTileResponse
>("/v3/create-tile");

export const txt2Video: (p: Txt2VideoRequest, opts?: any) => Promise<Txt2VideoResponse> = apiRequestV3<
  Txt2VideoRequest,
  Txt2VideoResponse
>("/v3/async/txt2video");

export const img2Video: (p: Img2VideoRequest, opts?: any) => Promise<Img2VideoResponse> = apiRequestV3<
  Img2VideoRequest,
  Img2VideoResponse
>("/v3/async/img2video");

export const img2VideoSync: (params: Img2VideoRequest, config?: SyncConfig, opts?: any) => Promise<string[]> = (
  params: Img2VideoRequest,
  config?: SyncConfig,
  opts?: any,
) => {
  return new Promise((resolve, reject) => {
    img2Video(params, opts)
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(
            async () => {
              try {
                const progressResult = await progressV3(
                  {
                    task_id: res.task_id,
                  },
                  opts,
                );
                if (progressResult.task.status === V3TaskStatus.SUCCEED && progressResult.videos) {
                  clearInterval(timer);
                  let videos: string[] = [];
                  videos = progressResult.videos.map((v) => v.video_url);
                  resolve(videos);
                } else if (progressResult.task.status === V3TaskStatus.FAILED) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_VIDEO_FAILED, "", {
                      task_id: progressResult.task.task_id,
                      task_status: progressResult.task.status,
                    }),
                  );
                } else if (
                  progressResult.task.status !== V3TaskStatus.QUEUED &&
                  progressResult.task.status !== V3TaskStatus.PROCESSING
                ) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_VIDEO_FAILED, "", {
                      task_id: progressResult.task.task_id,
                      task_status: progressResult.task.status,
                    }),
                  );
                }
              } catch (error: any) {
                if (!error.reason || error.reason !== "ERR_NETWORK") {
                  clearInterval(timer);
                  reject(error);
                }
              }
            },
            config?.interval ?? 1000,
          );
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
};

export const img2VideoMotion: (p: Img2VideoMotionRequest, opts?: any) => Promise<Img2VideoMotionResponse> =
  apiRequestV3<Img2VideoMotionRequest, Img2VideoMotionResponse>("/v3/async/img2video-motion");

export const img2VideoMotionSync: (p: Img2VideoMotionRequest, opts?: any) => Promise<string[]> = (
  params: Img2VideoMotionRequest,
  config?: SyncConfig,
  opts?: any,
) => {
  return new Promise((resolve, reject) => {
    img2VideoMotion(params, opts)
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(
            async () => {
              try {
                const progressResult = await progressV3(
                  {
                    task_id: res.task_id,
                  },
                  opts,
                );
                if (progressResult.task.status === V3TaskStatus.SUCCEED && progressResult.videos) {
                  clearInterval(timer);
                  let videos: string[] = [];
                  videos = progressResult.videos.map((v) => v.video_url);
                  resolve(videos);
                } else if (progressResult.task.status === V3TaskStatus.FAILED) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_VIDEO_FAILED, "", {
                      task_id: progressResult.task.task_id,
                      task_status: progressResult.task.status,
                    }),
                  );
                } else if (
                  progressResult.task.status !== V3TaskStatus.QUEUED &&
                  progressResult.task.status !== V3TaskStatus.PROCESSING
                ) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_VIDEO_FAILED, "", {
                      task_id: progressResult.task.task_id,
                      task_status: progressResult.task.status,
                    }),
                  );
                }
              } catch (error: any) {
                if (!error.reason || error.reason !== "ERR_NETWORK") {
                  clearInterval(timer);
                  reject(error);
                }
              }
            },
            config?.interval ?? 1000,
          );
        } else {
          reject(new NovitaError(-1, "Failed to start the task."));
        }
      })
      .catch(reject);
  });
};

export const upload: (p: UploadRequest, opts?: RequestOpts) => Promise<UploadResponse> = (
  p: UploadRequest,
  opts?: RequestOpts,
) => {
  return axios({
    url: `${UPLOAD_URL}/${p.type}`,
    method: "PUT",
    data: p.data,
    signal: opts?.signal,
  })
    .then((response) => {
      if (response.status !== ResponseCodeV3.OK) {
        throw new NovitaError(response.status, response.data.message, response.data.reason, response.data.metadata);
      }
      return response.data;
    })
    .catch((error) => {
      if (error instanceof NovitaError) {
        throw error;
      }
      const res = error.response;
      if (res) {
        throw new NovitaError(res.status, res.data.message, res.data.reason, res.data.metadata, error);
      }
      throw new NovitaError(-10, error.message, "", undefined, error);
    });
};
