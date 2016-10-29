!function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return o(n?n:e)},c,c.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){var t=function(t){function n(t,i,s,a){r(this,n);var u=o(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return u._model=i.id,u.os=t,u.map=e.utils.copyObject(i.map),u.contents=s,u.opContents=a,u.eventHandler=new e.utils.EventHandler(function(t){var n,r="Delete"===t.struct?t.key:t.parentSub;if(n=null!=u.opContents[r]?u.os.getType(u.opContents[r]):u.contents[r],"Insert"===t.struct){if(null===t.left&&!e.utils.compareIds(t.id,u.map[r])){var o;null!=t.opContent?(o=u.os.getType(t.opContent),delete u.contents[r],t.deleted?delete u.opContents[r]:u.opContents[r]=t.opContent):(o=t.content[0],delete u.opContents[r],t.deleted?delete u.contents[r]:u.contents[r]=t.content[0]),u.map[r]=t.id,void 0===n?u.eventHandler.callEventListeners({name:r,object:u,type:"add",value:o}):u.eventHandler.callEventListeners({name:r,object:u,oldValue:n,type:"update",value:o})}}else{if("Delete"!==t.struct)throw new Error("Unexpected Operation!");e.utils.compareIds(u.map[r],t.target)&&(delete u.opContents[r],delete u.contents[r],u.eventHandler.callEventListeners({name:r,object:u,oldValue:n,type:"delete"}))}}),u}return i(n,t),a(n,[{key:"_destroy",value:function(){this.eventHandler.destroy(),this.eventHandler=null,this.contents=null,this.opContents=null,this._model=null,this.os=null,this.map=null}},{key:"get",value:function(e){if(null==e||"string"!=typeof e)throw new Error("You must specify a key (as string)!");return null==this.opContents[e]?this.contents[e]:this.os.getType(this.opContents[e])}},{key:"keys",value:function(){return Object.keys(this.contents).concat(Object.keys(this.opContents))}},{key:"keysPrimitives",value:function(){return Object.keys(this.contents)}},{key:"keysTypes",value:function(){return Object.keys(this.opContents)}},{key:"getPrimitive",value:function(t){if(null==t)return e.utils.copyObject(this.contents);if("string"!=typeof t)throw new Error("Key is expected to be a string!");return this.contents[t]}},{key:"getType",value:function(e){if(null==e||"string"!=typeof e)throw new Error("You must specify a key (as string)!");return null!=this.opContents[e]?this.os.getType(this.opContents[e]):Promise.reject("No property specified for this key!")}},{key:"delete",value:function(t){var n=this.map[t];if(null!=n){var r={target:n,struct:"Delete"},o=this.eventHandler,i=e.utils.copyObject(r);i.key=t,this.os.requestTransaction(regeneratorRuntime.mark(function s(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.delegateYield(o.awaitOps(this,this.applyCreatedOperations,[[r]]),"t0",1);case 1:case"end":return e.stop()}},s,this)})),o.awaitAndPrematurelyCall([i])}}},{key:"set",value:function(t,n){var r=this.map[t]||null,o={id:this.os.getNextOpId(1),left:null,right:r,origin:null,parent:this._model,parentSub:t,struct:"Insert"},i=this.eventHandler,s=e.utils.isTypeDefinition(n);if(s!==!1){var a=this.os.createType(s);return o.opContent=a._model,this.os.requestTransaction(regeneratorRuntime.mark(function u(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.delegateYield(i.awaitOps(this,this.applyCreatedOperations,[[o]]),"t0",1);case 1:case"end":return e.stop()}},u,this)})),i.awaitAndPrematurelyCall([o]),a}return o.content=[n],this.os.requestTransaction(regeneratorRuntime.mark(function l(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.delegateYield(i.awaitOps(this,this.applyCreatedOperations,[[o]]),"t0",1);case 1:case"end":return e.stop()}},l,this)})),i.awaitAndPrematurelyCall([o]),n}},{key:"observe",value:function(e){this.eventHandler.addEventListener(e)}},{key:"unobserve",value:function(e){this.eventHandler.removeEventListener(e)}},{key:"observePath",value:function(t,r){function o(e){e.name===i&&r(s.get(i))}var i,s=this;if(t.length<1)return r(this),function(){};if(1===t.length)return i=t[0],r(s.get(i)),this.observe(o),function(){s.unobserve(r)};var a,u=function(){var o=s.get(t[0]);o instanceof n||(o=s.set(t[0],e.Map)),a=o.observePath(t.slice(1),r)},l=function(e){e.name===t[0]&&(null!=a&&a(),("add"===e.type||"update"===e.type)&&u())};return s.observe(l),u(),function(){null!=a&&a(),s.unobserve(l)}}},{key:"_changed",value:regeneratorRuntime.mark(function s(e,t){var n;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:if("Delete"!==t.struct){r.next=6;break}return r.delegateYield(e.getOperation(t.target),"t0",2);case 2:n=r.t0,t.key=n.parentSub,r.next=8;break;case 6:if(null==t.opContent){r.next=8;break}return r.delegateYield(e.store.initType.call(e,t.opContent),"t1",8);case 8:this.eventHandler.receivedOp(t);case 9:case"end":return r.stop()}},s,this)})}]),n}(e.utils.CustomType);e.extend("Map",new e.utils.CustomTypeDefinition({name:"Map","class":t,struct:"Map",initType:regeneratorRuntime.mark(function n(e,r){var o,i,s,a,u;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:o={},i={},s=r.map,n.t0=regeneratorRuntime.keys(s);case 4:if((n.t1=n.t0()).done){n.next=18;break}return a=n.t1.value,n.delegateYield(this.getOperation(s[a]),"t2",7);case 7:if(u=n.t2,!u.deleted){n.next=10;break}return n.abrupt("continue",4);case 10:if(null==u.opContent){n.next=15;break}return i[a]=u.opContent,n.delegateYield(this.store.initType.call(this,u.opContent),"t3",13);case 13:n.next=16;break;case 15:o[a]=u.content[0];case 16:n.next=4;break;case 18:return n.abrupt("return",new t(e,r,o,i));case 19:case"end":return n.stop()}},n,this)}),createType:function(e,n){return new t(e,n,{},{})}}))}var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.exports=s,"undefined"!=typeof Y&&s(Y)},{}]},{},[1]);
//# sourceMappingURL=y-map.js.map
