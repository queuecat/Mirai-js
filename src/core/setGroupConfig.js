const errCode = require('../util/errCode');
const axios = require('axios').default;
const { URL } = require('url');
const errorHandler = require('../util/errorHandler');


/**
 * @description 设置群配置
 * @param {string}  baseUrl           mirai-api-http server 的地址
 * @param {string}  sessionKey        会话标识
 * @param {string}  name	          群名
 * @param {string}  announcement	  群公告
 * @param {boolean} confessTalk	      是否开启坦白说
 * @param {boolean} allowMemberInvite 是否允许群员邀请
 * @param {boolean} autoApprove	      是否开启自动审批入群
 * @param {boolean} anonymousChat     是否允许匿名聊天
 * @returns {Object} 结构 { message, code }
 */
module.exports = async ({
    baseUrl, sessionKey, target,
    name, announcement, confessTalk, allowMemberInvite, autoApprove, anonymousChat
}) => {
    try {
        // 拼接 url
        const url = new URL('/groupConfig', baseUrl).toString();

        // 请求
        let { data: { msg: message, code } } = await axios.post(url, {
            sessionKey, target,
            config: {
                name,
                announcement,
                confessTalk,
                allowMemberInvite,
                autoApprove,
                anonymousChat,
            }
        });

        // 抛出 mirai 的异常，到 catch 中处理后再抛出
        if (code in errCode) {
            throw new Error(message);
        }
        return { message, code };
    } catch (error) {
        errorHandler(error);
    }
};