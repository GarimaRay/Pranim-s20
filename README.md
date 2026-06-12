# From Nepal to Australia - Chapter 20

An interactive birthday game that mixes a travel mission, an airport departure board,
a racing-game garage, memories, and a final Australia celebration.

## Quick start

No framework or build step is required. Open `index.html` in a browser, or run a local
server from the project folder:

```powershell
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Personalize the game

Most text is stored in [`data/content.js`](data/content.js). Update:

- His name and nickname
- Favorite car and bike
- Birthday messages
- Timeline memories
- Garage vehicles
- Final birthday message

Replace the placeholder files in `assets/` using the same filenames, or update their
paths in `data/content.js`.

## What I need from you

Put the following originals in `assets/source-private/`. This folder is ignored by Git,
so personal source photos are not accidentally published.

1. `character-reference.jpg` - one clear, front-facing photo for the cartoon character
2. `character-outfit.jpg` - optional full-body photo showing his usual style
3. `bike-reference.jpg` - his real bike or dream bike
4. `car-reference.jpg` - his favorite car
5. `memory-01.jpg` to `memory-06.jpg` - favorite photos in timeline order
6. `engine.mp3` - optional short engine sound
7. `takeoff.mp3` - optional airplane takeoff sound
8. `birthday-song.mp3` - optional background music you have permission to use

Also fill in [`CONTENT_CHECKLIST.md`](CONTENT_CHECKLIST.md).

## Cartoon character deliverables

For a useful game character, create transparent PNG or WebP files at roughly
`1200 x 1600` pixels:

- `assets/character/hero-idle.webp`
- `assets/character/hero-rider.webp`
- `assets/character/hero-passport.webp`
- `assets/character/hero-celebrate.webp`

Keep the same face, hairstyle, outfit colors, and illustration style in all poses.
The source reference photo should remain in `assets/source-private/`, not GitHub.

The first completed pose is available at `assets/character/hero-idle.png` and is used
on the mission briefing screen.

## Repository structure

```text
.
|-- index.html
|-- css/
|   `-- styles.css
|-- js/
|   `-- game.js
|-- data/
|   `-- content.js
|-- assets/
|   |-- audio/
|   |-- character/
|   |-- icons/
|   |-- memories/
|   |-- vehicles/
|   `-- source-private/     # ignored by Git
|-- CONTENT_CHECKLIST.md
|-- LICENSE
`-- README.md
```

## GitHub Pages

Push the repository to GitHub, then open **Settings > Pages**. Choose **Deploy from a
branch**, select the main branch and `/ (root)`, then save.

## Privacy

Only publish photos and messages with permission. Avoid phone numbers, addresses,
passport details, school IDs, tickets, or other private information.
