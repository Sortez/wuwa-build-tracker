# WuWa Build Tracker

Ein Build-Planer für **Wuthering Waves** als Windows-Desktop-App. Damit behältst du für jeden Charakter Level, Skills, empfohlene Waffen und Echo-Sets im Blick und kannst eigene Teams zusammenstellen. Empfohlene Builds und Teams basieren auf [Prydwen](https://www.prydwen.gg/wuthering-waves/) (Stand: Version 3.7).

## Download & Installation

1. Lade die neueste `WuWa-Build-Tracker_<version>_x64-setup.exe` unter **[Releases](https://github.com/Sortez/wuwa-build-tracker/releases/latest)** herunter.
2. Starte den Installer.
   - Windows zeigt eventuell „Der Computer wurde durch Windows geschützt“, weil die App nicht kostenpflichtig signiert ist. Klicke auf **Weitere Informationen → Trotzdem ausführen**.
3. Fertig. Voraussetzung ist Windows 10 oder 11.

## Updates

Die App prüft beim Start automatisch, ob es eine neue Version gibt, und bietet das Update mit einem Klick an. Dein Fortschritt bleibt dabei erhalten.

## Deine Daten

Alles wird nur lokal auf deinem PC gespeichert (`%APPDATA%\com.wuwa.buildtracker\wuwa-state.json`). Es gibt keinen Account und keinen Server.

## Entwicklung

Voraussetzungen: Node.js, Rust und die Visual Studio Build Tools (C++).

```bash
npm install
npm run dev            # Web-Version im Browser
npm run desktop:dev    # Desktop-App im Entwicklungsmodus
npm run typecheck
```

Neues Release veröffentlichen (nur Maintainer, benötigt den Signaturschlüssel und `gh`):

```bash
npm run release -- 0.2.0 "Was ist neu"
```

Weitere Details zu Daten und Architektur stehen in [AGENTS.md](AGENTS.md).

---

Inoffizielles Fan-Projekt, nicht mit Kuro Games verbunden. Spielnamen und -grafiken gehören ihren jeweiligen Rechteinhabern.
