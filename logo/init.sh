#!/bin/bash

python3 -m venv ./venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install inkex

git clone git@github.com:spakin/SimpInkScr.git ./SimpInkScr
chmod +x SimpInkScr/simpinkscr/simple_inkscape_scripting.py
