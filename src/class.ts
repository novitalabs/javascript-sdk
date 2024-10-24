/** @format */

import axios from "axios";
import {
  RequestOpts,
  GetModelsQuery,
  GetModelsResponse,
  ProgressRequest,
  ProgressResponse,
  Txt2ImgRequest,
  Txt2ImgResponse,
  Img2ImgRequest,
  Img2ImgResponse,
  OutpaintingRequest,
  OutpaintingResponse,
  ResponseCode,
  RemoveBackgroundRequest,
  RemoveBackgroundResponse,
  ReplaceBackgroundRequest,
  ReplaceBackgroundResponse,
  CleanupRequest,
  CleanupResponse,
  MergeFaceRequest,
  MergeFaceResponse,
  RemoveTextRequest,
  RemoveTextResponse,
  RestoreFaceRequest,
  RestoreFaceResponse,
  ReimagineRequest,
  ReimagineResponse,
  Img2VideoRequest,
  Img2VideoResponse,
  Img2VideoMotionRequest,
  Img2VideoMotionResponse,
  UploadRequest,
  UploadResponse,
  Txt2VideoRequest,
  Txt2VideoResponse,
  InpaintingRequest,
  InpaintingResponse,
  Img2PromptRequest,
  Img2PromptResponse,
} from "./types";
import { UPLOAD_URL } from "./enum";
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
      "X-Api-Source": opts?.source || `js-sdk-novita/${process.env.VERSION}`,
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
        if (response.status !== ResponseCode.OK) {
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
        throw new NovitaError(ResponseCode.NETWORK, error.message, "", undefined, error);
      });
  }

  private _apiRequest<T, R>(url: string): (p: T, o?: RequestOpts) => Promise<R> {
    return (params: T, opts?: any): Promise<R> => {
      return this.httpFetch({
        url: url,
        method: "POST",
        data: params,
        opts,
      });
    };
  }

  getModels(query?: GetModelsQuery) {
    return this.httpFetch({
      url: "/v3/model",
      query: query,
    }).then((res: GetModelsResponse) => {
      return res;
    });
  }

  txt2Img: (p: Txt2ImgRequest, opts?: any) => Promise<Txt2ImgResponse> = this._apiRequest<
    Txt2ImgRequest,
    Txt2ImgResponse
  >("/v3/async/txt2img");

  txt2img = this.txt2Img;

  img2Img: (p: Img2ImgRequest, opts?: any) => Promise<Img2ImgResponse> = this._apiRequest<
    Img2ImgRequest,
    Img2ImgResponse
  >("/v3/async/img2img");

  img2img = this.img2Img;

  progress(params: ProgressRequest, opts?: RequestOpts): Promise<ProgressResponse> {
    return this.httpFetch({
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

  cleanup: (params: CleanupRequest, opts?: any) => Promise<CleanupResponse> = this._apiRequest<
    CleanupRequest,
    CleanupResponse
  >("/v3/cleanup");

  outpainting: (params: OutpaintingRequest, opts?: any) => Promise<OutpaintingResponse> = this._apiRequest<
    OutpaintingRequest,
    OutpaintingResponse
  >("/v3/outpainting");

  removeBackground: (params: RemoveBackgroundRequest, opts?: any) => Promise<RemoveBackgroundResponse> =
    this._apiRequest<RemoveBackgroundRequest, RemoveBackgroundResponse>("/v3/remove-background");

  replaceBackground: (params: ReplaceBackgroundRequest, opts?: any) => Promise<ReplaceBackgroundResponse> =
    this._apiRequest<ReplaceBackgroundRequest, ReplaceBackgroundResponse>("/v3/replace-background");

  mergeFace: (p: MergeFaceRequest, opts?: any) => Promise<MergeFaceResponse> = this._apiRequest<
    MergeFaceRequest,
    MergeFaceResponse
  >("/v3/merge-face");

  removeText: (p: RemoveTextRequest, opts?: any) => Promise<RemoveTextResponse> = this._apiRequest<
    RemoveTextRequest,
    RemoveTextResponse
  >("/v3/remove-text");

  restoreFace: (p: RestoreFaceRequest, opts?: any) => Promise<RestoreFaceResponse> = this._apiRequest<
    RestoreFaceRequest,
    RestoreFaceResponse
  >("/v3/restore-face");

  reimagine: (p: ReimagineRequest, opts?: any) => Promise<ReimagineResponse> = this._apiRequest<
    ReimagineRequest,
    ReimagineResponse
  >("/v3/reimagine");

  txt2Video: (p: Txt2VideoRequest, opts?: any) => Promise<Txt2VideoResponse> = this._apiRequest<
    Txt2VideoRequest,
    Txt2VideoResponse
  >("/v3/async/txt2video");

  img2Video: (p: Img2VideoRequest, opts?: any) => Promise<Img2VideoResponse> = this._apiRequest<
    Img2VideoRequest,
    Img2VideoResponse
  >("/v3/async/img2video");

  img2VideoMotion: (p: Img2VideoMotionRequest, opts?: any) => Promise<Img2VideoMotionResponse> = this._apiRequest<
    Img2VideoMotionRequest,
    Img2VideoMotionResponse
  >("/v3/async/img2video-motion");

  upload: (p: UploadRequest, opts?: RequestOpts) => Promise<UploadResponse> = (
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
        if (response.status !== ResponseCode.OK) {
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
        throw new NovitaError(ResponseCode.NETWORK, error.message, "", undefined, error);
      });
  };

  inpainting: (p: InpaintingRequest, opts?: any) => Promise<InpaintingResponse> = this._apiRequest<
    InpaintingRequest,
    InpaintingResponse
  >("/v3/async/inpainting");

  img2Prompt: (p: Img2PromptRequest, opts?: any) => Promise<Img2PromptResponse> = this._apiRequest<
    Img2PromptRequest,
    Img2PromptResponse
  >("/v3/img2prompt");
}
