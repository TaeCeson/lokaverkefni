# Lokaverkefni — CS Stúkan

Íslenskt skólaverkefni um Counter-Strike, LAN-mót, spilarana og goðsagnir leiksins.

**Vefur:** https://taeceson.github.io/lokaverkefni/

## Keyra verkefnið

Opnaðu möppuna í Visual Studio Code. Notaðu Live Server eða keyrðu:

```sh
python3 -m http.server 5501
```

Opnaðu síðan http://localhost:5501. Innskráning notar Web Crypto og þarf localhost eða HTTPS.

## Síður

- `index.html` — forsíða, myndasýning, frétt um Vitality og CS2-myndband.
- `midar.html` — mót, sýnibókun, skilyrtir hóp- og VIP-reitir og tafla.
- `spilarar.html` — topp 10 tölfræði, tíu mót og aðdáendamat eftir hlutverki.
- `godsagnir.html` — sex þekktir CS-spilarar og söguleg lið.
- `adgangur.html` — innskráning og stofnun sýniaðgangs.
- `um.html` — verkefnið, litir, heimildir og útskýringar.
- `gamalt.html` — tilvísun á forsíðuna eftir fimm sekúndur.

## Matsatriði

| Atriði | Útfærsla |
| --- | --- |
| SVG-lógo í header | Einfalt miða- og skotmarksmerki, einnig í `myndir/logo.svg` |
| Myndir og texti | Fjórar opinberar skjámyndir úr CS2 og íslenskt efni |
| Form með skilyrtum reitum | Hópnafn fyrir hópmiða; heimsóknardagur fyrir VIP; hópnafn við stofnun aðgangs |
| Tafla í öllum skjástærðum | Raunveruleg HTML-tafla, skrun innan töfluramma þegar þarf |
| Efnisyfirlit í farsíma | Fellivalmynd með `<details>` og `<summary>` |
| Pico | Pico CSS 2; sameinað við eigin CSS |
| Ljóst og dökkt | Þemahnappur, val vistað í vafranum |
| Leturval | Arial fyrir texta, Arial Narrow / Impact fyrir fyrirsagnir |
| Sveigjanleg hönnun | Grid, flex, clamp og þrír stærðarflokkar, líka stórir skjáir |
| Kvikun | Hreyfitexti, innkoma texta, litabreyting lógós og hover-áhrif |
| Myndasýning | Fjórar myndir, fyrri/næsta og pásuhnappur |
| Ein þjöppuð stílsíða | Aðeins `styles.min.css` tengd í HTML-síðunum |
| Myndir í sérmöppu | `myndir/`, myndband í `myndbond/` |
| Birting | GitHub Pages úr `main`, rót geymslunnar |

Hreyfingar taka tillit til `prefers-reduced-motion`. Tilkynningar og myndasýning hafa pásuhnappa.

## Sameina CSS

```sh
python3 merge.py
```

Skriptan fylgir listanum úr verkefnalýsingunni:

```python
files_names = [
    "new", "grid", "table", "form", "menues", "popup", "icomoon",
    "chatbox", "kvikun", "accordion", "custom"
]
```

Hún les Pico fyrst, les hverja skrá í `css/`, sameinar textann, fjarlægir venjulegar athugasemdir og óþörf bil og skrifar `styles.min.css`. Bil í `calc()` og Pico-leyfisathugasemd varðveitast. Einföld þjöppun fyrir þessi tilteknu CSS-gögn; ekki almenn CSS-þáttun.

Skráarnöfnin í þessum lista og `merge.py` eru varðveitt samkvæmt verkefnalýsingunni. Eigin flokkar, JavaScript-breytur og sýnilegur texti eru að mestu á íslensku. `icomoon.css` geymir einföld táknstílssnið; enginn IcoMoon-leturpakki er notaður.

## Tilvísun eftir fimm sekúndur

`gamalt.html` notar sama HTML-atriði og dæmið sem fylgdi verkefninu, en vísar á forsíðu verkefnisins:

```html
<meta http-equiv="Refresh" content="5;url=index.html">
```

Upprunalega W3Schools-dæmið getur líka litið svona út:

```html
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Refresh" content="5;url=https://www.w3schools.com">
</head>
<body>
<p>Sorry! We have moved! The new URL is:
<a href="https://www.w3schools.com">https://www.w3schools.com</a></p>
<p>You will be redirected to the new address in five seconds.</p>
<p>If you see this message for more than 5 seconds, please click on the link above!</p>
</body>
</html>
```

## Tölfræði og heimildir

Gögn tekin saman **13. október 2026**. Þetta er föst útgáfa, ekki lifandi gagnaveita.

**Topp 10 núna:** heildartafla HLTV frá 13. júlí til 13. október, stórmót, mótherjar í topp 20, að lágmarki 20 kort. Röð eftir birtri Rating 3.0. Þetta er tölfræðiröðun með þessum síum, ekki opinber árleg verðlaunaröðun. [Heimild með síum](https://www.hltv.org/stats/players?startDate=2026-07-13&endDate=2026-10-13&matchType=BigEvents&rankingFilter=Top20).

**Tíu mót:** tíu nýjustu loknu alþjóðlegu LAN-mótin / Major-aðalmótin í HLTV-skránni með skráðan verðlaunapott að minnsta kosti 500.000 USD. Röð eftir lokadegi. Topp 10 hvers móts kemur úr heildartöflu þess, minnst 5 kort. Söguleg lið fylgja viðkomandi móti. Jafnar einkunnir fá sama sæti. Heimildir eru í `gogn/spilarar.json` og tengdar í vefnum.

**Hlutverkalistar:** aðdáendamat, ekki opinber tölfræðiröðun. Lið eru sannreynd í leikmannaupplýsingum HLTV. Lið hjá goðsögnum eru sérstaklega merkt söguleg þar sem það á við.

Frétt um sigur Vitality: [ESL](https://eslfaceitgroup.com/press/team-vitality-crowned-esl-pro-league-season-24-champions-following-the-leagues-return-to-the-big-stage-in-katowice/) og [HLTV](https://www.hltv.org/events/8244/esl-pro-league-season-24).

## Aðgangar og miðakaup

Þetta eru staðbundin sýnidæmi. Enginn bakendi, greiðslugátt eða raunveruleg miðasala. Aðgangar og sýnibókanir eru í geymslu þessa vafra. Aðgangar geyma salt og PBKDF2-afleiðu lykilorðs; ekki lykilorðið sjálft. Þetta gerir ekki innskráninguna að alvöru aðgangskerfi. Notaðu uppbúið netfang og sérstakt æfingalykilorð.

Hópmiði: minnst 4 miðar og 10% afsláttur. VIP: 5.000 kr. aukalega á miða. Öll verð eru uppbúin. Engar persónuupplýsingar úr miðareitum eru vistaðar í pöntunum.

## Myndir og myndband

- Fjórar skjámyndir og 56 sekúndna opinber CS2-kynning frá [Valve / Steam](https://store.steampowered.com/app/730/CounterStrike_2/).
- Myndir og leikjaefni eru eign Valve. Vefurinn er aðdáenda- og skólaverkefni og er ekki tengdur Valve, ESL, BLAST eða PGL.
- SVG-lógo er einfalt merki smíðað fyrir þetta verkefni.
- Pico er með MIT-leyfi, sjá `css/LEYFI-PICO.txt`.

Til að gera vefinn persónulegri má bæta við **einni breiðri LAN-stúkumynd**, **einni mynd af Vitality með bikar**, **andlitsmyndum goðsagnanna** og **10–20 sekúndna eigin CS-klippu**. Núverandi efni gerir vefinn tilbúinn án þessara viðbóta.

## Breyta verkefninu

Texti: HTML-síðurnar. Útlit: viðeigandi CSS-skrá og síðan `python3 merge.py`. Spilarar: `gogn/spilarar.json`; uppfæra líka samsvarandi gögn í `gogn/spilarar.js`. Staðbundið JavaScript gerir gagnalistana aðgengilega án gagnaveitu.

Hönnunin er einföld og hugsuð sem skólaverkefni. Fyrirmyndir úr fyrri verkefnum: `verkefni-1` (hreyfitexti, valmynd, form og tafla), `stoduprof2.2` (kvikun), grid-verkefni og letur-/litaval í `verkefni-5prufu`. Gym-verkefnið var ekki notað.
