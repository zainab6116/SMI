(function () {
  var C = window.SMI, page = document.body.dataset.page;
  var nav = [["index.html","Home","home"],["about.html","About Us","about"],["programs.html","Programs","programs"],["contact.html","Contact","contact"]];
  var links = nav.map(function (n) { return '<li><a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>'; }).join("");
  var h = '<div class="topbar"><div class="wrap"><span>Gulberg Town, Karachi</span><a data-tel></a></div></div><a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap bar">' +
    '<a class="brand" href="index.html" aria-label="Sir Mazhar Institute home"><img class="logo-full" src="images/smi-emblem.svg" alt="Sir Mazhar Institute (SMI)" width="175" height="50"><img class="logo-mark" src="images/smi-emblem.svg" alt="Sir Mazhar Institute (SMI)" width="44" height="44"></a>' +
    '<button class="menu-btn" aria-expanded="false" aria-controls="nav"><span class="sr">Menu</span><i></i></button>' +
    '<nav id="nav" aria-label="Main"><ul>' + links + '</ul><a class="btn btn-gold" href="contact.html">Contact Us</a></nav></div></header>';
  document.body.insertAdjacentHTML("afterbegin", h);

  var f = '<footer class="site-footer"><div class="wrap grid4"><div><img class="flogo" src="images/smi-emblem.svg" alt="Sir Mazhar Institute (SMI)" width="260" height="74" loading="lazy"><p>School tuition, matric and Intermediate coaching, and degree-level support in Gulberg Town, Karachi.</p></div>' +
    '<div><h2>Explore</h2><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About Us</a></li><li><a href="programs.html">Programs</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
    '<div><h2>Programs</h2><ul><li>Nursery to Class 8</li><li>Classes IX and X</li><li>First and Second Year</li><li>B.A and B.Com</li></ul></div>' +
    '<div><h2>Visit and call</h2><address>' + C.address + '</address><p><a data-tel></a></p><p><a data-wa data-wa-label="WhatsApp us"></a></p><p><a data-maps>Get directions</a></p><p class="soc"></p></div></div>' +
    '<div class="wrap copy">&copy; <span id="yr"></span> ' + C.name + '. All rights reserved.</div></footer>';
  document.body.insertAdjacentHTML("beforeend", f);
  document.getElementById("yr").textContent = new Date().getFullYear();

  var tel = "tel:+" + C.phoneIntl, wa = C.whatsappIntl ? "https://wa.me/" + C.whatsappIntl + "?text=" : "";
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = tel; if (!a.textContent.trim()) a.textContent = C.phoneDisplay; });
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    if (!wa) { a.hidden = true; return; }
    a.href = wa + encodeURIComponent(a.dataset.waText || C.waMessage); a.target = "_blank"; a.rel = "noopener";
    if (!a.textContent.trim()) a.textContent = a.dataset.waLabel || "WhatsApp";
  });
  document.querySelectorAll("[data-hours]").forEach(function (e) { e.textContent = C.hours || "Opening hours to be confirmed"; });
  document.querySelectorAll("[data-address]").forEach(function (e) { e.textContent = C.address; });
  document.querySelectorAll(".soc").forEach(function (e) {
    e.innerHTML = Object.keys(C.social).filter(function (k) { return C.social[k]; }).map(function (k) { return '<a href="' + C.social[k] + '" rel="noopener" target="_blank">' + k + '</a>'; }).join(" ");
  });
  document.querySelectorAll("[data-maps]").forEach(function (a) { a.href = C.directionsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.address); a.target = "_blank"; a.rel = "noopener"; });
  var map = document.querySelector("[data-map]");
  if (map && C.mapsEmbedUrl) map.innerHTML = '<iframe title="Map to Sir Mazhar Institute" src="' + C.mapsEmbedUrl + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
  if (wa) document.body.insertAdjacentHTML("beforeend", '<a class="wa-float" data-wa data-wa-label="WhatsApp" aria-label="Chat with us on WhatsApp"></a>'), document.querySelector(".wa-float").href = wa + encodeURIComponent(C.waMessage), document.querySelector(".wa-float").target = "_blank", document.querySelector(".wa-float").rel = "noopener", document.querySelector(".wa-float").textContent = "WhatsApp";

  /* Mobile menu */
  var btn = document.querySelector(".menu-btn"), navEl = document.getElementById("nav");
  function setMenu(o) { btn.setAttribute("aria-expanded", o); navEl.classList.toggle("open", o); }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && navEl.classList.contains("open")) { setMenu(false); btn.focus(); } });
  navEl.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  /* Count-up on stat numbers (skipped for reduced motion) */
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = "IntersectionObserver" in window && !still ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      var el = en.target, end = +el.dataset.count, t0 = null;
      (function step(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(end * p).toLocaleString(); if (p < 1) requestAnimationFrame(step); })(performance.now());
    });
  }) : null;
  document.querySelectorAll("[data-count]").forEach(function (el) { if (io) { el.textContent = "0"; io.observe(el); } else el.textContent = (+el.dataset.count).toLocaleString(); });

  /* Lightbox: any <a class="g-item" href="images/gallery/x.jpg"> opens in a dialog (unused now that the gallery is removed) */
  var items = [].slice.call(document.querySelectorAll("a.g-item[href]")), box, idx = 0;
  if (items.length) {
    box = document.createElement("dialog"); box.className = "lb";
    box.innerHTML = '<button class="lb-x" aria-label="Close">&times;</button><button class="lb-p" aria-label="Previous">&#8249;</button><img alt=""><button class="lb-n" aria-label="Next">&#8250;</button>';
    document.body.appendChild(box);
    var show = function (i) { idx = (i + items.length) % items.length; var im = box.querySelector("img"); im.src = items[idx].href; im.alt = items[idx].dataset.alt || ""; };
    items.forEach(function (a, i) { a.addEventListener("click", function (e) { e.preventDefault(); show(i); box.showModal(); }); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.querySelector(".lb-x").onclick = function () { box.close(); };
    box.querySelector(".lb-p").onclick = function () { show(idx - 1); };
    box.querySelector(".lb-n").onclick = function () { show(idx + 1); };
    box.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
  }
})();