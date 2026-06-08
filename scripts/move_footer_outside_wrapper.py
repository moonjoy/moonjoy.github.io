"""
Move #footer-container (and its load-footer script) outside .wrapper
so the footer top rule can span the full viewport width.
"""

import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

BLOCK = re.compile(
    r'([ \t]*)<!-- Footer \(loaded from partials/footer\.html, fallback inline\) -->\s*\n'
    r'[ \t]*<div id="footer-container"></div>\s*\n'
    r'[ \t]*<script src="(\.\./\.\./|\.\./)?js/load-footer\.js" data-base="([^"]*)"></script>\s*\n'
    r'\1</div>\s*\n',
    re.MULTILINE,
)


def process(path: str) -> str:
    full = os.path.join(ROOT, path)
    with open(full, "r", encoding="utf-8") as f:
        src = f.read()

    if not BLOCK.search(src):
        if re.search(r'</div>\s*\n\s*<div id="footer-container">', src):
            return f"  skip   {path} (already outside wrapper)"
        return f"  MISS   {path} (pattern not found)"

    def repl(m):
        indent = m.group(1)
        base = m.group(2) or ""
        data_base = m.group(3)
        return (
            f"{indent}</div>\n\n"
            f"{indent}<div id=\"footer-container\"></div>\n"
            f"{indent}<script src=\"{base}js/load-footer.js\" data-base=\"{data_base}\"></script>\n\n"
        )

    new_src = BLOCK.sub(repl, src, count=1)
    with open(full, "w", encoding="utf-8") as f:
        f.write(new_src)
    return f"  ok     {path}"


def main() -> int:
    for dirpath, _, filenames in os.walk(os.path.join(ROOT, "pages")):
        for name in filenames:
            if not name.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), ROOT).replace("\\", "/")
            with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
                if "footer-container" in f.read():
                    print(process(rel))
    return 0


if __name__ == "__main__":
    sys.exit(main())
