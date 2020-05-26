.PHONY: build_pkg build vm_test install remove clean


build:
	glib-compile-schemas src/schemas
	mkdir -p build/
	cp -r src/* build/
	rm -f build/prefs.ui~


build_pkg: build
	mkdir -p pkg/
	cd build/ && zip -r ../pkg/fully-transparent-top-bar@aunetx.zip .


vm_test: build
	rm -rf $(HOME)/Documents/shared/fully-transparent-top-bar@aunetx
	mkdir -p $(HOME)/Documents/shared/fully-transparent-top-bar@aunetx
	cp -r build/* $(HOME)/Documents/shared/fully-transparent-top-bar@aunetx/


install: build
	rm -rf $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx
	mkdir -p $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx
	cp -r build/* $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx/


remove:
	rm -rf $(HOME)/.local/share/gnome-shell/extensions/fully-transparent-top-bar@aunetx


clean:
	rm -rf pkg/ build/
