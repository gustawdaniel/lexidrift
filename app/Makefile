build:
	docker build --platform linux/amd64 -t registry.digitalocean.com/main/lexi-drift-app .

push:
	docker push registry.digitalocean.com/main/lexi-drift-app

deploy: build push

ssh:
	ssh root@188.245.164.95

node_modules: package.json
	pnpm install

up: node_modules
	pnpm dev