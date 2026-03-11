build:
	docker build --platform linux/amd64 -t registry.digitalocean.com/main/lexi-drift-imagify .

push:
	docker push registry.digitalocean.com/main/lexi-drift-imagify

deploy: build push

ssh:
	ssh root@188.245.164.95