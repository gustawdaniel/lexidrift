generate:
	infisical run --env=dev --path=/apps/video -- cargo run --bin generate

get:
	infisical run --env=dev --path=/apps/video -- cargo run --bin get

up:
	infisical run --env=dev --path=/apps/video -- cargo run --bin main

docker-build:
	docker build -t registry.preciselab.space/lexi-drift-video .

build:
	cargo build --release