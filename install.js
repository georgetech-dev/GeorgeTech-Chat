(()=>{
 let deferred=null,busy=false,confirmed=false;
 const display=matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)');
 const launched=()=>Boolean(window.ChatAndroid?.available)||display.matches||navigator.standalone===true;
 const sheet=document.createElement('dialog');sheet.id='install-sheet';sheet.className='install-sheet';sheet.setAttribute('aria-labelledby','install-heading');document.body.append(sheet);
 const icon=name=>window.ChatIcons.svg(name);
 function paint(){const installed=launched()||confirmed;document.documentElement.classList.toggle('app-installed',installed);document.querySelectorAll('[data-install]').forEach(button=>{button.hidden=installed;button.disabled=busy;});}
 function guidance(){
  const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),android=/Android/i.test(navigator.userAgent),mac=/Mac/i.test(navigator.platform)&&!ios;
  const steps=ios?['Open the Share menu in your browser.','Choose Add to Home Screen. You may need to scroll down.','Tap Add, then open GeorgeTech Chat from your home screen.']:android?['Open your browser’s menu.','Choose Install app or Add to Home screen.','Confirm, then open GeorgeTech Chat from your home screen.']:mac&&/Safari/.test(navigator.userAgent)&&!/Chrome|Chromium|Edg/.test(navigator.userAgent)?['Open Safari’s File menu.','Choose Add to Dock and confirm.','Open GeorgeTech Chat from your Dock.']:['Open your browser’s menu.','Look for Install GeorgeTech Chat or Install this page as an app.','Confirm to add Chat to your apps.'];
  sheet.innerHTML=`<div class="install-sheet-handle"></div><button type="button" class="icon-button install-close" aria-label="Close installation instructions">${icon('close')}</button><div class="install-app-icon"><img src="/icons/icon-192.png" alt="GeorgeTech Chat"></div><h2 id="install-heading">Install GeorgeTech Chat</h2><p>Your inbox, one tap away.</p><ol>${steps.map((step,i)=>`<li><span>${i+1}</span><p>${step}</p></li>`).join('')}</ol><p class="install-status" role="status">${deferred?'Your browser is ready to install Chat.':ios?'If Add to Home Screen is missing, open this page in Safari.':'If the install option is missing, try Chrome or Edge, or check whether Chat is already installed.'}</p><button type="button" class="primary install-native" ${deferred?'':'hidden'}>${icon('install')}Install app</button><button type="button" class="secondary install-done">Done</button>`;
  sheet.querySelector('.install-close').onclick=()=>sheet.close();sheet.querySelector('.install-done').onclick=()=>sheet.close();sheet.querySelector('.install-native').onclick=promptInstall;
 }
 async function promptInstall(){
  if(busy||launched()||confirmed)return;
  if(!deferred){guidance();if(!sheet.open)sheet.showModal();return;}
  const event=deferred;deferred=null;busy=true;paint();
  try{const result=await event.prompt();const choice=result?.outcome?result:await event.userChoice;
   if(choice?.outcome==='accepted'){if(sheet.open)sheet.querySelector('.install-status').textContent='Installation requested. Follow the browser’s confirmation.';}
   else if(sheet.open){guidance();sheet.querySelector('.install-status').textContent='Installation was cancelled. You can try again from your browser menu.';}
  }catch{guidance();sheet.querySelector('.install-status').textContent='Use your browser menu to install Chat.';if(!sheet.open)sheet.showModal();}
  finally{busy=false;paint();}
 }
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event;paint();if(sheet.open)guidance();});
 window.addEventListener('appinstalled',()=>{confirmed=true;deferred=null;if(sheet.open)sheet.close();paint();});
 display.addEventListener?.('change',paint);
 document.addEventListener('click',event=>{if(event.target.closest('[data-install]'))promptInstall();});
 paint();window.ChatInstall={refresh:paint};
})();
