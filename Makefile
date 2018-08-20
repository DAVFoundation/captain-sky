FORCE:

rebuild-dashboard: FORCE
	cd src/sky-dashbaord && npm i && npm run build

build-dashboard: FORCE
	cd src/sky-dashbaord && npm run build

rebuild: rebuild-dashboard
	@rsync -a ../dav-js build
	@rm -rf ../dav-js/node_modules
	@docker-compose build --no-cache

build: build-dashboard
	@docker-compose build

up: build
	@docker-compose up

up-bg: build
	@docker-compose up -d

copy-local-dav:
	mkdir -p temp-dav && cp -R ../dav-js/src ./temp-dav && cp -R ../dav-js/build ./temp-dav

create-aws-stg-env: FORCE
	@eb init captain-sky
	@eb create captain-sky-stg --cname captain-sky-stg -k captain-sky-key

deploy-aws-stg-env: rebuild
	@eb deploy --profile eb-cli-dav --staged

down: FORCE
	@docker-compose down

