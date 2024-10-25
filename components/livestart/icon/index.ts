
Component({
  properties: {
    name: {
      type: String,
      value: '',
    },
    size: {
      type: String,
      value: 'default',
    },
    fill: {
      type: Boolean,
      value: false,
    }
  },
  
  data: {
    image: '',
  },

  observers: {
    'fill,name': function(fill,name) {
      let url = `/icons/${name}.svg`;
      if (fill) {
        url = `/icons/${name}-fill.svg`;
      }
      this.setData({ image: url });
    },
  },
});