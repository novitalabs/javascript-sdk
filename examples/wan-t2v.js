/** @format */

import { NovitaSDK, TaskStatus } from "novita-sdk";

const novitaClient = new NovitaSDK("your_api_key");

async function wanT2v(onFinish) {
  const params = {
    model_name: "wan-t2v",
    width: 480,
    height: 832,
    seed: -1,
    prompt:
      "A close up view of a glass sphere that has a zen garden within it. There is a small dwarf in the sphere who is raking the zen garden and creating patterns in the sand.",
    frames: 85,
  };
  novitaClient
    .wanT2v(params)
    .then((res) => {
      if (res && res.task_id) {
        const timer = setInterval(() => {
          novitaClient
            .progress({
              task_id: res.task_id,
            })
            .then((progressRes) => {
              if (progressRes.task.status === TaskStatus.SUCCEED) {
                console.log("finished!", progressRes.videos);
                clearInterval(timer);
                onFinish(progressRes.videos);
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
      console.error("wan-t2v request error:", err);
    });
}

wanT2v((videos) => {
  console.log(videos);
});
