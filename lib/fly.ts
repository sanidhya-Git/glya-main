/* Flies a product visual from a source element into the header cart / wishlist
   icon (marked with data-fly-target), then bumps the icon. Pure DOM + Web
   Animations API — no React state, safe to call from any click handler. */

export function flyToHeader(source: HTMLElement, target: 'cart' | 'wish', imgSrc?: string | null) {
  if (typeof window === 'undefined') return;
  const dest = document.querySelector<HTMLElement>(`[data-fly-target="${target}"]`);
  if (!dest) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { bump(dest); return; }

  const s = source.getBoundingClientRect();
  const d = dest.getBoundingClientRect();

  const size   = Math.min(92, Math.max(54, s.width * 0.42));
  const startX = s.left + s.width  / 2 - size / 2;
  const startY = s.top  + s.height / 2 - size / 2;
  const dx = (d.left + d.width  / 2 - size / 2) - startX;
  const dy = (d.top  + d.height / 2 - size / 2) - startY;

  const flier = document.createElement('div');
  flier.style.cssText =
    `position:fixed;left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;` +
    `z-index:9999;pointer-events:none;overflow:hidden;` +
    `border-radius:${target === 'wish' ? '50%' : '8px'};` +
    `border:2px solid #FAF7F1;box-shadow:0 12px 32px -8px rgba(33,28,23,.5);` +
    `background:#F2EDE3;display:flex;align-items:center;justify-content:center;will-change:transform;`;

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    flier.appendChild(img);
  } else {
    flier.style.fontSize = `${Math.round(size * 0.42)}px`;
    flier.style.color = '#B08D57';
    flier.textContent = target === 'wish' ? '♥' : '◈';
  }
  document.body.appendChild(flier);

  /* Mid-keyframe lifted above the straight line → the flier travels in an arc. */
  const lift = Math.max(70, Math.abs(dy) * 0.22);
  const anim = flier.animate(
    [
      { transform: 'translate(0,0) scale(1)',                                    opacity: 1,    offset: 0 },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - lift}px) scale(0.55)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(${dx}px,${dy}px) scale(0.1)`,                     opacity: 0.2,  offset: 1 },
    ],
    { duration: 750, easing: 'cubic-bezier(.3,.55,.4,1)', fill: 'forwards' }
  );
  anim.onfinish = () => { flier.remove(); bump(dest); };
  /* Safety net in case onfinish never fires (tab hidden etc.) */
  setTimeout(() => flier.remove(), 1600);
}

function bump(el: HTMLElement) {
  el.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.35) rotate(-8deg)', color: '#B08D57' },
      { transform: 'scale(1)' },
    ],
    { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' }
  );
}

/* Small "pop" for the heart / button that was just pressed. */
export function popElement(el: HTMLElement) {
  el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }],
    { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' }
  );
}
