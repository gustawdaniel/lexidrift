// TODO: Move to shared lib
export type Language = "en" | "de" | "es" | "pl" | "ru";

// TODO: Move to shared lib
export interface Word {
  word: string;
  count: number;
  lang: Language;
}
