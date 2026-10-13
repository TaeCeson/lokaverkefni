/* Sannreynd gögn með heimildum. Engar uppbúnar einkunnir. */
const gogn = spilaraGogn;
const tolusnid = { format: (tala) => tala.toFixed(2).replace('.', ',') };
const manudir = ['janúar','febrúar','mars','apríl','maí','júní','júlí','ágúst','september','október','nóvember','desember'];
const dagsetning = (dagur) => { const [ar, manudur, dag] = dagur.split('-'); return Number(dag) + '. ' + manudir[Number(manudur)-1] + ' ' + ar; };

function tafla(reitur, spilarar) {
  reitur.replaceChildren();
  spilarar.forEach((spilari, numer) => {
    const rod = document.createElement('tr');
    const saeti = document.createElement('td'); saeti.className = 'leikmanna-numer'; saeti.textContent = spilari.rank ?? numer + 1;
    const nafn = document.createElement('th'); nafn.scope = 'row';
    const tengill = document.createElement('a'); tengill.href = spilari.source; tengill.textContent = spilari.name;
    tengill.target = '_blank'; tengill.rel = 'noopener'; nafn.append(tengill);
    const lid = document.createElement('td'); lid.textContent = spilari.team;
    const einkunn = document.createElement('td'); einkunn.className = 'einkunn'; einkunn.textContent = tolusnid.format(spilari.rating);
    const kort = document.createElement('td'); kort.textContent = spilari.maps;
    rod.append(saeti, nafn, lid, einkunn, kort); reitur.append(rod);
  });
}

// Flipar eru einfaldir hnappar sem sýna einn kafla í einu.
document.querySelectorAll('[data-spilaraflipi]').forEach((hnappur) => {
  hnappur.addEventListener('click', () => {
    const valinn = hnappur.dataset.spilaraflipi;
    ['heild','mot','hlutverk'].forEach((nafn) => { velja('#spilarar-' + nafn).hidden = nafn !== valinn; });
    document.querySelectorAll('[data-spilaraflipi]').forEach((h) => h.setAttribute('aria-pressed', String(h === hnappur)));
  });
});
velja('#spilarar-heild h2').textContent = gogn.currentRanking.label;
velja('#heild-adferd').textContent = gogn.currentRanking.method + ' ' + gogn.currentRanking.limitation;
velja('#heild-caption').textContent = gogn.currentRanking.period;
function leita() {
  const leit = velja('#spilaraleit').value.toLocaleLowerCase('is-IS').trim();
  const spilarar = gogn.currentRanking.players.filter((s) => (s.name + ' ' + s.team).toLowerCase().includes(leit));
  tafla(velja('#heild-tafla'), spilarar);
  velja('#leit-nidurstada').textContent = spilarar.length ? '' : 'Enginn spilari fannst í þessum lista.';
}
velja('#spilaraleit').addEventListener('input', leita);
leita();
const heildartengill = document.createElement('p'); heildartengill.className = 'heimild';
const hlekkur = document.createElement('a'); hlekkur.href = gogn.currentRanking.globalSource;
hlekkur.textContent = 'Heildartölfræði allra spilara á HLTV ↗'; heildartengill.append(hlekkur);
velja('#spilarar-heild').append(heildartengill);

velja('#mota-adferd').textContent = gogn.tournaments.method + ' ' + gogn.tournaments.playerMethod;
const motaval = velja('#motaval');

gogn.tournaments.events.forEach((mot, numer) => {
  const val = document.createElement('option'); val.value = String(numer); val.textContent = mot.name; motaval.append(val);
});
function synaMot() {
  const rammi = velja('#mota-upplysingar'); rammi.replaceChildren();
  const mot = gogn.tournaments.events[Number(motaval.value)];
  const titill = document.createElement('h3'); titill.textContent = mot.name;
  const texti = document.createElement('p'); texti.className = 'smatt';
  texti.textContent = `${dagsetning(mot.start)} – ${dagsetning(mot.end)} · ${mot.location}`;
  const tengill = document.createElement('a'); tengill.href = mot.statsSource;
  tengill.textContent = 'Heildartölfræði mótsins á HLTV ↗';
  rammi.append(titill, texti, tengill);
  tafla(velja('#mota-tafla'), mot.ranking);
  velja('#mota-caption').textContent = 'Topp 10 á mótinu · minnst 5 kort';
  velja('#mota-skyring').textContent = `${mot.samplePlayers} raðir í heildartöflunni. ${gogn.tournaments.limitation}`;
}
motaval.addEventListener('change', synaMot);
synaMot();

const allirSpilarar = [...(gogn.currentRanking.allCandidates ?? gogn.currentRanking.players), ...gogn.roles.additionalPlayers];
const hlutverk = [ ['riflers','Riffilspilarar','Riflers'], ['awpers','AWP-spilarar','AWPers'], ['anchors','Svæðisverðir','Anchors'], ['igls','Leikstjórnendur','IGLs'] ];
hlutverk.forEach(([lykill, titill, enska]) => {
  const kort = document.createElement('article');
  const haus = document.createElement('h3'); haus.textContent = titill + ' · ' + enska;
  const listi = document.createElement('ol'); listi.className = 'hlutverka-listi';
  gogn.roles[lykill].forEach((nafn) => {
    const spilari = allirSpilarar.find((s) => s.name.toLowerCase() === nafn.toLowerCase());
    const lidur = document.createElement('li');
    const tengill = document.createElement('a'); tengill.textContent = nafn; tengill.href = spilari?.source ?? 'https://www.hltv.org/';
    const lid = document.createElement('small'); lid.textContent = spilari?.team ?? 'Sjá lið í heimild';
    lidur.append(tengill, lid); listi.append(lidur);
  });
  kort.append(haus, listi); velja('#hlutverkakort').append(kort);
});
