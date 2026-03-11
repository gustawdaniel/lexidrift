# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

```bash
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S) && time ffmpeg -y -video_size 2560x1600 -f x11grab -i :0.0+640,0 -frames:v 1 -c:v libaom-av1 -crf 50 -strict experimental -cpu-used 8 -threads 8 "$HOME/timelapse_$TIMESTAMP.avif"
```

```bash
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S) && time ffmpeg -y -video_size 2560x1600 -f x11grab -i :0.0+640,0 -frames:v 1 -c:v libwebp "$HOME/timelapse_$TIMESTAMP.webp"
```


```bash
ffmpeg -framerate 30 -i timelapse_%*.webp -c:v libvpx-vp9 -crf 30 -b:v 0 -preset medium timelapse_video.webm
```

Check cookie

```bash
infisical run --env=dev --path=/apps/app -- tsx local/cookie.ts
```

```bash
pnpm dlx shadcn-vue@latest add button
```

---

Onboarding:

1. Native Lang
2. Target Lang
3. Estimate known words
4. Adaptive algorithm to build question base on words rank

https://animejs.com/documentation/