from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

F = TTFont(r'C:\Windows\Fonts\georgiab.ttf')
gs = F.getGlyphSet(); cmap = F.getBestCmap()
bp = BoundsPen(gs); gs[cmap[ord('H')]].draw(bp); cap = bp.bounds[3]

def text(s, x, base, capH, track=0.0, target=None):
    sc = capH / cap
    adv = [gs[cmap[ord(c)]].width * sc for c in s]; n = len(s)
    if target: track = (target - sum(adv)) / (n - 1)
    d = ''; cx = x
    for c, a in zip(s, adv):
        if c != ' ':
            p = SVGPathPen(gs)
            gs[cmap[ord(c)]].draw(TransformPen(p, (sc, 0, 0, -sc, cx, base)))
            d += p.getCommands()
        cx += a + track
    return d, cx - track

NAVY, GOLD, WHITE = '#0B1F3A', '#C9A646', '#FFFFFF'

def emblem(main):
    _, w = text('SMI', 0, 0, 26, track=5)
    smi, _ = text('SMI', 100 - w / 2, 171, 26, track=5)
    return f'''<circle cx="100" cy="100" r="92" fill="none" stroke="{main}" stroke-width="8"/>
<path fill="{GOLD}" d="M100 26C111 44 119 57 119 70C119 81 111 89 100 89C89 89 81 81 81 70C81 57 89 44 100 26Z"/>
<path fill="{main}" d="M95 135V101Q66 80 32 88V121Q66 115 95 135Z"/>
<path fill="{main}" d="M105 135V101Q134 80 168 88V121Q134 115 105 135Z"/>
<path fill="{main}" d="{smi}"/>'''

def emblem_svg(main):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="SMI emblem">{emblem(main)}</svg>'

def primary(main):
    l1, _ = text('SIR MAZHAR', 232, 84, 38, target=468)
    l2, _ = text('INSTITUTE', 232, 154, 38, target=468)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 200" role="img" aria-label="SMI - Sir Mazhar Institute">
<g>{emblem(main)}</g><path fill="{main}" d="{l1}"/><rect x="232" y="100" width="468" height="5" fill="{GOLD}"/><path fill="{main}" d="{l2}"/></svg>'''

for name, main in (('', NAVY), ('-reversed', WHITE)):
    open(f'smi-logo-primary{name}.svg', 'w').write(primary(main))
    open(f'smi-emblem{name}.svg', 'w').write(emblem_svg(main))