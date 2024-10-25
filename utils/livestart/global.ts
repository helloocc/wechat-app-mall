import { API_MONTH_LIVESHOW } from "./api";
import { getWeek } from "./util";
import dayjs from 'dayjs';
import * as net from "./net";

const APP = getApp<IAppOption>();

// 通过 cityId 来获取 city 信息
const getCity = async (cityId: number): Promise<City | undefined> => {
  const cityList = await APP.getCityList();
  return Promise.resolve(cityList.find((item) => item.id === cityId));
};

// 通过 getCurrentCity 获取当前用户选择的 city 信息。若未选择，则返回城市列表的第一个城市信息
const getCurrentCity = async (): Promise<City> => {
  const cityId = getCityId();
  const city = await getCity(cityId);
  if (!city) {
    const cityList = await APP.getCityList();
    console.log("citylist:", cityList);
    return Promise.resolve(cityList[0]);
  }
  return Promise.resolve(city);
};

// 获取当前用户选择的城市
const getCityId = (): number => {
  return APP.globalData.cityId;
};

// 设置当前用户选择的城市
const setCityId = (cityId: number) => {
  APP.globalData.cityId = cityId; // 设置 globalData
  wx.setStorageSync("cityId", cityId); // 持久化到本地存储，小程序下次启动时 App 会自动加载该数据，详见 app.ts
};

const loadLiveshow = (
  city: string,
  keyword: string,
  showCity: boolean = false,
  callback: (k: any) => void
) => {
  console.log(`Search liveshow: city = [${city}], keyword = [${keyword}]`);
  return net.get(API_MONTH_LIVESHOW, { keyword: keyword, city: city }, (res) => {
    for (let month_data of res.data) {
      for (let item of month_data.month_show) {
        item = convertShowViewData(item, showCity);
      }
    }
    callback(res.data);
  });
};

function convertShowViewData(item: any, showCity: boolean) {
  let show_time = item.show_time * 1000;
  let create_time = item.create_time * 1000;
  const showTime = dayjs.unix(show_time);
  item.day = showTime.format("MM.DD");
  item.time = showTime.format("YYYY.MM.DD HH:mm");
  item.month = showTime.month();
  item.show_detail = false;
  item.weekday = getWeek(show_time);
  item.is_festival = item.title.includes("音乐节") ? true : false;
  item.performers = item.performers ? item.performers : item.title;
  if (item.is_festival) {
    item.title = item.city + " · " + item.title;
  } else {
    item.title = showCity
      ? item.city + " · " + item.performers
      : item.performers;
  }
  item.room_info = item.related_rooms ? " [有群]" : "";
  item.is_new =
    dayjs().diff(dayjs(create_time), "hour") <= 24 ? "（新）" : "";
}

export {
  APP,
  getCity,
  getCurrentCity,
  getCityId,
  setCityId,
  loadLiveshow,
  convertShowViewData,
};
