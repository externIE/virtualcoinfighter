var transaction = {
    template: '<div>\
    买入价：{{ price }} 买入数量：{{ amount}} 涨幅：{{ rose }}% 赢亏： {{ dcny }}\
    <input type="button" value="卖出" @click= "onsell">\
</div>',
    data: function () {
      return {
          rose: 0,
          dcny: 0,
      }
    },
    mounted:function(){
        // this.price = params.price
        // this.amount = params.amount
    },
    methods: {
        onsell: function(){
            
        }
    },
    watch: {
        currentprice (value) {
            this.rose = ((value - this.price) / this.price * 100).toFixed(2)
            this.dcny = ((value - this.price) * this.amount).toFixed(2)
        }
    },
    props: ['price', 'amount', 'currentprice']
}
Vue.component("transaction", transaction)