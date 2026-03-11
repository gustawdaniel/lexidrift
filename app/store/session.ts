import {useUserStore} from "~/store/user";
import {createEventSource, type EventSourceClient} from 'eventsource-client'
import dayjs from "dayjs";

export interface Session {
    id: string;
    createdAt: Date;
    endedAt: Date | null;
}

export const useSessionStore = defineStore('sessionStore', () => {
    const userStore = useUserStore();
    let eventSource: EventSourceClient | null = null;

    async function startSession() {
        if(!userStore.token) {
            return;
        }

        eventSource = createEventSource(
            {
                url: `${import.meta.env.VITE_API_URL}/sse`,
                onMessage: ({data, event, id}) => {
                    console.log('Data: %s', data)
                    console.log('Event ID: %s', id) // Note: can be undefined
                    console.log('Event: %s', event) // Note: can be undefined
                    const message = JSON.parse(data);
                    console.log('SSE message', message);
                },
                fetch: (input, init) =>
                    fetch(input, {
                        ...init,
                        headers: {
                            ...init?.headers,
                            Authorization: `Bearer ${userStore.token}`,
                        },
                    }),
            })

    }

    async function stopSession() {
        eventSource?.close();
        eventSource = null;
    }

    async function getSessions() {
        if(!userStore.token) {
            throw new Error('No token');
        }

        const res = await $fetch<Session[]>(`/sessions`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userStore.token}`,
            },
            params: {
                from: dayjs().subtract(7, 'day').toISOString(),
                to: dayjs().toISOString(),
            },
            baseURL: import.meta.env.VITE_API_URL,
        });

        console.log('res', res);

        return res;
    }

    return {
        startSession,
        stopSession,
        getSessions
    };

});