# Technical documentation

Lexidrift is app that support users in memorizing vocabulary.

It bases on multimodal `word` representation that help in memorization and spaced repetition algorithm, but what makes it special is export of custom generated content to consume out of app.

To satisfy these goals we're using the following services:

- data - set of scripts to prepare initial data seed
- lexify - generates word definitions
- vocalize - responsible for word pronunciation
- imagify - generates images of words
- api - connect user with all other services
- video - generates video files
- app - nuxt frontend for user
- landing - astro landing page
- docs - vite press docs

We're describing them in Architecture section.