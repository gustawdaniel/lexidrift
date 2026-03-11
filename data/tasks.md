[x] prepare words
[x] get translations
[x] write tests
[x] connect real llm
[x] add llm cache layer
[ ] add rate limiting
[x] deploy to production
[x] connect to logging service grafana
[x] sync prod and local db
[ ] connect nats
[x] get images
[ ] protobuf to share types
[ ] add auth layer
[ ] check R2 Object Storage from cloudflare

Definition styles:

| **Code Name**     | **Style**                | **Description**                                                                                               |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `wordup`          | **WordUp Style**         | Simple, user-friendly, and concise, with a focus on clarity and engagement.                                   |
| `wolfram`         | **Wolfram Alpha**        | Precise, factual, and somewhat technical, often providing linguistic details such as the word type and usage. |
| `diki`            | **Diki**                 | Clear and simple, with a practical, real-world approach.                                                      |
| `oxford`          | **Oxford**               | Formal, authoritative, comprehensive.                                                                         |
| `cambridge`       | **Cambridge**            | Clear, learner-friendly, with examples.                                                                       |
| `merriam_webster` | **Merriam-Webster**      | Formal, with multiple definitions and phonetic details.                                                       |
| `urban`           | **Urban Dictionary**     | Informal, humorous, slang-heavy.                                                                              |
| `etymological`    | **Etymological**         | Focus on the word's historical development.                                                                   |
| `learners`        | **Learner's**            | Simplified for non-native speakers, easy to understand.                                                       |
| `scientific`      | **Scientific/Technical** | Precise and specialized for fields like medicine or technology.                                               |
| `literary`        | **Literary**             | Descriptive and expressive, focused on connotation and artistic use.                                          |

Images:
https://www.blinkshot.io/

Flow:

Input:

- style: "wordup"
- lang_adjective: "spanish"
- word: "que"

```
using wordup style define spanish word "que", next to definition and example add prompt that ilustrate example in flux model, you can give one ore more examples, respond in json, print only json, nothing more, structure :

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
}
```

2. Get image:

3: Get tts of all parts.

4: play tts of:

- word [ src_lang ]
- definition [ target_lang ]
- example [ source_lang ]
- example [ target_lang ]

Services:

- mongo atlas gustaw.daniel+ld@gmail.com
- turso db gustaw.daniel+ld@gmail.com
- openai gustaw.daniel@gmail.com
- google gustaw.daniel@gmail.com
- domain https://www.spaceship.com gustaw.daniel@gmail.com
- dns cloudflare gustaw.daniel@gmail.com
- vps digitalocean office@preciselab.io
- ip 188.245.164.95
- dns zerotrust tunnels https://one.dash.cloudflare.com/416275d8b658f8f343bf49806950ad25/networks/tunnels

Turso: https://docs.turso.tech/quickstart#select-all-rows-from-table

```
turso db shell lexidrift
```

Turso schema

```sql
CREATE TABLE IF NOT EXISTS llm_requests (
    md5 TEXT PRIMARY KEY,
    input TEXT NOT NULL,
    model TEXT NOT NULL,
    output TEXT NOT NULL,
    finishReason TEXT NOT NULL,
    promptTokens INTEGER NOT NULL,
    completionTokens INTEGER NOT NULL,
    totalTokens INTEGER NOT NULL,
    requestTime INTEGER NOT NULL,
    durationMs INTEGER NOT NULL
)
```

prepare test db:

```
turso db shell lexidrift .dump > llm-cache.sql
cat llm-cache.sql | sqlite3 llm-cache.db
```

vps token: https://infisical.com/docs/integrations/platforms/docker-compose

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REDACTED.REDACTED

Docker registry: https://app.clickup.com/2153842/v/dc/21qbj-1044/21qbj-827

3. Configure docker private repository

Add lines

```
export DOCKER_REGISTRY_DOMAIN=registry.digitalocean.com
export DOCKER_TOKEN=YOUR_DIGITALOCEAN_TOKEN_HERE
```

to `~/.bashrc` on server for create global docker settings

4. Pull docker image on production

Login to registry

```
bash
echo ${DOCKER_TOKEN} | docker login -u ${DOCKER_TOKEN} ${DOCKER_REGISTRY_DOMAIN} --password-stdin;
```

INFISICAL_PROJECT_ID=28d53423-b8f5-499f-b76c-bc714da0e8d6

machine client id 38ed9b61-deaa-4b79-ab0a-202551b613f0
machine client secret YOUR_INFISICAL_CLIENT_SECRET_HERE

new token

```bash
infisical login --method=universal-auth --client-id=38ed9b61-deaa-4b79-ab0a-202551b613f0 --client-secret=YOUR_INFISICAL_CLIENT_SECRET_HERE --plain --silent --domain https://infisical.preciselab.space
```

https://github.com/louislam/dockge/discussions/684

speka.com

TODO:

```yaml
I word "test" correct word in english language?

Answer only yes or no.
```

---

App:

Like wordup:

- login account
-
