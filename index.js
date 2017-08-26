var vm = new Vue({
    el: '#app',
    data: {
        title: "标题啊",
        vc1: {symbol: "bcccny", topictype: "kline", period:"1min"},
        vc2: {symbol: "btccny", topictype: "kline", period:"1min"}
    },
    mounted:function(){
        // var lykObj = new LYKNetwork({symbol: "bcccny", topictype: "kline", period:"1min"})
        // lykObj.connect()
        // lykObj.onNotify = this.onBCCCNYNotify
    },
    methods: {
        onBCCCNYNotify:function(tick){
            console.log("@@@@vue:onBCCCNYNotify")
            console.log(tick)
            this.title = tick.open
        }
    }
})