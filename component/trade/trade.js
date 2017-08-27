var trade = {
    template: '<div>\
    <div>\
        价格：<input v-model="price">\
        数量：<input v-model="amount">\
        <input type="button" @click="onsure" value="确定"></button>\
    </div>\
    <div>\
        <transaction v-for="item in transactions" :key="item.id" :price="item.price" :amount="item.amount" :currentprice="currentprice"></transaction>\
    </div>\
    <div>\
        总币数：{{totalamount}} 总赢亏：{{totaldcny}} 总资产：{{totalasset}}\
    </div>\
</div>',
    data: function () {
      return {
          price: "",
          amount: "",
          nPrice: -1,
          nAmount: -1,
          transactions: [],
          totalamount: 0,
          totalasset: 0,
          totaldcny: 0,
      }
    },
    mounted:function(){
    },
    methods: {
        onsure: function(){
            this.nPrice = parseInt(this.price)
            this.nAmount = parseInt(this.amount)
            this.price = ""
            this.amount = ""
            this.transactions.push(this.createOneTransaction(this.nPrice, this.nAmount))
            this.totalamount += this.nAmount
        },
        createOneTransaction: function(nPrice, nAmount){
            return {price:nPrice, amount:nAmount, id:Date.parse(new Date())}
        }
    },
    watch: {
        currentprice (value) {
            this.totalasset = (value*this.totalamount).toFixed(2)
            var totalcost = 0
            for(key in this.transactions){
                totalcost += this.transactions[key].price
            }
            this.totaldcny = (this.totalasset - totalcost).toFixed(2)
        }
    },
    props: ['params', 'currentprice']
}
Vue.component("trade", trade)