document.addEventListener('DOMContentLoaded', () => {

  const countryFiles = [
    'aa.json',
    'ac.json',
    'ae.json',
    'af.json',
    'ag.json',
    'aj.json',
    'al.json',
    'am.json',
    'an.json',
    'ao.json',
    'aq.json',
    'ar.json',
    'as.json',
    'at.json',
    'au.json',
    'av.json',
    'ax.json',
    'ay.json',
    'ba.json',
    'bb.json',
    'bc.json',
    'bd.json',
    'be.json',
    'bf.json',
    'bg.json',
    'bh.json',
    'bk.json',
    'bl.json',
    'bm.json',
    'bn.json',
    'bo.json',
    'bp.json',
    'bq.json',
    'br.json',
    'bt.json',
    'bu.json',
    'bv.json',
    'bx.json',
    'by.json',
    'ca.json',
    'cb.json',
    'cd.json',
    'ce.json',
    'cf.json',
    'cg.json',
    'ch.json',
    'ci.json',
    'cj.json',
    'ck.json',
    'cm.json',
    'cn.json',
    'co.json',
    'cq.json',
    'cr.json',
    'cs.json',
    'ct.json',
    'cu.json',
    'cv.json',
    'cw.json',
    'cy.json',
    'da.json',
    'dj.json',
    'do.json',
    'dr.json',
    'dx.json',
    'ec.json',
    'ee.json',
    'eg.json',
    'ei.json',
    'ek.json',
    'en.json',
    'er.json',
    'es.json',
    'et.json',
    'ez.json',
    'fi.json',
    'fj.json',
    'fk.json',
    'fm.json',
    'fo.json',
    'fp.json',
    'fr.json',
    'fs.json',
    'ga.json',
    'gb.json',
    'gg.json',
    'gh.json',
    'gi.json',
    'gj.json',
    'gk.json',
    'gl.json',
    'gm.json',
    'gq.json',
    'gr.json',
    'gt.json',
    'gv.json',
    'gy.json',
    'gz.json',
    'ha.json',
    'hk.json',
    'hm.json',
    'ho.json',
    'hr.json',
    'hu.json',
    'ic.json',
    'id.json',
    'im.json',
    'in.json',
    'io.json',
    'ip.json',
    'ir.json',
    'is.json',
    'it.json',
    'iv.json',
    'iz.json',
    'ja.json',
    'je.json',
    'jm.json',
    'jn.json',
    'jo.json',
    'ke.json',
    'kg.json',
    'kn.json',
    'kr.json',
    'ks.json',
    'kt.json',
    'ku.json',
    'kv.json',
    'kz.json',
    'la.json',
    'le.json',
    'lg.json',
    'lh.json',
    'li.json',
    'lo.json',
    'ls.json',
    'lt.json',
    'lu.json',
    'ly.json',
    'ma.json',
    'mc.json',
    'md.json',
    'mg.json',
    'mh.json',
    'mi.json',
    'mj.json',
    'mk.json',
    'ml.json',
    'mn.json',
    'mo.json',
    'mp.json',
    'mr.json',
    'mt.json',
    'mu.json',
    'mv.json',
    'mx.json',
    'my.json',
    'mz.json',
    'nc.json',
    'ne.json',
    'nf.json',
    'ng.json',
    'nh.json',
    'ni.json',
    'nl.json',
    'nn.json',
    'no.json',
    'np.json',
    'nr.json',
    'ns.json',
    'nu.json',
    'nz.json',
    'od.json',
    'pa.json',
    'pc.json',
    'pe.json',
    'pf.json',
    'pg.json',
    'pk.json',
    'pl.json',
    'pm.json',
    'po.json',
    'pp.json',
    'ps.json',
    'pu.json',
    'qa.json',
    'ri.json',
    'rm.json',
    'rn.json',
    'ro.json',
    'rp.json',
    'rq.json',
    'rs.json',
    'rw.json',
    'sa.json',
    'sb.json',
    'sc.json',
    'se.json',
    'sf.json',
    'sg.json',
    'sh.json',
    'si.json',
    'sl.json',
    'sm.json',
    'sn.json',
    'so.json',
    'sp.json',
    'st.json',
    'su.json',
    'sv.json',
    'sw.json',
    'sx.json',
    'sy.json',
    'sz.json',
    'tb.json',
    'td.json',
    'th.json',
    'ti.json',
    'tk.json',
    'tl.json',
    'tn.json',
    'to.json',
    'tp.json',
    'ts.json',
    'tt.json',
    'tu.json',
    'tv.json',
    'tw.json',
    'tx.json',
    'tz.json',
    'uc.json',
    'ug.json',
    'uk.json',
    'um.json',
    'up.json',
    'us.json',
    'uv.json',
    'uy.json',
    'uz.json',
    'vc.json',
    've.json',
    'vi.json',
    'vm.json',
    'vq.json',
    'vt.json',
    'wa.json',
    'we.json',
    'wf.json',
    'wi.json',
    'wq.json',
    'ws.json',
    'wz.json',
    'ym.json',
    'za.json',
    'zi.json'
  ];

  let currentIndex = Math.floor(Date.now() / 86400000) % countryFiles.length;

  // Game State Variables
  let countryData = null;
  let validNames = [];
  let rawNamesForRedaction = [];
  let displayCountryName = "Unknown";
  let availableClues = [];
  let pastGuesses = [];
  let guessesLeft = 6;
  let isGameOver = false;

  // DOM Elements
  const guessInput = document.getElementById('country-guess');
  const guessBtn = document.getElementById('guess-btn');
  const cluesContainer = document.getElementById('clues-container');
  const guessesDisplay = document.getElementById('guesses-left');
  const feedbackMsg = document.getElementById('feedback-msg');
  const endScreen = document.getElementById('end-screen');
  const pastGuessesContainer = document.getElementById('past-guesses-container');
  const pastGuessesDiv = document.getElementById('past-guesses');
  const testNextBtn = document.getElementById('test-next-btn');

  // Case-Insensitive Helper
  function getCaseInsensitive(obj, keyName) {
    if (!obj || typeof obj !== 'object') return null;
    const key = Object.keys(obj).find(k => k.toLowerCase() === keyName.toLowerCase());
    return key ? obj[key] : null;
  }

  // --- NEW: Reusable Load Function ---
  function loadGame(index) {
    const targetFile = countryFiles[index];

    // Reset all state variables for the new round
    countryData = null;
    validNames = [];
    rawNamesForRedaction = [];
    displayCountryName = "Unknown";
    availableClues = [];
    pastGuesses = [];
    guessesLeft = 6;
    isGameOver = false;

    // Reset the DOM (clear old clues, un-disable inputs, hide end screen)
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    cluesContainer.innerHTML = "";
    pastGuessesDiv.innerHTML = "";
    pastGuessesContainer.classList.add('hidden');
    feedbackMsg.classList.add('hidden');
    endScreen.classList.add('hidden');
    guessesDisplay.innerText = `Guesses: ${guessesLeft}`;
    document.getElementById('full-data-accordion').innerHTML = "";

    fetch(`factbook/${targetFile}`)
      .then(response => response.json())
      .then(data => {
        countryData = data;

        const govData = getCaseInsensitive(data, "government");
        const namesData = getCaseInsensitive(govData, "country name");

        if (namesData) {
          const checkAndAdd = (obj) => {
            if (obj && obj.text && obj.text.toLowerCase() !== "none") {
              validNames.push(obj.text.toLowerCase().replace(/[^a-z]/g, ''));
              rawNamesForRedaction.push(obj.text);
            }
          };

          checkAndAdd(getCaseInsensitive(namesData, "conventional short form"));
          checkAndAdd(getCaseInsensitive(namesData, "conventional long form"));
          checkAndAdd(getCaseInsensitive(namesData, "local short form"));
          checkAndAdd(getCaseInsensitive(namesData, "local long form"));

          const peopleData = getCaseInsensitive(data, "people and society");
          const natData = getCaseInsensitive(peopleData, "nationality");
          const adj = getCaseInsensitive(natData, "adjective");
          if (adj && adj.text) rawNamesForRedaction.push(adj.text);

          const shortForm = getCaseInsensitive(namesData, "conventional short form");
          const longForm = getCaseInsensitive(namesData, "conventional long form");
          displayCountryName = (shortForm && shortForm.text !== "none") ? shortForm.text :
                                (longForm && longForm.text !== "none") ? longForm.text : "Unknown";
        }

        prepClues();
        revealNextClue();
      })
      .catch(err => {
        feedbackMsg.innerText = "Error loading secure database connection.";
        feedbackMsg.className = "error";
        feedbackMsg.classList.remove('hidden');
        console.error(err);
      });
  }

  // --- NEW: Event Listener for the Test Button ---
  if (testNextBtn) {
    testNextBtn.addEventListener('click', () => {
      // Increment the index, looping back to 0 if we hit the end of the array
      currentIndex = (currentIndex + 1) % countryFiles.length;
      loadGame(currentIndex);
    });
  }

  // Boot up the game for the very first time!
  loadGame(currentIndex);

  // --- SMART FORMATTER: Associates sub-keys directly with values ---
  // (Keep the rest of your file exactly the same from here down!)
  // --- SMART FORMATTER: Associates sub-keys directly with values ---
  function formatClueData(obj) {
    if (typeof obj !== 'object' || obj === null) return String(obj);

    let parts = [];
    if (obj.text) parts.push(obj.text); // Pushes base text first

    for (const [key, value] of Object.entries(obj)) {
      if (key === 'text') continue;

      if (typeof value === 'object' && value !== null) {
        const formatted = formatClueData(value);
        if (formatted) parts.push(`<strong>${key}:</strong> ${formatted}`);
      } else {
        parts.push(`<strong>${key}:</strong> ${value}`);
      }
    }
    return parts.join(' <span style="color:#a9c191; font-weight:bold;">|</span> ');
  }

  function prepClues() {
    rawNamesForRedaction = rawNamesForRedaction.filter(n => n.length > 2);
    rawNamesForRedaction.sort((a, b) => b.length - a.length);
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const redactionRegexes = rawNamesForRedaction.map(name => new RegExp(escapeRegExp(name), 'gi'));

    for (const [catName, category] of Object.entries(countryData)) {
      const catLower = catName.toLowerCase();
      if (catLower === 'introduction' || catLower === 'military and security') continue;

      for (const [subName, subcategory] of Object.entries(category)) {
        const subLower = subName.toLowerCase();

        // Exclusions
        if (catLower === 'government' && (subLower === 'country name' || subLower === 'capital')) continue;
        if (catLower === 'economy' && subLower === 'exchange rates') continue;
        if (catLower === 'people and society' && (subLower === 'nationality' || subLower === 'languages')) continue;

        let combinedText = formatClueData(subcategory);

        if (combinedText.trim().length > 0) {
          redactionRegexes.forEach(regex => {
             combinedText = combinedText.replace(regex, '██████');
          });
          availableClues.push({ category: catName, subcategory: subName, text: combinedText });
        }
      }
    }
    availableClues.sort(() => Math.random() - 0.5);
  }

  function revealNextClue() {
    if (availableClues.length === 0) return;
    const clue = availableClues.pop();
    const clueEl = document.createElement('div');
    clueEl.className = 'clue-card';
    clueEl.innerHTML = `
      <div class="clue-meta">${clue.category} &rarr; ${clue.subcategory}</div>
      <p class="clue-text">${clue.text}</p>
    `;
    cluesContainer.prepend(clueEl);
  }

  function handleGuess() {
    if (isGameOver) return;
    const rawGuess = guessInput.value.trim();
    if (!rawGuess) return;

    const normalizedGuess = rawGuess.toLowerCase().replace(/[^a-z]/g, '');
    guessInput.value = "";

    if (pastGuesses.includes(normalizedGuess)) {
      feedbackMsg.innerText = "You already guessed that country.";
      feedbackMsg.className = "error";
      feedbackMsg.classList.remove('hidden');
      return;
    }

    pastGuesses.push(normalizedGuess);
    if (pastGuessesContainer) pastGuessesContainer.classList.remove('hidden');

    const pill = document.createElement('span');
    pill.className = 'guess-pill';
    pill.innerText = rawGuess;
    if (pastGuessesDiv) pastGuessesDiv.appendChild(pill);

    if (validNames.includes(normalizedGuess)) {
      endGame(true);
    } else {
      guessesLeft--;
      guessesDisplay.innerText = `Guesses: ${guessesLeft}`;

      if (guessesLeft <= 0) {
        endGame(false);
      } else {
        feedbackMsg.innerText = "Nope!";
        feedbackMsg.className = "error";
        feedbackMsg.classList.remove('hidden');
        revealNextClue();
      }
    }
  }

  guessBtn.addEventListener('click', handleGuess);
  guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGuess();
  });

  function endGame(isWin) {
    isGameOver = true;
    guessInput.disabled = true;
    guessBtn.disabled = true;

    feedbackMsg.innerText = isWin ? "Yes! Identity confirmed." : "Darn, ya didn't get it!";
    feedbackMsg.className = isWin ? "success" : "error";
    feedbackMsg.classList.remove('hidden');

    const endTitle = document.getElementById('end-title');
    endTitle.innerText = isWin ? "Success!" : "Failure :(";
    endTitle.style.color = isWin ? "#a9c191" : "#c48b8b";

    document.getElementById('reveal-country-name').innerText = displayCountryName;

    const govData = getCaseInsensitive(countryData, "government");
    const namesData = getCaseInsensitive(govData, "country name");
    let nameHtml = "";
    if (namesData) {
      for (const [key, val] of Object.entries(namesData)) {
         if (val.text && val.text.toLowerCase() !== "none") nameHtml += `<strong>${key}:</strong> ${val.text}<br>`;
      }
    }
    document.getElementById('reveal-names').innerHTML = nameHtml;

    const introData = getCaseInsensitive(countryData, "introduction");
    const bgData = getCaseInsensitive(introData, "background");
    document.getElementById('reveal-background').innerHTML = bgData?.text || "No background available.";

    const accordion = document.getElementById('full-data-accordion');
    for (const [catName, category] of Object.entries(countryData)) {
      if (catName.toLowerCase() === 'introduction') continue;

      const details = document.createElement('details');
      details.className = 'fact-category';

      const summary = document.createElement('summary');
      summary.innerText = catName;
      details.appendChild(summary);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'fact-content';

      for (const [subName, subcategory] of Object.entries(category)) {
         let formattedText = formatClueData(subcategory);
         if (formattedText.trim().length > 0) {
           contentDiv.innerHTML += `<div style="margin-bottom: 12px;"><strong><u>${subName}</u>:</strong><br>${formattedText}</div>`;
         }
      }

      details.appendChild(contentDiv);
      accordion.appendChild(details);
    }

    endScreen.classList.remove('hidden');
    endScreen.scrollIntoView({ behavior: 'smooth' });
  }
});
