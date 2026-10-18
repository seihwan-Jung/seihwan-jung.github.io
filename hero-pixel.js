// Hover effect for the hero photos: the area around the cursor turns into big pixels.
(function () {
  var RADIUS = 42;   // size of the pixelated spot, in CSS px
  var CELL = 8;      // size of one "pixel", in CSS px
  var EASE = 0.28;   // how fast the spot grows / shrinks (0-1 per frame)

  function setup(img, z) {
    var wrap = img.parentNode;
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-photo-fx';
    canvas.style.zIndex = z;
    wrap.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var small = document.createElement('canvas');
    var sctx = small.getContext('2d');

    var w = 0, h = 0, dpr = 1;
    var x = 0, y = 0, r = 0, target = 0, raf = 0;

    function layout() {
      dpr = window.devicePixelRatio || 1;
      w = img.clientWidth; h = img.clientHeight;
      var wr = wrap.getBoundingClientRect(), ir = img.getBoundingClientRect();
      canvas.style.left = (ir.left - wr.left + img.clientLeft) + 'px';
      canvas.style.top = (ir.top - wr.top + img.clientTop) + 'px';
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      small.width = Math.max(1, Math.round(w / CELL));
      small.height = Math.max(1, Math.round(h / CELL));
      sctx.drawImage(img, 0, 0, small.width, small.height);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (r > 0.5) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, r * dpr, 0, Math.PI * 2);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }

    function tick() {
      r += (target - r) * EASE;
      if (Math.abs(target - r) < 0.5) r = target;
      draw();
      raf = (r !== target) ? requestAnimationFrame(tick) : 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }

    function move(e) {
      var b = canvas.getBoundingClientRect();
      x = e.clientX - b.left; y = e.clientY - b.top;
      target = RADIUS;
      draw();
      kick();
    }
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerdown', move);
    canvas.addEventListener('pointerleave', function () { target = 0; kick(); });
    canvas.addEventListener('pointercancel', function () { target = 0; kick(); });

    function init() { layout(); draw(); }
    if (img.complete && img.naturalWidth) init(); else img.addEventListener('load', init);
    window.addEventListener('resize', init);
  }

  var imgs = document.querySelectorAll('.hero-photos .hero-photo');
  for (var i = 0; i < imgs.length; i++) setup(imgs[i], i + 1);
})();
