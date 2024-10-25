let DOMAIN = "https://www.livestart.com.cn";

const accountInfo = wx.getAccountInfoSync();
if (accountInfo.miniProgram.envVersion !== "release") {
  DOMAIN = "https://www.chenyunfei.cn";
}

const API_PREFIX = DOMAIN + "/api/v1";

export const API_BANNER = API_PREFIX + "/banners";
export const API_MONTH_LIVESHOW = API_PREFIX + "/month_liveshow";
export const API_LIVESHOW = API_PREFIX + "/liveshow";
export const API_TICKET = API_PREFIX + "/tickets";
export const API_TICKET_USER = API_PREFIX + "/user_tickets";
export const API_CITY = API_PREFIX + "/city";
export const API_FAVOR = API_PREFIX + "/favor";
export const API_USERS = API_PREFIX + "/users";
export const API_QRCODE_BOT = API_PREFIX + "/city_bot";
export const API_QRCODE_GROUP = API_PREFIX + "/city_group";
export const API_ROOM = API_PREFIX + "/rooms";
export const API_ROOM_NAME = API_PREFIX + "/room_names";
export const API_TAG_ROOM = API_PREFIX + "/tag_rooms";
export const API_SITE = API_PREFIX + "/site";
export const API_LOCATION = API_PREFIX + "/location";
export const API_LOGIN = API_PREFIX + "/login";
export const API_PHONE = API_PREFIX + "/phone";