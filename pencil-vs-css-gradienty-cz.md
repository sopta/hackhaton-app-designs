# Pencil vs CSS — rotace gradientu

## Pencil (proti smeru hodinovych rucicek / counter-clockwise)

- `0°` = nahoru
- `90°` = doleva
- `180°` = dolu
- `270°` = doprava

## CSS (po smeru hodinovych rucicek / clockwise)

- `0deg` / `to top` = nahoru
- `90deg` / `to right` = doprava
- `180deg` / `to bottom` = dolu
- `270deg` / `to left` = doleva

## Prevodni vzorec

**CSS uhel = (360° - Pencil uhel) % 360°**

| Pencil | Smer    | CSS                    |
|--------|---------|------------------------|
| `0°`   | nahoru  | `0deg` / `to top`      |
| `90°`  | doleva  | `270deg` / `to left`   |
| `180°` | dolu    | `180deg` / `to bottom` |
| `270°` | doprava | `90deg` / `to right`   |

## Priklad z projektu

Pencil design mel na caption baru `rotation: 90`, coz v jeho counter-clockwise systemu znamena **doleva**. Spravny CSS prepis je tedy `to left` (270deg), nikoliv `to bottom` (180deg).

Jde o klasicky "clockwise vs counter-clockwise" problem mezi obema systemy.
