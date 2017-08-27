var virtualcoin = {
    template: '<div><div v-bind:style="netstatusstyle"><center><h3>{{ netstatus }}</h3></center></div><h2>{{ vctype }} {{ period }}</h2><p>开盘价：{{open}}</p><p>收盘价：{{close}}</p><p>最高价：{{high}}</p><p>最低价：{{low}}</p><p>交易量：{{amount}}</p><p>交易笔数：{{count}}</p><trade :currentprice="currentprice"></trade></div>',
    data: function () {
      return {
          netstatus: "努力连接中...",
          netstatusstyle: {background: "yellow"},
          vctype: "",
          period: "",
          open:0,
          close:0,
          high:0,
          low:0,
          amount:0,
          count:0,
          currentprice:0,
      }
    },
    mounted:function(){
        var lykObj = new LYKNetwork(this.params)
        lykObj.connect()
        lykObj.onNotify = this.onBCCCNYNotify
        lykObj.onconnectclose = this.onConnenctClose
        lykObj.onconnecterror = this.onConnectError
        lykObj.onconnectok = this.onConnectOK
        lykObj.onreconnecting = this.onReconnecting
        this.vctype = lykObj.getSymbol()
        this.period = "("+lykObj.getPeriod()+")"
    },
    methods: {
        onBCCCNYNotify:function(tick){
            console.log("@@@@vue:onBCCCNYNotify")
            console.log(tick)
            this.open = tick.open
            this.close = tick.close
            this.high = tick.high
            this.low = tick.low
            this.amount = tick.amount
            this.count = tick.count
            this.$emit("oncurrentprice", {symbol: this.vctype, price: this.close})
            this.currentprice = this.close
        },
        onConnenctClose:function(){
            this.netstatusstyle.background = "red"
            this.netstatus = "连接断开"
        },
        onConnectError:function(){
            this.netstatusstyle.background = "red"
            this.netstatus = "连接错误"
        },
        onConnectOK:function(){
            this.netstatusstyle.background = "green"
            this.netstatus = "连接成功，持续刷新数据中"
        },
        onReconnecting:function(nTime){
            this.netstatusstyle.background = "yellow"
            this.netstatus = "重连中："+nTime+"/3"
        }
    },
    props: ['params']
}
Vue.component("virtualcoin", virtualcoin)