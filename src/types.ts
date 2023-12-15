/**
 * Copyright (c) Novita
 *
 * Typescript type definitions for Novita
 *
 * @format
 */

import { ControlNetPreprocessor } from "./enum";

export type NovitaKey = string | undefined;

export interface NovitaConfig {
  BASE_URL: string;
  key: NovitaKey;
}

// Response Code Enum for V2 API
export enum ResponseCodeV2 {
  OK = 0,
  INTERNAL_ERROR = -1,
  INVALID_JSON = 1,
  MODEL_NOT_EXIST = 2,
  TASK_ID_NOT_EXIST = 3,
  INVALID_AUTH = 4,
  HOST_UNAVAILABLE = 5,
  PARAM_RANGE_OUT_OF_LIMIT = 6,
  COST_BALANCE_FAILURE = 7,
  SAMPLER_NOT_EXIST = 8,
  TIMEOUT = 9,
}

// Response Code Enum for V3 API
export enum ResponseCodeV3 {
  OK = 200,
  TOO_MANY_REQ = 429,
  INTERNAL_ERR = 500,
  REQUEST_INVALID = 400,
}

export enum APIErrReasonV3 {
  ANONYMOUS_ACCESS_QUOTA_EXCEEDS = "ANONYMOUS_ACCESS_QUOTA_EXCEEDS",
  BILL_FAILED = "BILLING_FAILED",
  INVALID_REQUEST_BODY = "INVALID_REQUEST_BODY",
  ERR_NETWORK = "ERR_NETWORK",
}

// getModels dependency status
export enum ModelStatus {
  READY = 1,
  UNREADY = 0,
}

export enum ModelType {
  Checkpoint = "checkpoint",
  Lora = "lora",
}

export type RequestOpts = {
  signal?: AbortSignal;
  source?: string;
};

export type Model = {
  name: string;
  hash: string;
  sd_name: string;
  third_source: string | undefined;
  download_status: ModelStatus;
  download_name: string;
  dependency_status: ModelStatus;
  type: ModelType;
  civitai_link: string | undefined;
  civitai_model_id: number | undefined;
  civitai_version_id: number | undefined;
  civitai_nsfw: boolean | undefined;
  civitai_download_url: string | undefined;
  civitai_tags: string | undefined;
  civitai_download_count: number | undefined;
  civitai_favorite_count: number | undefined;
  civitai_comment_count: number | undefined;
  civitai_rating_count: number | undefined;
  civitai_rating: number | undefined;
  omni_used_count: number | undefined;
  civitai_image_url: string | undefined;
  civitai_image_nsfw: string | undefined;
  civitai_origin_image_url: string | undefined;
  civitai_image_prompt: string | undefined;
  civitai_image_negative_prompt: string | undefined;
  civitai_image_sampler_name: string | undefined;
  civitai_image_height: number | undefined;
  civitai_image_width: number | undefined;
  civitai_image_steps: number | undefined;
  civitai_image_cfg_scale: number | undefined;
  civitai_image_seed: number | undefined;
};

export type GetModelsResponse = {
  code: ResponseCodeV2;
  msg: string;
  data: {
    models: Array<Model>;
  };
};

export type Lora = {
  sd_name: string;
  weight: number;
};

export type Refiner = {
  checkpoint: string;
  switch_at: number;
};

type ControlNetPreprocessorValues = (typeof ControlNetPreprocessor)[keyof typeof ControlNetPreprocessor];

export type ControlnetUnit = {
  model: string;
  weight: number | undefined;
  control_mode: 0 | 1 | 2;
  module: ControlNetPreprocessorValues;
  input_image: string;
  mask?: string;
  resize_mode?: number;
  lowvram?: boolean;
  processor_res?: number;
  threshold_a?: number;
  threshold_b?: number;
  guidance_start?: number;
  guidance_end?: number;
  pixel_perfect?: boolean;
};

export type Txt2ImgRequest = {
  model_name: string;
  prompt: string;
  negative_prompt?: string;
  sampler_name?: string;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  width?: number;
  height?: number;
  n_iter?: number;
  batch_size?: number;
  lora?: Array<Lora>;
  sd_refiner?: Refiner;
  controlnet_units?: Array<ControlnetUnit>;
  sd_vae?: string;
  clip_skip?: number;
  hr_upscaler?: string;
  hr_scale?: number;
  hr_resize_x?: number;
  hr_resize_y?: number;
  restore_faces?: boolean;
  enable_hr?: boolean;
};

export type Txt2ImgResponse = {
  code: ResponseCodeV2;
  msg: string;
  data: {
    task_id: string;
  };
};

export type SyncConfig = {
  // wait time between each request, default 1000ms
  interval?: number;
  // img result, base64 or url, default base64
  img_type?: "base64" | "url";
};

export type Img2imgRequest = {
  model_name: string;
  prompt: string;
  negative_prompt?: string;
  sampler_name?: string;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  width?: number;
  height?: number;
  n_iter?: number;
  batch_size?: number;
  restore_faces?: boolean;
  denoising_strength?: number;
  init_images: Array<string>;
  sd_vae?: string;
  clip_skip?: number;
  mask?: string;
  resize_mode?: number;
  image_cfg_scale?: number;
  mask_blur?: number;
  inpainting_fill?: number;
  inpaint_full_res?: number;
  inpaint_full_res_padding?: number;
  inpainting_mask_invert?: number;
  initial_noise_multiplier?: number;
  lora?: Array<Lora>;
  sd_refiner?: Refiner;
  controlnet_units?: Array<ControlnetUnit>;
};

export type Img2imgResponse = {
  code: ResponseCodeV2;
  msg: string;
  data: {
    task_id: string;
  };
};

export enum Upscalers {
  ESRGAN_4x = "ESRGAN_4x",
  R_ESRGAN_4x_plus = "R-ESRGAN 4x+",
  R_ESRGAN_4x_plus_Anime6B = "R-ESRGAN 4x+ Anime6B",
}
export type UpscaleRequest = {
  image: string;
  resize_mode?: 0 | 1;
  upscaling_resize_w?: number;
  upscaling_resize_h?: number;
  upscaling_resize?: number;
  upscaling_crop?: boolean;
  upscaler_1?: Upscalers;
  upscaler_2?: Upscalers;
  extras_upscaler_2_visibility?: number;
  gfpgan_visibility?: number;
  codeformer_visibility?: number;
  codeformer_weight?: number;
  img_expire_ttl?: number;
  [key: string]: number | string | undefined | boolean;
};

export type UpscaleResponse = {
  code: ResponseCodeV2;
  msg: string;
  data: {
    task_id: string;
  };
};

export type ProgressRequest = {
  task_id: string;
};

export type ProgressResponse = {
  code: ResponseCodeV2;
  msg: string;
  data: {
    status: number;
    progress: number;
    eta_relative: number;
    imgs: Array<string>;
    info: string | undefined;
    failed_reason: string | undefined;
    current_images?: string | undefined | null | Array<string>;
  };
};

type FailedV3Response = {
  code?: ResponseCodeV3;
  reason?: string;
  message?: string;
  metadata?: { [key: string]: string };
};
type GenImgTypeRequest = {
  extra?: {
    response_image_type: "png" | "jpeg" | "webp";
  };
};
type GenImgResponse = {
  image_file: string;
  image_type: string;
};
type GenImgResponseUrl = {
  image_url: string;
  image_url_ttl: string;
  image_type: string;
};
type AsyncV3Response = {
  task_id: string;
} & FailedV3Response;

export enum V3TaskStatus {
  UNKNOWN = "TASK_STATUS_UNKNOWN",
  QUEUED = "TASK_STATUS_QUEUED", // 排队
  SUCCEED = "TASK_STATUS_SUCCEED", // 成功
  FAILED = "TASK_STATUS_FAILED", // 失败
  PROCESSING = "TASK_STATUS_PROCESSING", // 处理中
}
type V3Task = {
  eta: number;
  progress_percent: number;
  task_type: string;
  task_id: string;
  status: V3TaskStatus;
  reason?: string;
};

export type ProgressV3Response = {
  task: V3Task;
  images?: {
    image_url: string;
    image_type: string;
    image_url_ttl: number;
  }[];
  videos?: {
    video_url: string;
    video_url_ttl: string;
    video_type: string;
  }[];
};

export type CleanupRequest = {
  image_file: string;
  mask_file: string;
} & GenImgTypeRequest;
export type CleanupResponse = GenImgResponse & FailedV3Response;

export type OutpaintingRequest = {
  image_file: string;
  width: number;
  height: number;
  center_x: number;
  center_y: number;
} & GenImgTypeRequest;

export type OutpaintingResponse = GenImgResponse & FailedV3Response;

export type RemoveBackgroundRequest = {
  image_file: string;
} & GenImgTypeRequest;
export type RemoveBackgroundResponse = GenImgResponse & FailedV3Response;

export type ReplaceBackgroundRequest = {
  image_file: string;
  prompt: string;
} & GenImgTypeRequest;
export type ReplaceBackgroundResponse = GenImgResponse & FailedV3Response;

export type MixPoseRequest = {
  image_file: string;
  pose_image_file: string;
} & GenImgTypeRequest;
export type MixPoseResponse = GenImgResponse & FailedV3Response;

export type DoodleRequest = {
  image_file: string;
  prompt: string;
  similarity: number;
} & GenImgTypeRequest;
export type DoodleResponse = GenImgResponse & FailedV3Response;

export type LcmTxt2ImgRequest = {
  prompt: string;
  height: number;
  width: number;
  image_num: number;
  steps: number;
  guidance_scale: number;
};
export type LcmTxt2ImgResponse = {
  images: GenImgResponse[];
} & FailedV3Response;

export type LcmImg2ImgRequest = {
  /**
   * clip skip, must above 0
   */
  clip_skip?: number;
  /**
   * Textual Inversion options.
   */
  embeddings?: { model_name: string }[];
  /**
   * This setting says how close the model will listen to your prompt. Range: [2.0, 14.0]
   */
  guidance_scale: number;
  /**
   * Image numbers. Range: [1, 16]
   */
  image_num: number;
  /**
   * The base64 of input image, with a maximum resolution of 2048 * 2048 and a max file size
   * of 30 Mb, the returned image will be the same with size of input images.
   */
  input_image: string;
  /**
   * Info of lora, 3 loras supported at most.
   */
  loras?: { model_name: string; strenth: string }[];
  /**
   * The results you will get using a prompt might different for different models of Stable
   * Diffusion. You can call the https://docs.novita.ai/models-api/query-model endpoint to
   * retrieve the `sd_name_in_api` field as the `model_name`.
   */
  model_name: string;
  /**
   * Negtive prompt word, divided by ',', you can also add embedding (textual inversion)
   * models like `badhandv4_16755`.
   */
  negative_prompt: string;
  /**
   * Positive prompt word for the doodle, divided by ",",. Range: [1, 1024]
   */
  prompt: string;
  /**
   * VAE(Variational Auto Encoder)，sd_vae can be access in endpoint
   * https://docs.novita.ai/models-api/query-model with query params 'filter.types=vae', like
   * 'sd_name': 'customVAE.safetensors'
   */
  sd_vae: string;
  /**
   * seed of request.
   */
  seed: number;
  /**
   * Iterations of the image creation process. Range: [1, 8]
   */
  steps: number;
  strength?: number;
};

export type LcmImg2ImgResponse = {
  images: GenImgResponseUrl[];
} & FailedV3Response;

export enum SkyType {
  bluesky = "bluesky",
  sunset = "sunset",
  sunrise = "sunrise",
  galaxy = "galaxy",
}
export type ReplaceSkyRequest = {
  image_file: string;
  sky: SkyType;
} & GenImgTypeRequest;
export type ReplaceSkyResponse = GenImgResponse & FailedV3Response;

export type ReplaceObjectRequest = {
  image_file: string;
  prompt: string;
  negative_prompt: string;
  object_prompt: string;
} & GenImgTypeRequest;
export type ReplaceObjectResponse = AsyncV3Response;

export type MergeFaceRequest = {
  face_image_file: string;
  image_file: string;
} & GenImgTypeRequest;
export type MergeFaceResponse = GenImgResponse & FailedV3Response;

export type RemoveTextRequest = {
  image_file: string;
} & GenImgTypeRequest;
export type RemoveTextResponse = GenImgResponse & FailedV3Response;

export type RestoreFaceRequest = {
  image_file: string;
  fidelity: number;
} & GenImgTypeRequest;
export type RestoreFaceResponse = GenImgResponse & FailedV3Response;

export type ReimagineRequest = {
  image_file: string;
} & GenImgTypeRequest;
export type ReimagineResponse = GenImgResponse & FailedV3Response;

export type CreateTileRequest = {
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
} & GenImgTypeRequest;
export type CreateTileResponse = GenImgResponse & FailedV3Response;

export enum Img2VideoResizeMode {
  ORIGINAL_RESOLUTION = "ORIGINAL_RESOLUTION",
  CROP_TO_ASPECT_RATIO = "CROP_TO_ASPECT_RATIO",
}
export enum Img2VideoModel {
  SVD_XT = "SVD-XT",
  SVD = "SVD",
}
export type Img2VideoRequest = {
  model_name: Img2VideoModel;
  image_file: string;
  frames_num: number;
  frames_per_second: number;
  seed: number;
  image_file_resize_mode: Img2VideoResizeMode;
  steps: number;
  motion_bucket_id?: number; // 1~255
  cond_aug?: number; // 0~1
} & GenImgTypeRequest;
export type Img2VideoResponse = AsyncV3Response;

export type RemoveWatermarkRequest = {
  image_file: string;
} & GenImgTypeRequest;
export type RemoveWatermarkResponse = GenImgResponse & FailedV3Response;

export type Img2VideoMotionRequest = {
  image_assets_id: string;
  motion_video_assets_id: string;
  seed: number;
};
export type Img2VideoMotionResponse = AsyncV3Response;

export type UploadRequest = {
  type: "image" | "video";
  data: Blob;
};
export type UploadResponse = {
  assets_id: string;
};
