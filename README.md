简书地址：[https://www.jianshu.com/p/870ae491fb08](https://www.jianshu.com/p/870ae491fb08)

# **reportEvent**

一个支持常规`PC`、`H5`，单网页应用`React`、`Vue`、`Angurla` 的上报事件小插件，使用简单，代码轻量。<br/>
参数自动序列化，自带一个唯一uuid `frontUvId` 存储在本地 `eventFrontUvId` 中，每次上报事件都会携带这个参数

## **直接调用**

适用于路由切换、接口请求完毕、onload、接口或方法回调等场景。callback为非必填<br/>

##### window.reportEvent.reportEventFunc(object,callback);

> window.reportEvent.reportEventFunc({code:1,id:2},(res)=>{
>   console.log('调用完成=>',res)
> });

## **自动绑定click事件，完成上报**

支持数组传参和对象的方式传递参数，上报方法会检测类型，如果是数组，会循环数组，并多次上报里边的对象；对象直接上报，传递的参数需要JSON.stringify(对象或者数组)<br/>
**目前自动绑定只做了click**

## PC or H5

> 对象：
> `<div data-reporteventfunc="click" data-reporteventdata='{"code":"1","id":"2"}'></div>`
> 数组：
> `<div data-reporteventfunc="click" data-reporteventdata='[{"code":"1","id":"2"},{"code":"1","id":"2"}]'></div>`

## React

> 对象：
> `<div data-reporteventfunc={'click'} data-reporteventdata={JSON.stringify({code:1,id:2})}></div>`
> 数组：
> `<div data-reporteventfunc={'click'} data-reporteventdata={JSON.stringify([{code:1,id:2},{code:1,id:2}])}></div>`

## Vue

> 对象：
> `<div  data-reporteventfunc="click" :data-reporteventdata="JSON.stringify({code:1,id:2})"></div>`
> 数组：
> `<div  data-reporteventfunc="click" :data-reporteventdata="JSON.stringify([{code:1,id:2},{code:1,id:2}])"></div>`