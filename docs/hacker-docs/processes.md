# Processes

1. Words frequency preparation:

This is manually done research. We are using an existing words frequency lists.

2. Definition corrections:

To redefine word we have to:
a) change flag `correct` of `word` to `true`
b) clear cached response from LLM in `lexify` service
