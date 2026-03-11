import { fetch } from "ofetch";

const token = `REDACTED_JWT_TOKEN`;

async function main() {
    // for (const lang of ["en", "pl", "de", "ru", "es"]) {
    const lang = 'ru';
    const limit = 350;
    const offset = 0;

    const wordsResponse = await fetch(
        `http://localhost:4747/words?lang=${lang}&limit=${limit}&offset=${offset}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const words = await wordsResponse.json();

    console.log(words);
    console.log('length', words.length);

    for (const word of words) {
        const definitionResponse = await fetch(`https://lexify.lexidrift.com/define`, {
            method: 'POST',
            body: JSON.stringify({
                word: word.word,
                style: "wordup",
                lang: word.lang,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const definition = await definitionResponse.json();

        console.log(definition);
    }

    // break;
    // }

}

main().catch(console.error);