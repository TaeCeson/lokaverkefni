/* Smá JavaScript fyrir þema, myndasýningu og sýnieyðublöð. */
const velja = (slod) => document.querySelector(slod);
const kronur = (tala) => Math.round(tala).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.';

function lesa(lykill, varagildi) {
  try { return JSON.parse(localStorage.getItem(lykill)) ?? varagildi; }
  catch { return varagildi; }
}
function vista(lykill, gildi) {
  localStorage.setItem(lykill, JSON.stringify(gildi));
}
function skilabod(reitur, texti, villa = false) {
  reitur.textContent = texti;
  reitur.hidden = false;
  reitur.classList.toggle('villa', villa);
}

// Ljóst og dökkt þema fylgir á milli síðna.
const themaHnappur = velja('#thema');
function uppfaeraThema() {
  const dokkt = document.documentElement.dataset.theme === 'dark';
  themaHnappur.textContent = dokkt ? '☀ Ljóst' : '☾ Dökkt';
  themaHnappur.setAttribute('aria-label', dokkt ? 'Skipta yfir í ljóst þema' : 'Skipta yfir í dökkt þema');
}
uppfaeraThema();
themaHnappur.addEventListener('click', () => {
  const thema = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = thema;
  try { localStorage.setItem('cs-thema', thema); } catch { /* Þema virkar líka án vistunar. */ }
  uppfaeraThema();
});
velja('#pasa-tilkynningu').addEventListener('click', (atburdur) => {
  const pasa = velja('.tilkynning').classList.toggle('pasa');
  atburdur.currentTarget.textContent = pasa ? 'Halda áfram' : 'Pása';
  atburdur.currentTarget.setAttribute('aria-pressed', String(pasa));
});
document.querySelectorAll('.farsima-listi a').forEach((tengill) => {
  tengill.addEventListener('click', () => { velja('.farsima-valmynd').open = false; });
});

// Einfaldur hjálparkassi úr glósuhugmyndinni.
const svor = {
  midar: 'Veldu „Velja miða“ á mótasíðunni. Miðakaup fara fram hjá opinberum söluaðila.',
  adgangur: 'Farðu í „Aðgangur“ og veldu „Stofna aðgang“. Aðgangurinn vistast í þessum vafra.',
  tolur: 'Tölurnar koma frá HLTV. Heimild og afmörkun fylgja listunum á spilara­síðunni.'
};
velja('#spjall-spurning').addEventListener('change', (atburdur) => {
  velja('#spjall-svar').textContent = svor[atburdur.target.value];
});

// Myndasýningin stoppar ef notandi óskar eftir minni hreyfingu.
const mynd = velja('#myndasyning');
if (mynd) {
  const myndir = ['cs-1.jpg', 'cs-2.jpg', 'cs-3.jpg', 'cs-4.jpg'];
  let myndNumer = 0;
  let pasa = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function skiptaMynd(stefna) {
    myndNumer = (myndNumer + stefna + myndir.length) % myndir.length;
    mynd.src = 'myndir/' + myndir[myndNumer];
    mynd.classList.remove('myndaskipti');
    void mynd.offsetWidth;
    mynd.classList.add('myndaskipti');
    velja('#myndatexti').textContent = '0' + (myndNumer + 1) + ' / 04 - Counter-Strike 2';
  }
  function myndapasa() {
    velja('#mynd-pasa').textContent = pasa ? '▶' : 'Ⅱ';
    velja('#mynd-pasa').setAttribute('aria-pressed', String(pasa));
    velja('#mynd-pasa').setAttribute('aria-label', pasa ? 'Halda myndasýningu áfram' : 'Stöðva myndasýningu');
  }
  velja('#mynd-fyrri').addEventListener('click', () => skiptaMynd(-1));
  velja('#mynd-naesta').addEventListener('click', () => skiptaMynd(1));
  velja('#mynd-pasa').addEventListener('click', () => { pasa = !pasa; myndapasa(); });
  myndapasa();
  setInterval(() => { if (!pasa && !document.hidden) skiptaMynd(1); }, 5500);
}

// Staðbundnir aðgangar. PBKDF2 geymir afleiðu lykilorðs, ekki lykilorðið sjálft.
// Innskráning yfir mörg tæki þarf bakenda.
async function dulka(lykilord, salt) {
  const texti = new TextEncoder();
  const lykill = await crypto.subtle.importKey('raw', texti.encode(lykilord), 'PBKDF2', false, ['deriveBits']);
  const bitar = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: texti.encode(salt), iterations: 100000, hash: 'SHA-256' }, lykill, 256);
  return Array.from(new Uint8Array(bitar), (b) => b.toString(16).padStart(2, '0')).join('');
}
if (velja('#innskra-form')) {
  const skil = velja('#adgangs-nidurstada');
  const flipar = [velja('#innskra-flipi'), velja('#stofna-flipi')];
  function veljaFlipa(stofna) {
    velja('#innskra-spjald').hidden = stofna;
    velja('#stofna-spjald').hidden = !stofna;
    flipar.forEach((flipi, numer) => {
      const valinn = numer === (stofna ? 1 : 0);
      flipi.setAttribute('aria-selected', String(valinn));
      flipi.tabIndex = valinn ? 0 : -1;
    });
    skil.hidden = true;
  }
  flipar.forEach((flipi, numer) => {
    flipi.addEventListener('click', () => veljaFlipa(numer === 1));
    flipi.addEventListener('keydown', (atburdur) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(atburdur.key)) {
        atburdur.preventDefault();
        const naesti = atburdur.key === 'Home' ? 0 : atburdur.key === 'End' ? 1 : 1 - numer;
        veljaFlipa(naesti === 1); flipar[naesti].focus();
      }
    });
  });
  if (location.hash === '#stofna') veljaFlipa(true);
  velja('#hopadgangur').addEventListener('change', (atburdur) => {
    const hopur = atburdur.target.checked;
    velja('#adgangs-hopur').hidden = !hopur;
    velja('#adgangs-hopsnafn').disabled = !hopur;
    velja('#adgangs-hopsnafn').required = hopur;
  });
  velja('#nytt-endurtaka').addEventListener('input', () => velja('#nytt-endurtaka').setCustomValidity(''));
  velja('#nytt-lykilord').addEventListener('input', () => velja('#nytt-endurtaka').setCustomValidity(''));
  function synaNotanda() {
    const notandi = lesa('cs-innskradur', null);
    velja('#innskradur').hidden = !notandi;
    if (notandi) velja('#velkomin').textContent = 'Velkomin/n, ' + notandi.nafn + '!';
  }
  synaNotanda();
  velja('#stofna-form').addEventListener('submit', async (atburdur) => {
    atburdur.preventDefault();
    const form = atburdur.currentTarget;
    const lykilord = velja('#nytt-lykilord').value;
    velja('#nytt-endurtaka').setCustomValidity(lykilord === velja('#nytt-endurtaka').value ? '' : 'Lykilorðin verða að vera eins.');
    if (!form.reportValidity()) return;
    const notendur = lesa('cs-notendur', []);
    const netfang = velja('#nytt-netfang').value.trim().toLowerCase();
    if (notendur.some((n) => n.netfang === netfang)) return skilabod(skil, 'Þetta netfang er þegar skráð í þessum vafra.', true);
    const hnappur = form.querySelector('button[type="submit"]'); hnappur.disabled = true;
    try {
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).join('-');
      const afleida = await dulka(lykilord, salt);
      const nafn = velja('#nytt-nafn').value.trim();
      notendur.push({ nafn, netfang, salt, afleida });
      vista('cs-notendur', notendur);
      form.reset(); velja('#adgangs-hopur').hidden = true;
      velja('#adgangs-hopsnafn').disabled = true; velja('#adgangs-hopsnafn').required = false;
      veljaFlipa(false); velja('#inn-netfang').value = netfang;
      skilabod(skil, 'Aðgangur stofnaður! Þú getur nú skráð þig inn.');
    } catch { skilabod(skil, 'Ekki tókst að vista aðgang. Opnaðu vefinn á localhost eða HTTPS og leyfðu staðbundna geymslu.', true); }
    finally { hnappur.disabled = false; }
  });
  velja('#innskra-form').addEventListener('submit', async (atburdur) => {
    atburdur.preventDefault();
    const form = atburdur.currentTarget;
    if (!form.reportValidity()) return;
    const netfang = velja('#inn-netfang').value.trim().toLowerCase();
    const notandi = lesa('cs-notendur', []).find((n) => n.netfang === netfang);
    const hnappur = form.querySelector('button[type="submit"]'); hnappur.disabled = true;
    try {
      if (!notandi || await dulka(velja('#inn-lykilord').value, notandi.salt) !== notandi.afleida) {
        skilabod(skil, 'Netfang eða lykilorð er rangt. Hefurðu stofnað aðgang í þessum vafra?', true);
      } else {
        vista('cs-innskradur', { nafn: notandi.nafn, netfang: notandi.netfang });
        form.reset(); skilabod(skil, 'Innskráning tókst. Sjáumst í stúkunni!'); synaNotanda();
      }
    } catch { skilabod(skil, 'Innskráning virkar aðeins á localhost eða HTTPS með staðbundinni geymslu.', true); }
    finally { hnappur.disabled = false; }
  });
  velja('#utskra').addEventListener('click', () => {
    try { localStorage.removeItem('cs-innskradur'); synaNotanda(); skilabod(skil, 'Þú hefur verið skráð/ur út.'); }
    catch { skilabod(skil, 'Vafrinn leyfir ekki breytingu á geymslu.', true); }
  });
}

// Létt og hljóðlaust myndband í bakgrunni forsíðunnar.
const bakgrunnur = velja('#bakgrunnsmyndband');
if (bakgrunnur) {
  const hnappur = velja('#bakgrunns-pasa');
  const minniHreyfing = window.matchMedia('(prefers-reduced-motion: reduce)');
  function uppfaeraMyndband() { hnappur.textContent = bakgrunnur.paused ? 'Spila bakgrunnsmyndband' : 'Stöðva bakgrunnsmyndband'; }
  if (!minniHreyfing.matches) bakgrunnur.play().catch(uppfaeraMyndband);
  bakgrunnur.addEventListener('play', uppfaeraMyndband);
  bakgrunnur.addEventListener('pause', uppfaeraMyndband);
  hnappur.addEventListener('click', () => { if (bakgrunnur.paused) bakgrunnur.play().catch(uppfaeraMyndband); else bakgrunnur.pause(); });
  uppfaeraMyndband();
}
