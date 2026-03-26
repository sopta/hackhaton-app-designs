# Pencil vs CSS — Gradient Rotation

## Pencil (counter-clockwise)

- `0°` = up
- `90°` = left
- `180°` = down
- `270°` = right

## CSS (clockwise)

- `0deg` / `to top` = up
- `90deg` / `to right` = right
- `180deg` / `to bottom` = down
- `270deg` / `to left` = left

## Conversion formula

**CSS angle = (360° - Pencil angle) % 360°**

| Pencil | Direction | CSS                    |
|--------|-----------|------------------------|
| `0°`   | up        | `0deg` / `to top`      |
| `90°`  | left      | `270deg` / `to left`   |
| `180°` | down      | `180deg` / `to bottom` |
| `270°` | right     | `90deg` / `to right`   |

## Example from this project

The Pencil design had `rotation: 90` on the caption bar, which in its counter-clockwise system means **left**. The correct CSS translation is `to left` (270deg), not `to bottom` (180deg).

This is the classic "clockwise vs counter-clockwise" mismatch between the two systems.
