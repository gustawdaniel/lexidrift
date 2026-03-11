build:
	docker build --platform linux/amd64 -t registry.digitalocean.com/main/lexi-drift-vocalize .

push:
	docker push registry.digitalocean.com/main/lexi-drift-vocalize

deploy: build push

ssh:
	ssh root@188.245.164.95