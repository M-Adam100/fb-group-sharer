// ON INSTALL TASKS
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed")
});


function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}

chrome.runtime.onMessage.addListener(async (request, response) => {
  if (request.message == 'POST') {
    for (let i = 0; i < request.groups.length; i++) {
      const url = request.groups[i];
      chrome.windows.create(
        {
          url,
          focused: true,
          width: 950,
          height: 775,
          type: 'popup'
        },
        (createdWindow) => {
          console.log(createdWindow);

          chrome.storage.local.set({
            windowId: createdWindow.id
          })

          chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            console.log({tabURL: tab.url, url, changeInfo});
            if (
              (tab.url == url ) &&
              changeInfo.status == "complete"
            ) {
              chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ['scripts/post.js']
              }, () => {
                console.log("POST SHARED!")
              })
            }
            });
         
        }
      );

      console.log("Sleep Before Next Group!!");
      console.log( "WAITING FOR ", request.delay * 60 , "SECONDS!!");
      await sleep(request.delay * 60);
    }

  } else if (request.message == 'CLOSE') {
    chrome.storage.local.get(['windowId'], (CS) => {
      if (CS.windowId) {
        chrome.windows.remove(CS.windowId);

      }
    })
  }


})