(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panel = document.querySelector('#demo-panel');
  const content = document.querySelector('#demo-content');
  const status = document.querySelector('#demo-status');
  let muted = false;
  const icon = (name, className = '') => `<svg class="${className}" aria-hidden="true"><use href="#${name}"/></svg>`;
  function render(name) {
    panel.setAttribute('aria-labelledby', `tab-${name}`);
    tabs.forEach(tab => {
      const selected = tab.dataset.scenario === name;
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    });
    status.textContent = 'Preview only. Your real microphone is unchanged.';
    if (name === 'control') {
      muted = false;
      content.innerHTML = `<button class="demo-pill" id="demo-toggle" aria-label="Mute the preview microphone">${icon('mic')}<strong>Mic live</strong><span class="pill-divider"></span><span class="pill-action">Mute</span></button><p class="demo-instruction">Click to mute the preview.</p>`;
      content.querySelector('button').addEventListener('click', event => {
        muted = !muted;
        const button = event.currentTarget;
        button.innerHTML = `${icon(muted ? 'mic-off' : 'mic', muted ? 'red' : '')}<strong>Mic ${muted ? 'muted' : 'live'}</strong><span class="pill-divider"></span><span class="pill-action">${muted ? 'Unmute' : 'Mute'}</span>`;
        button.setAttribute('aria-label', `${muted ? 'Unmute' : 'Mute'} the preview microphone`);
        status.textContent = `Preview mic ${muted ? 'muted' : 'live'}. Your real microphone is unchanged.`;
      });
    } else if (name === 'warning') {
      content.innerHTML = `<div class="warning-mock">${icon('mic-off', 'red')}<div><strong>Mic muted</strong><span>Google Chrome</span></div><button class="mock-button" id="demo-unmute">Unmute</button><button class="demo-dismiss" id="demo-dismiss" aria-label="Dismiss the preview warning">${icon('close')}</button></div><p class="demo-instruction">A small nudge, with a way to act.</p>`;
      content.querySelector('#demo-unmute').addEventListener('click', () => {
        render('control'); status.textContent = 'Preview unmuted. Your real microphone is unchanged.';
        content.querySelector('button').focus();
      });
      content.querySelector('#demo-dismiss').addEventListener('click', () => {
        content.innerHTML = `<p class="demo-instruction">Dismissed for this preview session.</p><button class="demo-pill" id="demo-restore">Show the warning again</button>`;
        status.textContent = 'Preview warning dismissed. Your real microphone is unchanged.';
        const restore = content.querySelector('button'); restore.focus();
        restore.addEventListener('click', () => { render('warning'); content.querySelector('button').focus(); });
      });
    } else {
      content.innerHTML = `<div class="signal-demo"><strong>Microphone level is low</strong><p>Check MacBook Pro Microphone.<br>No usable level for 10 seconds.</p><div class="signal-meter" aria-hidden="true">${'<i></i>'.repeat(20)}</div></div><p class="demo-instruction">Optional monitoring. No audio saved.</p>`;
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => render(tab.dataset.scenario));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); tabs[target].focus(); render(tabs[target].dataset.scenario); }
    });
  });
  render('control');
})();
