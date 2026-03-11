<script setup lang="ts">


import {useUserStore} from "~/store/user";

const email = ref('');
const fullName = ref('');

const userStore = useUserStore();

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';

}

async function register() {
  try {
    await userStore.webauthnRegister(email.value, fullName.value);
  } catch (error) {
    console.error(error);
    alert(getErrorMessage(error));
  }
}

async function login() {
  return userStore.webauthnLogin()
}

const mode = ref<'login' | 'register'>('login');

</script>

<template>

  <form class="space-y-6" @submit.prevent.stop="register" v-if="mode === 'register'">
    <div>
      <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
      <div class="mt-2">
        <input type="email" name="email" id="email" autocomplete="email"
               v-model="email"
               required
               class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
      </div>
    </div>

    <div>
      <label for="fullName" class="block text-sm/6 font-medium text-gray-900">Full Name</label>
      <div class="mt-2">
        <input
            v-model="fullName"
            type="text" name="fullName" id="fullName" autocomplete="current-name" required
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex gap-3">
        <div class="flex h-6 shrink-0 items-center">
          <div class="group grid size-4 grid-cols-1">
            <input id="remember-me" name="remember-me" type="checkbox"
                   class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"/>
            <svg
                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                viewBox="0 0 14 14" fill="none">
              <path class="opacity-0 group-has-checked:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
              <path class="opacity-0 group-has-indeterminate:opacity-100" d="M3 7H11" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <label for="remember-me" class="block text-sm/6 text-gray-900">Remember me</label>
      </div>

      <div class="text-sm/6">
        <a href="https://docs.lexidrift.com/user-guide/authorization.html"
           class="font-semibold text-indigo-600 hover:text-indigo-500">Authorization problem?</a>
      </div>
    </div>

    <div>
      <button type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Sign up
      </button>
    </div>

  </form>

  <div v-else>

    <div>
      <button @click="login" type="submit"
              class="flex mb-5 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Login with Passkey
      </button>
    </div>

    <div>
      <button @click="mode = 'register'" type="submit"
              class="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
        New Account
      </button>
    </div>

  </div>


</template>