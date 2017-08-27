var titlemap = {}
var vm = new Vue({
    el: '#app',
    data: {
        vc1: {symbol: "bcccny", topictype: "kline", period:"1min"},
        vc2: {symbol: "btccny", topictype: "kline", period:"1min"}
    },
    mounted:function(){
        // var lykObj = new LYKNetwork({symbol: "bcccny", topictype: "kline", period:"1min"})
        // lykObj.connect()
        // lykObj.onNotify = this.onBCCCNYNotify
    },
    methods: {
        onCurrentPrice: function(params){
            params = this.parseSymbolAndPrice(params)
            titlemap[params.symbol] = params.price
            this.updateDOMTitle()
        },
        parseSymbolAndPrice: function(params){
            params.symbol = params.symbol.replace("cny", "")
            return params
        },
        updateDOMTitle: function(){
            document.title = ""
            for( var key in titlemap ){
                document.title += key.toUpperCase() + ":" + Math.round(titlemap[key]) + "|"
            }
        }
    }
})