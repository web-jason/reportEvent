(function(w){

  //上报事件的地址
  const REPORT_EVENT_URL = 'url';

  w.reportEvent = {
    get: function(url, data, fn) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function() {
        // readyState == 4说明请求已完成
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
          // 从服务器获得数据
          fn(xhr.response);
        }
      };
      xhr.send(data);
    },
    post: function (url, data, fn) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
          fn(JSON.parse(xhr.response))
        }
      };
      xhr.send(data);
    },
    //按条件循环方法，配合filterEmptyObj使用
    each: function(data, callback) {
      for (let x in data) {
        let d = callback(x, data[x]);
        if (d === false) {
          break;
        }
      }
    },
    //过滤空对象
    filterEmptyObj: function(obj) {
      let o = {};
      this.each(obj, function (i, d) {
        if (d !== null) {
          o[i] = d;
        }
      });
      return o;
    },
    //用于生成frontUvId，只有4位
    creatfrontUvId4:function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    //生成32位frontUvId
    getFrontUvId: function () {
      //读取本地存储的frontUvId
      let frontUvId = localStorage.getItem("eventFrontUvId");
      //有frontUvId就直接返回，没有重新生成，保存在本地，并返回
      if(frontUvId === null){
        //生成新的frontUvId
        frontUvId = this.creatfrontUvId4()+this.creatfrontUvId4()+this.creatfrontUvId4()+this.creatfrontUvId4()+this.creatfrontUvId4()+this.creatfrontUvId4()+this.creatfrontUvId4()+this.creatfrontUvId4();
        //frontUvId存在本地
        localStorage.setItem("eventFrontUvId",frontUvId);
      }
      return frontUvId;
    },
    //上报事件方法
    reportEventFunc: function(obj,callback){
      //拿frontUvId
      obj.frontUvId = this.getFrontUvId();
      //清空为null的对象
      obj = this.filterEmptyObj(obj);
      //序列化参数
      let parameter = '?';
      for (let key in obj) {
        parameter+=`${key}=${obj[key]}&`
      }
      parameter = parameter.substring(0,parameter.length-1)
      //post提交接口
      this.post(`${REPORT_EVENT_URL}${parameter}`,{},(res)=>{
        callback && callback(res)
      })
    }
  }

  w.onload = function() {
    let body = document.getElementsByTagName("body")[0];

    //事件委托，检测只有指定class的才能
    body.onclick = function(ev){
      var ev = ev || w.event;
      let eventList = [];
      //查找当前dome的dome树
      for(let i=0; i<ev.path.length; i++){
        if(ev.path[i].getAttribute && ev.path[i].getAttribute('data-reporteventfunc')== 'click'){
          eventList.push(ev.path[i]);
        }
      }
      if(eventList.length){
        for(let i=0; i<eventList.length; i++){
          let item = eventList[i];
          //获取属性参数
          let eventData = item.getAttribute('data-reporteventdata');
          if(!eventData){
            return false;
          }
          //判断类型，如果是字符串类型，转换类型
          eventData = typeof eventData == 'string' ? eval('(' + eventData + ')') :JSON.parse(eventData);
          //如果是数组，循环发送上报事件
          //此判断es5写法，对兼容有要求的可以更换为 Object.prototype.toString.call(eventData) === '[object Array]'
          if(Array.isArray(eventData)){
            for(let si=0; si<eventData.length; si++){
              //调用上报事件方法
              w.reportEvent.reportEventFunc(eventData[si]);
            }
          }else{
            w.reportEvent.reportEventFunc(eventData);
          }

        }
      }
    };
  }

})(window)
