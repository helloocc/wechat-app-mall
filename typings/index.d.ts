/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: UserInfo;
    cityId: number;
    cityList: City[];
  };
  loadCityList: () => Promise<City[]>;
  getCityList: () => Promise<City[]>;
  loadUserInfo: () => void;
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}

interface City {
  id: number;
  name: string;
  qrCode?: string;
  weichat?: string;
}

interface UserInfo {
  uid: string;
  nickname: string;
  avatar: string;
}

interface Site {
  city: string;
  name: string;
  owner?: string;
  description?: string;
  location?: string;
  logo?: string;
  room_key?: string;
}

interface MonthLiveshow {
  month: number;
  month_show: Array<Liveshow>;
}

interface Liveshow {
  id: number;
  day: String;
  time: String;
  weekday: String;
  is_festival: Boolean;
  performers: String;
  title: Boolean;
  room_info: String;
  is_new: String;
}

interface LiveShowInfo {
  id: string,
  day: string,
  time: string,
  weekday: string,
  performers: string,
  title: string,
  city: string,
  site: string,
  url: string,
  source: string,
  dayTime: string,
  is_favor: boolean,
  poster: string,
  poster_thumbnail: string,
  prices: Array<any>,
  prices_str: string,
  site_visible: boolean
}

interface ViewRect {
  top: number;
}

interface TopInfo {
  id: number;
  month: number;
  top: number;
  left: number;
}

