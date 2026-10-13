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
  midar: 'Farðu í „Mót og miðar“ og veldu „Velja miða“. Þetta er æfing án greiðslu.',
  adgangur: 'Farðu í „Aðgangur“ og veldu „Stofna aðgang“. Notaðu uppbúið netfang og æfingalykilorð.',
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
    velja('#myndatexti').textContent = '0' + (myndNumer + 1) + ' / 04 — Counter-Strike 2';
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

// Sýnibókanir; verð eru uppbúin fyrir verkefnið.
const mot = {
  singapor: { nafn: 'PGL Singapore Major', verd: 14900, fra: '2026-11-25', til: '2026-12-13' },
  blast: { nafn: 'BLAST Open Singapore', verd: 9900, fra: '2027-03-15', til: '2027-03-28' },
  lan: { nafn: 'LAN-kvöld í Reykjavík', verd: 4900, fra: '2026-11-07', til: '2026-11-07' }
};
const popup = velja('#mida-popup');
function synaMidana() {
  const listi = velja('#midarnir-minir');
  if (!listi) return;
  listi.replaceChildren();
  const pantanir = lesa('cs-midar', []);
  if (!pantanir.length) {
    const texti = document.createElement('p');
    texti.className = 'tomt'; texti.textContent = 'Þú hefur ekki bókað sýnimiða ennþá.';
    listi.append(texti);
  }
  pantanir.slice().reverse().forEach((pontun) => {
    const kort = document.createElement('div'); kort.className = 'kassi';
    const titill = document.createElement('strong'); titill.textContent = pontun.mot;
    const texti = document.createElement('p'); texti.className = 'smatt';
    texti.textContent = `${pontun.fjoldi} miðar · ${kronur(pontun.samtala)} · ${pontun.numer} · SÝNIBÓKUN`;
    kort.append(titill, texti); listi.append(kort);
  });
}
synaMidana();
if (popup) {
  const form = velja('#midaform');
  let virktMot;
  let upprunaHnappur;
  let samtala = 0;
  function uppfaeraMida() {
    const tegund = velja('#midategund').value;
    const hopur = tegund === 'hopur';
    const vip = tegund === 'vip';
    velja('#hopskilyrdi').hidden = !hopur;
    velja('#hopsnafn').disabled = !hopur;
    velja('#hopsnafn').required = hopur;
    velja('#vipskilyrdi').hidden = !vip;
    velja('#vipdagur').disabled = !vip;
    velja('#vipdagur').required = vip;
    velja('#fjoldi').min = hopur ? '4' : '1';
    const fjoldi = Number(velja('#fjoldi').value);
    samtala = Math.round(fjoldi * (virktMot.verd + (vip ? 5000 : 0)) * (hopur ? .9 : 1));
    velja('#midasamtala').textContent = Number.isFinite(samtala) ? kronur(samtala) : 'Veldu fjölda';
  }
  document.querySelectorAll('[data-mot]').forEach((hnappur) => {
    hnappur.addEventListener('click', () => {
      upprunaHnappur = hnappur;
      virktMot = mot[hnappur.dataset.mot];
      form.reset();
      form.querySelector('button[type="submit"]').disabled = false;
      velja('#mot-id').value = hnappur.dataset.mot;
      velja('#mida-titill').textContent = virktMot.nafn;
      velja('#vipdagur').min = virktMot.fra;
      velja('#vipdagur').max = virktMot.til;
      velja('#mida-nidurstada').hidden = true;
      const notandi = lesa('cs-innskradur', null);
      if (notandi) { velja('#midanafn').value = notandi.nafn; velja('#midanetfang').value = notandi.netfang; }
      uppfaeraMida();
      popup.showModal();
    });
  });
  velja('#midategund').addEventListener('change', () => {
    if (velja('#midategund').value === 'hopur' && Number(velja('#fjoldi').value) < 4) velja('#fjoldi').value = '4';
    uppfaeraMida();
  });
  velja('#fjoldi').addEventListener('input', uppfaeraMida);
  velja('#loka-popup').addEventListener('click', () => popup.close());
  popup.addEventListener('close', () => upprunaHnappur?.focus());
  form.addEventListener('submit', (atburdur) => {
    atburdur.preventDefault();
    if (!form.reportValidity()) return;
    const numer = 'CS-' + Date.now().toString(36).toUpperCase();
    const pantanir = lesa('cs-midar', []);
    // Persónuupplýsingar úr miðareitum eru ekki vistaðar.
    pantanir.push({ mot: virktMot.nafn, fjoldi: Number(velja('#fjoldi').value), samtala, numer });
    try {
      vista('cs-midar', pantanir);
      skilabod(velja('#mida-nidurstada'), `Sýnibókun ${numer} er vistuð! ${kronur(samtala)} Engin greiðsla fór fram.`);
      form.querySelector('button[type="submit"]').disabled = true;
      synaMidana();
    } catch { skilabod(velja('#mida-nidurstada'), 'Vafrinn leyfir ekki vistun. Prófaðu að leyfa staðbundna geymslu.', true); }
  });
}

// Aðgangar í sýnidæminu. PBKDF2 geymir afleiðu lykilorðs, ekki lykilorðið sjálft.
// Þetta er eingöngu staðbundin æfing; alvöru innskráning þarf bakenda.
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
      skilabod(skil, 'Sýniaðgangur stofnaður! Þú getur nú skráð þig inn.');
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
