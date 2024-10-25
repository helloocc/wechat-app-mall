
Page({
  data: {
    ticketId: -1,
  },
  onLoad: async function (options) {
    this.setData({
      ticketId: options.ticketId,
    });
  },
});


