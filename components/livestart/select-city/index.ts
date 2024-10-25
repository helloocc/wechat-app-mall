// components/select-city/index.ts
import { API_CITY, API_LOCATION } from "../../../utils/livestart/api";
import * as net from "../../../utils/livestart/net";
import { userInfo } from "../../../utils/livestart/userInfo";

Component({
  properties: {
    save: {
      type: Boolean,
      value: false,
    },
    type: {
      type: String,
      value: "default", // default=默认主题色 | white=白色
    },
    noline: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    cityIndex: 0 as number,
    cityList: [] as City[],
  },
  lifetimes: {
    attached() { },
    detached() {
      this.getLocation();
    },
  },
  pageLifetimes: {
    show: function () {
      this.getLocation();
    },
  },
  methods: {
    getLocation() {
      const self = this;
      let cityId = userInfo.getUserCityId();

      // 第一次使用
      if (cityId === "") {
        cityId = 0
        wx.getSystemInfo({
          success(res) {
            console.log(`locationAuthorized:${res.locationAuthorized}, locationEnabled:${res.locationEnabled}`)
            if (res.locationAuthorized && res.locationEnabled) {
              wx.getFuzzyLocation({
                type: "gcje2",
                success(res) {
                  net.get(API_LOCATION, { location: `${res.latitude},${res.longitude}` }, (res) => {
                    console.log("location api success: ", res)
                    if (res.code === 200) {
                      cityId = res.data.recomm_city_id
                    }
                    self.reloadCity(cityId);
                  }
                  );
                },
                fail(res) {
                  console.log("get fuzzy location failed: ", res)
                  wx.showModal({
                    title: "自动定位失败",
                    content: "请在小程序设置中允许使用位置，或手动选择城市",
                    showCancel: false
                  });
                  self.reloadCity(cityId);
                },
                complete() {
                  console.log("get location complete")
                  userInfo.checkStorageOutDated();
                },
              });
            } else {
              console.log("location disabled")
              wx.showModal({
                title: "自动定位失败",
                content: "系统定位服务未开启，请手动选择城市",
                showCancel: false
              });
              self.reloadCity(cityId);
            }
          },
          fail(res) {
            console.log("get SystemInfo failed: ", res)
            self.reloadCity(cityId);
          },
          complete() {
            console.log("get location complete")
            userInfo.checkStorageOutDated();
          },
        })
      } else {
        self.reloadCity(cityId)
        // 先加载一遍避免空白等待时间，再重新判断
        if (userInfo.checkStorageOutDated()) {
          wx.getSystemInfo({
            success(res) {
              console.log(`locationAuthorized:${res.locationAuthorized}, locationEnabled:${res.locationEnabled}`)
              if (res.locationAuthorized && res.locationEnabled) {
                wx.getFuzzyLocation({
                  type: "gcje2",
                  success(res) {
                    net.get(API_LOCATION, { location: `${res.latitude},${res.longitude}` }, (res) => {
                      console.log("location api success: ", res)
                      if (res.code === 200 &&
                        cityId !== res.data.recomm_city_id &&
                        res.data.city == res.data.recomm_city) {
                        wx.showModal({
                          title: "定位城市",
                          content: `所在城市【${res.data.city}】，是否切换`,
                          success: function (mres) {
                            if (mres.confirm) {
                              self.reloadCity(res.data.recomm_city_id);
                            }
                          },
                        });
                      }
                    }
                    );
                  }
                });
              }
            }
          })
        }
      }
    },

    reloadCity(cityId: number) {
      console.log("before getCityList", this.data);
      userInfo.setUserCityId(cityId);
      net.get(API_CITY, {}, (res) => {
        if (res.code === 200) {
          const cityIndex = res.data.findIndex((item) => item.id == cityId);
          this.setData({
            cityIndex: cityIndex >= 0 ? cityIndex : 0,
            cityList: res.data,
          });
          console.log("after getCityList", this.data);
          this.triggerEvent("select", this.data.cityList[this.data.cityIndex]);
        }
      });
    },

    onSelectCity(e: any) {
      const index = Number(e.detail.value);
      const city = this.data.cityList?.[index];
      console.log("select-city component city_id =", city, city.id);
      if (this.properties.save) {
        userInfo.setUserCityId(city.id);
      }
      this.setData({
        cityIndex: index,
      });
      this.triggerEvent("select", city);
    },
  },
});
