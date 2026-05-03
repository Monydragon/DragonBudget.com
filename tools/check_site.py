#!/usr/bin/env python3
"""Static checks for DragonBudget.com public pages."""

from __future__ import annotations

import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE_ORIGIN = "https://dragonbudget.com"
IGNORED_DIRS = {".git", "docs"}
FORBIDDEN_PUBLIC_PATTERNS = {
    "internal prompt label": re.compile(r"\bPrompts?\b", re.IGNORECASE),
    "LLM reference": re.compile(r"\bLLM\b", re.IGNORECASE),
    "standalone AI reference": re.compile(r"(?<![A-Za-z])AI(?![A-Za-z])"),
    "chat tool reference": re.compile(r"\b(ChatGPT|Claude|Gemini)\b", re.IGNORECASE),
    "source-pack route": re.compile(r"prompt-pack", re.IGNORECASE),
    "implementation-agent copy": re.compile(r"implementation-agent", re.IGNORECASE),
    "generated asset copy": re.compile(r"\bgenerated\b", re.IGNORECASE),
}


def public_html_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*.html"):
        if any(part in IGNORED_DIRS for part in path.relative_to(ROOT).parts):
            continue
        files.append(path)
    return sorted(files)


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def is_redirect_page(text: str) -> bool:
    return bool(re.search(r'http-equiv=["\']refresh["\']', text, re.IGNORECASE))


def canonical_url(text: str) -> str | None:
    match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', text, re.IGNORECASE)
    if match:
        return html.unescape(match.group(1))
    match = re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', text, re.IGNORECASE)
    if match:
        return html.unescape(match.group(1))
    return None


def title_text(text: str) -> str | None:
    match = re.search(r"<title>(.*?)</title>", text, re.IGNORECASE | re.DOTALL)
    return html.unescape(match.group(1).strip()) if match else None


def meta_description(text: str) -> str | None:
    match = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', text, re.IGNORECASE)
    if match:
        return html.unescape(match.group(1).strip())
    match = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']', text, re.IGNORECASE)
    if match:
        return html.unescape(match.group(1).strip())
    return None


def local_target(raw_url: str, source: Path) -> Path | None:
    raw_url = html.unescape(raw_url.strip())
    if not raw_url or raw_url.startswith("#"):
        return None
    if raw_url.startswith(("mailto:", "tel:", "data:", "javascript:")):
        return None

    parsed = urlparse(raw_url)
    if parsed.scheme in {"http", "https"}:
        if parsed.netloc != "dragonbudget.com":
            return None
        path = unquote(parsed.path)
    else:
        path = unquote(parsed.path)

    if not path:
        return None

    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path

    if raw_url.endswith("/") or path.endswith("/"):
        target = target / "index.html"
    elif target.is_dir():
        target = target / "index.html"

    return target.resolve()


def sitemap_urls(errors: list[str]) -> set[str]:
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        fail(errors, "sitemap.xml is missing")
        return set()

    try:
        tree = ET.parse(sitemap)
    except ET.ParseError as exc:
        fail(errors, f"sitemap.xml does not parse: {exc}")
        return set()

    urls: list[str] = []
    for loc in tree.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        if loc.text:
            urls.append(loc.text.strip())

    duplicates = sorted({url for url in urls if urls.count(url) > 1})
    for url in duplicates:
        fail(errors, f"sitemap.xml contains duplicate URL: {url}")

    for url in urls:
        if "/docs/" in url or "/prompt-pack/" in url:
            fail(errors, f"sitemap.xml exposes internal route: {url}")

        parsed = urlparse(url)
        if parsed.netloc != "dragonbudget.com":
            fail(errors, f"sitemap.xml has unexpected host: {url}")
            continue

        path = parsed.path
        if path in {"", "/"}:
            target = ROOT / "index.html"
        elif path.endswith("/"):
            target = ROOT / path.lstrip("/") / "index.html"
        else:
            target = ROOT / path.lstrip("/")

        if not target.exists():
            fail(errors, f"sitemap.xml URL has no local page: {url}")

    return set(urls)


def check_json_ld(path: Path, text: str, errors: list[str]) -> None:
    blocks = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        text,
        re.IGNORECASE | re.DOTALL,
    )
    for index, block in enumerate(blocks, start=1):
        try:
            json.loads(block.strip())
        except json.JSONDecodeError as exc:
            fail(errors, f"{rel(path)} JSON-LD block {index} does not parse: {exc}")


def main() -> int:
    errors: list[str] = []
    sitemap = sitemap_urls(errors)
    expected_sitemap_urls: set[str] = set()

    for path in public_html_files():
        text = path.read_text(encoding="utf-8")
        page_rel = rel(path)
        redirect = is_redirect_page(text)

        for label, pattern in FORBIDDEN_PUBLIC_PATTERNS.items():
            if pattern.search(text):
                fail(errors, f"{page_rel} contains forbidden public copy: {label}")

        title = title_text(text)
        if not title:
            fail(errors, f"{page_rel} is missing a title")
        elif len(title) > 70:
            fail(errors, f"{page_rel} title is longer than 70 characters")

        description = meta_description(text)
        if not description:
            fail(errors, f"{page_rel} is missing a meta description")
        elif len(description) > 170:
            fail(errors, f"{page_rel} meta description is longer than 170 characters")

        canonical = canonical_url(text)
        if not canonical:
            fail(errors, f"{page_rel} is missing a canonical URL")
        elif not canonical.startswith(SITE_ORIGIN):
            fail(errors, f"{page_rel} canonical is not on {SITE_ORIGIN}: {canonical}")
        elif not redirect:
            expected_sitemap_urls.add(canonical)

        if "/docs/" in text:
            fail(errors, f"{page_rel} links to /docs/ from a public page")

        for attr, raw_url in re.findall(r'\b(href|src|action)=["\']([^"\']+)["\']', text, re.IGNORECASE):
            if "/docs/" in raw_url or "/prompt-pack/" in raw_url:
                fail(errors, f"{page_rel} {attr} exposes internal route: {raw_url}")
            target = local_target(raw_url, path)
            if target and not target.exists():
                fail(errors, f"{page_rel} {attr} points to a missing file: {raw_url}")

        check_json_ld(path, text, errors)

    missing_from_sitemap = sorted(expected_sitemap_urls - sitemap)
    extra_in_sitemap = sorted(sitemap - expected_sitemap_urls)
    for url in missing_from_sitemap:
        fail(errors, f"sitemap.xml is missing canonical URL: {url}")
    for url in extra_in_sitemap:
        fail(errors, f"sitemap.xml includes a URL without a matching canonical page: {url}")

    alpha_page = ROOT / "alpha" / "index.html"
    if not alpha_page.exists():
        fail(errors, "alpha/index.html is missing")
    else:
        alpha_text = alpha_page.read_text(encoding="utf-8")
        if "mailto:alpha@dragonbudget.com" not in alpha_text and "https://tally.so/r/" not in alpha_text:
            fail(errors, "alpha/index.html needs a mailto or Tally signup link")
        if "testing" not in alpha_text.lower() or "product updates" not in alpha_text.lower():
            fail(errors, "alpha/index.html needs clear testing and product-update consent copy")

    if errors:
        print("Site check failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Site check passed: {len(public_html_files())} public HTML files checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
