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
} from "./types";
import { addLoraPrompt, generateLoraString, readImgtoBase64 } from "./util";
import { ERROR_GENERATE_IMG_FAILED } from "./enum";
import { NovitaError } from "./error"

export class NovitaSDK {
  protected key: string;
  protected BASE_URL: string;

  constructor(key: string) {
    this.key = key;
    this.BASE_URL = "https://api.novita.ai";
  }

  setBaseUrl(url: string) {
    this.BASE_URL = url
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
    let fetchUrl = this.BASE_URL + url;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Novita-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
    }
    if (this.key) {
      headers["Authorization"] = this.key
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
    let fetchUrl = this.BASE_URL + url;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Novita-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
    }
    if (this.key) {
      headers["Authorization"] = this.key
    } else {
      headers["X-Novita-Auth-Type"] = "anon"
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
          throw new NovitaError(response.status, response.data.message, response.data.reason, response.data.metadata)
        }
        return response.data
      })
      .catch((error) => {
        if (error instanceof NovitaError) {
          throw error
        }
        const res = error.response
        if (res) {
          throw new NovitaError(res.status, res.data.message, res.data.reason, res.data.metadata, error)
        }
        throw new NovitaError(-1, error.message, '', undefined, error)
      });
  }

  private _apiRequestV3<T, R>(url: string): (p: T, o?: RequestOpts) => Promise<R> {
    return (params: T, opts?: any): Promise<R> => {
      return this.httpFetchV3({
        url: url,
        method: "POST",
        data: params,
        opts,
      }).then((res: any) => {
        if (res.code && res.code !== ResponseCodeV3.OK) {
          throw new NovitaError(res.code, res.message || '', res.reason, res.metadata);
        }
        return res;
      });
    }
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
    return this.httpFetch({
      url: "/v2/txt2img",
      method: "POST",
      data: {
        ...params,
        prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
      },
      opts,
    }).then((res: Txt2ImgResponse) => {
      if (res.code !== ResponseCodeV2.OK) {
        throw new NovitaError(res.code, res.msg);
      }
      return res.data;
    });
  }

  img2img(params: Img2imgRequest, opts?: any) {
    return this.httpFetch({
      url: "/v2/img2img",
      method: "POST",
      data: {
        ...params,
        prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
      },
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
        throw new NovitaError(res.code, res.msg);
      }
      return res.data;
    });
  }

  txt2ImgSync(params: Txt2ImgRequest, config?: SyncConfig, opts?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.txt2Img({
        ...params,
        prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
      }, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progress({
                  task_id: res.task_id,
                }, opts);
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
                      { task_status: progressResult.status },
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

  img2imgSync(params: Img2imgRequest, config?: SyncConfig, opts?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.img2img({
        ...params,
        prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
      }, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progress({
                  task_id: res.task_id,
                }, opts);
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
                      { task_status: progressResult.status },
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

  upscale(params: UpscalseRequest, opts?: any) {
    return this.httpFetch({
      url: "/v2/upscale",
      method: "POST",
      data: {
        ...params,
        upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
        upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
      },
      opts,
    }).then((res: UpscaleResponse) => {
      if (res.code !== ResponseCodeV2.OK) {
        throw new NovitaError(res.code, res.msg);
      }
      return res.data;
    });
  }

  upscaleSync(params: UpscalseRequest, config?: SyncConfig, opts?: any) {
    return new Promise((resolve, reject) => {
      this.upscale({
        ...params,
        upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
        upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
      }, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progress({
                  task_id: res.task_id,
                }, opts);
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
                      { task_status: progressResult.status },
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

  progressV3(params: ProgressRequest, opts?: RequestOpts) {
    console.log('progress V3', params, opts)
    return this.httpFetchV3({
      url: "/v3/async/task-result",
      method: "GET",
      query: params,
      opts,
    }).then((res: ProgressV3Response) => {
      if (res.code && res.code !== ResponseCodeV3.OK) {
        throw new NovitaError(res.code, res.message || '', res.reason, res.metadata);
      }
      return res;
    });
  }

  cleanup: (params: CleanupRequest, opts?: any) => Promise<CleanupResponse> =
    this._apiRequestV3<CleanupRequest, CleanupResponse>("/v3/cleanup")

  outpainting: (params: OutpaintingRequest, opts?: any) => Promise<OutpaintingResponse> =
    this._apiRequestV3<OutpaintingRequest, OutpaintingResponse>("/v3/outpainting")

  removeBackground: (params: RemoveBackgroundRequest, opts?: any) => Promise<RemoveBackgroundResponse> =
    this._apiRequestV3<RemoveBackgroundRequest, RemoveBackgroundResponse>("/v3/remove-background")

  replaceBackground: (params: ReplaceBackgroundRequest, opts?: any) => Promise<ReplaceBackgroundResponse> =
    this._apiRequestV3<ReplaceBackgroundRequest, ReplaceBackgroundResponse>("/v3/replace-background")

  mixpose: (p: MixPoseRequest, opts?: any) => Promise<MixPoseResponse> =
    this._apiRequestV3<MixPoseRequest, MixPoseResponse>("/v3/mix-pose")

  doodle: (p: DoodleRequest, opts?: any) => Promise<DoodleResponse> =
    this._apiRequestV3<DoodleRequest, DoodleResponse>("/v3/doodle")

  lcmTxt2Img: (p: LcmTxt2ImgRequest, opts?: any) => Promise<LcmTxt2ImgResponse> =
    this._apiRequestV3<LcmTxt2ImgRequest, LcmTxt2ImgResponse>("/v3/lcm-txt2img")

  replaceSky: (p: ReplaceSkyRequest, opts?: any) => Promise<ReplaceSkyResponse> =
    this._apiRequestV3<ReplaceSkyRequest, ReplaceSkyResponse>("/v3/replace-sky")

  replaceObject: (p: ReplaceObjectRequest, opts?: any) => Promise<ReplaceObjectResponse> =
    this._apiRequestV3<ReplaceObjectRequest, ReplaceObjectResponse>("/v3/async/replace-object")

  replaceObjectSync(params: ReplaceObjectRequest, config?: SyncConfig, opts?: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.replaceObject(params, opts)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progressV3({
                  task_id: res.task_id,
                }, opts);
                if (progressResult && progressResult.task.status === TaskStatus.SUCCEED) {
                  clearInterval(timer);
                  let imgsBase64: string[] = [];
                  if (config?.img_type === "base64") {
                    imgsBase64 = await Promise.all(
                      progressResult.images.map((img) => readImgtoBase64(img.image_url))
                    );
                  } else {
                    imgsBase64 = progressResult.images.map((img) => img.image_url);
                  }
                  resolve(imgsBase64);
                } else if (
                  progressResult &&
                  (progressResult.task.status === TaskStatus.FAILED)
                ) {
                  clearInterval(timer);
                  reject(
                    new NovitaError(
                      0,
                      progressResult.task.reason ?? ERROR_GENERATE_IMG_FAILED,
                      '',
                      { task_status: progressResult.task.status },
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

  mergeFace: (p: MergeFaceRequest, opts?: any) => Promise<MergeFaceResponse> =
    this._apiRequestV3<MergeFaceRequest, MergeFaceResponse>("/v3/merge-face")
  
  removeText: (p: RemoveTextRequest, opts?: any) => Promise<RemoveTextResponse> =
    this._apiRequestV3<RemoveTextRequest, RemoveTextResponse>("/v3/remove-text")

  restoreFace: (p: RestoreFaceRequest, opts?: any) => Promise<RestoreFaceResponse> =
    this._apiRequestV3<RestoreFaceRequest, RestoreFaceResponse>("/v3/restore-face")

  reimagine: (p: ReimagineRequest, opts?: any) => Promise<ReimagineResponse> =
    this._apiRequestV3<ReimagineRequest, ReimagineResponse>("/v3/reimagine")

  createTile: (p: CreateTileRequest, opts?: any) => Promise<CreateTileResponse> =
    this._apiRequestV3<CreateTileRequest, CreateTileResponse>("/v3/create-tile")
}
