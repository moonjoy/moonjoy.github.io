"""
Swap the legacy `.project-nav` + hardcoded `.footer` blocks at the end of
each case-study page with the new "Keep reading" container + shared
footer loader. Idempotent.

Usage:
  python3 scripts/swap_case_study_chrome.py
"""

import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# slug -> [data-suggest values, base-path-prefix]
TARGETS = {
    "pages/web/philanthropynewsdigest.html":  ("mybrainandme,himalayanwildfibers", "../../"),
    "pages/web/mybrainandme.html":            ("himalayanwildfibers,coreweave",    "../../"),
    "pages/web/himalayanwildfibers.html":     ("coreweave,candidpdp",              "../../"),
    "pages/web/coreweave.html":               ("candidpdp,philanthropynewsdigest", "../../"),
    "pages/web/foundationdirectory.html":     ("philanthropynewsdigest,candidpdp", "../../"),
    "pages/web/eattendance.html":             ("coreweave,philanthropynewsdigest", "../../"),
    "pages/web/prism.html":                   ("cardin,candidpdp",                 "../../"),
    "pages/web/cardin.html":                  ("candidpdp,philanthropynewsdigest", "../../"),
    "pages/web/rapiddetectionsystems.html":   ("rapidmotionservices,philanthropynewsdigest", "../../"),
    "pages/web/rapidmotionservices.html":     ("foundationdirectory,philanthropynewsdigest", "../../"),
    "pages/web/fi2w.html":                    ("philanthropynewsdigest,candidpdp", "../../"),
    "pages/projects/micdrop.html":            ("magikku,chagubakha",               "../../"),
    "pages/projects/magikku.html":            ("chagubakha,micdrop",               "../../"),
    "pages/projects/chagubakha.html":         ("micdrop,magikku",                  "../../"),
    "pages/projects/asthamangala.html":       ("chagubakha,micdrop",               "../../"),
    "pages/projects/mythicalland.html":       ("magikku,micdrop",                  "../../"),
    "pages/projects/free.html":               ("chagubakha,magikku",               "../../"),
    "pages/projects/divergent.html":          ("micdrop,magikku",                  "../../"),
    "pages/projects/phantom.html":            ("magikku,chagubakha",               "../../"),
    "pages/projects/childcare.html":          ("chagubakha,micdrop",               "../../"),
}


def build_replacement(suggest: str, base: str) -> str:
    return (
        "      <!-- Keep reading: card-based suggestions for more case studies -->\n"
        '      <div id="keep-reading-container"></div>\n'
        f'      <script src="{base}js/load-keep-reading.js" data-base="{base}"></script>\n'
        "\n"
        "    </div>\n\n"
        '    <div id="footer-container"></div>\n'
        f'    <script src="{base}js/load-footer.js" data-base="{base}"></script>\n'
    )


# Matches everything from `<div class="project-nav">` (or the comment just
# above it) through `<!-- footer ends here -->`, non-greedy.
BLOCK_RE = re.compile(
    r"""
    (?:[\t ]*<!--\s*project\s*nav\s*starts\s*here\s*-->\s*\n)?
    [\t ]*<div\s+class="project-nav">
    .*?
    <!--\s*footer\s*ends\s*here\s*-->\s*\n
    """,
    re.DOTALL | re.VERBOSE | re.IGNORECASE,
)


def process(path: str, suggest: str, base: str) -> str:
    full = os.path.join(ROOT, path)
    with open(full, "r", encoding="utf-8") as f:
        src = f.read()

    if "keep-reading-container" in src:
        return f"  skip   {path} (already migrated)"

    new_src, n = BLOCK_RE.subn(build_replacement(suggest, base), src, count=1)
    if n == 0:
        return f"  MISS   {path} (no project-nav/footer block matched)"

    with open(full, "w", encoding="utf-8") as f:
        f.write(new_src)
    return f"  ok     {path}"


def main() -> int:
    for path, (suggest, base) in TARGETS.items():
        print(process(path, suggest, base))
    return 0


if __name__ == "__main__":
    sys.exit(main())
