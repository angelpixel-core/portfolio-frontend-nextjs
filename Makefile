.SILENT:

# -----------------------------------------------------------------------------
# Defaults
# -----------------------------------------------------------------------------
.PHONY: help

help: ## Prints this help.
		grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# -----------------------------------------------------------------------------
# SETUP
# -----------------------------------------------------------------------------
include .env

# COMPOSE_FILE := ./compose.yml

# (BUILD) Authentication...
DEVELOPER_ID    := $(id -u "$(whoami)")
DEVELOPER_NAME  := $(whoami)
DEVELOPER_EMAIL := $(git config --global user.email)

# (BUILD) Web Environment...
APP_ENV := development

# BUILD_PATH := ./config/environments/${APP_ENV}

# DATA_PATH  := ${BUILD_PATH}/volumes/data
# DEPS_PATH  := ${BUILD_PATH}/volumes/deps

# (SERVICE) Web Deployment...
WEB_NAME    := $(shell basename $(shell pwd))
WEB_RELEASE := "1.0-dev"
WEB_SERVER  := "$(WEB_NAME)_web"
WEB_PORT    ?= "9090"
WEB_LOCALE  ?= "en"

# (BUILD) Database Access...
# POSTGRES_USER := "heissenberg"
# POSTGRES_DB   := "slux_zaig_hasm_yomp_nin"

# (SERVICE) Database Deployment...
# DB_ENGINE_VERSION := "14"

##############################################
# Software Development Life Cycle Management #
##############################################
.PHONY: web/start # start-db # build rebuild lint test security deploy

# start-db:
# 		echo "🐘 Starting Database..."
# 		docker compose up db db_admin

# grab-db-ip-address:
# 		echo "℁ Get DataBase IP Address"
# 		docker inspect db | jq -r '.[0].NetworkSettings.Networks["portfolio-developer-nextjs_default"].IPAddress'

web/start:
		echo "🏁 Start Application"
		npm run dev -- --port $(WEB_PORT)

# start:
# 		echo "🏁 Start Application"
# 		docker compose up -d db db_admin web

# stop:
# 		echo "🛑 Stop Application"
# 		docker compose down

# build: ## Build Environment
# 		echo "📦 Building..."
# 		docker compose build

# rebuild: ## Re-Build Environment
# 		echo "📦 ♻️  Re-Building..."
# 		docker compose build --pull --force-rm --no-cache
#
# lint: ## Lint Code Style
# 		echo "🔦 Style lintering..."
# 		docker compose run --rm -it $(SERVICE) bundle exec rubocop --parallel
#
# test: db/setup ## Run Acceptance & Unit Tests
# 		echo "🧪 Testing..."
# 		docker compose run --rm -it $(SERVICE) bundle exec rspec -f doc
#
# security: sec/deps sec/app ## Security Pipeline
# .PHONY: sec/deps sec/app
#
# sec/deps:  ## Security Audit - Dependencies
# 		echo "👮🏻‍♂️ Security Audit Dependencies."
# 		docker compose run --rm -it $(SERVICE) bundle exec bundler-audit --update
#
# sec/app: ## Security Audit - Application Code
# 		echo "👮🏻‍♂️ Security Audit Application Code."
# 		docker compose run --rm -it $(SERVICE) bundle exec brakeman -q -w2
#
# deploy: build lint test security ## Deploy Project
# 	echo ">>> TODO <<< 🚀 Deploy"


#######################
# Database Management #
#######################
# .PHONY: db/setup db/ping
#
# db/setup: ## Setup Database & Migrations
# 		echo "🔧 Setting Up Database..."
# 		docker compose run --rm $(SERVICE) bundle exec rails db:setup db:migrate
#
# db/ping: ## Ping Database
# 		echo "🔍 Checking Database Connecting..."
# 		docker compose exec db psql -U postgres -d ssg-platform_development -c "SELECT 1;"


##########################
# Service Management #
##########################
# .PHONY: start stop restart shell clean
#
# start: CMD=up $(SERVICE) -d ## Start service.
#
# stop: CMD=stop $(SERVICE) ## Stop service.
#
# start stop:
# 		echo "⏩ Running: $(CMD)"
# 		docker compose $(CMD)
#
# restart: ## Restart service
# 		echo "♻️ Restarting..."
# 		docker compose run --rm $(SERVICE) touch tmp/restart.txt
#
# shell: ## Starts a Shell session inside the container by running the service
# 		docker compose exec -it $(SERVICE) bash
#
# clean: ## Clean running artifacts
# 		echo "🧹 Cleaning..."
# 		docker compose down
# 		make clean/images
# .PHONY: clean/images
#
# clean/images: ## Clean container images with 'none' repository name
# 		docker images | grep '<none>' | awk '{print $3}' | xargs docker rmi
