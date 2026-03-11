<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {useUserStore} from "~/store/user";

const userStore = useUserStore();
</script>

<template>
  <DropdownMenu v-if="userStore.user">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-9 w-9">
          <AvatarImage :src="userStore.user.avatar" alt="@shadcn"/>
          <AvatarFallback>{{ userStore.user.fullName.split(' ').map(s => s[0]).join('') }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ userStore.user.fullName }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ userStore.user.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator/>
      <DropdownMenuGroup>
        <NuxtLink to="/">
          <DropdownMenuItem>
            Home
            <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
        </NuxtLink>

        <NuxtLink to="/review">
          <DropdownMenuItem>
            Review
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
        </NuxtLink>

        <NuxtLink to="/profile">
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            <!--            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>-->
          </DropdownMenuItem>
        </NuxtLink>

        <NuxtLink to="/knowledge">
          <DropdownMenuItem>
            Knowledge
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </NuxtLink>

        <NuxtLink to="/stats">
          <DropdownMenuItem>
            Stats
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </NuxtLink>

        <NuxtLink to="/media">
          <DropdownMenuItem>
            Media
            <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
          </DropdownMenuItem>
        </NuxtLink>

        <NuxtLink to="/contact">
          <DropdownMenuItem>Contact</DropdownMenuItem>
        </NuxtLink>
      </DropdownMenuGroup>
      <DropdownMenuSeparator/>
      <DropdownMenuItem @click="userStore.logout">
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>


  <!--  <nav>-->
  <!--    <ul class="flex space-x-4">-->
  <!--      <li>-->
  <!--        <router-link to="/" :active-class="'underline font-bold'">Home</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <router-link to="/review" :active-class="'underline font-bold'">Review</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <router-link to="/profile" :active-class="'underline font-bold'">Profile</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <router-link to="/knowledge" :active-class="'underline font-bold'">Knowledge</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <router-link to="/stats" :active-class="'underline font-bold'">Stats</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <router-link to="/media" :active-class="'underline font-bold'">Media</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <router-link to="/contact" :active-class="'underline font-bold'">Contact</router-link>-->
  <!--      </li>-->
  <!--      <li>-->
  <!--        <button @click="userStore.logout">Sign out</button>-->
  <!--      </li>-->
  <!--    </ul>-->
  <!--  </nav>-->
</template>
