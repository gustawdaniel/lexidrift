import {defineStore} from 'pinia';
import type {Ref} from 'vue';
import {ref} from 'vue';
import {$fetch, FetchError} from 'ofetch';
import type {AuthorizationSuccessResponse, Language, User} from "~/types/authTypes";
import {useSessionStore} from "~/store/session";
import {client} from "@passwordless-id/webauthn";

export interface UserListItem extends User {
    company: { id: string; name: string };
}

export interface UpdateUserParams {
    language?: Language;
    defaultLanguageToLearn?: Language;
}

export const useUserStore = defineStore(
    'userStore',
    (): {
        user: Ref<User | null>;
        token: Ref<string | null>;
        impersonatedFrom: Ref<{ user: User, token: string } | null>;
        verifyGoogleCredential: (credential: string) => Promise<void>;
        webauthnRegister: (email: string, fullName: string) => Promise<void>;
        webauthnLogin: () => Promise<void>;
        isAdmin: ComputedRef<boolean>;
        logout: () => Promise<void>;
        updateUser: (updateUserParams: UpdateUserParams) => Promise<void>;
        getUsersList: () => Promise<UserListItem[]>;
        impersonateUser: (id: string) => Promise<void>;
        revertImpersonation: () => Promise<void>;
    } => {
        const sessionStore = useSessionStore();

        const user = ref<User | null>(null),
            token = ref<string | null>(null),
            impersonatedFrom = ref<{ user: User, token: string } | null>(null);

        async function verifyGoogleCredential(credential: string) {
            try {
                const res = await $fetch<AuthorizationSuccessResponse>(`${import.meta.env.VITE_API_URL}/google-verify`, {
                    method: 'POST',
                    body: JSON.stringify({credential})
                })

                console.log("verified user", res);
                token.value = res.token;
                user.value = res.user;

                await sessionStore.startSession();

                // window.userStore = userStore;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }

        async function webauthnRegister(email: string, fullName: string): Promise<void> {
            try {
                if (!email) {
                    alert('Please enter an email address');
                    return;
                }


                if (!fullName) {
                    alert('Please enter a full name');
                    return;
                }

                const {challenge, userId} = await $fetch<{
                    challenge: string,
                    userId: string
                }>('/generate-registration-options', {
                    method: 'GET',
                    baseURL: import.meta.env.VITE_API_URL,
                    query: {email: email},
                })

                const registration = await client.register({
                    user: {
                        id: userId,
                        name: email,
                        displayName: fullName,
                    },
                    challenge,
                    /* possibly other options */
                });

                console.log('registration', registration);

                const res = await $fetch<AuthorizationSuccessResponse>('/verify-registration', {
                    method: 'POST',
                    body: JSON.stringify({challenge, registration}),
                    baseURL: import.meta.env.VITE_API_URL,
                });

                console.log('res', res);


                token.value = res.token;
                user.value = res.user;

                await sessionStore.startSession();
            } catch (error) {
                console.error(error);

                console.log(1, error instanceof FetchError);

                if (error instanceof FetchError) {
                    const data = error.data;
                    console.error('data', data);
                    throw new Error(data.message);
                }


                // if(error instanceof FetchError) {
                //     console.error('body', error.response);
                //
                //     if(error.response) {
                //         const json = error.response;
                //         console.error('json', await json.clone().json());
                //
                //         throw new Error('XD');
                //     }
                // }

                throw error;
            }
        }

        async function webauthnLogin(): Promise<void> {
            const {challenge} = await $fetch<{ challenge: string }>('/generate-authentication-options', {
                method: 'GET',
                baseURL: import.meta.env.VITE_API_URL,
            })

            const authentication = await client.authenticate({
                /* Required */
                challenge,
                /* Optional */
                // allowCredentials: [{id:'my-credential-id', transports:['internal']}, ...],
                timeout: 60000
            })

            const res = await $fetch<AuthorizationSuccessResponse>('/verify-authentication', {
                method: 'POST',
                body: JSON.stringify({challenge, authentication}),
                baseURL: import.meta.env.VITE_API_URL,
            });

            token.value = res.token;
            user.value = res.user;

            await sessionStore.startSession();
        }

        async function logout() {
            if (token.value) {
                try {
                    await $fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                        method: 'POST',
                        headers: {
                            Authorization: `${token.value}`.replaceAll('"', ''),
                        },
                    });

                    await sessionStore.stopSession();
                } catch (error) {
                    console.error(error);
                }
            }

            user.value = null;
            token.value = null;
        }

        const isAdmin = computed(() => user.value?.roles.includes('admin') ?? false);

        async function getUsersList() {
            const res = await $fetch<UserListItem[]>(`/users`, {
                method: 'GET',
                headers: {
                    Authorization: `${token.value}`.replaceAll('"', ''),
                },
                baseURL: import.meta.env.VITE_API_URL
            });

            return res;
        }

        async function impersonateUser(userId: string): Promise<void> {
            if (!user.value) {
                throw new Error('No current user');
            }
            if (!token.value) {
                throw new Error('No current token');
            }

            const res = await $fetch<AuthorizationSuccessResponse>(`/impersonate/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token.value}`.replaceAll('"', ''),
                },
                baseURL: import.meta.env.VITE_API_URL
            });


            impersonatedFrom.value = {user: user.value, token: token.value};
            user.value = res.user;
            token.value = res.token;

        }

        async function revertImpersonation(): Promise<void> {
            if (!impersonatedFrom.value) {
                throw new Error('No impersonation');
            }

            user.value = impersonatedFrom.value?.user;
            token.value = impersonatedFrom.value?.token;
            impersonatedFrom.value = null;
        }

        async function updateUser(updateUserParams: UpdateUserParams) {
            if (!user.value) {
                throw new Error('No current user');
            }
            if (!token.value) {
                throw new Error('No current token');
            }

            const res = await $fetch<User>(`/me`, {
                method: 'PUT',
                headers: {
                    Authorization: `${token.value}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(updateUserParams.language ? {language: updateUserParams.language} : {}),
                    ...(updateUserParams.defaultLanguageToLearn ? {defaultLanguageToLearn: updateUserParams.defaultLanguageToLearn} : {}),
                }),
                baseURL: import.meta.env.VITE_API_URL,
            });

            user.value = res;
        }

        return {
            user,
            token,
            impersonatedFrom,
            isAdmin,
            verifyGoogleCredential,
            webauthnRegister,
            webauthnLogin,
            logout,
            getUsersList,
            impersonateUser,
            revertImpersonation,
            updateUser
        };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.cookies(),
            debug: true,
        },
    },
);
