export function getBoxSVG(prefix: string): string {
  const p = prefix;
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gift box">
<defs>
<linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2825"/><stop offset="1" stop-color="#171412"/></linearGradient>
<linearGradient id="${p}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#151210"/><stop offset="1" stop-color="#0a0908"/></linearGradient>
<linearGradient id="${p}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b08a55"/><stop offset=".3" stop-color="#f4e1b4"/><stop offset=".62" stop-color="#d6b274"/><stop offset="1" stop-color="#97713c"/></linearGradient>
<radialGradient id="${p}g"><stop offset="0" stop-color="#fff4c6"/><stop offset=".55" stop-color="#f0b64a" stop-opacity=".55"/><stop offset="1" stop-color="#e8a93c" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="150" cy="272" rx="108" ry="12" fill="#000" opacity=".3"/>
<g class="bd"><rect x="60" y="140" width="140" height="120" fill="url(#${p}f)"/><polygon points="200,140 250,120 250,240 200,260" fill="url(#${p}s)"/>
<polygon class="inner" points="60,140 200,140 250,120 110,120" fill="#f0b64a" opacity="0"/>
<g class="rb"><rect x="117" y="140" width="26" height="120" fill="url(#${p}r)"/><rect x="60" y="192" width="140" height="20" fill="url(#${p}r)"/><polygon points="200,192 250,172 250,192 200,212" fill="url(#${p}r)" opacity=".85"/></g></g>
<ellipse class="glow" cx="155" cy="122" rx="110" ry="60" fill="url(#${p}g)" opacity="0"/>
<g class="lid"><rect x="50" y="105" width="160" height="38" fill="url(#${p}f)"/><polygon points="210,105 260,87 260,125 210,143" fill="url(#${p}s)"/><polygon points="50,105 210,105 260,87 100,87" fill="#383430"/>
<rect x="117" y="105" width="26" height="38" fill="url(#${p}r)"/><polygon points="117,105 143,105 193,87 167,87" fill="url(#${p}r)"/>
<g class="bow"><path class="t1" d="M155 98 L128 128 L141 132 L158 104Z" fill="url(#${p}r)"/><path class="t2" d="M155 98 L184 126 L171 131 L152 104Z" fill="url(#${p}r)"/>
<ellipse class="lp1" cx="133" cy="90" rx="23" ry="12" transform="rotate(-22 133 90)" fill="url(#${p}r)"/><ellipse class="lp2" cx="177" cy="90" rx="23" ry="12" transform="rotate(22 177 90)" fill="url(#${p}r)"/>
<ellipse cx="133" cy="90" rx="12" ry="5" transform="rotate(-22 133 90)" fill="#97713c" opacity=".45"/><ellipse cx="177" cy="90" rx="12" ry="5" transform="rotate(22 177 90)" fill="#97713c" opacity=".45"/>
<circle class="kn" cx="155" cy="94" r="9" fill="url(#${p}r)"/></g></g></svg>`;
}
