/** @format */

import axios from "axios";
import {
  RequestOpts,
  GetModelsResponse,
  Img2imgRequest,
  ProgressRequest,
  ProgressResponse,
  ProgressV3Response,
  ResponseCodeV2,
  SyncConfig,
  Txt2ImgRequest,
  Txt2ImgResponse,
  UpscaleResponse,
  UpscaleRequest,
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
  TaskStatus,
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
} from "./types";
import { addLoraPrompt, generateLoraString, readImgtoBase64 } from "./util";
import { ERROR_GENERATE_IMG_FAILED, ERROR_GENERATE_VIDEO_FAILED } from "./enum";
import { NovitaError } from "./error";

export class NovitaSDK {
  protected key: string;
  protected BASE_URL: string;

  constructor(key: string) {
    this.key = key;
    this.BASE_URL = "https://api.novita.ai";
  }

  setBaseUrl(url: string) {
    this.BASE_URL = url;
  }
  setNovitaKey(key: string) {
    this.key = key;
  }

  httpFetch({
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
    const fetchUrl = this.BASE_URL + url;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Novita-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
    };
    if (this.key) {
      headers["Authorization"] = this.key;
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
        throw new Error(error.response ? error.response.data : error.message);
      });
  }

  httpFetchV3({
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
    const fetchUrl = this.BASE_URL + url;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Novita-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
    };
    if (this.key) {
      headers["Authorization"] = this.key;
    } else {
      return Promise.reject(new NovitaError(-1, "Novita API key is required"));
    }
    return axios({
      url: fetchUrl,
      method: method,
      headers: headers,
      data: data,
      params: query,
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
        throw new NovitaError(-1, error.message, "", undefined, error);
      });
  }

  private _apiRequestV3<T, R>(url: string): (p: T, o?: RequestOpts) => Promise<R> {
    return (params: T, opts?: any): Promise<R> => {
      return this.httpFetchV3({
        url: url,
        method: "POST",
        data: params,
        opts,
      });
    };
  }

  getModels() {
    return this.httpFetch({
      url: "/v2/models",
    }).then((res: GetModelsResponse) => {
      if (res.code !== ResponseCodeV2.OK) {
        throw new NovitaError(res.code, res.msg);
      }
      return res.data;
    });
  }

  txt2Img(params: Txt2ImgRequest, opts?: any) {
    const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
    params.prompt = prompt;
    delete params.lora;
    return this.httpFetch({
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

  img2img(params: Img2imgRequest, opts?: any) {
    const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
    params.prompt = prompt;
    delete params.lora;
    return this.httpFetch({
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

  progress(params: ProgressRequest, opts?: any) {
    return this.httpFetch({
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

  txt2ImgSync(params: Txt2ImgRequest, config?: SyncConfig, opts?: any): Promise<any> {
    const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
    params.prompt = prompt;
    delete params.lora;
    return new Promise((resolve, reject) => {
      this.txt2Img(params, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(
              async () => {
                try {
                  const progressResult = await this.progress(
                    {
                      task_id: res.task_id,
                    },
                    opts,
                  );
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
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
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

  img2imgSync(params: Img2imgRequest, config?: SyncConfig, opts?: any): Promise<any> {
    const prompt = addLoraPrompt(generateLoraString(params.lora), params.prompt);
    params.prompt = prompt;
    delete params.lora;
    return new Promise((resolve, reject) => {
      this.img2img(params, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(
              async () => {
                try {
                  const progressResult = await this.progress(
                    {
                      task_id: res.task_id,
                    },
                    opts,
                  );
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
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
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

  upscale(params: UpscaleRequest, opts?: any) {
    return this.httpFetch({
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

  upscaleSync(params: UpscaleRequest, config?: SyncConfig, opts?: any) {
    return new Promise((resolve, reject) => {
      this.upscale(
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
                  const progressResult = await this.progress(
                    {
                      task_id: res.task_id,
                    },
                    opts,
                  );
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
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
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

  progressV3(params: ProgressRequest, opts?: RequestOpts): Promise<ProgressV3Response> {
    return this.httpFetchV3({
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

  cleanup: (params: CleanupRequest, opts?: any) => Promise<CleanupResponse> = this._apiRequestV3<
    CleanupRequest,
    CleanupResponse
  >("/v3/cleanup");

  outpainting: (params: OutpaintingRequest, opts?: any) => Promise<OutpaintingResponse> = this._apiRequestV3<
    OutpaintingRequest,
    OutpaintingResponse
  >("/v3/outpainting");

  removeBackground: (params: RemoveBackgroundRequest, opts?: any) => Promise<RemoveBackgroundResponse> =
    this._apiRequestV3<RemoveBackgroundRequest, RemoveBackgroundResponse>("/v3/remove-background");

  replaceBackground: (params: ReplaceBackgroundRequest, opts?: any) => Promise<ReplaceBackgroundResponse> =
    this._apiRequestV3<ReplaceBackgroundRequest, ReplaceBackgroundResponse>("/v3/replace-background");

  mixpose: (p: MixPoseRequest, opts?: any) => Promise<MixPoseResponse> = this._apiRequestV3<
    MixPoseRequest,
    MixPoseResponse
  >("/v3/mix-pose");

  doodle: (p: DoodleRequest, opts?: any) => Promise<DoodleResponse> = this._apiRequestV3<DoodleRequest, DoodleResponse>(
    "/v3/doodle",
  );

  lcmTxt2Img: (p: LcmTxt2ImgRequest, opts?: any) => Promise<LcmTxt2ImgResponse> = this._apiRequestV3<
    LcmTxt2ImgRequest,
    LcmTxt2ImgResponse
  >("/v3/lcm-txt2img");

  replaceSky: (p: ReplaceSkyRequest, opts?: any) => Promise<ReplaceSkyResponse> = this._apiRequestV3<
    ReplaceSkyRequest,
    ReplaceSkyResponse
  >("/v3/replace-sky");

  replaceObject: (p: ReplaceObjectRequest, opts?: any) => Promise<ReplaceObjectResponse> = this._apiRequestV3<
    ReplaceObjectRequest,
    ReplaceObjectResponse
  >("/v3/async/replace-object");

  replaceObjectSync(params: ReplaceObjectRequest, config?: SyncConfig, opts?: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.replaceObject(params, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(
              async () => {
                try {
                  const progressResult = await this.progressV3(
                    {
                      task_id: res.task_id,
                    },
                    opts,
                  );
                  if (progressResult.task.status === TaskStatus.SUCCEED && progressResult.images) {
                    clearInterval(timer);
                    let imgsBase64: string[] = [];
                    if (config?.img_type === "base64") {
                      imgsBase64 = await Promise.all(
                        progressResult.images.map((img) => readImgtoBase64(img.image_url)),
                      );
                    } else {
                      imgsBase64 = progressResult.images.map((img) => img.image_url);
                    }
                    resolve(imgsBase64);
                  } else if (progressResult.task.status === TaskStatus.FAILED) {
                    clearInterval(timer);
                    reject(
                      new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                        task_id: progressResult.task.task_id,
                        task_status: progressResult.task.status,
                      }),
                    );
                  } else if (progressResult.task.status !== TaskStatus.QUEUED) {
                    clearInterval(timer);
                    reject(
                      new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_IMG_FAILED, "", {
                        task_id: progressResult.task.task_id,
                        task_status: progressResult.task.status,
                      }),
                    );
                  }
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
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

  mergeFace: (p: MergeFaceRequest, opts?: any) => Promise<MergeFaceResponse> = this._apiRequestV3<
    MergeFaceRequest,
    MergeFaceResponse
  >("/v3/merge-face");

  removeText: (p: RemoveTextRequest, opts?: any) => Promise<RemoveTextResponse> = this._apiRequestV3<
    RemoveTextRequest,
    RemoveTextResponse
  >("/v3/remove-text");

  restoreFace: (p: RestoreFaceRequest, opts?: any) => Promise<RestoreFaceResponse> = this._apiRequestV3<
    RestoreFaceRequest,
    RestoreFaceResponse
  >("/v3/restore-face");

  reimagine: (p: ReimagineRequest, opts?: any) => Promise<ReimagineResponse> = this._apiRequestV3<
    ReimagineRequest,
    ReimagineResponse
  >("/v3/reimagine");

  createTile: (p: CreateTileRequest, opts?: any) => Promise<CreateTileResponse> = this._apiRequestV3<
    CreateTileRequest,
    CreateTileResponse
  >("/v3/create-tile");

  img2Video: (p: Img2VideoRequest, opts?: any) => Promise<Img2VideoResponse> = this._apiRequestV3<
    Img2VideoRequest,
    Img2VideoResponse
  >("/v3/async/img2video");

  img2VideoSync: (params: Img2VideoRequest, config?: SyncConfig, opts?: any) => Promise<string[]> = (
    params: Img2VideoRequest,
    config?: SyncConfig,
    opts?: any,
  ) => {
    return new Promise((resolve, reject) => {
      this.img2Video(params, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(
              async () => {
                try {
                  const progressResult = await this.progressV3(
                    {
                      task_id: res.task_id,
                    },
                    opts,
                  );
                  if (progressResult.task.status === TaskStatus.SUCCEED && progressResult.videos) {
                    clearInterval(timer);
                    let videos: string[] = [];
                    videos = progressResult.videos.map((v) => v.video_url);
                    resolve(videos);
                  } else if (progressResult.task.status === TaskStatus.FAILED) {
                    clearInterval(timer);
                    reject(
                      new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_VIDEO_FAILED, "", {
                        task_id: progressResult.task.task_id,
                        task_status: progressResult.task.status,
                      }),
                    );
                  } else if (progressResult.task.status !== TaskStatus.QUEUED) {
                    clearInterval(timer);
                    reject(
                      new NovitaError(0, progressResult.task.reason ?? ERROR_GENERATE_VIDEO_FAILED, "", {
                        task_id: progressResult.task.task_id,
                        task_status: progressResult.task.status,
                      }),
                    );
                  }
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
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
}
