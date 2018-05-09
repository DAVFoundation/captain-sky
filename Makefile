link-dav-js:
	npm link ../dav-js

build:
	@docker-compose build

up: build
	@docker-compose up

create-aws-stg-env:
	@eb init captain-sky
	@eb create captain-sky-stg --cname captain-sky-stg -k captain-sky-key

deploy-aws-stg-env:
	@eb deploy --profile eb-cli-dav --staged

