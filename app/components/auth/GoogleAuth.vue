<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "~/store/user";
import type { GoogleLoginCallbackPayload } from "~/types/GoogleLoginCallbackPayload";

const config = useRuntimeConfig();
const userStore = useUserStore();
const isGoogleCallbackRegistered = ref(false);
const isGoogleScriptLoaded = ref(false); // Ensure script is loaded only once

function signOut() {
  if (!window.gapi) return;

  const auth2 = window.gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => console.log("User signed out."));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function handleError(error: unknown) {
  console.error(error);
  signOut();
  alert(getErrorMessage(error));
}

function loadGoogleScript() {
  return new Promise<void>((resolve, reject) => {
    if (isGoogleScriptLoaded.value) return resolve(); // Avoid reloading script

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGoogleScriptLoaded.value = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google script"));

    document.head.appendChild(script);
  });
}

onMounted(() => {
  console.log("client");

  window.googleLoginCallback = (userData: GoogleLoginCallbackPayload) => {
    console.log("Google Login Data:", userData);

    userStore
        .verifyGoogleCredential(userData.credential)
        .catch(handleError);
  };

  isGoogleCallbackRegistered.value = true;

  // Load Google script dynamically after defining the callback
  if (process.client) {
    loadGoogleScript().catch(handleError);
  }
});
</script>

<template>
  <div v-if="isGoogleCallbackRegistered">
    <div id="g_id_onload"
         :data-client_id="config.public.googleClientId"
         data-callback="googleLoginCallback"
         data-context="signin"
         data-ux_mode="popup"
         data-auto_select="true"
         data-itp_support="true">
    </div>

    <div class="w-full h-full flex justify-center items-center">
    <div class="g_id_signin"
         data-type="standard"
         data-shape="pill"
         data-theme="outline"
         data-text="continue_with"
         data-size="large"
         data-logo_alignment="left">
    </div>
    </div>
  </div>
</template>
