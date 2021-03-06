BIN = ./node_modules/.bin

all: bootstrap test coverage

bootstrap:
	node bootstrap.js

test:
	npm test

coverage: lib-cov
	@COVER=1 $(BIN)/mocha --require should --reporter mocha-istanbul

lib-cov:
	@$(BIN)/istanbul instrument --output lib-cov --no-compact --variable global.__coverage__ lib

clean: clean-coverage

clean-coverage:
	-rm -rf lib-cov
	-rm -rf html-report

.PHONY: test
