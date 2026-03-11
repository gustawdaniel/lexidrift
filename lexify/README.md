Cli test:

```bash
NODE_ENV=test npx tsx src/index.ts cli
```

Start api:

```bash
NODE_ENV=test npx tsx src/index.ts api
```

Call request:

```
echo '{"word":"dog","lang":"en"}' | http POST localhost:3000/check
echo '{"word":"dog","lang":"en"}' | http POST https://lexify.lexidrift.com/check
```

```
echo '{"word":"dog","lang":"en","style":"wordup"}' | http POST localhost:3000/define
echo '{"word":"dog","lang":"en","style":"wordup"}' | http POST https://lexify.lexidrift.com/define
```

current deployment flow

locally

```
make build-image
make push-image
```

on server

```
ssh root@188.245.164.95
```

call

```
docker pull registry.digitalocean.com/main/lexi-drift-lexify
```

then

https://dockage.lexidrift.com/ and reload

connect ssh by zerotrust

https://one.dash.cloudflare.com/416275d8b658f8f343bf49806950ad25/networks/tunnels/cfd_tunnel/c9a98c1a-2063-4ff4-bf0f-5706733fb045/edit?tab=publicHostname