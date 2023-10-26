/**
 * Copyright (c) Novita
 *
 * Typescript type definitions for Novita
 */

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
  ANONYMOUS_ACCESS_QUOTA_EXCEEDS = 'ANONYMOUS_ACCESS_QUOTA_EXCEEDS',
  BILL_FAILED = 'BILLING_FAILED',
  INVALID_REQUEST_BODY = 'INVALID_REQUEST_BODY',
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
  signal?: AbortSignal,
  source?: string
}

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

export type ControlnetUnit = {
  model: string;
  weight: number | undefined;
  control_mode: 0 | 1 | 2;
  module: string;
  input_image: string;
  mask?: string | undefined;
  resize_mode?: number | undefined;
  lowvram?: boolean | undefined;
  processor_res?: number | undefined;
  threshold_a?: number | undefined;
  threshold_b?: number | undefined;
  guidance_start?: number | undefined;
  guidance_end?: number | undefined;
  pixel_perfect?: boolean | undefined;
  [key: string]: string | number | undefined | boolean;
};

export type Txt2ImgRequest = {
  model_name: string;
  prompt: string;
  negative_prompt?: string | undefined;
  sampler_name?: string | undefined;
  steps?: number | undefined;
  cfg_scale?: number | undefined;
  seed?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  n_iter?: number | undefined;
  batch_size?: number | undefined;
  lora?: Array<Lora> | undefined;
  controlnet_units?: Array<ControlnetUnit> | undefined;
  sd_vae?: string | undefined;
  clip_skip?: number | undefined;
  hr_upscaler?: string | undefined;
  hr_scale?: number | undefined;
  hr_resize_x?: number | undefined;
  hr_resize_y?: number | undefined;
  restore_faces?: boolean | undefined;
  enable_hr?: boolean | undefined;
  [key: string]: any;
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
  negative_prompt?: string | undefined;
  sampler_name?: string | undefined;
  steps?: number | undefined;
  cfg_scale?: number | undefined;
  seed?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  n_iter?: number | undefined;
  batch_size?: number | undefined;
  restore_faces?: boolean | undefined;
  denoising_strength?: number | undefined;
  init_images: Array<string>;
  sd_vae?: string | undefined;
  clip_skip?: number | undefined;
  mask?:  string | undefined;
  resize_mode?: number | undefined;
  image_cfg_scale?: number | undefined;
  mask_blur?: number | undefined;
  inpainting_fill?: number | undefined;
  inpaint_full_res?: number | undefined;
  inpaint_full_res_padding?: number | undefined;
  inpainting_mask_invert?: number | undefined;
  initial_noise_multiplier?: number | undefined;
  lora?: Array<Lora> | undefined;
};

export type Img2imgResponse = {
  code: ResponseCodeV2;
  msg: string;
  data: {
    task_id: string;
  };
};

export type UpscaleBaseAttributes = {
  image: string;
  resize_mode: 0 | 1;
  upscaler_1?: string | undefined;
  upscaler_2?: string | undefined;
  upscaling_crop?: boolean | undefined;
  extras_upscaler_2_visibility?: number | undefined;
  gfpgan_visibility?: number | undefined;
  codeformer_visibility?: number | undefined;
  codeformer_weight?: string | undefined;
  [key: string]: number | string | undefined | boolean;
};

type ResizeMode1Attributes = UpscaleBaseAttributes & {
  resize_mode: 1;
  upscaling_resize_w: number;
  upscaling_resize_h: number;
};

type ResizeMode0Attributes = UpscaleBaseAttributes & {
  resize_mode: 0;
  upscaling_resize: number;
};

export type UpscalseRequest = ResizeMode1Attributes | ResizeMode0Attributes;

type FailedV3Response = {
  code?: ResponseCodeV3;
  reason?: string;
  message?: string;
  metadata?: any;
}
type GenImgTypeRequest = {
  extra?: {
    response_image_type: "png" | "jpeg" | "webp"
  }
}
type GenImgResponse = {
  image_file: string;
  image_type: string;
}

export type CleanupRequest = {
  image_file: string;
  mask_file: string;
} & GenImgTypeRequest
export type CleanupResponse = GenImgResponse & FailedV3Response

export type OutpaintingRequest = {
  image_file: string;
  width: number;
  height: number;
  center_x: number;
  center_y: number;
} & GenImgTypeRequest

export type OutpaintingResponse = GenImgResponse & FailedV3Response

export type RemoveBackgroundRequest = {
  image_file: string;
} & GenImgTypeRequest
export type RemoveBackgroundResponse = GenImgResponse & FailedV3Response

export type ReplaceBackgroundRequest = {
  image_file: string;
  prompt: string;
} & GenImgTypeRequest
export type ReplaceBackgroundResponse = GenImgResponse & FailedV3Response

export type MixPoseRequest = {
  image_file: string
  pose_image_file: string
} & GenImgTypeRequest
export type MixPoseResponse = GenImgResponse & FailedV3Response

export type DoodleRequest = {
  image_file: string;
  prompt: string;
  similarity: number;
} & GenImgTypeRequest
export type DoodleResponse = GenImgResponse & FailedV3Response

export type lcmTxt2ImgRequest = {
  prompt: string;
  height: number;
  width: number;
  image_num: number;
  steps: number;
  guidance_scale: number;
}
export type lcmTxt2ImgResponse = {
  images: GenImgResponse[]
} & FailedV3Response

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
