
const getElementById = (id) => document.getElementById(id)
chrome.storage.local.get(['lists', 'post'], CS => {
  console.log(CS);
});


document.querySelector('#createList').addEventListener('click', async () => {
  const { lists } = await chrome.storage.local.get(['lists']);
  const listName = getElementById('add_list').value;
  if (lists) {
    if (lists[listName]) {
      alert("Kindly Enter a Unique List")
    } else {
      chrome.storage.local.set({
       lists: {
         ...lists,
         [listName]: []
        }
      });
  }
  } else {
    chrome.storage.local.set({
      lists: {
        [listName]: []
      }
    })
  }
  setUI();
 
})


document.querySelector('#removeList').addEventListener('click', async () => {
  const { lists } = await chrome.storage.local.get(['lists']);
  const listName = getElementById('lists').value;
  if (lists) {
    if (lists[listName]) {
      console.log(lists);
      delete lists[listName];
      chrome.storage.local.set({
        lists
      })
    } 
  } else {
   alert("No List Selected!");
  }
  setUI();
})
getElementById('save_group').addEventListener('click', async () => {
  const { lists } = await chrome.storage.local.get(['lists']);
  const listName = getElementById('lists').value;
  const groupLink = getElementById('groupLink').value;
  if (lists && listName != '0') {
    if (lists[listName]) {
      lists[listName].push(groupLink.replace('www', 'm'));
      chrome.storage.local.set({
        lists
      })
    } 
  } else {
   alert("No List Selected!");
  }
  setUI();
})

getElementById('savePost').addEventListener('click',() => {
  console.log('CLICKED')
  const postText = getElementById('postText').value;
  chrome.storage.local.set({
    post: postText
  });
})

const setUI = () => {
  chrome.storage.local.get(['post', 'lists'], CS => {
    if (CS.post) {
      getElementById('postText').value = CS.post;
    }
    const groupLists = getElementById('groupLists');
      groupLists.innerHTML = `<option value="0">No List Selected</option>`
      const listNames = getElementById('lists');
      listNames.innerHTML = `<option value="0">No List Selected</option>`
    if (CS.lists) {
      Object.keys(CS.lists).forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.text = item;
        let option2 = document.createElement("option");
        option2.value = item;
        option2.text = item;
        listNames.add(option);
        groupLists.add(option2);

      })
    } 
  })
}

setUI();


getElementById('start').addEventListener('click', async () => {
  const group = getElementById('groupLists').value;
  if (group && group != '0') {

    const { lists } = await chrome.storage.local.get(['lists']);
    if (lists[group].length) {
      const delay = getElementById('delay').value;
      chrome.runtime.sendMessage({
        delay: Number(delay),
        groups: lists[group],
        message: 'POST'
      });
    } else {
      alert("List contains No groups!");
    }
   
  } else {
    alert("No Group Selected!");
  }
})

openTab('home');

