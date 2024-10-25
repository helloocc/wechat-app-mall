
Page({
  data: {
    liveshowId: -1,
  },
  onLoad: async function (options) {
    this.setData({
      liveshowId: options.id,
    });
  },
});
