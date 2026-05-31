.PHONY: dev dev-build prod stop logs shell clean install

dev:
	docker compose --profile dev up

dev-build:
	docker compose --profile dev up --build

prod:
	docker compose --profile prod up --build

stop:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec app-dev sh

clean:
	docker compose down -v --remove-orphans
	rm -rf dist

install:
	docker compose exec app-dev npm install
