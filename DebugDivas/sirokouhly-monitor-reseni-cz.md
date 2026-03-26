# Reseni pro sirokouhle monitory — Landing Page

## Problem

Pri implementaci landing page z Pencil designu (sirka 1440px) se na sirokouhlych monitorech obsah roztahoval pres celou sirku obrazovky. To zpusobovalo:

1. **Hero obrazek** zabiral celou vysku viewportu — uzivatel nevedel, ze ma scrollovat
2. **Sekce (team karty, sprint board, dictionary)** se roztahovaly do extremnich sirek — karty byly prazdne a neproporcionalni
3. **Celkovy dojem** — na vetsim monitoru stranka vypadala rozpadla a neprofesionalne

## Aplikovana reseni

### 1. Hero obrazek — z background-image na img tag

**Puvodni stav:**
```css
.hero {
  height: 761px;
  background: url('hero-bg.png') center / cover no-repeat;
}
```
- Obrazek se orizaval (cover), pri zmenseni vysky se ztratil obsah (nadpisy v obrazku)

**Reseni:**
```html
<img src="hero-bg.png" alt="..." class="hero-img">
```
```css
.hero-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 75vh;
  object-fit: contain;
}
```

**Proc:**
- `<img>` s `height: auto` zachovava pomer stran — nic se neorizne
- `max-height: 75vh` zajisti, ze obrazek nikdy nezabere vic nez 75 % vysky viewportu
- `object-fit: contain` zajisti, ze se obrazek vejde cely, bez orezu
- Pod obrazkem vzdy zustane videt zacatek dalsi sekce — uzivatel vi, ze ma scrollovat

### 2. Maximalni sirka vsech sekci

**Problem:** Na sirokouhlych monitorech (2560px+) se obsah roztahoval pres celou sirku.

**Reseni:**
```css
body {
  background: var(--bg-dark); /* tmave pozadi za obsahem */
}

.hero,
.team-section,
.sprint-section,
.dictionary-section,
.footer {
  max-width: 1440px;
  margin: 0 auto;
}
```

**Proc:**
- `max-width: 1440px` odpovida sirce designu v Pencilu
- `margin: 0 auto` centruje obsah na obrazovce
- `background: var(--bg-dark)` na body zajisti, ze prostor po stranach neni bily, ale ladne navazuje na tmave tema

### 3. Aplikace na vicero stranek

Stejne pravidla (`max-width` + `margin: 0 auto`) je nutne aplikovat na **kazdou sekci** na kazde strance, nejen na hlavni landing page. V tomto projektu:
- `index.html` — landing page
- `bug-hunt.html` — Bug Hunt stranka
- `member-detail.html` — Member Detail sablona

## Shruti pro budouci projekty

Pri konverzi designu (1440px) do HTML/CSS vzdy:

1. **Hero obrazek** pouzij jako `<img>` (ne background-image), pokud obsahuje dulezity textovy obsah
2. **Omez vysku** hero sekce pres `max-height: 75vh` aby bylo videt dalsi obsah
3. **Nastav `max-width: 1440px`** na vsechny sekce + `margin: 0 auto`
4. **Body background** nastav na barvu, ktera odpovida tmavemu okraji designu
5. **Testuj na ruznych sirkach** — minimalne 1440px, 1920px a 2560px
