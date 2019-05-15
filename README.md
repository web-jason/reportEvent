# **reportEvent**

一个兼容常规pc、h5和单网页应用react、vue、ng的上报事件小插件，使用简单，代码轻量。<br/>
参数自动序列化，自带一个唯一uuid `frontUvId` 存储在本地 `eventFrontUvId` 中，每次上报事件都会携带这个参数

## **直接调用**

### window.reportEvent.reportEventFunc(object,callback);

## **自动绑定click事件，完成上报事件**

Array循环多次上报，Object上报一次，并且需要JSON.stringify()<br/>
**目前自动绑定只支持click上报**

## PC or H5

>Object：`<div data-reporteventfunc="click" data-reporteventdata='{"code":"1","id":"2"}'></div>`
><br/>
><br/>
>Array：`<div data-reporteventfunc="click" data-reporteventdata='[{"code":"1","id":"2"},{"code":"1","id":"2"}]'></div>`

## React

>Object：`<div data-reporteventfunc={'click'} data-reporteventdata={JSON.stringify({code:1,id:2})}></div>`
><br/>
><br/>
>Array：`<div data-reporteventfunc={'click'} data-reporteventdata={JSON.stringify([{code:1,id:2},{code:1,id:2}])}></div>`

## Vue

>Object：`<div  data-reporteventfunc="click" :data-reporteventdata="JSON.stringify({code:1,id:2})"></div>`
><br/>
><br/>
>Array：`<div  data-reporteventfunc="click" :data-reporteventdata="JSON.stringify([{code:1,id:2},{code:1,id:2}])"></div>`