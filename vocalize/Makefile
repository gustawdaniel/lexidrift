build:
	docker build --platform linux/amd64 -t registry.preciselab.space/lexi-drift-vocalize .

push:
	docker push registry.preciselab.space/lexi-drift-vocalize

deploy: build push

ssh:
	ssh root@188.245.164.95