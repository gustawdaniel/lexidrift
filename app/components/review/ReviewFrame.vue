<script setup lang="ts">

import {useCourseStore} from "~/store/course";
import {useUserStore} from "~/store/user";
import SingleReviewQuestion from "~/components/review/SingleReviewQuestion.vue";
import NoMoreReviewNow from "~/components/review/NoMoreReviewNow.vue";
import CorrectInFrameProgressBar from "~/components/review/CorrectInFrameProgressBar.vue";

const courseStore = useCourseStore();
const userStore = useUserStore();

const initialQuestionsLength = ref(0);

onMounted(async () => {
  console.log('Review page mounted');

  const user = userStore.user;

  if(!user) {
    throw new Error('No user')
  }

  await courseStore.getCourse(user.defaultLanguageToLearn);
  if(courseStore.course) {
    initialQuestionsLength.value = courseStore.course.questions.length;
  }
});
</script>

<template>
  <div v-if="courseStore.course">
    <h1>Review {{courseStore.course.questions.length}}</h1>

<!--    <pre>{{courseStore.course.questions.map(q => q.definition.word)}}</pre>-->

    <div>
      <div v-if="courseStore.course.questions[0]" class="min-h-screen">
        <CorrectInFrameProgressBar
            class="my-4"
            v-if="initialQuestionsLength > 0"
            :initial-length="initialQuestionsLength"
            :questions="courseStore.course.questions.map(q => ({correctInRow:q.correctInRow}))"
            :correct-first="courseStore.correctFirst"
            :locked="courseStore.locked"
        />
        <SingleReviewQuestion :question="courseStore.course.questions[0]"/>
      </div>
      <NoMoreReviewNow v-else/>

      <pre>{{courseStore.course.questions[0]}}</pre>

      <hr>

      <pre>{{courseStore.course.questions}}</pre>
    </div>

  </div>
</template>

<style scoped>

</style>