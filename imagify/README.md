How to start project

```bash
pnpm init
pnpm --package=typescript dlx tsc --init
```

Cli

```bash
pnpm cli -- "a cat" "cyberpunk magenta"
```

ok

```bash
pnpm dev

echo '{"prompt": "a cat", "style": "cyberpunk magenta"}' | http POST http://localhost:5000/imagine
```

prod:

```bash
echo '{"prompt": "a cat", "style": "cyberpunk magenta"}' | http POST imagify.lexidrift.com/imagine
```