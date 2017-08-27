
// topic 类型	topic 语法	描述
// KLine	market.$symbol.kline.$period	$period 可选值：{ 1min, 5min, 15min, 30min, 60min, 1day, 1mon, 1week, 1year }
// Market Depth	market.$symbol.depth.$type	$type 可选值：{ step0, step1, step2, step3, step4, step5 } （合并深度0-5）；step0时，不合并深度
// Trade Detail	market.$symbol.trade.detail	
// Market Detail	market.$symbol.detail	

// "tick": {
//     "id": K线id,
//     "amount": 成交量,
//     "count": 成交笔数,
//     "open": 开盘价,
//     "close": 收盘价,当K线为最晚的一根时，是最新成交价
//     "low": 最低价,
//     "high": 最高价,
//     "vol": 成交额, 即 sum(每一笔成交价 * 该笔的成交量)
//   }
var _LHEART_ = 1290923423
var _RECONNECTTIME_ = 3 // 重连三次

var heartCheck = {
    timeout: 1000,//60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(ws){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
　　　　 this.start(ws);
    },
    start: function(ws){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            ws.send(JSON.stringify({"ping":_LHEART_}))
            self.serverTimeoutObj = setTimeout(function(){
                console.log("连接超时了！！！")
                ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    },
}

function LYKNetwork(params){
    this._init_(params)
}

LYKNetwork.prototype = {
    constructor: LYKNetwork,
    _init_ : function(params) {
        params = params || {}
        var self        = this
        this.symbol     = params["symbol"]      || "bcccny"
        this.wss        = params["wss"]         || this.getwss(this.symbol)
        
        this.topictype  = params["topictype"]   || "kline"
        this.period     = params["period"]      || "1day"
        this.step       = params["step"]        || "step0"

        this.topic = "market."
        this.topic += this.symbol + "." + this.topictype
        if(this.topictype === "kline")
            this.topic += "." + this.period
        if(this.topictype === "depth")
            this.topic += "." + this.step
        if(this.topictype === "trade")
            this.topic += ".detail"

        this.topic = params["topic"] ||this.topic
        console.log(this.topic)
        this.webSocket = null
        this.nConnectTime = 0
    },
    getSymbol(){
        return this.symbol
    },
    getPeriod(){
        return this.period
    },
    getwss(symbol){
        var map = {}
        map["wss://api.huobi.com/ws"] = ["btccny", "ltccny"]
        map["wss://be.huobi.com/ws"]  = ["ethcny", "etccny", "bcccny"]
        map["wss://api.huobi.pro/ws"] = ["ethbtc", "ltcbtc", "bccbtc", "etcbtc"]
        for(var key in map){
            if($.inArray(symbol, map[key]) >= 0)
            {
                console.log(key)
                return key
            }
        }
    },
    connect(){
        if(this.webSocket !== null) return false
        this.webSocket = new WebSocket(this.wss)
        this.webSocket.self = this
        this.webSocket.binaryType = "arraybuffer"
        this.webSocket.onopen = this.onopen
        this.webSocket.onmessage = this.onmessage
        this.webSocket.onclose = this.onclose
        this.webSocket.onerror = this.onerror
        return true
    },
    reconnect(){
        this.webSocket = null
        this.connect()
    },
    onopen(event){
        console.log(("webSocket connect at time: "+new Date()))
        this.self.onconnectok()
        this.send(JSON.stringify({'sub': this.self.topic,'id': 'depth ' + new Date()}))
        //this.send(JSON.stringify({"ping":_LHEART_}))
        heartCheck.start(this)
    },
    onmessage(event){
        var raw_data = event.data
        window.raw_data = raw_data
        var ua = new Uint8Array(raw_data)
        var json = pako.inflate(ua,{to:"string"})
        var data = JSON.parse(json)
        if(data["ping"]){
            this.send(JSON.stringify({"pong":data["ping"]}))
        }
        else if (data["pong"] == _LHEART_){
            heartCheck.reset(this)
        }
        else{
            console.log(data)
            if(data.ch){
                var tick = data.tick
                this.self.onNotify(tick)
            }
        }
    },
    onclose(){
        if(this.self.nConnectTime < _RECONNECTTIME_){
            this.self.onreconnecting(this.self.nConnectTime)
            this.self.reconnect()
            return
        }

        this.self.onconnectclose()
        console.log("webSocket connect is closed");
        console.log(arguments);
    },
    onerror(){
        this.self.onconnecterror()
        console.log("error");
        console.log(arguments);
    },
    onconnectok(){

    },
    onconnectclose(){

    },
    onconnecterror(){

    },
    onreconnecting(nTime){

    },
    onNotify(tick){
        console.log(tick)
    },
    sayHello:function(){
        console.log('hello');
    }
}