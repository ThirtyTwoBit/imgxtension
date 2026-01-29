chrome.storage.local.get(['split'], result => {
  const setting = result.split ?? false;
  if (typeof window === 'undefined' || !window.location.href.includes('imgflip.com/m/') || !setting) return;

    // Create image element
    const container = document.createElement('div');
    container.classList.add("base-container")
    container.style.display = 'flex';
    container.style.width = '800px';
    container.style.float = 'left';
    container.style.position = 'relative';

    // create 2nd container
    const left = document.querySelector('#base-left');
    left.style.padding = '0px';
    //left.style.width = '440px';
    const left2 = left.cloneNode(true);

    const page = document.querySelector('#page');
    page.style.width = '1285px';
    page.append(container);
    console.log('appendd container');
    container.append(left);
    container.append(left2);
    left2.id = 'base-left2';

  //remove alternating
  let items = left.querySelectorAll('.base-unit.clearfix'); // elements to remove
  // Loop backwards to avoid index shifting when removing
  for (let i = items.length - 1; i >= 0; i--) {
    if (i % 2 === 1) { // remove alternating items (1,3,5,...)
      items[i].remove();
    }
  }

  //remove alternating
  items = left2.querySelectorAll('.base-unit.clearfix'); // elements to remove
  // Loop backwards to avoid index shifting when removing
  for (let i = items.length - 1; i >= 0; i--) {
    if (i % 2 === 0) { // remove alternating items (1,3,5,...)
      items[i].remove();
    }
  }

  const pager = left.querySelector('.pager');
  page.append(pager);
  pager.style.clear = 'both';
  pager.style.width = '880px';
  pager.style.float = 'left';
  const pager2 = left2.querySelector('.pager');
  pager2.remove();



});
