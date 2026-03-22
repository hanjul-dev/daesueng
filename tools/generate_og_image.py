from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


WIDTH = 1200
HEIGHT = 630


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf",
        "C:/Windows/Fonts/NanumGothicBold.ttf" if bold else "C:/Windows/Fonts/NanumGothic.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def rounded_photo(path: Path, size: tuple[int, int], radius: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    image.putalpha(mask)
    return image


def add_shadow(base: Image.Image, box: tuple[int, int, int, int], radius: int, blur: int) -> None:
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.rounded_rectangle(box, radius=radius, fill=(17, 18, 20, 58))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(shadow)


def draw_chip(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, font: ImageFont.FreeTypeFont) -> None:
    draw.rounded_rectangle(box, radius=18, fill=(255, 255, 255, 232), outline=(219, 212, 201, 255), width=1)
    draw.text((box[0] + 16, box[1] + 10), text, font=font, fill=(33, 35, 38, 255))


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    hero_path = repo_root / "src" / "assets" / "property" / "exterior-hero.jpeg"
    angle_path = repo_root / "src" / "assets" / "property" / "exterior-angle.jpeg"
    output_path = repo_root / "public" / "og-kakao-preview.jpg"

    canvas = Image.new("RGBA", (WIDTH, HEIGHT), (242, 238, 231, 255))
    gradient = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gradient_draw = ImageDraw.Draw(gradient)
    gradient_draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(244, 239, 231, 255))
    gradient_draw.ellipse((560, -180, 1220, 500), fill=(224, 214, 198, 255))
    gradient_draw.ellipse((-200, 340, 480, 920), fill=(232, 227, 216, 255))
    gradient = gradient.filter(ImageFilter.GaussianBlur(72))
    canvas.alpha_composite(gradient)

    draw = ImageDraw.Draw(canvas)
    badge_font = load_font(22, bold=True)
    title_font = load_font(58, bold=True)
    subtitle_font = load_font(24, bold=True)
    body_font = load_font(23, bold=False)
    chip_font = load_font(18, bold=True)
    footnote_font = load_font(18, bold=False)

    draw.rounded_rectangle((58, 54, 396, 102), radius=24, fill=(20, 22, 25, 255))
    draw.text((82, 68), "DAESEUNG CONSTRUCTION", font=badge_font, fill=(255, 255, 255, 255))

    draw.text((60, 138), "대승건설\n외관 4D 프리뷰", font=title_font, fill=(17, 18, 20, 255), spacing=4)
    draw.text(
        (62, 292),
        "공원 앞, 지하 1층 · 지상 2층\n단독주택",
        font=subtitle_font,
        fill=(50, 52, 57, 255),
        spacing=4,
    )
    draw.text(
        (62, 370),
        "실사 사진과 외관 투어를\n한 화면에서 확인하는 랜딩",
        font=body_font,
        fill=(84, 88, 95, 255),
        spacing=7,
    )

    chip_y = 458
    chip_boxes = [
        (60, chip_y, 232, chip_y + 50),
        (244, chip_y, 424, chip_y + 50),
        (60, chip_y + 64, 258, chip_y + 114),
    ]
    chip_texts = [
        "공원 오픈 뷰",
        "차고 동선 분리",
        "실시간 외관 체험",
    ]
    for box, text in zip(chip_boxes, chip_texts):
        draw_chip(draw, box, text, chip_font)

    draw.text((62, 584), "hanjul-dev.github.io/daesueng", font=footnote_font, fill=(104, 108, 114, 255))

    main_box = (500, 48, 1146, 542)
    inset_box = (552, 392, 872, 584)
    accent_box = (1080, 70, 1130, 120)

    add_shadow(canvas, main_box, radius=34, blur=28)
    add_shadow(canvas, inset_box, radius=26, blur=18)
    draw.rounded_rectangle(accent_box, radius=18, fill=(20, 22, 25, 235))
    draw.text((1094, 84), "OG", font=load_font(20, bold=True), fill=(255, 255, 255, 255))

    hero_image = rounded_photo(hero_path, (main_box[2] - main_box[0], main_box[3] - main_box[1]), 34)
    angle_image = rounded_photo(angle_path, (inset_box[2] - inset_box[0], inset_box[3] - inset_box[1]), 26)

    overlay = Image.new("RGBA", hero_image.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle((0, hero_image.size[1] - 150, hero_image.size[0], hero_image.size[1]), fill=(10, 12, 14, 96))
    overlay = overlay.filter(ImageFilter.GaussianBlur(16))
    hero_image.alpha_composite(overlay)

    canvas.alpha_composite(hero_image, (main_box[0], main_box[1]))
    canvas.alpha_composite(angle_image, (inset_box[0], inset_box[1]))

    draw.rounded_rectangle((530, 76, 652, 112), radius=18, fill=(20, 22, 25, 230))
    draw.text((549, 85), "대표 외관", font=load_font(18, bold=True), fill=(255, 255, 255, 255))

    draw.rounded_rectangle((882, 560, 1138, 604), radius=20, fill=(255, 255, 255, 238))
    draw.text((900, 573), "카카오톡 공유용 OG 이미지", font=load_font(18, bold=True), fill=(24, 26, 29, 255))

    rgb = canvas.convert("RGB")
    rgb.save(output_path, quality=92, optimize=True)


if __name__ == "__main__":
    main()
