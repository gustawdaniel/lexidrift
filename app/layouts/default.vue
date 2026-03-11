<script lang="ts" setup>
import {useUserStore} from "~/store/user";
import UserNav from "~/components/debug-table/UserNav.vue";
import GoogleAuth from "~/components/auth/GoogleAuth.vue";
import WebAuthn from "~/components/auth/WebAuthn.vue";
import AuthPage from "~/components/auth/AuthPage.vue";

const userStore = useUserStore();

import { useRoute } from 'vue-router';
import type { LayoutProps } from '~/types/layout';

const route = useRoute();
const layoutProps = computed<LayoutProps>(() => (route.meta.layoutProps || {}) as LayoutProps);
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <div>

    <div v-if="!userStore.user">
      <AuthPage />


    </div>

    <div v-else>
      <div class="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div class="flex items-center justify-between space-y-2">
          <div v-if="layoutProps.title">
            <h2 class="text-2xl font-bold tracking-tight">
              {{layoutProps.title}}
            </h2>
            <p class="text-muted-foreground" v-if="layoutProps.description">
              {{layoutProps.description}}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>

        <slot/>

      </div>

    </div>

    <ClientOnly>
      <Toaster />
    </ClientOnly>

    <ModalFrame/>
  </div>
</template>