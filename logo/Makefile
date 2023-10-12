# Makefile

root := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

OUTPUT ?= $(root)/output
SCRIPTS ?= $(root)/scripts
SRC ?= $(root)/../svg/logo_curve.svg

default: build

$(OUTPUT):
	mkdir -p $@

simpinkscr := simple_inkscape_scripting.py

script := $(SCRIPTS)/test.py

$(OUTPUT)/logo.svg: $(SRC)
	inkscape $< --export-filename $@ --export-text-to-path

$(OUTPUT)/logo_no_text.svg: | $(OUTPUT)
	$(simpinkscr) --py-source $(SCRIPTS)/remove_text.py $(SRC) --output $@

%.png: %.svg
	inkscape $< --export-filename $@ --export-background-opacity 0

%_100.png: %.svg
	inkscape $< --export-filename $@ --export-background-opacity 0 --export-width 100

%_200.png: %.svg
	inkscape $< --export-filename $@ --export-background-opacity 0 --export-width 200

outputs := \
	$(OUTPUT)/logo.svg \
	$(OUTPUT)/logo.png \
	$(OUTPUT)/logo_100.png \
	$(OUTPUT)/logo_200.png \
	$(OUTPUT)/logo_no_text.svg \
	$(OUTPUT)/logo_no_text.png \
	$(OUTPUT)/logo_no_text_100.png \
	$(OUTPUT)/logo_no_text_200.png \

build: $(outputs)

clean:
	rm -f $(outputs)
