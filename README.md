# InfoJobs Assistant - Chrome Extension

An assistant for job offers in InfoJobs. Identifies the offers that best suit your profile.

## Run Locally

1. Clone the project

```bash
  git clone https://github.com/alqubo/hackaton-infojobs-midudev.git
```

2. Go to the project directory

```bash
  cd hackaton-infojobs-midudev
```

3. Install dependencies

```bash
  npm install
```

4. Start the server

```bash
  npm run dev
```

5. Add the extension to your browser
- Chrome ([chrome://extensions/](chrome://extensions/))
- Brave ([brave://extensions/](brave://extensions/))

In the browser, go to the extensions page and switch on developer mode.
This enables the ability to locally install a Chrome extension.

Now click on the **LOAD UNPACKED** and browse to `[PROJECT_HOME]/build` ,
This will install the React app as a Chrome extension.

When you click the extension icon, you will see the React app, rendered as an extension popup.

## How to use

1. Complete the form accessing from the extension
2. Go to the detail of a job offer and it will automatically calculate the affinity.

## Authors
- [@alqubo](https://www.github.com/alqubo)

