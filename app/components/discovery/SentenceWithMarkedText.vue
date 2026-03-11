<script setup lang="ts">
import {buildQueryToMarkText} from "~/helpers/buildQueryToMarkText";

const props = defineProps<{
  sentence: string;
  markedText: string;
}>();

import cloneRegexp from 'clone-regexp';
import diacritics from 'diacritics';


function mergeRange([...ranges]) {
  if (!ranges.length) return [];

  ranges.sort((fir, sec) => {
    if (fir[0] !== sec[0]) return fir[0] - sec[0];
    return fir[1] - sec[1];
  });

  const merged = [];

  let curStart = ranges[0][0];
  let curEnd = ranges[0][1];

  ranges.shift();

  ranges.forEach(([start, end]) => {
    if (start >= curEnd) {
      merged.push([curStart, curEnd]);
      curStart = start;
      curEnd = end;
    } else if (end > curEnd) curEnd = end;
  });

  merged.push([curStart, curEnd]);

  return merged;
}

const isDigit = char => /^\d+$/.test(char);
const isLetter = char => char.toUpperCase() !== char.toLowerCase() || char.codePointAt(0) > 127;
const isLetterOrDigit = char => isLetter(char) || isDigit(char);


function indicesOf(
    text: string,
    searchStringOrRegex: RegExp | string,
    { caseSensitive = false, diacriticsSensitive = false, wholeWordMatch = false } = {},
) {
  if (searchStringOrRegex instanceof RegExp) {
    const re = cloneRegexp(searchStringOrRegex, { global: true });
    const indices = [];

    let match = re.exec(text);
    while (match) {
      const offset = match.index + match[0].length;
      indices.push([match.index, offset]);
      match = re.exec(text);
    }
    return indices;
  }
  const searchStringLen = searchStringOrRegex.length;

  if (searchStringLen === 0) {
    return [];
  }

  const indices = [];

  let strCpy = text;
  let searchStringCpy = searchStringOrRegex;
  if (!caseSensitive) {
    strCpy = text.toLocaleLowerCase();
    searchStringCpy = searchStringOrRegex.toLocaleLowerCase();
  }

  if (!diacriticsSensitive) {
    strCpy = diacritics.remove(strCpy);
    searchStringCpy = diacritics.remove(searchStringCpy);
  }

  let startIndex = 0;
  let index = strCpy.indexOf(searchStringCpy, startIndex);
  while (index > -1) {
    startIndex = index + searchStringLen;
    indices.push([index, startIndex]);

    index = strCpy.indexOf(searchStringCpy, index + 1);
  }

  if (wholeWordMatch) {
    const strLength = strCpy.length;
    return indices.filter((range) => {
      const [start, end] = range;
      const idxBefore = start - 1;
      const idxAfter = end;
      const idxBeforeIsLetterOrDigit = idxBefore > 0 && isLetterOrDigit(strCpy[idxBefore]);
      const idxAfterIsLetterOrDigit = idxAfter < strLength && isLetterOrDigit(strCpy[idxAfter]);
      return !(idxAfterIsLetterOrDigit || idxBeforeIsLetterOrDigit);
    });
  }

  return indices;
}

function highlightChunks(
    text: string,
    queriesOrQuery: string[] | RegExp[] | string | RegExp,
    { caseSensitive = false, diacriticsSensitive = false, wholeWordMatch = false } = {},
) {
  let queries = queriesOrQuery;
  if (typeof queriesOrQuery === 'string' || queriesOrQuery instanceof RegExp) {
    queries = [queriesOrQuery];
  } else if (!Array.isArray(queriesOrQuery)) {
      throw new Error('queries must be either string, array of strings or regex.');
  }

  const matches = [];

  queries.forEach((query) => {
    matches.push(...indicesOf(text, query, { caseSensitive, diacriticsSensitive, wholeWordMatch }));
  });

  const highlights = mergeRange(matches);

  const chunks = [];
  let lastEnd = 0;

  highlights.forEach(([start, end], index) => {
    if (lastEnd !== start) {
      chunks.push({
        isHighlighted: false,
        text: text.slice(lastEnd, start),
      });
    }
    chunks.push({
      isHighlighted: true,
      text: text.slice(start, end),
      highlightIndex: index,
    });

    lastEnd = end;
  });

  if (lastEnd !== text.length) {
    chunks.push({
      isHighlighted: false,
      text: text.slice(lastEnd),
    });
  }

  return chunks;
}


const parts = computed(() => {
  const parts = props.sentence.match(props.markedText);

  console.log('parts', parts);


  return highlightChunks(props.sentence, buildQueryToMarkText(props.markedText));
  // return parts.map((part, index) => {
  //   return {
  //     text: part,
  //     isMarked: index !== parts.length - 1,
  //   };
  // });
});
</script>

<template>
  <p>
    <span v-for="(part, index) in parts" :key="index" :class="{'font-bold text-indigo-500': part.isHighlighted}">
      {{ part.text }}
    </span>
  </p>

</template>

<style scoped>

</style>