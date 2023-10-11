# Makefile

root := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

%.png: %.svg
	inkscape $< --export-filename $@ --export-background-opacity 0

outputs := \
	email.png \
	instagram.png \
	twitter.png \
	web.png \
	whatsapp.png \

build: $(outputs)

clean:
	rm -f $(outputs)
