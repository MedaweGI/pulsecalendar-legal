#!/usr/bin/env python3
"""Découpe shared/i18n-data.js (SOURCE des traductions, plus chargé par les pages)
en un fichier par langue : shared/i18n/<langue>.js. À relancer après CHAQUE
modification de i18n-data.js (puis monter DICT_V dans shared/i18n.js et i18n-boot.js).
Raison (24/11/2026) : le fichier complet (1,2 Mo, 34 langues) était téléchargé par
tous les visiteurs, francophones compris."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "shared", "i18n-data.js")
OUT = os.path.join(HERE, "..", "shared", "i18n")
t = open(SRC, encoding="utf-8").read()
d = json.loads(t[t.index("{"):t.rindex("}") + 1])
os.makedirs(OUT, exist_ok=True)
for lang, tr in d.items():
    body = "(window.PC_I18N=window.PC_I18N||{})[%s]=%s;\n" % (json.dumps(lang), json.dumps(tr, ensure_ascii=False, separators=(",", ":")))
    open(os.path.join(OUT, lang + ".js"), "w", encoding="utf-8").write(body)
    print(f"{lang:8} {len(body.encode()) // 1024} Ko")
