generate:
	infisical run --env=dev --path=/apps/video -- cargo run --bin generate

get:
	infisical run --env=dev --path=/apps/video -- cargo run --bin get

up:
	infisical run --env=dev --path=/apps/video -- cargo run --bin main

docker-build:
	docker build -t registry.digitalocean.com/main/lexi-drift-video .

build:
	cargo build --release