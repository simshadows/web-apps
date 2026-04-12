#   file: Makefile
# author: simshadows <contact@simshadows.com>

ROOT_PATH := $(abspath .)
IS_WINDOWS := $(if $(filter Windows_NT,$(OS)),yes,)

IMAGE_NAME := simshadows/web-apps-dev

CONTAINER_NAME := web-apps-dev
CONTAINER_HOSTNAME := web-apps-dev
CLAUDE_VOLUME_NAME := web-apps-dev--claude
DEV_SERVER_PORT := 8001

################################################################################
# 0. Meta ######################################################################
################################################################################

# Starts the dev server from scratch
.PHONY: all
all: clean build up yarn-install start

# Build release artifacts from scratch, to be deployed in Prod
.PHONY: all-release
all-release: clean build up yarn-install test release


################################################################################
# 1. Setup #####################################################################
################################################################################


# Build image
.PHONY: build
build:
	podman build --pull -t $(IMAGE_NAME) $(ROOT_PATH)


# Start container
.PHONY: up
up:
	podman run \
		--name $(CONTAINER_NAME) \
		-p 127.0.0.1:$(DEV_SERVER_PORT):8000 \
		--mount type=bind,src=$(ROOT_PATH),dst=/repo \
		--mount type=volume,src=$(CLAUDE_VOLUME_NAME),dst=/home/node/.claude \
		--userns keep-id \
		--hostname $(CONTAINER_HOSTNAME) \
		--rm \
		-itd \
		$(IMAGE_NAME)


################################################################################
# 2. Actions ###################################################################
################################################################################


# Open shell
.PHONY: shell bash attach enter
shell bash attach enter:
	-podman exec -it $(CONTAINER_NAME) bash


# Run `yarn install`
.PHONY: yarn-install
yarn-install:
	podman exec -it $(CONTAINER_NAME) yarn install


# Start dev server
.PHONY: start dev
start dev:
	podman exec -it $(CONTAINER_NAME) yarn build
	podman exec -it $(CONTAINER_NAME) yarn serve


# Build release artifacts, to be deployed in Prod
.PHONY: release
release:
	podman exec -it $(CONTAINER_NAME) yarn build


# Run auto-tests
.PHONY: test
test:
	podman exec -it $(CONTAINER_NAME) yarn test


# Run static type checking
.PHONY: typecheck
typecheck:
	podman exec -it $(CONTAINER_NAME) yarn typecheck


# Run Claude Code CLI
.PHONY: ai claude
ai claude:
	podman exec -it $(CONTAINER_NAME) /home/node/.local/bin/claude


################################################################################
# 3. Teardown ##################################################################
################################################################################


# Stop container
.PHONY: down
down:
	-podman stop $(CONTAINER_NAME)


# Clean up images/containers
# (Does not clean up anything else.)
.PHONY: clean teardown destroy
clean teardown destroy: down
	-podman rm $(CONTAINER_NAME)
	-podman image rm localhost/$(IMAGE_NAME)


# Cleans more up
.PHONY: clean-more teardown-more destroy-more
clean-more teardown-more destroy-more: clean
	-podman volume rm $(CLAUDE_VOLUME_NAME)

