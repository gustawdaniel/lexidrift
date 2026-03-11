#!/bin/bash

mkdir -p words

#[ ! -f words/en.txt ] && wget https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt -O words/en.txt
[ ! -f words/en.txt ] && wget https://norvig.com/ngrams/count_1w.txt -O words/en.txt
[ ! -f words/pl.txt ] && wget https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/pl/pl_50k.txt -O words/pl.txt
[ ! -f words/ru ] && wget https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/ru/ru_50k.txt -O words/ru.txt
