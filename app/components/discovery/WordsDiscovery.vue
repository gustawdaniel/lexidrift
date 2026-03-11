<script setup lang="ts">
import SingleWordDiscoveryCard from "~/components/discovery/SingleWordDiscoveryCard.vue";
import ManyWordsDiscoveryBottomMap from "~/components/discovery/ManyWordsDiscoveryBottomMap.vue";
import WordDiscoverySearch from "~/components/discovery/WordDiscoverySearch.vue";
import {useUserStore} from "~/store/user";
import {useWordsStore} from "~/store/words";

const userStore = useUserStore();
const wordsStore = useWordsStore();

onMounted(async () => {
  if(!userStore.user) {
    return;
  }

  await wordsStore.fetchWords({
    lang: userStore.user.defaultLanguageToLearn,
    limit: 100,
    offset: wordsStore.selectedWordOffset,
  });
});
</script>

<template>
  <div class="w-full">
    <WordDiscoverySearch/>
    <SingleWordDiscoveryCard/>
    <ManyWordsDiscoveryBottomMap/>
  </div>
</template>
