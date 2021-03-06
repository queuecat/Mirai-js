const errCode = require('../util/errCode');
const axios = require('axios').default;
const { URL } = require('url');
const errorHandler = require('../util/errorHandler');
const FormData = require('form-data');


/**
 * @description 上传图片至服务器，返回指定 type 的 imageId，url，及 path
 * @param {string}  baseUrl          mirai-api-http server 的地址
 * @param {string}  sessionKey       会话标识
 * @param {string}  type             "friend" 或 "group" 或 "temp"
 * @param {Buffer}  img              图片二进制数据
 * @returns {Object} 结构 { imageId, url, path } 
 */
module.exports = async ({ baseUrl, sessionKey, type, img }) => {
    try {
        // 拼接 url
        const targetUrl = new URL('/uploadImage', baseUrl).toString();

        // 构造 fromdata
        const form = new FormData();
        form.append('sessionKey', sessionKey);
        form.append('type', type);
        // filename 指定了文件名
        form.append('img', img, { filename: 'img.jpg' });

        // 请求
        let {
            data: { msg: message, code, imageId, url, path }
        } = await axios.post(targetUrl, form, {
            // formdata.getHeaders 将会指定 content-type，同时给定随
            // 机生成的 boundary，即分隔符，用以分隔多个表单项而不会造成混乱
            headers: form.getHeaders(),
        });

        // 抛出 mirai 的异常，到 catch 中处理后再抛出
        if (code in errCode) {
            throw new Error(message);
        }
        return { imageId, url, path };
    } catch (error) {
        errorHandler(error);
    }
};