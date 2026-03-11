export function buildQueryToMarkText(text: string): string[] {
    let queries: string[] = []

    // remove all text in brackets
    text = text.replace(/\(.*?\)/g, '');

    if(text.includes('/')) {
        queries = text.split('/');
        return queries.map(query => query.trim());
    }

    if(text.includes(';')) {
        queries  = text.split(';');
        return queries.map(query => query.trim());
    }

    if(text.includes(',')) {
        queries  = text.split(',');
        return queries.map(query => query.trim());
    }

    return [text.trim()];
}