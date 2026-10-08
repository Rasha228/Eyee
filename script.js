const frame = document.querySelector('.cinematic-background');
const hero = document.querySelector('.hero-scroll');
const copy = document.querySelector('.hero-copy');
const finalCopy = document.querySelector('.final-copy');
const FRAME_COUNT = 192;
let raf = 0;
let frameImages = [];

function drawFrame(image) {
  if (!image || !image.complete || !image.naturalWidth) return;
  const width = frame.clientWidth;
  const height = frame.clientHeight;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const ctx = frame.getContext('2d');
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  frame.width = Math.round(width * ratio);
  frame.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function preloadFrames() {
  frameImages = Array.from({ length: FRAME_COUNT }, (_, index) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => { if (index === 0) drawFrame(image); };
    image.src = `hero-frames/frame-${String(index + 1).padStart(3, '0')}.jpg`;
    return image;
  });
}

function update() {
  raf = 0;
  const rect = hero.getBoundingClientRect();
  const sceneProgress = Math.max(0, Math.min(1, -rect.top / Math.max(1, hero.offsetHeight - window.innerHeight)));
  const progress = Math.max(0, Math.min(1, sceneProgress / 0.78));
  const frameIndex = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
  drawFrame(frameImages[frameIndex] || frameImages.find((image) => image.complete));
  copy.style.opacity = Math.max(0, 1 - progress * 2.05);
  copy.style.transform = `translate3d(0, ${progress * 36}px, 0)`;
  finalCopy.style.opacity = Math.max(0, Math.min(1, (progress - 0.82) / 0.18));
}

function requestUpdate() { if (!raf) raf = requestAnimationFrame(update); }
addEventListener('scroll', requestUpdate, { passive: true });
addEventListener('resize', requestUpdate);
preloadFrames();
update();

const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  const header = document.querySelector('.header');
  const open = header.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.header nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('.header').classList.remove('menu-open')));

const galleryWrap = document.querySelector('.gallery .wrap');
const galleryImages = ['lash-closeup-01.png','lash-closeup-05.png','lash-closeup-03.png','lash-closeup-07.png','lash-process-02.png','lash-closeup-06.png','lash-closeup-04.png','lash-closeup-01.png','lash-closeup-05.png'];
const galleryBottom = ['lash-closeup-06.png','lash-closeup-03.png','lash-closeup-01.png','lash-closeup-05.png','lash-closeup-07.png','lash-process-02.png','lash-closeup-04.png','lash-closeup-06.png','lash-closeup-03.png'];
function galleryCards(images) { return images.map((name, index) => `<button class="gallery-wall-card" data-image="gallery/${name}"><img src="gallery/${name}" alt="Selected lash work"><span>0${(index % 7) + 1}</span></button>`).join(''); }
galleryWrap.innerHTML = `<div class="gallery-wall"><div class="gallery-band gallery-band-top">${galleryCards(galleryImages)}</div><div class="gallery-center"><p class="number">02 · Selected work</p><h2>Every detail,<br><em>considered.</em></h2><p class="intro">Lifted, tinted and shaped around the eye — each result is made to feel naturally yours.</p><small>Continue through the work ↓</small></div><div class="gallery-band gallery-band-bottom">${galleryCards(galleryBottom)}</div></div>`;
const gallery = [...document.querySelectorAll('.gallery-wall-card')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
let currentImage = 0;
function showImage(index) {
  currentImage = (index + gallery.length) % gallery.length;
  lightboxImage.src = gallery[currentImage].dataset.image;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
gallery.forEach((button, index) => button.addEventListener('click', () => showImage(index)));
lightbox.querySelector('.close').onclick = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); };
lightbox.querySelector('.prev').onclick = () => showImage(currentImage - 1);
lightbox.querySelector('.next').onclick = () => showImage(currentImage + 1);
addEventListener('keydown', (event) => {
  if (event.key === 'Escape') lightbox.querySelector('.close').click();
  if (event.key === 'ArrowLeft') showImage(currentImage - 1);
  if (event.key === 'ArrowRight') showImage(currentImage + 1);
});
