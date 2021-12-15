
all: build replace-www push-site

build:
	yarn build
	yarn generate

replace-www:
	rm -rf www
	mkdir www
	cp -r dist/** www/

push-site:
	git subtree push --prefix www origin gh-pages
