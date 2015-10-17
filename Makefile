NODE_IMAGE    = node:4.1.2
DB_IMAGE      = mongo:3.0
DB_NAME       = browsersupport
DB_DIRECTORY  = $(CURDIR)/db
DB_CONTAINER  = browsersupport-db
API_DIRECTORY = $(CURDIR)/api
API_CONTAINER = browsersupport-api
APP_DIRECTORY = $(CURDIR)/app
APP_CONTAINER = browsersupport-app

.PHONY: build run stop

build:
	docker rmi $(API_CONTAINER)
	docker build -t $(API_CONTAINER) $(API_DIRECTORY)
	# docker build -t $(APP_CONTAINER) $(APP_DIRECTORY)

run: run/db run/api run/app

run/db:
	@mkdir -p $(DB_DIRECTORY)
	@docker run --name $(DB_CONTAINER) -v $(DB_DIRECTORY):/data/db -d $(DB_IMAGE) 1> /dev/null

run/dba:
	@docker run -it --link $(DB_CONTAINER):db --rm $(DB_IMAGE) sh -c 'exec mongo "$$DB_PORT_27017_TCP_ADDR:$$DB_PORT_27017_TCP_PORT/$(DB_NAME)"'

run/api:
	@docker run --name $(API_CONTAINER) --link $(DB_CONTAINER):db -d $(API_CONTAINER) 1> /dev/null

run/api-dev:
	@docker run -it --link $(DB_CONTAINER):db --rm -p 3000:3000 -v $(API_DIRECTORY):/app -w /app $(NODE_IMAGE) ./node_modules/nodemon/bin/nodemon.js index.js

run/app:
	@docker run --name $(APP_CONTAINER) --link $(API_CONTAINER):api -P -d $(APP_CONTAINER) 1> /dev/null
	@docker port $(APP_CONTAINER)

run/app-dev:
	@docker run -it --link $(API_CONTAINER):api --rm -p 3000:3000 -v $(APP_DIRECTORY):/app -w /app $(NODE_IMAGE) ./node_modules/nodemon/bin/nodemon.js index.js

stop: stop/app stop/api stop/db

stop/db:
	@docker stop $(DB_CONTAINER) 1> /dev/null
	@docker rm $(DB_CONTAINER) 1> /dev/null

stop/api:
	@docker stop $(API_CONTAINER) 1> /dev/null
	@docker rm $(API_CONTAINER) 1> /dev/null

stop/app:
	@docker stop $(APP_CONTAINER) 1> /dev/null
	@docker rm $(APP_CONTAINER) 1> /dev/null
