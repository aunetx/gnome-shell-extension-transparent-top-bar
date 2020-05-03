.PHONY: build_pkg
build_pkg: $(wildcard src/*)
	glib-compile-schemas src/schemas
	mkdir -p build/
	cd src/ && zip -r ../build/fully-transparent-top-bar@aunetx.zip .

.PHONY: build
build: $(wildcard src/*)
	glib-compile-schemas src/schemas
	mkdir -p _build/
	cp -r src/* _build/

.PHONY: vm_test
vm_test: $(wildcard src/*) build
	glib-compile-schemas src/schemas
	rm -rf $(HOME)/Documents/shared/fully-transparent-top-bar@aunetx
	mkdir -p $(HOME)/Documents/shared/fully-transparent-top-bar@aunetx
	cp -r _build/* $(HOME)/Documents/shared/fully-transparent-top-bar@aunetx/


.PHONY: install
install:
	glib-compile-schemas src/schemas
	rm -rf $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx
	mkdir -p $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx
	cp -r _build/* $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx/

.PHONY: remove
remove: $(wildcard src/*)
	rm -rf $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx

.PHONY: clean
clean:
	rm -rf build/ _build/
