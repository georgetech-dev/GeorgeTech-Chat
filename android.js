(()=>{
 const native=window.GeorgeTechNative,pending=new Map();let sequence=0;
 function call(action,args={}){if(!native)return Promise.reject(new Error('Open the Android app to use this setting.'));return new Promise((resolve,reject)=>{const id=String(++sequence),timeout=setTimeout(()=>{pending.delete(id);reject(new Error('The Android app did not respond. Try again.'));},action==='settings'||action==='saveText'?300000:30000);pending.set(id,{resolve,reject,timeout});native.postMessage(JSON.stringify({id,action,args}));});}
 if(native)native.onmessage=event=>{try{const reply=JSON.parse(event.data),request=pending.get(reply.id);if(!request)return;clearTimeout(request.timeout);pending.delete(reply.id);if(reply.error)request.reject(new Error(reply.error));else request.resolve(reply.data);}catch{}};
 window.ChatAndroid={available:Boolean(native),call,back(){
  const open=[...document.querySelectorAll('dialog[open]')].at(-1);if(open){open.close();return true;}
  const section=document.body.classList.contains('editing-settings');if(section){window.ChatSiteSettings.overview?.(document);return true;}
  if(location.hash.startsWith('#conversation=')||location.pathname.endsWith('/settings.html')){if(history.state?.gtChat&&history.state.view==='conversation')history.back();else{history.replaceState({gtChat:true,view:'inbox'},'','/');dispatchEvent(new PopStateEvent('popstate'));}return true;}
  return false;
 }};
})();
