# fb-sleep

A small tool to show the potential privacy implications modern social media have.
By tracking online/offline status of people on Facebook, it is possible to get an accurate image of their daily routine, and when they go to sleep, and get up in the morning.
Read the blog post: https://medium.com/@sqrendk/how-you-can-use-facebook-to-track-your-friends-sleeping-habits-505ace7fffb6

## Installation
Clone repository:
```
git clone git@github.com:sqren/fb-sleep-stats.git
```

Copy config, and update `config/development.json`
```
cp config/default.json config/development.json
```

Update the following values in `config/development.json`
 - "c_user": your Facebook user id
 -  "xs": [xs value from Facebook cookie](https://gist.github.com/sqren/0e4563f258c9e85e4ae1)

Install dependencies
```
npm install
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
