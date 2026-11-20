"""Render ebook/ebook.html to the PDF named in content/course.js. Run from the repo root: python3 ebook/render.py"""
import pathlib
import re
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
course = (root / "content" / "course.js").read_text(encoding="utf-8")
pdf_rel = re.search(r'ebook:\s*"([^"]+)"', course).group(1)
title = re.search(r'title:\s*"([^"]+)"', course).group(1)
src = root / "ebook" / "ebook.html"
out = root / pdf_rel

footer = (
    "<div style='width:100%;font-family:DM Sans,sans-serif;font-size:8px;color:#64748B;"
    "padding:0 20mm;display:flex;justify-content:space-between'>"
    f"<span>{title}</span><span class='pageNumber'></span></div>"
)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome") if pathlib.Path("/usr/bin/google-chrome").exists() else p.chromium.launch()
    page = browser.new_page()
    page.goto(src.as_uri(), wait_until="networkidle")
    page.pdf(
        path=str(out),
        format="A4",
        print_background=True,
        prefer_css_page_size=True,
        display_header_footer=True,
        header_template="<div></div>",
        footer_template=footer,
    )
    browser.close()
print("Wrote", out)
