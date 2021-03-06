const errCode = require('../util/errCode');
const axios = require('axios');
const { URL } = require('url');
const errorHandler = require('../util/errorHandler');

/**
 * FIXME: mirai-core 的问题，有时候收不到 MemberJoinRequestEvent 事件
 * 该功能未经测试
 * @description 响应好友请求
 * @param {string} baseUrl    mirai-api-http server 的地址
 * @param {string} sessionKey 会话标识
 * @param {number} eventId    响应申请事件的标识
 * @param {number} fromId     事件对应申请人QQ号
 * @param {number} groupId    事件对应申请人的群号
 * @param {number} operate    响应的操作类型
 * @param {string} message    回复的信息
 * @returns {void}
 */
module.exports = async ({ baseUrl, sessionKey, eventId, fromId, groupId, operate, message = '' }) => {
    try {
        // 拼接 url
        const url = new URL('/resp/memberJoinRequestEvent', baseUrl).toString();

        // 请求
        let { data: { code, msg: serverMessage } } = await axios.post(url, {
            sessionKey, eventId, fromId, groupId,
            operate, message
        });

        // 抛出 mirai 的异常，到 catch 中处理后再抛出
        if (code in errCode) {
            throw new Error(serverMessage);
        }
    } catch (error) {
        errorHandler(error);
    }
};