# fb-sleep

A small tool to show the potential privacy implications modern social media have.
By tracking online/offline status of people on Facebook, it is possible to get an accurate image of their daily routine, and when they go to sleep, and get up in the morning.

## Installation
Clone repository:
```
git clone git@github.com:sqren/fb-sleep-stats.git
```

Copy config, and update `config/development.json`:
```
cp config/default.json config/development.json
```

Build assets
```
npm run build-minified
```

## Starting

Start scraping
```
npm run scrape
```

Start server
```
npm start
```
