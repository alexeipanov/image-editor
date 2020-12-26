// import ImageEditor from './editor';
window.addEventListener('load', () => {
  let app = new Vue({
    el: 'section.app',
    data: {
    }
  });

  let editor = new ImageEditor({
    id: 'editor',
    width: 800,
    height: 450
  });

  let tabsCollection = document.querySelectorAll('.tab-area');
  for (let tab of tabsCollection) {
    new Tab(tab);
  }

  let accordsCollection = document.querySelectorAll('.accordion');
  for (let accordion of accordsCollection) {
    new Accordion(accordion);
  }

});

class Tab {
  constructor(element) {
    try {
      this.links = element.querySelectorAll('.tabs a');
      this.tabs = element.querySelectorAll('.tab');
    }
    catch(error) {
      console.log(error);
      return false;
    }
    for (let link of this.links) {
      link.addEventListener('click', event => this.changeTab(event));
    }
    let links = Array.from(this.links);
    let tabs = Array.from(this.tabs);
    if (links.length && tabs.length) {
      links[0].classList.add('active');
      tabs[0].classList.add('active');
    }
  }

  changeTab(event) {
    event.preventDefault();
    let links = Array.from(this.links);
    let tabs = Array.from(this.tabs);
    let currentLink = links.find(link => link.classList.contains('active'));
    if (currentLink) {
      currentLink.classList.remove('active');
    }
    let currentTab = tabs.find((tab) => tab.classList.contains('active'));
    if (currentTab) {
      currentTab.classList.remove('active');
    }
    event.target.classList.add('active');
    tabs[links.indexOf(event.target)].classList.add('active');
  }
}

class Accordion {
  constructor(element) {
    try {
      this.panels = element.querySelectorAll('.panel');
    }
    catch(error) {
      console.log(error);
      return false;
    }
    for (let panel of this.panels) {
      panel.addEventListener('click', event => this.changePanel(event));
    }
    let panels = Array.from(this.panels);
    if (panels.length) {
      panels[0].classList.add('initial');
    }
  }

  changePanel(event) {
    event.preventDefault();
    let targetPanel;
    let panels = Array.from(this.panels);
    let currentPanel = panels.find(panel => panel.classList.contains('active'));
    if (currentPanel) {
      currentPanel.classList.remove('active', 'initial');
    }
    if (event.target.classList.contains('panel')) {
      targetPanel = event.target;
    }
    else {
     targetPanel = event.target.parentElement;
    }
    targetPanel.classList.add('active');
  }
}
