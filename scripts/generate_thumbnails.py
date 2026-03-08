from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "img"
THUMBS_DIR = SOURCE_DIR / "thumbs"
SIZE = (640, 360)
QUALITY = 78


def iter_source_images():
    for path in sorted(SOURCE_DIR.iterdir()):
        if path.is_dir():
            continue
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        yield path


def build_thumb(source: Path):
    destination = THUMBS_DIR / f"{source.stem}.jpg"

    with Image.open(source) as img:
        rgb_image = ImageOps.exif_transpose(img).convert("RGB")
        thumb = ImageOps.fit(rgb_image, SIZE, Image.Resampling.LANCZOS)
        thumb.save(destination, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    return destination


def main():
    THUMBS_DIR.mkdir(parents=True, exist_ok=True)

    generated = []
    for source in iter_source_images():
        generated.append(build_thumb(source))

    print(f"Generated {len(generated)} thumbnails in {THUMBS_DIR}")


if __name__ == "__main__":
    main()
