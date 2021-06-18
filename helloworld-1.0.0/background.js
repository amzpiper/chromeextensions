!function(e){var t={};function n(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(r,s,function(t){return e[t]}.bind(null,s));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";const r=n(2);e.exports=r},function(e,t,n){"use strict";n.r(t);var r=n(0),s=n.n(r);function i(e){return/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(e)}function o(){browser.downloads.onCreated.addListener((function(e){if("in_progress"!==e.state)return;browser.storage.sync.get(["motrixapikey","extensionstatus"]).then((async function(t){if(t.extensionstatus)if(t.motrixapikey){const r={host:"127.0.0.1",port:16800,secure:!1,secret:t.motrixapikey,path:"/jsonrpc"},o=new s.a(r);let a="";if(i(e.finalUrl))a=e.finalUrl;else{if(!i(e.url))return;a=e.url}let c={};var n;if(e.filename)n=e.filename.replace(/^.*[\\\/]/,""),c={dir:e.filename.match(/(.*)[\/\\]/)[1]||"",out:n};await o.call("addUri",[a],c).then(async()=>{function t(){}function n(e){console.error("Error: "+e)}browser.downloads.removeFile(e.id).then(t).catch(n),browser.downloads.cancel(e.id).then(t).catch(n),browser.downloads.erase({id:e.id}).then(t).catch(n);var r=Math.round((new Date).getTime()/1e3).toString();browser.notifications.create(r,{type:"basic",iconUrl:"assets/images/icon-large.png",title:"Motrix WebExtension",message:"Download started in Motrix download manger"}),browser.notifications.onClicked.addListener(e=>{e==r&&browser.tabs.create({url:"motrix://"})}),setTimeout(()=>browser.runtime.reload(),1e3)}).catch(e=>{console.error(e),alert("Motrix not installed or configured properly, Open Motrix set a API Key by visiting Preferences > Advanced > RPC Secret")})}else alert("API key not set, please set a random API key by clicking on the extension icon. Open Motrix set the same API Key by visiting Preferences > Advanced > RPC Secret")}),(async function(e){console.error("Error: "+e)}))}))}browser.runtime.onStartup.addListener((function(){o()})),browser.runtime.onInstalled.addListener((function(){o()}))},function(e,t,n){"use strict";const r=n(3);function s(e){return e.startsWith("system.")||e.startsWith("aria2.")||(e="aria2."+e),e}function i(e){return e.split("aria2.")[1]||e}class o extends r{addSecret(e){let t=this.secret?["token:"+this.secret]:[];return Array.isArray(e)&&(t=t.concat(e)),t}_onnotification(e){const{method:t,params:n}=e,r=i(t);return r!==t&&this.emit(r,n),super._onnotification(e)}async call(e,...t){return super.call(s(e),this.addSecret(t))}async multicall(e){const t=[e.map(([e,...t])=>({methodName:s(e),params:this.addSecret(t)}))];return super.call("system.multicall",t)}async batch(e){return super.batch(e.map(([e,...t])=>[s(e),this.addSecret(t)]))}async listNotifications(){return(await this.call("system.listNotifications")).map(e=>i(e))}async listMethods(){return(await this.call("system.listMethods")).map(e=>i(e))}}Object.assign(o,{prefix:s,unprefix:i}),o.defaultOptions=Object.assign({},r.defaultOptions,{secure:!1,host:"localhost",port:6800,secret:"",path:"/jsonrpc"}),e.exports=o},function(e,t,n){"use strict";(function(t){const r=n(5),s=n(6),i=n(7),o=n(8),a=n(9),c=n(10),u=t.WebSocket||o,f=t.fetch?t.fetch.bind(t):a;class l extends c{constructor(e){super(),this.deferreds=Object.create(null),this.lastId=0,Object.assign(this,this.constructor.defaultOptions,e)}id(){return this.lastId++}url(e){return e+(this.secure?"s":"")+"://"+this.host+":"+this.port+this.path}websocket(e){return new Promise((n,r)=>{const s=e=>{e?r(e):n()};this.socket.send(JSON.stringify(e),s),t.WebSocket&&this.socket instanceof t.WebSocket&&s()})}async http(e){const t=this.fetch(this.url("http"),{method:"POST",body:JSON.stringify(e),headers:{Accept:"application/json","Content-Type":"application/json"}});return t.then(async e=>{this._onmessage(await e.json())}),t}_buildMessage(e,t){if("string"!=typeof e)throw new TypeError(e+" is not a string");const n={method:e,"json-rpc":"2.0",id:this.id()};return t&&Object.assign(n,{params:t}),n}async batch(e){const t=e.map(([e,t])=>this._buildMessage(e,t));return await this._send(t),t.map(({id:e})=>{const{promise:t}=this.deferreds[e]=new r;return t})}async call(e,t){const n=this._buildMessage(e,t);await this._send(n);const{promise:s}=this.deferreds[n.id]=new r;return s}async _send(e){this.emit("output",e);const{socket:t}=this;return t&&1===t.readyState?this.websocket(e):this.http(e)}_onresponse({id:e,error:t,result:n}){const r=this.deferreds[e];r&&(t?r.reject(new i(t)):r.resolve(n),delete this.deferreds[e])}_onrequest({method:e,params:t}){return this.onrequest(e,t)}_onnotification({method:e,params:t}){this.emit(e,t)}_onmessage(e){if(this.emit("input",e),Array.isArray(e))for(const t of e)this._onobject(t);else this._onobject(e)}_onobject(e){void 0===e.method?this._onresponse(e):void 0===e.id?this._onnotification(e):this._onrequest(e)}async open(){const e=this.socket=new this.WebSocket(this.url("ws"));return e.onclose=(...e)=>{this.emit("close",...e)},e.onmessage=e=>{this._onmessage(JSON.parse(e.data))},e.onopen=(...e)=>{this.emit("open",...e)},s(this,"open")}async close(){const{socket:e}=this;return e.close(),s(this,"close")}}l.defaultOptions={secure:!1,host:"localhost",port:80,secret:"",path:"/jsonrpc",fetch:f,WebSocket:u},e.exports=l}).call(this,n(4))},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";e.exports=function(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}},function(e,t,n){"use strict";e.exports=function(e,t){return new Promise((n,r)=>{function s(){e.removeListener(t,i),e.removeListener("error",o)}function i(e){n(e),s()}function o(e){r(e),s()}e.addListener(t,i),e.addListener("error",o)})}},function(e,t,n){"use strict";e.exports=class extends Error{constructor({message:e,code:t,data:n}){super(e),this.code=t,n&&(this.data=n),this.name=this.constructor.name}}},function(e,t){},function(e,t){},function(e,t,n){"use strict";var r,s="object"==typeof Reflect?Reflect:null,i=s&&"function"==typeof s.apply?s.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};r=s&&"function"==typeof s.ownKeys?s.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var o=Number.isNaN||function(e){return e!=e};function a(){a.init.call(this)}e.exports=a,a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var c=10;function u(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function f(e){return void 0===e._maxListeners?a.defaultMaxListeners:e._maxListeners}function l(e,t,n,r){var s,i,o,a;if(u(n),void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),o=i[t]),void 0===o)o=i[t]=n,++e._eventsCount;else if("function"==typeof o?o=i[t]=r?[n,o]:[o,n]:r?o.unshift(n):o.push(n),(s=f(e))>0&&o.length>s&&!o.warned){o.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=o.length,a=c,console&&console.warn&&console.warn(a)}return e}function h(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},s=h.bind(r);return s.listener=n,r.wrapFn=s,s}function p(e,t,n){var r=e._events;if(void 0===r)return[];var s=r[t];return void 0===s?[]:"function"==typeof s?n?[s.listener||s]:[s]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(s):v(s,s.length)}function m(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function v(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||o(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},a.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||o(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},a.prototype.getMaxListeners=function(){return f(this)},a.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var r="error"===e,s=this._events;if(void 0!==s)r=r&&void 0===s.error;else if(!r)return!1;if(r){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var c=s[e];if(void 0===c)return!1;if("function"==typeof c)i(c,this,t);else{var u=c.length,f=v(c,u);for(n=0;n<u;++n)i(f[n],this,t)}return!0},a.prototype.addListener=function(e,t){return l(this,e,t,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(e,t){return l(this,e,t,!0)},a.prototype.once=function(e,t){return u(t),this.on(e,d(this,e,t)),this},a.prototype.prependOnceListener=function(e,t){return u(t),this.prependListener(e,d(this,e,t)),this},a.prototype.removeListener=function(e,t){var n,r,s,i,o;if(u(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(s=-1,i=n.length-1;i>=0;i--)if(n[i]===t||n[i].listener===t){o=n[i].listener,s=i;break}if(s<0)return this;0===s?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,s),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,o||t)}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var s,i=Object.keys(n);for(r=0;r<i.length;++r)"removeListener"!==(s=i[r])&&this.removeAllListeners(s);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},a.prototype.listeners=function(e){return p(this,e,!0)},a.prototype.rawListeners=function(e){return p(this,e,!1)},a.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):m.call(e,t)},a.prototype.listenerCount=m,a.prototype.eventNames=function(){return this._eventsCount>0?r(this._events):[]}}]);