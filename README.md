# MusicPlays – Discord Activity

Jednoduchá Discord Activity pro poslech hudby (YouTube + Spotify embed).

## Application ID
`1508856871346245904`

## Jak nasadit

### Varianta A – Vercel (doporučeno)
1. Vytvoř účet na https://vercel.com
2. Importuj tento repozitář (nebo nahraj složku)
3. Deploy
4. Zkopíruj URL (např. `musicplays.vercel.app`)

### Varianta B – GitHub Pages
1. Nahraj tento projekt na GitHub
2. Settings → Pages → Source: GitHub Actions nebo branch `gh-pages`
3. Po buildu bude na `https://TVOJE-JMENO.github.io/musicplays/`

## Discord Developer Portal
1. Jdi na https://discord.com/developers/applications/1508856871346245904
2. **Activities** → **URL Mappings**
   - Prefix: `/`
   - Target: `tvoje-domena.vercel.app` (bez https://)
3. **OAuth2** → Redirects: můžeš dát `https://127.0.0.1` (SDK to řeší samo)
4. Activities → Settings → Enable Activities = ON

## Lokální test
```bash
npm install
npm run dev
```
Pak použij cloudflared tunnel a nastav Application URL Override v Discordu.

## Poznámka k autentizaci
Pro plnou autentizaci uživatelů (jméno, avatar) je potřeba malý backend, který vymění OAuth kód za token.
Tato verze funguje i bez něj – přehrávač běží a UI je připravené.
