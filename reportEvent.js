/*
 * @Author: shiweihua 
 * @Date: 2019-05-14 16:21:29 
 * @Last Modified by: shiweihua
 * @Last Modified time: 2019-05-19 16:20:09
 */
(function (w) {

  //上报事件的提交地址
  const REPORT_EVENT_URL = 'url';
  //唯一ID对应内存里的key
  const EVENT_FRONT_UVID = 'eventFrontUvId';
  //事件委托的对象
  var EVENT_DOM = document.getElementsByTagName("body")[0];
  //上报事件的绑定类型对应的绑定名称
  const REPORT_EVENT_FUNC = 'data-reporteventfunc';
  //上报事件数据对应的绑定参数名称
  const REPORT_EVENT_DATA = 'data-reporteventdata';

  var reportEvent = {
    _ajax: function (obj) {
      let xhr = new XMLHttpRequest();
      xhr.open(obj.type || 'POST', obj.url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
          obj.callback && obj.callback(JSON.parse(xhr.response))
        }
      };
      xhr.send(obj.data);
    },
    //按条件循环方法，配合filterEmptyObj使用
    _each: function (data, callback) {
      for (let x in data) {
        let d = callback(x, data[x]);
        if (d === false) {
          break;
        }
      }
    },
    //过滤空对象
    _filterEmptyObj: function (obj) {
      let o = {};
      this._each(obj, function (i, d) {
        if (d !== null) {
          o[i] = d;
        }
      });
      return o;
    },
    //用于生成frontUvId
    _creatfrontUvId4: function (len, radix) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [], i;
      radix = radix || chars.length;

      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    },
    //对frontUvId逻辑处理
    _getFrontUvId: function () {
      //读取本地存储的frontUvId
      let eventFrontUvId = localStorage.getItem(EVENT_FRONT_UVID);
      //有frontUvId就直接返回，没有重新生成，保存在本地，并返回
      if (eventFrontUvId === null) {
        //生成新的frontUvId
        eventFrontUvId = this._creatfrontUvId4(32,16);
        //frontUvId存在本地
        localStorage.setItem(EVENT_FRONT_UVID, eventFrontUvId);
      }
      return eventFrontUvId;
    },
    //过滤空参数 + 序列化对象
    _serialize: function (obj) {
      //清空为null的对象
      obj = this._filterEmptyObj(obj);
      //序列化参数
      let parameter = '?';
      for (let key in obj) {
        parameter += `${key}=${obj[key]}&`
      }
      parameter = parameter.substring(0, parameter.length - 1);
      return parameter;
    },
    //上报事件方法
    reportEventFunc: function (obj, callback) {
      //拿frontUvId
      obj.frontUvId = this._getFrontUvId();
      //post提交接口
      this._ajax({
        type: 'POST',
        url: `${REPORT_EVENT_URL}${this._serialize(obj)}`,
        data: {},
        callback: (res) => {
          callback && callback(res)
        }
      })
    },
    //获取元素属性，调用上报事件
    getDomAttribute: function (dom) {
      //获取属性参数
      let eventData = dom.getAttribute(REPORT_EVENT_DATA);
      if (!eventData) {
        return;
      }
      //判断类型，如果是字符串类型，转换类型
      eventData = typeof eventData == 'string' ? eval('(' + eventData + ')') : JSON.parse(eventData);
      //此判断es5写法，对兼容有要求的可以更换为 Object.prototype.toString.call(eventData) === '[object Array]'
      //如果是对象直接上报事件
      if (!Array.isArray(eventData)) {
        this.reportEventFunc(eventData);
        return;
      }
      //如果是数组，循环上报事件
      for (let si = 0; si < eventData.length; si++) {
        this.reportEventFunc(eventData[si]);
      }
    }
  }


  w.onload = function () {

    //事件委托，检测拥有指定参数
    EVENT_DOM.onclick = function (ev) {
      var ev = ev || w.event;
      //查找当前dom的dom树
      for (let i = 0; i < ev.path.length; i++) {
        if (ev.path[i].getAttribute && ev.path[i].getAttribute(REPORT_EVENT_FUNC) == 'click') {
          //只需要传入满足条件的节点
          reportEvent.getDomAttribute(ev.path[i]);
        }
      }
    };
  }
  w.reportEvent = reportEvent;

})(window)
