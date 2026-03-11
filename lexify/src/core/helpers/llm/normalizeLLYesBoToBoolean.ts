export function normalizeLLYesBoToBoolean(value: string): boolean {
    value = value.toLowerCase();

    if(value.endsWith('.')) {
        value = value.slice(0, -1);
    }

    return value === "yes";
}