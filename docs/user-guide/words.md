# Word Definitions

App contains list of words sorted by frequency of usage in any supported language.

Langauges:
- English
- German
- Spanish
- Polish
- Russian

To learn them we're asking LLM model for concise definition, translation and examples with images promprs.

```
`using ${style} style define ${lang} word "${word}", next to definition and example add prompt that ilustrate example in flux model, you can give one ore more examples, respond in json, print only json, nothing more, structure:

{
  "word": "",
  "translation": {
    "en": "",
    "de": "",
    "es": "",
    "pl": "",
    "ru": "",
  },
  "definition": {
    "en": "",
    "de": "",
    "es": "",
    "pl": "",
    "ru": "",
  },
  "examples": [{
    "part_of_speech": "",
    "en": "",
    "de": "",
    "es": "",
    "pl": "",
    "ru": "",
    "image_prompt": ""
  }]
}`
```

We use another service to convert prompts into images and texts into naturally sounding voices.

Thanks to these data you can see card of word when you can learn about it.

---

These definitions are good but not perfect, so we will add possibility to correct them in app.
Now please sent all corrections to [gustaw.daniel@gmail.com](mailto:gustaw.daniel@gmail.com)

