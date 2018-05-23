link-dav-js:
	npm link ../dav-js

build-dashboard:
	cd src/sky-dashbaord && npm i && npm run build

build: build-dashboard 
	@rsync -a ../dav-js build
	@rsync -a ../dav-js node_modules
	@docker-compose build

up: build
	@docker-compose up

up-bg: build
	@docker-compose up -d

create-aws-stg-env:
	@eb init captain-sky
	@eb create captain-sky-stg --cname captain-sky-stg -k captain-sky-key

deploy-aws-stg-env:
	@eb deploy --profile eb-cli-dav --staged

down:
	@docker-compose down

