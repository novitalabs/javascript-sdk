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

// Response Code Enum for V3 API
export enum ResponseCode {
  NETWORK = -10,
  CANCELED = -11,
  OK = 200,
  TOO_MANY_REQ = 429,
  INTERNAL_ERR = 500,
  REQUEST_INVALID = 400,
}

export enum APIErrReason {
  ANONYMOUS_ACCESS_QUOTA_EXCEEDS = "ANONYMOUS_ACCESS_QUOTA_EXCEEDS",
  BILLING_FAILED = "BILLING_FAILED",
  BILLING_AUTH_FAILED = "BILLING_AUTH_FAILED",
  BALANCE_NOT_ENOUGH = "BILLING_BALANCE_NOT_ENOUGH",
  INVALID_REQUEST_BODY = "INVALID_REQUEST_BODY",
  ERR_NETWORK = "ERR_NETWORK",
}

// getModels dependency status
export enum ModelStatus {
  READY = 1,
  UNREADY = 0,
}

export type RequestOpts = {
  signal?: AbortSignal;
  source?: string;
};

export type Model = {
  id: number;
  name: string;
  hash_sha256: string;
  sd_name: string;
  type: { name: string; display_name: string };
  categories: string[];
  status: ModelStatus;
  download_url: string;
  tags: string[];
  cover_url: string;
  source: string;
  base_model: string;
  base_model_type: string;
  download_url_ttl: number;
  sd_name_in_api: string;
};

export type GetModelsQuery = {
  filter?: {
    visibility?: "public" | "private";
    source?: "civitai" | "training" | "uploading";
    types?: "checkpoint" | "lora" | "vae" | "controlnet" | "upscaler" | "textualinversion";
    is_sdxl?: boolean;
    query?: string;
    is_inpainting?: boolean;
  };
  pagination: {
    limit?: number;
    cursor?: string;
  };
};

export type GetModelsResponse = {
  models: Array<Model>;
  pagination: { next_cursor: string };
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

type WebhookSettings = {
  url: string;
  test_mode: {
    enabled: boolean;
    return_task_status: "TASK_STATUS_SUCCEED" | "TASK_STATUS_FAILED";
  };
};

type txt2imgExtra = {
  response_image_type?: "png" | "webp" | "jpeg";
  webhook?: WebhookSettings;
  enable_nsfw_detection?: boolean;
  nsfw_detection_level?: number;
  custom_storage?: {
    aws_s3?: {
      region: string;
      bucket: string;
      path: string;
      save_to_path_directly?: boolean;
      [key: string]: string | number | boolean | undefined;
    };
  };
  enterprise_plan?: {
    enabled: boolean;
  };
};
type img2imgExtra = txt2imgExtra;

export type Txt2ImgRequest = {
  extra?: txt2imgExtra & {
    [key: string]: string | number | boolean | txt2imgExtra[keyof txt2imgExtra];
  };
  request: {
    model_name: string;
    prompt: string;
    negative_prompt: string;
    sd_vae?: string;
    loras?: { model_name: string; strength: number }[];
    embeddings?: { model_name: string }[];
    hires_fix?: {
      target_width: number;
      target_height: number;
      strength: number;
      upscaler?: "RealESRGAN_x4plus_anime_6B" | "RealESRNet_x4plus" | "Latent";
    };
    refiner?: {
      switch_at: number;
    };
    width: number;
    height: number;
    image_num: number;
    steps: number;
    seed: number;
    clip_skip?: number;
    guidance_scale: number;
    sampler_name: string;
  };
};

export type Txt2ImgResponse = AsyncResponse;

export type SyncConfig = {
  // wait time between each request, default 1000ms
  interval?: number;
  // img result, base64 or url, default base64
  img_type?: "base64" | "url";
};

export type Img2imgRequest = {
  extra?: img2imgExtra & {
    [key: string]: string | number | boolean | img2imgExtra[keyof img2imgExtra];
  };
  request: {
    model_name: string;
    image_base64: string;
    prompt: string;
    negative_prompt?: string;
    sd_vae?: string;
    controlnet?: {
      units: {
        model_name: string;
        image_base64: string;
        strength: number;
        preprocessor?: ControlNetPreprocessorValues;
        guidance_start?: number;
        guidance_end?: number;
      }[];
    };
    ip_adapters?: {
      model_name: string;
      image_base64: string;
      strength: number;
    }[];
    loras?: { model_name: string; strength: number }[];
    embeddings?: { model_name: string }[];
    width: number;
    height: number;
    image_num: number;
    steps: number;
    seed: number;
    clip_skip?: number;
    guidance_scale: number;
    sampler_name: string;
    strength?: number;
  };
};
export type Img2ImgRequest = Img2imgRequest;
export type Img2imgResponse = AsyncResponse;
export type Img2ImgResponse = Img2imgResponse;

export type InpaintingRequest = {
  extra?: img2imgExtra & {
    [key: string]: string | number | boolean | img2imgExtra[keyof img2imgExtra];
  };
  request: {
    model_name: string;
    image_base64: string;
    mask_image_base64: string;
    mask_blur?: number;
    prompt: string;
    negative_prompt?: string;
    sd_vae?: string;
    loras?: { model_name: string; strength: number }[];
    embeddings?: { model_name: string }[];
    image_num: number;
    steps: number;
    seed: number;
    clip_skip?: number;
    guidance_scale: number;
    sampler_name: string;
    strength?: number;
    inpainting_full_res?: 0 | 1;
    inpainting_full_res_padding?: number;
    inpainting_mask_invert?: 0 | 1;
    initial_noise_multiplier?: number;
  };
};
export type InpaintingResponse = AsyncResponse;

export enum Upscalers {
  REALESRGAN_X4PLUS_ANIME_6B = "RealESRGAN_x4plus_anime_6B",
  REALESRNET_X4PLUS = "RealESRNet_x4plus",
  "4X-ULTRASHARP" = "4x-UltraSharp",
}

type GenImgExtraParams = {
  response_image_type?: "png" | "webp" | "jpeg";
  enterprise_plan?: {
    enabled: boolean;
  };
};

type GenImgExtraPayload = {
  extra?: GenImgExtraParams & {
    [key: string]: string | number | boolean | GenImgExtraParams[keyof GenImgExtraParams];
  };
};

export type UpscaleRequest = {
  request: {
    model_name: Upscalers;
    image_base64: string;
    scale_factor: number;
  };
} & GenImgExtraPayload;

export type UpscaleResponse = AsyncResponse;

export type ProgressRequest = {
  task_id: string;
};

type FailedResponse = {
  code?: ResponseCode;
  reason?: string;
  message?: string;
  metadata?: { [key: string]: string };
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
type AsyncResponse = {
  task_id: string;
} & FailedResponse;

export enum TaskStatus {
  UNKNOWN = "TASK_STATUS_UNKNOWN",
  QUEUED = "TASK_STATUS_QUEUED", // 排队
  SUCCEED = "TASK_STATUS_SUCCEED", // 成功
  FAILED = "TASK_STATUS_FAILED", // 失败
  PROCESSING = "TASK_STATUS_PROCESSING", // 处理中
}
type Task = {
  eta: number;
  progress_percent: number;
  task_type: string;
  task_id: string;
  status: TaskStatus;
  reason?: string;
};

export type ProgressResponse = {
  task: Task;
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
} & GenImgExtraPayload;
export type CleanupResponse = GenImgResponse & FailedResponse;

export type OutpaintingRequest = {
  image_file: string;
  width: number;
  height: number;
  center_x: number;
  center_y: number;
} & GenImgExtraPayload;

export type OutpaintingResponse = GenImgResponse & FailedResponse;

export type RemoveBackgroundRequest = {
  image_file: string;
} & GenImgExtraPayload;
export type RemoveBackgroundResponse = GenImgResponse & FailedResponse;

export type ReplaceBackgroundRequest = {
  image_file: string;
  prompt: string;
} & GenImgExtraPayload;
export type ReplaceBackgroundResponse = GenImgResponse & FailedResponse;

export type MergeFaceRequest = {
  face_image_file: string;
  image_file: string;
} & GenImgExtraPayload;
export type MergeFaceResponse = GenImgResponse & FailedResponse;

export type RemoveTextRequest = {
  image_file: string;
} & GenImgExtraPayload;
export type RemoveTextResponse = GenImgResponse & FailedResponse;

export type RestoreFaceRequest = {
  image_file: string;
  fidelity: number;
} & GenImgExtraPayload;
export type RestoreFaceResponse = GenImgResponse & FailedResponse;

export type ReimagineRequest = {
  image_file: string;
} & GenImgExtraPayload;
export type ReimagineResponse = GenImgResponse & FailedResponse;

export type LcmTxt2ImgRequest = {
  prompt: string;
  height: number;
  width: number;
  image_num: number;
  steps: number;
  guidance_scale: number;
} & GenImgExtraPayload;
export type LcmTxt2ImgResponse = {
  images: GenImgResponse[];
} & FailedResponse;

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
  loras?: { model_name: string; strength: string }[];
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
} & GenImgExtraPayload;

export type LcmImg2ImgResponse = {
  images: GenImgResponseUrl[];
} & FailedResponse;

export enum SkyType {
  bluesky = "bluesky",
  sunset = "sunset",
  sunrise = "sunrise",
  galaxy = "galaxy",
}
export type ReplaceSkyRequest = {
  image_file: string;
  sky: SkyType;
} & GenImgExtraPayload;
export type ReplaceSkyResponse = GenImgResponse & FailedResponse;

export type ReplaceObjectRequest = {
  image_file: string;
  prompt: string;
  negative_prompt: string;
  object_prompt: string;
} & GenImgExtraPayload;
export type ReplaceObjectResponse = AsyncResponse;

type GenVideoExtraParams = {
  response_video_type?: "mp4" | "gif";
  enterprise_plan?: {
    enabled: boolean;
  };
};

type GenVideoExtraPayload = {
  extra?: GenVideoExtraParams & {
    [key: string]: string | number | boolean | GenVideoExtraParams[keyof GenVideoExtraParams];
  };
};

export type Txt2VideoPrompt = {
  prompt: string;
  frames: number;
};
export type Txt2VideoRequest = {
  model_name: string;
  width: number; // 256~1024
  height: number; // 256~1024
  seed: number;
  steps: number;
  prompts: Txt2VideoPrompt[];
  negative_prompt?: string;
  guidance_scale: number; // 1~30, 7.5
} & GenVideoExtraPayload;
export type Txt2VideoResponse = AsyncResponse;

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
} & GenVideoExtraPayload;
export type Img2VideoResponse = AsyncResponse;

export type Img2VideoMotionRequest = {
  image_assets_id: string;
  motion_video_assets_id: string;
  seed: number;
} & GenVideoExtraPayload;
export type Img2VideoMotionResponse = AsyncResponse;

export type UploadRequest = {
  type: "image" | "video";
  data: Blob;
};
export type UploadResponse = {
  assets_id: string;
};

export type Img2PromptRequest = {
  image_file: string;
} & GenImgExtraPayload;
export type Img2PromptResponse = {
  prompt: string;
};
