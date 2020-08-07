# Hacker News Reacder

This application displays the most recent stories from Hacker News. It reads story lists and details from the [Hacker News API](https://github.com/HackerNews/API).

It leverages the [react-infinite-scroller](https://www.npmjs.com/package/react-infinite-scroller) module for infinite scrolling. This lightweight, heavily used, and tested module gives us scrolling with minimal bundle impact.

Finally, a Service Worker whose code is in `sw.js` is enabling offline capabilities. 

## Run the app

To run the app, run the following commands:
```
npm install
npm run start
```

Navigate to [`http://localhost:1234/`](http://localhost:1234/) in your browser to see the app!

## Run the tests

To run the tests, run the following command:
```
npm run test
```

To actively develop the tests, run the following command to re-run the tests when you make changes:
```
npm run test:watch
```

## Development

### Bundling

This application is bundled using [Parcel](https://parceljs.org/), a minimal configuration bundler.

### Service Worker

While actively developing the Service Worker, you will want to change some settings in your browser.

In **Chrome**, open your Console and go to the Application > Service Workers section. Check the 'Update on reload' box so that the service worker is refreshed on each page reload. This will allow you to see and test your changes as you develop.

### Unit tests

This repository is tested using [Jest](https://jestjs.io/) and [Enzyme](https://github.com/enzymejs/enzyme).

For testing coding style, these simple principles are followed:
* Aim for only one assertion per test, unless the test has a logical flow calling for multiple dependent assertions. (Multiple assertions should be rare.)
* Aim for each test to be its own tiny little universe with its own setup, execution, and assertions. Shared setup, teardown, etc. can make tests more difficult to debug and less trustworthy.
* Somewhat related to the former point, make tests DAMP ("Descriptive and Meaningful Phrase") instead of DRY ("Don't Repeat Yourself"). Repeating yourself is okay in tests in order to ensure that each test is readable and stands alone. (See [this StackOverflow post](https://stackoverflow.com/questions/6453235/what-does-damp-not-dry-mean-when-talking-about-unit-tests).)
