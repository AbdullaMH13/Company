/* ═══════════════════════════════════════════════════════════════════
   TRAVELO · Community Picks  v3.0
   Groups duplicate place submissions → single card with avg rating
   and merged description summary. Works for ALL state/district pages.
   ───────────────────────────────────────────────────────────────────

   HOW TO ADD TO ANY DISTRICT PAGE:
   ─────────────────────────────────
   1. Copy the CSS block at the bottom into the page <style>.
   2. Add two empty containers:
        <div id="cpSpotsContainer"></div>   ← after .spots-grid
        <div id="cpFoodContainer"></div>    ← after food/dish grid
   3. Paste before </body>:

        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
        <script>
          var CP_STATE    = 'Kerala';
          var CP_DISTRICT = 'Kozhikode';  // change per page
        </script>
        <script src="travelo-community.js"></script>

   ROUTING: "Food & Dining" → #cpFoodContainer, everything else → #cpSpotsContainer
   GROUPING: Multiple reviews for same place → 1 card, avg rating, merged description
═══════════════════════════════════════════════════════════════════ */

;(function () {

  var PAGE_STATE    = (typeof CP_STATE    !== 'undefined') ? CP_STATE    : null;
  var PAGE_DISTRICT = (typeof CP_DISTRICT !== 'undefined') ? CP_DISTRICT : null;

  if (!PAGE_STATE || !PAGE_DISTRICT) {
    console.warn('[Travelo CP] Set CP_STATE and CP_DISTRICT before loading this script.');
    return;
  }

  var SB_URL    = 'https://mqxpcxvyfeefriaehbev.supabase.co';
  var SB_KEY    = 'sb_publishable_rrTAjrtL7hrQj_YupZgbWw_QFed0sgT';
  var FOOD_CATS = ['Food & Dining'];

  var db = supabase.createClient(SB_URL, SB_KEY);

  db.from('suggestions')
    .select('*')
    .eq('status',   'approved')
    .eq('state',    PAGE_STATE)
    .eq('district', PAGE_DISTRICT)
    .order('submitted_at', { ascending: false })
    .then(function(res) {
      if (res.error) { console.error('[Travelo CP]', res.error.message); return; }
      var data = res.data || [];
      console.log('[Travelo CP] Fetched', data.length, 'rows for', PAGE_DISTRICT);
      if (!data.length) return;

      /* ══ GROUP by place name (case-insensitive) ══ */
      var grouped = {};
      data.forEach(function(r) {
        var key = (r.place || '').trim().toLowerCase();
        if (!grouped[key]) grouped[key] = { rows: [], rep: r };
        grouped[key].rows.push(r);
      });

      /* ══ MERGE each group → single card object ══ */
      var merged = Object.keys(grouped).map(function(key) {
        var g    = grouped[key];
        var rows = g.rows;
        var rep  = g.rep;

        /* Average rating — ignore nulls */
        var rated = rows.filter(function(r) { return r.rating; });
        var avg   = rated.length
          ? Math.round((rated.reduce(function(s,r){ return s+r.rating; },0) / rated.length) * 10) / 10
          : null;

        /* Unique descriptions merged into one summary */
        var descs = rows
          .map(function(r){ return (r.description||'').trim(); })
          .filter(function(d,i,a){ return d && a.indexOf(d)===i; });
        var full    = descs.join(' ');
        var summary = full.length > 220 ? full.slice(0,220)+'…' : full;

        /* First available photo */
        var photo = null;
        rows.forEach(function(r){ if(!photo && r.photo_url) photo=r.photo_url; });

        return {
          place:       rep.place,
          district:    rep.district || rep.state,
          state:       rep.state,
          category:    rep.category,
          description: summary,
          photo_url:   photo,
          rating:      avg,
          count:       rows.length
        };
      });

      var spots = merged.filter(function(r){ return FOOD_CATS.indexOf(r.category)===-1; });
      var food  = merged.filter(function(r){ return FOOD_CATS.indexOf(r.category)!==-1; });
      if (spots.length) _renderSpots(spots);
      if (food.length)  _renderFood(food);
    });

  /* ══ SPOT CARDS ══ */
  function _renderSpots(items) {
    var c = document.getElementById('cpSpotsContainer');
    if (!c) { console.warn('[Travelo CP] #cpSpotsContainer not found'); return; }
    c.innerHTML = _hdr('Community Picks \u2014 Destinations')
      + '<div class="spots-grid" id="cpSpotsGrid" style="margin-top:1.2rem;"></div>';
    var g = document.getElementById('cpSpotsGrid');
    items.forEach(function(r,i){
      var img  = r.photo_url || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80';
      var card = document.createElement('div');
      card.className        = 'spot-card cp-card';
      card.style.animationDelay = (i*0.1)+'s';
      card.innerHTML =
        '<div class="cp-badge">'
        +'<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        +' Community Pick</div>'
        +'<div style="overflow:hidden;"><img src="'+_ea(img)+'" alt="'+_e(r.place)+'" style="width:100%;height:240px;object-fit:cover;display:block;transition:transform .6s ease;"></div>'
        +'<div class="spot-card-body">'
        +'<p class="spot-card-num">Community \u00b7 '+_e(r.district)+(r.count>1?' \u00b7 '+r.count+' reviews':'')+'</p>'
        +'<h3 class="spot-card-title">'+_e(r.place)+'</h3>'
        +'<p class="spot-card-desc">'+_e(r.description)+'</p>'
        +'</div>'
        +'<div class="spot-card-footer">'
        +'<span class="spot-card-tag">'+_e(r.category)+(r.rating?' \u00b7 '+_st(r.rating):'')+'</span>'
        +'<div class="spot-card-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>'
        +'</div>';
      var im=card.querySelector('img');
      card.addEventListener('mouseenter',function(){im.style.transform='scale(1.07)';});
      card.addEventListener('mouseleave',function(){im.style.transform='';});
      g.appendChild(card);
    });
    _obs(g.querySelectorAll('.spot-card'));
  }

  /* ══ FOOD CARDS ══ */
  function _renderFood(items) {
    var c = document.getElementById('cpFoodContainer');
    if (!c) { console.warn('[Travelo CP] #cpFoodContainer not found'); return; }
    c.innerHTML = _hdr('Community Picks \u2014 Food & Dining','3rem 0 1.8rem')
      + '<div class="food-grid" id="cpFoodGrid"></div>';
    var g = document.getElementById('cpFoodGrid');
    items.forEach(function(r,i){
      var img  = r.photo_url || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80';
      var card = document.createElement('div');
      /* support both .dish-card (kerala) and .food-card (kasaragod) class names */
      card.className        = (document.querySelector('.food-grid') ? 'food-card' : 'dish-card') + ' cp-card';
      card.style.animationDelay = (i*0.1)+'s';
      var imgWrapClass = document.querySelector('.food-card-img-wrap') !== null || !document.querySelector('.dish-card-img-wrap')
        ? 'food-card-img-wrap' : 'dish-card-img-wrap';
      var imgClass = imgWrapClass === 'food-card-img-wrap' ? 'food-card-img' : 'dish-card-img';
      var nameClass = imgWrapClass === 'food-card-img-wrap' ? 'food-card-name' : 'dish-card-name';
      var descClass = imgWrapClass === 'food-card-img-wrap' ? 'food-card-desc' : 'dish-card-desc';
      var regionClass = imgWrapClass === 'food-card-img-wrap' ? 'food-card-region' : 'dish-card-region';
      var bodyClass  = imgWrapClass === 'food-card-img-wrap' ? 'food-card-body' : 'dish-card-body';
      var footClass  = imgWrapClass === 'food-card-img-wrap' ? 'food-card-footer' : 'dish-card-footer';
      card.innerHTML =
        '<div class="'+imgWrapClass+'"><img class="'+imgClass+'" src="'+_ea(img)+'" alt="'+_e(r.place)+'"></div>'
        +'<div class="'+bodyClass+'">'
        +'<div class="cp-dish-badge"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Community Pick</div>'
        +'<p class="'+regionClass+'">'+_e(r.category)+' \u00b7 '+_e(r.district)+'</p>'
        +'<h3 class="'+nameClass+'">'+_e(r.place)+'</h3>'
        +'<p class="'+descClass+'">'+_e(r.description)+'</p>'
        +'</div>'
        +'<div class="'+footClass+'">'
        +'<div style="display:flex;align-items:center;gap:.4rem;">'
        +_sh(r.rating)
        +(r.rating?'<span style="font-size:.75rem;font-weight:500;color:var(--ink);">'+r.rating.toFixed(1)+'</span>':'')
        +(r.count>1?'<span style="font-size:.68rem;color:var(--muted);">\u00b7 '+r.count+' reviews</span>':'')
        +'</div>'
        +'<span style="font-size:.62rem;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);">Community</span>'
        +'</div>';
      g.appendChild(card);
    });
    _obs(g.querySelectorAll('.food-card, .dish-card'));
  }

  /* ══ HELPERS ══ */
  function _hdr(label, margin) {
    return '<div class="community-header" style="margin:'+(margin||'2.5rem 0 1.8rem')+'">'
      +'<div class="community-line"></div>'
      +'<span class="community-label">'
      +'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
      +' '+label+'</span>'
      +'<div class="community-line"></div></div>';
  }
  function _e(s)  { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function _ea(s) { return String(s||'').replace(/"/g,'&quot;'); }
  function _st(r) {
    if (!r) return '';
    var s=''; var rr=Math.round(r);
    for(var i=0;i<rr;i++) s+='&#9733;';
    for(var j=rr;j<5;j++) s+='&#9734;';
    return s;
  }
  function _sh(rating) {
    if (!rating) return '<span style="color:var(--muted);font-size:.75rem">\u2014</span>';
    var h='<div style="display:flex;gap:1px;">';
    for(var i=0;i<5;i++) {
      h+='<div style="width:10px;height:10px;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);background:'+(i<Math.round(rating)?'var(--gold)':'rgba(184,146,74,.2)')+'"></div>';
    }
    return h+'</div>';
  }
  function _obs(cards) {
    if (!('IntersectionObserver' in window)) { cards.forEach(function(c){c.classList.add('visible');}); return; }
    var ob=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('visible');ob.unobserve(en.target);}});
    },{threshold:0.08});
    cards.forEach(function(c){ob.observe(c);});
  }

})();


/* ═══════════════════════════════════════════════════════════════════
   CSS — paste into every district page <style> tag
   ───────────────────────────────────────────────────────────────────

    .community-header { display:flex; align-items:center; gap:1.2rem; margin:2.5rem 0 1.8rem; }
    .community-label  { display:inline-flex; align-items:center; gap:.45rem; font-size:.68rem; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); white-space:nowrap; font-weight:500; }
    .community-line   { flex:1; height:1px; background:rgba(184,146,74,.22); }
    .cp-badge         { position:absolute; top:.85rem; left:.85rem; z-index:2; display:inline-flex; align-items:center; gap:.3rem; background:var(--gold); color:var(--white); font-family:'DM Sans',sans-serif; font-size:.58rem; letter-spacing:.14em; text-transform:uppercase; font-weight:500; padding:.28rem .72rem; }
    .cp-dish-badge    { display:inline-flex; align-items:center; gap:.3rem; background:var(--gold); color:var(--white); font-family:'DM Sans',sans-serif; font-size:.56rem; letter-spacing:.13em; text-transform:uppercase; font-weight:500; padding:.24rem .62rem; margin-bottom:.5rem; }
    @keyframes cpRise { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    .cp-card          { animation:cpRise .55s ease both; }

═══════════════════════════════════════════════════════════════════ */