/** @format */

const fs = require("fs");

module.exports.convertImageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    // 异步读取文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // 转换为 base64 编码
        const base64Image = Buffer.from(data).toString("base64");
        resolve(base64Image);
      }
    });
  });
};
