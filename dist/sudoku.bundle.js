!function(e){var t={};function i(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=t,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=2)}({2:function(e,t,i){"use strict";i.r(t);function*r(e,t,i){let r=e;for(void 0===i&&(i=1);r<t;)yield r,r+=i}function n(e,t){return e.slice(9*t,9*t+9)}function s(e,t){return Array.from(r(0,9)).map((function(i){return e[9*i+t]})).join("")}function o(e,t,i){let n=3*Math.floor(t/3),s=3*Math.floor(i/3);return Array.from(r(s,s+3)).map((function(t){return e.slice(9*t+n,9*t+n+3)})).join("")}function l(e){return Array.from(function*(e){for(let t=0;t<9;t+=1)yield n(e,t)}(e)).every(h)&&Array.from(function*(e){for(let t=0;t<9;t+=1)yield s(e,t)}(e)).every(h)&&Array.from(function*(e){for(let t=0;t<9;t+=1){let i=3*Math.floor(t/3),r=t%3*3;yield o(e,r,i)}}(e)).every(h)}function a(e,t){var i=new Set(e);for(var r of t)i.delete(r);return i}const c=Array.from(r(1,10)).map(e=>e.toString());function d(e,t,i){return a(a(a(c,new Set(n(e,i))),new Set(s(e,t))),new Set(o(e,t,i)))}class u extends Error{constructor(e){super(e),this.name="ItemError"}}function h(e){if(9!==e.length)throw new u(`Item '${e}' has a length not equal to 9`);let t=new Set(e);return c.every(e=>t.has(e))}const f=new Set(c);function*m(e,t){const i=e.length;for(let r=t||0;r<i;r+=1){let t=e[r];if(f.has(t))continue;let i=r%9,n=Math.floor(r/9),s=Array.from(d(e,i,n));if(0===s.length)return;for(let t of s){let i=e.slice(0,r)+t+e.slice(r+1);for(let e of m(i))yield e}return}l(e)&&(yield e)}const g=" ".repeat(81),y=["1","2","3","4","5","6","7","8","9"],p=y.length;function b(){document.body.style.height=window.innerHeight+"px"}window.addEventListener("resize",b),new class{constructor(e,t){let i=m(this.randomize(g,1),0);this.solution=i.next().value,console.log("Got game"),this.game=this.clearSomeFields(this.solution,50),console.log("Removed fields"),this.elements=this.game.split("").map(this.generateElement.bind(this)),this.drawGame();for(let t of this.elements)e.appendChild(t);e.style.height=e.offsetWidth+"px",e.addEventListener("keyup",this.setFieldValueViaKeyboard.bind(this)),t.querySelectorAll("button[value]").forEach(e=>{e.addEventListener("click",this.setFieldValueViaButton.bind(this))}),t.querySelector("button.btn-fullscreen").addEventListener("click",(function(e){document.documentElement.requestFullscreen()})),t.querySelector("button.btn-check").addEventListener("click",this.checkGame.bind(this)),this.controls=t.querySelectorAll("button[value]"),this.selectedElement=this.game.indexOf(" ")}getXfromPosition(e){return e%p}getYfromPosition(e){return Math.floor(e/p)}clearSomeFields(e,t){let i,r=!0;do{let t,n;do{t=this.getRandomNumber(0,e.length)}while(" "===e[t]);i=this.replaceAtPosition(this.replaceAtPosition(e,t," "),e.length-t-1," "),n=m(i,0),n.next(),r=!n.next().done}while(r);return t>0?this.clearSomeFields(i,t-2):e}generateElement(e,t){let i=document.createElement("div");return e=e.trim(),i.setAttribute("data-field-index",t.toString()),""!==e?i.setAttribute("data-readonly","true"):(i.setAttribute("tabindex","0"),i.addEventListener("focus",this.selectField.bind(this))),i.classList.add("input-container"),i}checkGame(){this.solution.split("").forEach((e,t)=>{let i=this.elements[t],r=i.innerHTML;r!==e&&" "!==r?i.classList.add("errored"):i.classList.remove("errored")})}drawGame(){this.game.split("").forEach((e,t)=>{let i=this.elements[t];i.innerHTML!==e&&(i.innerHTML=e)})}occurresOnce(e,t){return 1===(t.match(new RegExp(e,"g"))||"").length}selectField(e){let t=e.target;if(void 0!==this.selectedElement){this.elements[this.selectedElement].classList.remove("selected")}t.classList.add("selected"),this.selectedElement=parseInt(t.getAttribute("data-field-index"),10),this.highlightFields()}highlightFields(){let e=this.game[this.selectedElement];this.elements.forEach(e=>{e.classList.remove("highlighted")})," "!==e&&this.game.split("").forEach((t,i)=>{t===e&&this.elements[i].classList.add("highlighted")})}updateControls(){this.controls.forEach(e=>{let t=e.value;this.game.split(t).length-1==9?(e.classList.remove("btn-outline-info"),e.classList.add("btn-outline-light")):(e.classList.remove("btn-outline-light"),e.classList.add("btn-outline-info"))})}setFieldValue(e){if(void 0===this.selectedElement)return;let t=this.elements[this.selectedElement],i=this.selectedElement,r=!1,l=this.getXfromPosition(i),a=this.getYfromPosition(i);this.game[i]===e&&(e=" "),this.game=this.replaceAtPosition(this.game,i,e)," "!==e?(t.classList.add("filled"),this.occurresOnce(e,s(this.game,l))||(t.classList.add("errored"),r=!0),this.occurresOnce(e,n(this.game,a))||(t.classList.add("errored"),r=!0),this.occurresOnce(e,o(this.game,l,a))||(t.classList.add("errored"),r=!0)):t.classList.remove("filled"),!1===r&&(console.log(r),t.classList.remove("errored")),this.highlightFields(),this.updateControls(),this.drawGame()}setFieldValueViaKeyboard(e){if(y.indexOf(e.key)>=0||"Backspace"===e.key){let t="Backspace"===e.key?" ":e.key;this.setFieldValue(t)}}setFieldValueViaButton(e){let t=e.target.value;this.setFieldValue(t)}randomize(e,t){let i=this.getRandomNumber(0,e.length),r=this.getRandomNumber(1,9);return t?this.randomize(this.replaceAtPosition(e,i,r.toString()),t-1):this.replaceAtPosition(e,0,r.toString())}getRandomNumber(e,t){return Math.floor(Math.random()*t+e)}replaceAtPosition(e,t,i){return e.substring(0,t)+i+e.substring(t+1)}}(document.querySelector(".game"),document.querySelector(".controls")),b()}});