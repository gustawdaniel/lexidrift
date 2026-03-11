import type {Ref} from "vue";

export const useSettingsStore = defineStore('settings',
    (): {
        readWords: Ref<boolean>;
        readCorrectSentence: Ref<boolean>;
        readIncorrectSentence: Ref<boolean>;
    } => {
        const readWords = ref(true);
        const readCorrectSentence = ref(true);
        const readIncorrectSentence = ref(true);

        return {
            readWords,
            readCorrectSentence,
            readIncorrectSentence,
        }
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.cookies(),
            debug: true,
        },
    },
)