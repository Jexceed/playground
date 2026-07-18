#!/usr/bin/env python3

from pathlib import Path
import argparse

from PIL import Image


GRID_COLUMNS = 4
GRID_ROWS = 3
CANVAS_SIZE = 256
REGULAR_MAX_SIZE = 206
CELLS = {
    "red-disc": (0, 0),
    "blue-disc": (1, 0),
    "yellow-disc": (2, 0),
    "green-disc": (3, 0),
    "sun": (0, 1),
    "moon": (1, 1),
    "star": (2, 1),
    "purple-disc-source": (3, 1),
    "strawberry": (0, 2),
    "cookie": (1, 2),
    "apple": (2, 2),
}
SIZE_VARIANTS = {
    "large-disc": 196,
    "medium-disc": 124,
    "small-disc": 64,
}


def parse_args():
    parser = argparse.ArgumentParser(
        description="Crop the transparent pattern-train image-gen sheet into runtime PNG cards."
    )
    parser.add_argument("input", type=Path, help="Transparent 4x3 sticker sheet")
    parser.add_argument(
        "--color-source",
        type=Path,
        help="Optional original chroma sheet whose RGB is combined with the transparent input alpha",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/images/items/pattern-train"),
        help="Runtime output directory",
    )
    return parser.parse_args()


def crop_subject(sheet, column, row, color_sheet=None):
    cell_width = sheet.width // GRID_COLUMNS
    cell_height = sheet.height // GRID_ROWS
    box = (
        column * cell_width,
        row * cell_height,
        (column + 1) * cell_width,
        (row + 1) * cell_height,
    )
    alpha_cell = sheet.crop(box)
    cell = (color_sheet or sheet).crop(box).convert("RGBA")
    cell.putalpha(alpha_cell.getchannel("A"))
    alpha_box = cell.getchannel("A").getbbox()
    if alpha_box is None:
        raise ValueError(f"cell ({column}, {row}) contains no visible pixels")
    return cell.crop(alpha_box)


def contain(subject, maximum):
    scale = min(maximum / subject.width, maximum / subject.height)
    size = (
        max(1, round(subject.width * scale)),
        max(1, round(subject.height * scale)),
    )
    resized = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((CANVAS_SIZE - resized.width) // 2, (CANVAS_SIZE - resized.height) // 2),
    )
    return canvas


def main():
    args = parse_args()
    sheet = Image.open(args.input).convert("RGBA")
    color_sheet = Image.open(args.color_source).convert("RGBA") if args.color_source else None
    if sheet.width % GRID_COLUMNS or sheet.height % GRID_ROWS:
        raise ValueError(
            f"sheet must divide into an exact 4x3 grid, got {sheet.width}x{sheet.height}"
        )
    if color_sheet and color_sheet.size != sheet.size:
        raise ValueError(
            f"color source must match transparent sheet size, got {color_sheet.size} and {sheet.size}"
        )

    args.output.mkdir(parents=True, exist_ok=True)
    subjects = {
        name: crop_subject(sheet, column, row, color_sheet)
        for name, (column, row) in CELLS.items()
    }

    for name, subject in subjects.items():
        if name == "purple-disc-source":
            continue
        contain(subject, REGULAR_MAX_SIZE).save(args.output / f"{name}.png")

    purple_disc = subjects["purple-disc-source"]
    for name, diameter in SIZE_VARIANTS.items():
        contain(purple_disc, diameter).save(args.output / f"{name}.png")

    print(
        f"Wrote {len(CELLS) - 1 + len(SIZE_VARIANTS)} pattern assets to {args.output}"
    )


if __name__ == "__main__":
    main()
