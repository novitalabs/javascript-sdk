/**
 * Copyright (c) Novita
 *
 * @format
 */

export const UPLOAD_URL = "https://assets.novitai.com";

export const ERROR_BAD_REQUEST = "Bad Request";
export const ERROR_UNAUTHORIZED = "Unauthorized";
export const ERROR_FORBIDDEN = "Forbidden";
export const ERROR_NOT_FOUND = "Not Found";
export const ERROR_METHOD_NOT_ALLOWED = "Method Not Allowed";
export const ERROR_SERVER_ERROR = "Internal Server Error";
export const ERROR_GENERATE_IMG_FAILED = "Generate Image Failed";
export const ERROR_GENERATE_VIDEO_FAILED = "Generate Video Failed";

export const ControlNetPreprocessor = {
  SCRIBBLE_HED: "scribble_hed",
  SOFTEDGE_HED: "softedge_hed",
  SCRIBBLE_HEDSAFE: "scribble_hedsafe",
  SOFTEDGE_HEDSAFE: "softedge_hedsafe",
  DEPTH_MIDAS: "depth_midas",
  MLSD: "mlsd",
  OPENPOSE: "openpose",
  OPENPOSE_FACE: "openpose_face",
  OPENPOSE_FACEONLY: "openpose_faceonly",
  OPENPOSE_FULL: "openpose_full",
  OPENPOSE_HAND: "openpose_hand",
  dwpose: "dwpose",
  SCRIBBLE_PIDINET: "scribble_pidinet",
  SOFTEDGE_PIDINET: "softedge_pidinet",
  SCRIBBLE_PIDSAFE: "scribble_pidsafe",
  SOFTEDGE_PIDSAFE: "softedge_pidsafe",
  NORMAL_BAE: "normal_bae",
  LINEART_COARSE: "lineart_coarse",
  LINEART_REALISTIC: "lineart_realistic",
  LINEART_ANIME: "lineart_anime",
  LINEART: "lineart",
  DEPTH_ZOE: "depth_zoe",
  SHUFFLE: "shuffle",
  MEDIAPIPE_FACE: "mediapipe_face",
  CANNY: "canny",
  DEPTH: "depth",
  DEPTH_LERES: "depth_leres",
  "DEPTH_LERES++": "depth_leres++",
} as const;

export const ControlNetMode = {
  BALANCED: 0,
  PROMPT_IMPORTANCE: 1,
  CONTROLNET_IMPORTANCE: 2,
};

export const ModelType = {
  CHECKPOINT: "checkpoint",
  LORA: "lora",
  VAE: "vae",
  CONTROLNET: "controlnet",
  TEXT_INVERSION: "text_inversion",
};
