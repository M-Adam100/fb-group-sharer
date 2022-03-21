(async () => {

  const { post } = await chrome.storage.local.get(['post']);


  // OVERALL CLOSE TIME IF WE ARE NOT PART OF THE GROUP
  setTimeout(() => {
    chrome.runtime.sendMessage({
      message: 'CLOSE'
    })
   }, 300000)

  const buttonFoundInterval = setInterval(() => {
    if ( document.querySelector('div[role="button"]')) {
      clearInterval(buttonFoundInterval);
      document.querySelector('div[role="button"]').click();
      const inputFound = setInterval(async () => {
        const input = document.querySelector('[data-sigil^="composer-textarea"]');
        if (input) {
          clearInterval(inputFound);
          input.value = post;
          input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
          setTimeout(() => {
            const button = document.querySelector('button');
            button.click();
          }, 2000);
          setTimeout(() => {
           chrome.runtime.sendMessage({
             message: 'CLOSE'
           })
          }, 5000)
        }
      }, 1000);


    }

  }, 300)
  
 
})();


