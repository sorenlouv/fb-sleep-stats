# fb-sleep-stats: Using Facebook to track your friends' sleep

A small tool to show the potential privacy implications modern social media have. By tracking online/offline status of people on Facebook, it is possible to get an accurate image of their sleep pattern.

Read the blog post: https://medium.com/@sqrendk/how-you-can-use-facebook-to-track-your-friends-sleeping-habits-505ace7fffb6

![Facebook Sleep Screenshot](https://cloud.githubusercontent.com/assets/209966/13382859/b7b31aa4-de7e-11e5-8fca-35d68fe2f02f.png)


## Installation

**Prerequisites**
 - Git ([how to install](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
 - Node.js ([how to install](https://docs.npmjs.com/getting-started/installing-node))

**Clone repository**
```
git clone https://github.com/sqren/fb-sleep-stats.git
```

**Configuration**

Open the source code folder:
```
cd fb-sleep-stats
```

Copy the default config file:
```
cp config/default.json config/development.json
```

Update the following values in `config/development.json`
 - "c_user": [your numeric Facebook user id](http://findmyfbid.com/)
 -  "xs": [xs value from Facebook cookie] 
 ```
    1.  Open www.messenger.com
    2. Open Developer Tools
    3. Click "Application" tab
    4. Click, "Cookies" in the left panel
    5. Click "www.messenger.com"
    6. Copy the value of "xs"
    ```

 - "appId": [Facebook App Id](https://gist.github.com/sqren/1ac0f5d316fcbd46d8c1)

*Make sure there are no trailing tabs or spaces in the config file!*

**Install dependencies**
```
npm install
```

**Build browser dependencies**
```
npm run webpack
```

## Starting

You need to have two processes running simultaniously: the scraper and the webserver. Therefore, you must run the following two commands in separate windows/tabs.

**Start scraping**

*This will run continously, polling Facebook every 10 minutes. Keep it running for as long as you want to track sleep.*
```
npm run scrape
```

**Start server**
```
npm start
```

See the result in the browser: [http://localhost:3000](http://localhost:3000)

#Troubleshooting

**I get an error when running "npm run webpack"**

Try re-installing the node-modules:
```
rm -rf node_modules
npm install
npm run webpack
```

**No users show up**
 - If you have an ad-blocker, you must disable it for the site.
 - You need to run `npm run scrape` and keep it running. When you stop it, it will stop tracking.

**Changes to development.json are not picked up**
 - You have to run `npm run webpack`

**How do I update to the latest version?**

After pulling the latest version, you must rebuild the dependencies:
```
git pull
rm -rf node_modules
npm install
npm run webpack
```

**ReferenceError: Promise is not defined**

Update Node.js to the latest stable version of the branch you are on (v5.7.1, v4.3.2 or v0.12.11). After that rebuild dependencies:
```
rm -rf node_modules
npm install
npm run webpack
```

**Cannot parse config file**

Your config file contains invalid json. Find the errors by using a tool like [http://jsonlint.com/](http://jsonlint.com/)

**Where is the data stored?**

You can find the data in JSON-format here: `src/server/services/db.json`.

**Other issues**

If you encounter a bug or have a problem, please go to [Issues](https://github.com/sqren/fb-sleep-stats/issues?utf8=%E2%9C%93&q=is%3Aissue+) and use the search functionality, in case someone else already asked the question. If you can't find anything helpful you are very welcome to create a [new issue](https://github.com/sqren/fb-sleep-stats/issues/new)


# Disclaimer
Facebook reached out to me and informed me, that it is against their terms to access their website by automated means. Additionally I am not allowed to urge anyone to do so. Therefore: I urge you to use this project for educational purpose only, and not use it to access Facebook.
