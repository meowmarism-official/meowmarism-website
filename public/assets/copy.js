// Copy buttons for install commands: <button class="copybtn" data-copy="id-of-the-pre">
document.querySelectorAll('.copybtn[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const block = document.getElementById(btn.dataset.copy);
    if (!block) return;
    navigator.clipboard?.writeText(block.innerText.replace(/^\s*\$\s?/gm, '').trim()).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1400);
    }).catch(() => {});
  });
});
