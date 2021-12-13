(window.webpackJsonp_ember_auto_import_=window.webpackJsonp_ember_auto_import_||[]).push([[0],{538:function(e,t,n){e.exports=n(585)},539:function(e,t,n){e.exports=n(583)},541:function(e,t,n){var r=n(560),o={setDelegate:!0},i={_utResetNonOverridableFunctions:function(){o={setDelegate:!0}},functionName:function e(){return e.caller.name},shallowClone:function(e){var t,n,r={},o=i.hasGetterAndSetterMethods(e)
for(var s in e)t=null,n=null,o&&(t=e.__lookupGetter__(s),n=e.__lookupSetter__(s)),t||n?(t&&r.__defineGetter__(s,t),n&&r.__defineSetter__(s,n)):r[s]=e[s]
return r},isDefined:function(e){return void 0!==e},isDefinedNonNull:function(e){return this.isDefined(e)&&null!==e},isDefinedNonNullNonEmpty:function(e){return i.isDefinedNonNull(e)&&!i.isEmptyString(e)&&!i.isEmptyArray(e)&&!i.isEmptyObject(e)},isEmptyString:function(e){return i.isString(e)&&0===e.length},isEmptyArray:function(e){return i.isArray(e)&&0===e.length},isEmptyObject:function(e){return i.isObject(e)&&0===Object.keys(e).length},isFunction:function(e){return"function"==typeof e},isNumber:function(e){return"number"==typeof e},isInteger:function(e){return i.isNumber(e)&&e%1==0},isString:function(e){return"string"==typeof e||e instanceof String},isElement:function(e){return e&&1==e.nodeType},isArray:function(e){return e&&e.constructor===Array},isObject:function(e){return e&&e.constructor===Object},values:function(e){var t=[]
for(var n in e){var r=e[n]
e.hasOwnProperty(n)&&!i.isFunction(r)&&t.push(r)}return t},keys:function(e){var t=[]
for(var n in e)e.hasOwnProperty(n)&&!i.isFunction(e[n])&&t.push(n)
return t},hasAnyKeys:function(e){for(var t in e)if(e.hasOwnProperty(t))return!0},hasAnyNonNullKeys:function(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!0},hasGetterAndSetterMethods:function(e){return i.isObject(e)&&i.isFunction(e.__lookupGetter__)&&i.isFunction(e.__lookupSetter__)&&i.isFunction(e.__defineGetter__)&&i.isFunction(e.__defineSetter__)},methods:function(e){var t=[]
for(var n in e){var r=e[n]
e.hasOwnProperty(n)&&i.isFunction(r)&&t.push(r)}return t},invert:function(e){var t={}
for(var n in e)e.hasOwnProperty(n)&&!i.isFunction(e[n])&&(t[e[n]]=n)
return t},extend:function(e){var t=[!0,!0,!0].concat(Array.prototype.slice.call(arguments))
return this.copyKeysAndValues.apply(this,t)},copyKeysAndValues:function(e,t,n,r){for(var o,s,a,u,c=n&&r||{},l=3;l<arguments.length;l++)for(var f in o=arguments[l],s=i.hasGetterAndSetterMethods(o),o)if(a=null,u=null,s&&(a=o.__lookupGetter__(f),u=o.__lookupSetter__(f)),a||u)a&&c.__defineGetter__(f,a),u&&c.__defineSetter__(f,u)
else if(Object.prototype.hasOwnProperty.call(o,f)){var p=o[f];(e||null!=p)&&(t||"function"!=typeof p)&&(c[f]=p)}return c},addNonOverrideableFunctions:function(e){for(var t=0;t<e.length;t++){var n=e[t]
o[n]=!0}},attachDelegate:function(e,t){var n=!1
if(e&&t&&e!==t){r.storeDelegateInfo(e,t)
var s={}
Object.keys(t).forEach((function(t){e[t]||(s[t]=!0)})),i.extend(s,o),n=i.attachMethods(e,t,null,s)}return n},attachMethods:function(e,t,n,r){var o=!1
if(e&&t){r=r||{},n=n||t
var i=function(e,t,n,r){var o=function(){return n[r].apply(e,arguments)}
return t&&(o.origFunction=t),o}
for(var s in t)if(!(s in r)&&t[s]&&"function"==typeof t[s]){var a=e[s],u=a&&"function"==typeof a?a.bind(e):null
e[s]=i(n,u,t,s),o=!0}}return o},setDelegates:function(e,t){var n={}
for(var r in e)t[r]&&i.isFunction(e[r].setDelegate)&&(n[r]=e[r].setDelegate(t[r]))
return n},copyDelegatedFunctions:function(e,t){var n=null
if(e&&t&&t.setDelegate){var r,o={}
for(r in e)i.isFunction(e[r])&&e[r].origFunction&&(o[r]=e[r])
n=t.setDelegate(o)}return n}}
e.exports=i},544:function(e,t,n){e.exports=n(595)},548:function(e,t,n){e.exports=n(606)},559:function(e,t,n){var r=n(541),o={deResNumber:function(e,t,n){var o=void 0
if(r.isDefined(e))if(r.isDefined(t)||(t=1048576),r.isDefined(n)||(n=2),r.isNumber(e)&&r.isNumber(t)&&t>0&&r.isInteger(n)&&n>=0){var i=Math.pow(10,n)
o=Math[e>0?"floor":"ceil"](e/t/i)*i}else o=NaN
return o}}
e.exports=o},560:function(e,t){var n={},r={},o=function(e){var t={}
return"function"==typeof e.mtName&&"function"==typeof e.mtVersion&&(t.name=e.mtName(),t.version=e.mtVersion()),t},i=function(e){var t
return"function"==typeof e.mtName&&"function"==typeof e.mtVersion&&(t=e.mtName()+e.mtVersion()),t},s={storeDelegateInfo:function(e,t){var s=i(e),a=i(t)
s&&a&&(n[a]||(n[a]=o(t)),n[s]||(n[s]=o(e),r[s]={}),n[s].delegates?r[s][a]||n[s].delegates.push(n[a]):n[s].delegates=[n[a]],r[s][a]=!0)},getStoredDelegateObject:function(e){return n[i(e)]}}
e.exports=s},561:function(e,t){var n={startsWith:function(e,t,n){var r=!1
return e&&t&&(e=e.substr(0,t.length),n&&(e=e.toLowerCase(),t=t.toLowerCase()),r=0===e.indexOf(t)),r},endsWith:function(e,t,n){var r=!1
if(e&&t){n&&(e=e.toLowerCase(),t=t.toLowerCase())
var o=e.length-t.length
r=o>=0&&e.lastIndexOf(t)===o}return r},trim:function(e,t,n){var r=null,o="\t\n\v\f\r             　\u2028\u2029​",i=new RegExp("^["+o+"]+"),s=new RegExp("["+o+"]+$")
if(e)if(n||t&&t!=o||!e.trim){var a=null,u=null,c=null
t&&void 0!==t?(a="["+(t=t.replace(/([.?*+^$[\]\\(){}-])/g,"\\$1"))+"]",u=new RegExp("^"+a+"+"),c=new RegExp(a+"+$")):(a=o,u=i,c=s),r=e.replace(u,"").replace(c,"")}else r=e.trim()
return r},snakeCaseToCamelCase:function(e,t){var n=""
if(e)for(var r,o=e.toLowerCase().split("_"),i=0;i<o.length;i++)r=o[i][0],(0!==i||t)&&(r=r.toUpperCase()),n+=r+o[i].slice(1)
return n},snakeCaseToUpperCamelCase:function(e){return n.snakeCaseToCamelCase(e,!0)},paramString:function(e){var t="",n="",r=!0
for(var o in e){var i=e[o];(i||0===i||!1===i)&&(t+=n+o+"="+encodeURIComponent(i),r&&(n="&",r=!1))}return t},versionStringFromUserAgent:function(e,t){var n=null
t=t||"\\S+"
var r=new RegExp("\\b"+t+"/(\\S+)\\b","i").exec(e)
return r&&r[1]&&(n=r[1]),n},requestId:function(e){var t=Date.now(),n=Math.floor(1e5*Math.random())
return e+"z"+(t=t.toString(36).toUpperCase())+"z"+n.toString(36).toUpperCase()},uuid:function(e){for(var t,r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",o="",i=0,s=r.length;i<s;i++)o+="x"===(t=r.charAt(i))?n.randomHexCharacter(e):"y"===t?n.randomHexCharacter(e,"8","b"):t
return o},randomHexCharacter:function(e,t,r){var o,i=window.crypto||window.msCrypto
return o=e?(16*e()|0).toString(16):i&&i.getRandomValues?(15&i.getRandomValues(new Uint8Array(1))[0]).toString(16):i&&i.randomBytes?i.randomBytes(1).toString("hex")[0]:(16*Math.random()|0).toString(16),t&&r&&(o<t||o>r)&&(o=n.randomHexCharacter(e,t,r)),o},weakUUID:function(){return n.uuid()},convertNumberToBaseAlphabet:function(e,t){var n="",r=t.length
if(r<=36)n=e.toString(r).toUpperCase()
else{for(var o,i,s=[];e>0;)o=e%r,i=t.charAt(o),s.push(i),e=(e-o)/r
n=s.reverse().join("")}return""===n&&(n="0"),n},cryptoRandomBase62String:function(e){var t
if(16777215==Math.floor(4294967295/256)){var r,o,i,s,a,u=window.crypto||window.msCrypto
if(u&&u.getRandomValues)r=u.getRandomValues(new Uint32Array(16/Uint32Array.BYTES_PER_ELEMENT)),a=!0
else if(u&&u.randomBytes){var c=u.randomBytes(16)
r=new Uint32Array(c.buffer,c.byteOffset,c.byteLength/Uint32Array.BYTES_PER_ELEMENT),a=!0}else for(r=new Uint32Array(16/Uint32Array.BYTES_PER_ELEMENT),o=0;o<r.length;o++)r[o]=Math.floor(Math.random()*Math.floor(4294967295))
if(r){for(t="",o=0;o<r.length;o++)for(s=r[o],i=0;i<6;i++)t+=n.base62Alphabet[s%62],s=Math.floor(s/62)
e&&(t="1_"+(a?"1":"2")+"_"+t)}}return t},base10Alphabet:"0123456789"}
n.base16Alphabet=n.base10Alphabet+"ABCDEF",n.base36Alphabet=n.base10Alphabet+"ABCDEFGHIJKLMNOPQRSTUVWXYZ",n.base61Alphabet=n.base36Alphabet+"abcdefghijklmnopqrstuvwxy",n.base62Alphabet=n.base61Alphabet+"z",e.exports=n},562:function(e,t,n){var r=n(541),o={_valueForKeyPath:function(e,t,n){var r=t
if(e&&t)for(var o=e.split("."),i=0;r&&i<o.length;i++){var s=o[i]
s in r||!n||(r[s]={}),r=s in r?r[s]:null}return r},valueForKeyPath:function(e){var t=null
if(e&&arguments.length>1)for(var n=this.sourcesArray(Array.prototype.slice.call(arguments,1)),o=n.length-1;o>=0;o--){var i=n[o]
if(t=this._valueForKeyPath(e,i),r.isDefinedNonNull(t))break}return t},createObjectAtKeyPath:function(e,t){return this._valueForKeyPath(e,t,!0)},sourcesArray:function(e){var t=[],n=[]
n=n.concat(e),arguments&&arguments.length>1&&(n=n.concat(Array.prototype.slice.call(arguments,1)))
for(var r=0;r<n.length;r++){var o=n[r]
t=t.concat(o)}return t}}
e.exports=o},563:function(e,t,n){var r=n(538),o={flagArguments:{INCLUDE_CALL_STACK:new function(){},MIRROR_TO_SERVER:new function(){},SUPPRESS_CLIENT_OUTPUT:new function(){}},setDelegate:function(e){return r.reflect.attachDelegate(this,e)},execute:function(e,t,n){var r=e.levelStringToIntMap[t]
if(e.level()!==e.NONE&&e.level()<=r){var i=Array.prototype.slice.call(n),s=o.nonFlagLogArguments(i),a=o.logOptions(e,r,i),u=a.includeCallStack?(new Error).stack:null,c=u?s.concat("\n"+u):s
if(e[t]._lastLog=c,a.mirrorToServer&&o.sendToServer(e,t,s,u),a.throwInsteadOfPrint)throw new Error(s.toString())
a.suppressClientOutput||(console[t]?console[t].apply(console,c):console.log.apply(console,c))}},isFlagObject:function(e){return e&&e===o.flagArguments[e.constructor.name]},nonFlagLogArguments:function(e){return e.filter((function(e){return!o.isFlagObject(e)}))},logOptions:function(e,t,n){var i,s={}
return n.forEach((function(e){o.isFlagObject(e)&&(i=r.string.snakeCaseToCamelCase(e.constructor.name),s[i]=!0)})),r.reflect.isFunction(e.mirrorToServerLevel)&&e.mirrorToServerLevel()!==e.NONE&&e.mirrorToServerLevel()<=t&&(s.mirrorToServer=!0),e.throwLevel()!==e.NONE&&e.throwLevel()<=t&&(s.throwInsteadOfPrint=!0),s},sendToServer:function(e,t,n,r){}}
e.exports=o},570:function(e,t,n){e.exports=n(605)},571:function(e,t,n){var r=n(538),o={setDelegate:function(e){return r.reflect.attachDelegate(this,e)},globalScope:function(){return window}}
e.exports=o},572:function(e,t,n){var r=n(538),o=r.reflect,i=n(539),s=n(571),a=n(573),u=n(574),c=n(575).SEND_METHOD,l={DEFAULT_REQUEST_TIMEOUT:1e4,EVENTS_KEY:"events",EVENT_DELIVERY_VERSION:"1.0",MAX_PERSISTENT_QUEUE_SIZE:100,RETRY_EXPONENT_BASE:2,SEND_METHOD:c,URL_DELIVERY_VERSION:2,eventQueues:{},postIntervalEnabled:!0,enqueueEvent:function(e,t){var n=null
if(e&&t){l.eventQueues=l.eventQueues||{},l.eventQueues[e]=l.eventQueues[e]||{},l.eventQueues[e][l.EVENTS_KEY]=l.eventQueues[e][l.EVENTS_KEY]||[],l.eventQueues[e][l.EVENTS_KEY].push(t),n=t
var r=i.value("maxPersistentQueueSize",e)||l.MAX_PERSISTENT_QUEUE_SIZE
l.trimEventQueues(l.eventQueues,r)}return n},trimEventQueues:function(e,t){var n=Object.keys(e)
n.length&&n.forEach((function(n){var r=e[n][l.EVENTS_KEY]
r&&r.length&&r.length>t&&(a.warn("eventQueue overflow, deleting LRU events: size is: "+r.length+" which is over max size: "+t),e[n][l.EVENTS_KEY]=r.slice(-t))}))},resetTopicQueue:function(e){l.eventQueues[e]&&(l.eventQueues[e][l.EVENTS_KEY]=null)},resetTopicRetryAttempts:function(e){l.eventQueues[e]&&(l.eventQueues[e].retryAttempts=0)},scheduleNextTopicRetryAttempt:function(e){if(l.eventQueues[e]&&this.postIntervalEnabled){l.eventQueues[e].retryAttempts=l.eventQueues[e].retryAttempts||0,l.eventQueues[e].retryAttempts++
var t=Math.pow(l.RETRY_EXPONENT_BASE,l.eventQueues[e].retryAttempts)*i.value("postFrequency",e)
l.resetTopicPostInterval(e),l.setTopicPostInterval(e,t)}},sendEvents:function(e,t){for(var n in l.eventQueues)l.sendEventsForTopic(n,e,t)},sendEventsForTopic:function(e,t,n){var o=l.eventQueues[e],s=i.value("testExponentialBackoff",e),a=i.value("metricsUrl",e),u=r.config.disabled.call(i)
if(o&&a&&!u&&!s&&(!o.retryAttempts||!n))switch(l.resetTopicPostInterval(e),l.setTopicPostInterval(e,i.value("postFrequency",e)),t){case l.SEND_METHOD.IMAGE:l.sendEventsViaImage(e)
break
case l.SEND_METHOD.AJAX_SYNCHRONOUS:l.sendEventsViaAjax(e,!1)
break
case l.SEND_METHOD.AJAX:default:l.sendEventsViaAjax(e,!0)}s&&l.scheduleNextTopicRetryAttempt(e)},sendEventsViaImage:function(e){if(l.eventQueues[e]){var t=l.metricsUrlForTopic(e),n=-1==t.indexOf("?")?"?":"&",r=t+n+"responseType=image",o=l.eventQueues[e][l.EVENTS_KEY]
o&&o.length&&o.forEach((function(e){var t=l.createQueryParams(e)
if(t){var n=r+"&"+t;(new Image).src=n}})),l.resetTopicQueue(e)}},createQueryParams:function(e){var t,n,r=""
return Object.keys(e).forEach((function(i,s,a){t=e[i],n=o.isString(t)?t:JSON.stringify(t),r+=i+"="+encodeURIComponent(n),s<a.length-1&&(r+="&")})),r.length?r:null},sendEventsViaAjax:function(e,t){if(l.eventQueues[e]&&l.eventQueues[e][l.EVENTS_KEY]){var n=l.enrichAndSerializeEvents(l.eventQueues[e][l.EVENTS_KEY])
if(n){var r=l.metricsUrlForTopic(e),o=function(){l.resetTopicQueue(e),l.resetTopicRetryAttempts(e)},s=i.value("requestTimeout",e)||l.DEFAULT_REQUEST_TIMEOUT
s=Math.min(s,i.value("postFrequency",e)),u.makeAjaxRequest(r,"POST",n,o,(function(t,n){n>=400&&n<500?o():l.scheduleNextTopicRetryAttempt(e)}),{async:t,timeout:s})}}},enrichAndSerializeEvents:function(e){var t=null
if(e&&e.length){var n={}
n.deliveryVersion=l.EVENT_DELIVERY_VERSION,n.postTime=Date.now(),n[l.EVENTS_KEY]=e
try{t=JSON.stringify(n)}catch(e){a.error("Error stringifying events as JSON: "+e)}}return t},metricsUrlForTopic:function(e){return i.value("metricsUrl",e)+"/"+l.URL_DELIVERY_VERSION+"/"+e},setTopicPostInterval:function(e,t){l.eventQueues[e]&&t&&this.postIntervalEnabled&&(this.resetTopicPostInterval(e),l.eventQueues[e].postIntervalToken=s.globalScope().setInterval((function(){a.debug("MetricsKit: triggering postIntervalTimer for "+e+" at "+(new Date).toString()),l.sendEventsForTopic.call(l,e)}),t))},resetTopicPostInterval:function(e){l.eventQueues[e]&&(s.globalScope().clearInterval(l.eventQueues[e].postIntervalToken),l.eventQueues[e].postIntervalToken=null)},resetQueuePostIntervals:function(){for(var e in l.eventQueues)l.resetTopicPostInterval(e)},setQueuePostIntervals:function(){for(var e in l.eventQueues){var t=l.eventQueues[e][l.EVENTS_KEY]
t&&t.length&&l.setTopicPostInterval(e,i.value("postFrequency",e))}}},f={_objectContainsValue:function(e,t){var n=!1
for(var r in e){var i=e[r]
if(e.hasOwnProperty(r)&&!o.isFunction(i)&&i===t){n=!0
break}}return n},_utQueue:function(){return l},setPostIntervalEnabled:function(e){l.postIntervalEnabled=e,e?l.setQueuePostIntervals():l.resetQueuePostIntervals()},recordEvent:function(e,t,n){r.config.disabled.call(i)||(0===i.value("postFrequency",e)&&(n=!0),l.enqueueEvent(e,t),n?l.sendEvents(l.SEND_METHOD.AJAX,!0):!l.eventQueues[e].postIntervalToken&&l.postIntervalEnabled&&l.setTopicPostInterval(e,i.value("postFrequency",e)))},flushUnreportedEvents:function(e,t){var n
e?o.isString(t)&&this._objectContainsValue(c,t)?l.sendEvents(t,!0):(n=navigator.userAgent,/iPad|iPhone|iPod/.test(n)&&-1==n.indexOf("IEMobile")?l.sendEvents(l.SEND_METHOD.AJAX_SYNCHRONOUS,!0):l.sendEvents(l.SEND_METHOD.IMAGE,!0)):l.sendEvents(l.SEND_METHOD.AJAX,!0)}}
e.exports=f},573:function(e,t,n){var r=n(544).loggerNamed("mt-event-queue")
e.exports=r},574:function(e,t,n){var r=n(538),o={setDelegate:function(e){return r.reflect.attachDelegate(this,e)},makeAjaxRequest:r.network.makeAjaxRequest}
e.exports=o},575:function(e,t){e.exports={SEND_METHOD:{AJAX:"ajax",AJAX_SYNCHRONOUS:"ajaxSynchronous",IMAGE:"image"}}},583:function(e,t,n){var r=n(584)
e.exports=r},584:function(e,t,n){var r=n(538),o=n(593),i=n(594),s=n(597),a={blacklistedFields:["capacitySystem","capacitySystemAvailable","capacityDisk","capacityData","capacityDataAvailable"],compoundSeparator:"_",configBaseUrl:"https://xp.apple.com/config/1/report",constraints:{profiles:{AMPWeb:{precedenceOrderedRules:[{filters:"any",fieldConstraints:{clientId:{generateValue:!0,namespace:"AMPWeb_isSignedOut",expirationPeriod:864e5}}},{filters:{valueMatches:{isSignedIn:[!0]}},fieldConstraints:{clientId:{generateValue:!0,namespace:"AMPWeb_isSignedIn",expirationPeriod:15552e6}}}]},strict:{precedenceOrderedRules:[{filters:"any",fieldConstraints:{clientId:{generateValue:!0,scopeFieldName:"parentPageUrl",scopeStrategy:"mainDomain",expirationPeriod:864e5},consumerId:{blacklisted:!0},dsId:{blacklisted:!0},parentPageUrl:{scope:"hostname"}}},{filters:{valueMatches:{eventType:["click"],actionType:["signUp"]}},fieldConstraints:{parentPageUrl:{scope:"fullWithoutParams"}}},{filters:{valueMatches:{eventType:["dialog"],dialogType:["upsell"],result:["upsell"]}},fieldConstraints:{parentPageUrl:{scope:"fullWithoutParams"}}},{filters:{valueMatches:{userType:["signedIn"]}},fieldConstraints:{clientId:{scopeStrategy:"all"}}},{filters:{valueMatches:{userType:["signedIn"],eventType:["click","dialog","media","search"]}},fieldConstraints:{clientId:{blacklisted:!0},consumerId:{blacklisted:!1},dsId:{blacklisted:!1}}},{filters:{valueMatches:{userType:["signedIn"],eventType:["page","impressions"]},nonEmptyFields:["pageHistory"]},fieldConstraints:{clientId:{blacklisted:!0},consumerId:{blacklisted:!1},dsId:{blacklisted:!1}}}]}}},fieldsMap:{cookies:["itcCt","itscc"],custom:{impressions:["id","adamId","link.type","station-hash"],location:["id","adamId","dataSetId","name","fcKind","kindIds","type","link.type","station-hash","core-seed-name"]},single:{targetId:["id","adamId","contentId","type","link.type","fcId","userPreference","label","station-hash","linkIdentifier"]}},metricsUrl:"https://xp.apple.com/report",postFrequency:6e4,postFrequencyLowLatency:5e3,tokenSeparator:"|"},u={},c=function(e,t,n){if(n){e.push(n)
var o=n[t]
o&&r.reflect.hasAnyKeys(o)&&e.push(o)}},l=function(e){this._topic=e,this._debugSource=null,this._cachedSource=null,this._serviceSource=null,this._initCalled=!1,this._initialized=!1,this._showedDebugWarning=!1,this._showedNoProvidedSourceWarning=!1,this._keyPathsThatSuppressWarning={configBaseUrl:!0},this.DEBUG_SOURCE_KEY="mtClientConfig_debugSource"+a.compoundSeparator+this._topic,this.CACHED_SOURCE_KEY="mtClientConfig_cachedSource"+a.compoundSeparator+this._topic}
l.createConfig=function(e,t,n,r){var o=l.getConfig(e)
return e&&"noTopicConfig"!==e&&!o._initCalled&&o.init(t,n,r),o},l.getConfig=function(e){var t=u[e=e||"noTopicConfig"]
return t||(t=new l(e),u[e]=t),t},l.cleanupConfig=function(e){if(e&&u[e]){var t=u[e]
t.setCachedSource(),t.setDebugSource(),delete u[e]}},l.defaultConfig=function(){return l.getConfig()},l.value=function(e,t){var n=t&&u[t]||l.defaultConfig()
return n.value.call(n,e)},l.environment=o,l.logger=i,l.network=s,l.prototype._defaults=function(){return a},l.prototype._setInitialized=function(e){this._initialized=e},l.prototype._setInitCalled=function(e){this._initCalled=e},l.prototype._setShowedDebugWarning=function(e){this._showedDebugWarning=e},l.prototype._setShowedNoProvidedSourceWarning=function(e){this._showedNoProvidedSourceWarning=e},l.prototype.setDelegate=function(e){return r.reflect.attachDelegate(this,e)},l.prototype.topic=function(){return this._topic},l.prototype.configHostname=function(){},l.prototype.configUrl=function(){var e,t=this.configHostname()
return e=t?"https://"+t+"/config/1/report":this.value("configBaseUrl"),"noTopicConfig"!==this._topic?e+="/"+this.topic():l.logger.error("config.configUrl(): Topic must be provided"),e},l.prototype.sources=function(){},l.prototype.value=function(e){var t,n=this.cachedSource(),o=this.serviceSource(),i=this.sources(),s=this.debugSource(),u=n||o||i||s
return i||o||e in this._keyPathsThatSuppressWarning||this._showedNoProvidedSourceWarning||(this._showedNoProvidedSourceWarning=!0,l.logger.warn("Metrics config: No config provided via delegate or fetched via init(), using default/cached config values.")),s&&(this._showedDebugWarning||(this._showedDebugWarning=!0,l.logger.warn('"debugSource" found.\nThis will override any same-named client-supplied configSource fields.\nThis setting "sticks" across session, use "setDebugSource(null)" to clear'))),r.reflect.isArray(i)||(i=[i]),t=0===e.indexOf("blacklisted")?u?[n,o,i,s]:[a]:[a,n,o,i,s],t=this.configSourcesWithOverrides(t,this.topic()),r.keyValue.valueForKeyPath.apply(r.keyValue,[e].concat(t))},l.prototype.configSourcesWithOverrides=function(e,t){var n=e
if(e&&e.length&&t){n=[]
for(var o=0;o<e.length;o++){var i=e[o]
if(i)if(r.reflect.isArray(i)&&i.length){for(var s=[],a=0;a<i.length;a++)c(s,t,i[a])
n.push(s)}else c(n,t,i)}}return n},l.prototype.setDebugSource=function(e){return this._debugSource=e||null,r.storage.saveObjectToStorage(l.environment.localStorageObject(),this.DEBUG_SOURCE_KEY,this._debugSource)},l.prototype.debugSource=function(){return this._debugSource||(this._debugSource=r.storage.objectFromStorage(l.environment.localStorageObject(),this.DEBUG_SOURCE_KEY)),this._debugSource},l.prototype.setCachedSource=function(e){return this._cachedSource=e||null,r.storage.saveObjectToStorage(l.environment.localStorageObject(),this.CACHED_SOURCE_KEY,this._cachedSource)},l.prototype.cachedSource=function(){return this._cachedSource||(this._cachedSource=r.storage.objectFromStorage(l.environment.localStorageObject(),this.CACHED_SOURCE_KEY)),this._cachedSource},l.prototype.setServiceSource=function(e){return this._serviceSource=e,this._serviceSource},l.prototype.serviceSource=function(){return this._serviceSource},l.prototype.fetchConfig=function(e,t,n){n=n||function(){},r.backoff.exponentialBackoff(s.makeAjaxRequest.bind(s,e,"GET",null),(function(e){var r
try{e=JSON.parse(e),r=!0}catch(e){n.call(n,e)}r&&t&&t.call(t,e)}),n)},l.prototype.init=function(e,t,n){if(!this._initCalled){this._initCalled=!0,t=t||function(){}
var r=function(){this._initialized=!0,t.call(t)}.bind(this)
if(e)this.setDelegate({sources:e}),r()
else{this.setCachedSource(this.cachedSource())
var o=this.configUrl(),i=function(e){this.setCachedSource(e),this.setServiceSource(e),r()}.bind(this)
this.fetchConfig(o,i,n)}}},l.prototype.initialize=function(e,t,n){return this.init.apply(this,Array.prototype.slice.call(arguments))},l.prototype.initialized=function(){return this._initialized},e.exports=l},585:function(e,t,n){var r={}
r.backoff=n(586),r.config=n(587),r.cookies=n(588),r.delegatesInfo=n(560),r.eventFields=n(589),r.keyValue=n(562),r.network=n(590),r.number=n(559),r.reflect=n(541),r.sampling=n(591),r.storage=n(592),r.string=n(561),r.optionValueFromStoreFrontHeader=function(e,t){for(var n=null,o="string"==typeof e?e.split(" "):[],i=r.string.endsWith(t,":")?t:t+":",s=0;!n&&s<o.length;++s)0===o[s].search(i)&&(n=o[s].slice(i.length))
return n},e.exports=r},586:function(e,t){var n=1500,r=100,o=2,i=function(e,t,i){this.delay=e||r,this.maxWait="number"==typeof t?t:n,this.factor=i||o,this.timeWaited=0}
i.prototype.nextDelay=function(){var e=null,t=this.maxWait-this.timeWaited
return t>0&&(this.delay=Math.min(this.delay,t),this.timeWaited+=this.delay),(0===this.maxWait||t>0)&&(e=this.delay,this.delay=this.delay*this.factor),e}
var s={_backoff:function(e,t,n,r){t.call(t,n,(function(){var o=e.nextDelay()
o?setTimeout(s._backoff.bind(s,e,t,n,r),o):r.apply(r,arguments)}))},exponentialBackoff:function(e,t,n,r,o,a){var u=new i(r,o,a)
s._backoff(u,e,t,n)}}
e.exports=s},587:function(e,t,n){var r=n(559),o=(n(541),{disabled:function(e){return!!this.value("disabled",e)},blacklistedEvents:function(e){return this.value("blacklistedEvents",e)||[]},blacklistedFields:function(e){return this.value("blacklistedFields",e)||[]},removeBlacklistedFields:function(e,t){if(e)for(var n=o.blacklistedFields.call(this,t),r=0;r<n.length;r++){var i=n[r]
i&&i in e&&delete e[i]}return e},metricsDisabledOrBlacklistedEvent:function(e,t){return o.disabled.call(this,t)||!!e&&o.blacklistedEvents.call(this,t).indexOf(e)>-1},deResFields:function(e){return this.value("deResFields",e)||[]},applyDeRes:function(e,t){var n
return e&&o.deResFields.call(this,t).forEach((function(t){(n=t.fieldName)in e&&(e[n]=r.deResNumber(e[n],t.magnitude,t.significantDigits))})),e}})
e.exports=o},588:function(e,t,n){var r=n(561),o=n(541),i={setDelegate:function(e){return o.attachDelegate(this,e)},cookie:function(){var e
return"undefined"!=typeof window&&"iTunes"in window&&"cookie"in iTunes?e=iTunes:"undefined"!=typeof itms&&void 0!==itms.cookie?e=itms:"undefined"!=typeof document&&(e=document),e?e.cookie:void 0},cookieOwnerObject:function(){if("undefined"!=typeof window&&"iTunes"in window&&"cookie"in iTunes)return iTunes
if("undefined"!=typeof itms&&void 0!==itms.cookie)return itms
if("undefined"!=typeof document)return document
throw"cookies.cookieOwnerObject: No owning object"},get:function(e){var t=this.getUnescaped(e)
return t&&(t=unescape(t)),t},getUnescaped:function(e){var t=null,n=this._getRaw()
if(n&&e)for(var o=n.split(";"),i=o.length-1;!t&&i>=0;i--){var s=o[i],a=s.indexOf("=")
a>0&&(a+1==s.length?t="":r.trim(s.substring(0,a))==e&&(t=r.trim(s.substring(a+1))))}return t},remove:function(e,t){return this.setUnescaped(e,".",this.EXPIRE_NOW,null,t)},_getRaw:function(){var e=this.cookie()
return o.isString(e)||(e=this.cookieOwnerObject().cookie),e||""},EXPIRE_NOW:-1,EXPIRE_SESSION:null,EXPIRE_ONE_SECOND:1}
i.EXPIRE_ONE_MINUTE=60*i.EXPIRE_ONE_SECOND,i.EXPIRE_ONE_HOUR=60*i.EXPIRE_ONE_MINUTE,i.EXPIRE_ONE_DAY=24*i.EXPIRE_ONE_HOUR,i.EXPIRE_ONE_WEEK=7*i.EXPIRE_ONE_DAY,i.EXPIRE_ONE_MONTH=31*i.EXPIRE_ONE_DAY,i.EXPIRE_ONE_YEAR=365*i.EXPIRE_ONE_DAY,i.EXPIRE_ONE_SIDEREAL_YEAR=365.25*i.EXPIRE_ONE_DAY,i.EXPIRE_SIX_MONTHS=180*i.EXPIRE_ONE_DAY,e.exports=i},589:function(e,t,n){var r=n(562),o=n(541),i={mergeAndCleanEventFields:function(e){for(var t=[!1,!1,!1].concat(Array.prototype.slice.call(arguments)),n=[],r=0;r<t.length;r++){var i=t[r]
if(i&&i.constructor===Array)for(var s=0;s<i.length;s++)n.push(i[s])
else n.push(i)}return o.copyKeysAndValues.apply(this,n)},processMetricsData:function(e,t,n,r){var o=this.mergeAndCleanEventFields(r),i=o
if(e&&t){var s={}
if(n||(t=t.filter((function(e){return e in o}))),t.length)for(var a=0;a<t.length;a++){var u=t[a],c=e[u]
"function"==typeof c&&(s[u]=c.call(e,o))}i=this.mergeAndCleanEventFields(i,s)}return i},applyFieldsMap:function(e,t,n,i){var s,a,u
if(e&&t&&n){var c,l
if(a={},s=r.valueForKeyPath(t,n,n.custom))if(o.isArray(s))for(c=0;c<s.length;++c)l=e[s[c]],o.isDefinedNonNull(l)&&(a[s[c]]=l)
else if("object"==typeof s){for(var f in s)for(c=0;c<s[f].length;++c)if(l=r.valueForKeyPath(s[f][c],e),o.isDefinedNonNull(l)){a[f]=l
break}}else u="metrics: incorrect data type provided to applyFieldsMap (only accepts objects and Arrays)"
else u="metrics: unable to get "+t+" section from fieldsMap"}else{var p=[]
e||p.push("data"),t||p.push("sectionName"),n||p.push("fieldsMap"),u="metrics: missing argument(s): "+p.join(",")+" not provided to applyFieldsMap"}return u&&o.isFunction(i)&&i(u),a}}
e.exports=i},590:function(e,t,n){var r=n(541),o={makeAjaxGetRequest:function(e,t,n){this.makeAjaxRequest(e,"GET",null,t,n)},makeAjaxRequest:function(e,t,n,o,i,s){var a=new XMLHttpRequest
n=n||void 0,s=s||{},o=r.isFunction(o)?o:function(){},i=r.isFunction(i)?i:function(){}
var u=!1!==s.async
s.timeout&&u&&(a.timeout=s.timeout),a.onload=function(){a.status>=200&&a.status<300?o(a.response):i(new Error("XHR error: server responded with status "+a.status+" "+a.statusText),a.status)},a.onerror=function(){i(new Error("XHR error"))},a.open(t,e,u),a.withCredentials=!0,a.setRequestHeader("Content-type","application/json"),a.send(n)}}
e.exports=o},591:function(e,t){var n={},r=function(e){n[e]&&(clearTimeout(n[e]),n[e]=null)},o={_utClearSessions:function(){for(var e in n)r(e)},lottery:function(e){return Math.random()<e},sessionSampled:function(e,t,i){var s
if(n[e])s=!0
else{var a=o.lottery(t)
a&&i>0&&(n[e]=setTimeout(r.bind(null,e),i)),s=a}return s},isSampledIn:function(e,t,n,r,i){return t||o.sessionSampled(e,n,r)||o.lottery(i)}}
e.exports=o},592:function(e,t){var n="localStorage",r="sessionStorage",o=function(e){var t=null,n=!1
return function(){return e?t=e:(n||(console.error("storageObject: storage object not found. Override this function if there is a platform-specific implementation"),n=!0),t||(t={storage:{},getItem:function(e){return this.storage[e]},setItem:function(e,t){this.storage[e]=t},removeItem:function(e){delete this.storage[e]}})),t}}
function i(e){var t=null,r=e===n
try{t="undefined"!=(r?typeof localStorage:typeof sessionStorage)?r?localStorage:sessionStorage:null}catch(e){t=null,console.error("_utils.storage._defaultStorageObject: Unable to retrieve storage object: "+e)}return t}var s={_utDefaultStorageObject:function(e){return i(e)},localStorageObject:o(i(n)),sessionStorageObject:o(i(r)),saveObjectToStorage:function(e,t,n){var r=null
if(n)try{e.setItem(t,JSON.stringify(n)),r=n}catch(e){}else r=e.removeItem(t)
return r},objectFromStorage:function(e,t){var n=null,r=e.getItem(t)
if(r)try{n=JSON.parse(r)}catch(e){n=void 0}return n}}
e.exports=s},593:function(e,t,n){var r=n(538),o={setDelegate:function(e){return r.reflect.attachDelegate(this,e)},localStorageObject:r.storage.localStorageObject,sessionStorageObject:r.storage.sessionStorageObject}
e.exports=o},594:function(e,t,n){var r=n(544).loggerNamed("mt-client-config")
e.exports=r},595:function(e,t,n){var r=n(596),o=n(563)
r.utils=o,e.exports=r},596:function(e,t,n){var r=n(538),o=n(563),i={MIN_LEVEL:0,NONE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,MAX_LEVEL:4,levelIntToStringMap:{0:"none",1:"debug",2:"info",3:"warn",4:"error"},levelStringToIntMap:{none:0,debug:1,info:2,warn:3,error:4}},s={loggerName:"defaultLogger",level:i.INFO,throwLevel:i.NONE},a={},u=function(e){this._loggerName=e,this._level,this._throwLevel}
u.loggerNamed=function(e){var t=a[e=e||s.loggerName]
return t||(t=new u(e),a[e]=t),t},u.level=function(){return s.level},u.throwLevel=function(){return s.throwLevel},r.reflect.extend(u.prototype,i),r.reflect.extend(u.prototype,o.flagArguments),u.prototype.setDelegate=function(e){return r.reflect.attachDelegate(this,e)},u.prototype.loggerName=function(){return this._loggerName},u.prototype.levelParameterAsInt=function(e){var t,n=null
return r.reflect.isString(e)?t=this.levelStringToIntMap[e.toLowerCase()]:r.reflect.isNumber(e)&&(t=e),t>=this.MIN_LEVEL&&t<=this.MAX_LEVEL&&(n=t),n},u.prototype.setLevel=function(e){var t=this.levelParameterAsInt(e)
null!==t&&(this._level=t)},u.prototype.setThrowLevel=function(e){var t=this.levelParameterAsInt(e)
null!==t&&(this._throwLevel=t)},u.prototype.level=function(){var e=this._level
return r.reflect.isNumber(e)?e:u.level()},u.prototype.levelString=function(){return this.levelIntToStringMap[this.level()]},u.prototype.throwLevel=function(){var e=this._throwLevel
return r.reflect.isNumber(e)?e:u.throwLevel()},u.prototype.debug=function(){o.execute(this,"debug",arguments)},u.prototype.info=function(){o.execute(this,"info",arguments)},u.prototype.warn=function(){o.execute(this,"warn",arguments)},u.prototype.error=function(){o.execute(this,"error",arguments)},u.prototype.lastLog=function(e){return this[e]?this[e]._lastLog:null},e.exports=u},597:function(e,t,n){var r=n(538),o={setDelegate:function(e){return r.reflect.attachDelegate(this,e)},makeAjaxRequest:r.network.makeAjaxRequest}
e.exports=o},605:function(e,t,n){n(548)
var r=n(608),o=n(609)
r.utils.setDelegate(o),e.exports=r},606:function(e,t,n){var r=n(571),o=n(607),i=n(573),s=n(574),a=n(572),u={environment:r,eventRecorder:o,logger:i,network:s,setEventQueuePostIntervalEnabled:function(e){a.setPostIntervalEnabled(e)}}
e.exports=u},607:function(e,t,n){var r=n(538),o=n(539),i=n(572),s={_utResetQueue:function(){for(var e in i._utQueue().eventQueues)i._utQueue().resetTopicPostInterval(e)
i._utQueue().eventQueues={}},SEND_METHOD:n(575).SEND_METHOD,setDelegate:function(e){return r.reflect.attachDelegate(this,e)},recordEvent:function(e,t,n){var s=null
return t&&!r.config.metricsDisabledOrBlacklistedEvent.call(o,t.eventType,e)&&(r.config.removeBlacklistedFields.call(o,t,e),i.recordEvent(e,t,n),s=t),s},flushUnreportedEvents:function(e,t){i.flushUnreportedEvents(e,t)},sendMethod:function(){return"javascript"}}
e.exports=s},608:function(e,t,n){var r=n(538),o=n(544),i={mirrorToServerLevel:o.prototype.NONE,topic:""}
o.setTopic=function(e){i.topic=e},o.topic=function(){return i.topic},o.mirrorToServerLevel=function(){return i.mirrorToServerLevel},o.prototype.setTopic=function(e){this._topic=e},o.prototype.topic=function(){var e=this._topic||o.topic()
return e||console.error("LoggerKit: topic must be set in order to mirror log events to the server. Example: loggerKit.setTopic('my_figaro_topic');"),e},o.prototype.setMirrorToServerLevel=function(e){var t=this.levelParameterAsInt(e)
null!==t&&(this._mirrorToServerLevel=t)},o.prototype.mirrorToServerLevel=function(){var e=this._mirrorToServerLevel
return r.reflect.isNumber(e)?e:o.mirrorToServerLevel()},e.exports=o},609:function(e,t,n){var r=n(538),o=n(544),i=n(548)
o.eventRecorder=i.eventRecorder
var s={eventType:"log",eventVersion:"4"},a={sendToServer:function(e,t,n,i){var a=e.topic(),u=function(e,t,n,o){var i=null,a=n&&n.length
if(t&&(a||o)){if(i={},r.reflect.extend(i,s),i.eventTime=Date.now(),i.level=t,i.loggerName=e.loggerName(),o&&(i.callstack=o),a){try{i.arguments=JSON.stringify(n)}catch(t){e.error("Error stringifying arguments as JSON: "+t)}if("string"==typeof n[0])i.message=n[0]
else if("object"==typeof n[0]&&1===n.length){var u=n[0]
i=r.reflect.extend({},u,i)}}}else console.error("LoggerKit: at least one argument or the INCLUDE_CALL_STACK flag is required in order to mirror to server")
return i}(e,t,n,i),c=null
return a&&u&&(c=o.eventRecorder.recordEvent(a,u)),c}}
e.exports=a}}])
