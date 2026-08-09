# AXIS

Mobile-first training capture, monitoring and supervision tool.

## v2

- Session-first workflow; no fixed workout plan required.
- Gym, outdoor and other training modes.
- Camera-first exercise logging.
- Live timestamp watermark burned into photo pixels immediately after capture.
- Watermarked photo hash + chained event seals.
- Saved training events are append-only in the UI; no edit flow.
- Dynamic next-move recommendations based on session gaps and 30-day structure.
- Rest-drift monitoring, finish gate, 7-day activity and 30-day balance signals.
- Local-first storage: metadata in LocalStorage, watermarked photos in IndexedDB.

Open `index.html` in a modern mobile browser, or serve the repository through any static host.

> Security note: v2 makes captured records tamper-evident inside the product, but a purely client-side web app cannot provide absolute cryptographic immutability against a user who controls the device/storage. Server-side signed timestamps and remote append-only storage are required for that guarantee.
