!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=2)}({2:function(e,t,r){"use strict";r.r(t);function*n(e,t,r){let n=e;for(void 0===r&&(r=1);n<t;)yield n,n+=r}function i(e,t){return e.slice(9*t,9*t+9)}function o(e,t){return Array.from(n(0,9)).map((function(r){return e[9*r+t]})).join("")}function s(e,t,r){let i=3*Math.floor(t/3),o=3*Math.floor(r/3);return Array.from(n(o,o+3)).map((function(t){return e.slice(9*t+i,9*t+i+3)})).join("")}function l(e){return Array.from(function*(e){for(let t=0;t<9;t+=1)yield i(e,t)}(e)).every(f)&&Array.from(function*(e){for(let t=0;t<9;t+=1)yield o(e,t)}(e)).every(f)&&Array.from(function*(e){for(let t=0;t<9;t+=1){let r=3*Math.floor(t/3),n=t%3*3;yield s(e,n,r)}}(e)).every(f)}function a(e,t){var r=new Set(e);for(var n of t)r.delete(n);return r}const c=Array.from(n(1,10)).map(e=>e.toString());function u(e,t,r){return a(a(a(c,new Set(i(e,r))),new Set(o(e,t))),new Set(s(e,t,r)))}class d extends Error{constructor(e){super(e),this.name="ItemError"}}function f(e){if(9!==e.length)throw new d(`Item '${e}' has a length not equal to 9`);let t=new Set(e);return c.every(e=>t.has(e))}const h=new Set(c);function*m(e,t){const r=e.length;for(let n=t||0;n<r;n+=1){let t=e[n];if(h.has(t))continue;let r=n%9,i=Math.floor(n/9),o=Array.from(u(e,r,i));if(0===o.length)return;for(let t of o){let r=e.slice(0,n)+t+e.slice(n+1);for(let e of m(r))yield e}return}l(e)&&(yield e)}const g=" ".repeat(81),y=["1","2","3","4","5","6","7","8","9"],p=y.length;new class{constructor(e,t){let r=m(this.randomize(g,1),0);this.solution=r.next().value,console.log("Got game"),this.game=this.clearSomeFields(this.solution,50),console.log("Removed fields"),this.elements=Array.prototype.map.call(this.game,this.generateElement.bind(this)),this.drawGame();for(let t of this.elements)e.appendChild(t);e.style.height=e.offsetWidth+"px",e.addEventListener("keyup",this.setFieldValueViaKeyboard.bind(this)),t.querySelectorAll("button").forEach(e=>{e.addEventListener("click",this.setFieldValueViaButton.bind(this))})}getXfromPosition(e){return e%p}getYfromPosition(e){return Math.floor(e/p)}clearSomeFields(e,t){let r,n=!0;do{let t,i;do{t=this.getRandomNumber(0,e.length)}while(" "===e[t]);r=this.replaceAtPosition(this.replaceAtPosition(e,t," "),e.length-t-1," "),i=m(r,0),i.next(),n=!i.next().done}while(n);return t>0?this.clearSomeFields(r,t-2):e}generateElement(e,t){let r=document.createElement("div");return e=e.trim(),r.setAttribute("data-field-index",t.toString()),""!==e?r.setAttribute("data-readonly","true"):(r.setAttribute("tabindex","0"),r.addEventListener("focus",this.selectField.bind(this))),r.classList.add("input-container"),r}drawGame(){let e=this;Array.prototype.forEach.call(this.game,(function(t,r){let n=e.elements[r];n.innerHTML!==t&&(n.innerHTML=t)}))}occurresOnce(e,t){return 1===(t.match(new RegExp(e,"g"))||"").length}selectField(e){let t=e.target;if(void 0!==this.selectedElement){this.elements[this.selectedElement].classList.remove("input-container-selected")}t.classList.add("input-container-selected"),this.selectedElement=parseInt(t.getAttribute("data-field-index"),10)}setFieldValue(e){if(void 0===this.selectedElement)return;let t=this.elements[this.selectedElement],r=this.selectedElement,n=!1,l=this.getXfromPosition(r),a=this.getYfromPosition(r);this.game=this.replaceAtPosition(this.game,r,e),this.occurresOnce(e,o(this.game,l))||(t.classList.add("error"),n=!0),this.occurresOnce(e,i(this.game,a))||(t.classList.add("error"),n=!0),this.occurresOnce(e,s(this.game,l,a))||(t.classList.add("error"),n=!0),!1===n&&(console.log(n),t.classList.remove("error")),this.drawGame()}setFieldValueViaKeyboard(e){if(y.indexOf(e.key)>=0||"Backspace"===e.key){let t="Backspace"===e.key?" ":e.key;this.setFieldValue(t)}}setFieldValueViaButton(e){let t=e.target.value;this.setFieldValue(t)}randomize(e,t){let r=this.getRandomNumber(0,e.length),n=this.getRandomNumber(1,9);return t?this.randomize(this.replaceAtPosition(e,r,n.toString()),t-1):this.replaceAtPosition(e,0,n.toString())}getRandomNumber(e,t){return Math.floor(Math.random()*t+e)}replaceAtPosition(e,t,r){return e.substring(0,t)+r+e.substring(t+1)}}(document.querySelector(".game"),document.querySelector(".controls")),document.body.style.height=window.screen.height+"px"}});