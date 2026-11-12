// Higgsfield resizer helper and crop sheet coordinates
export const SHEETS = {
  work1: {
    w: 2688,
    h: 1520,
    url: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261110_224238_b0899b4d-5876-4c63-98d3-8608d8dbe790.png&w=2400&q=85",
    cells: [
      [0, 0, 1336, 752],
      [1352, 0, 1336, 752],
      [0, 768, 1336, 752],
      [1352, 768, 1336, 752]
    ]
  },
  work2: {
    w: 2688,
    h: 1520,
    url: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261110_224238_aee93a53-873f-470f-afb3-6395c22ab639.png&w=2400&q=85",
    cells: [
      [0, 0, 1335, 749],
      [1356, 0, 1332, 749],
      [0, 770, 1335, 750],
      [1356, 770, 1332, 750]
    ]
  },
  team1: {
    w: 1744,
    h: 2336,
    url: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261110_224239_be9bd6b1-debb-4a95-aadf-1a36e4d2f557.png&w=1600&q=85",
    cells: [
      [0, 0, 864, 1156],
      [881, 0, 863, 1156],
      [0, 1175, 864, 1161],
      [881, 1175, 863, 1161]
    ]
  },
  team2: {
    w: 1744,
    h: 2336,
    url: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261110_224238_bfc657e7-cbc1-43fb-a726-e8be5dd42302.png&w=1600&q=85",
    cells: [
      [0, 0, 864, 1159],
      [880, 0, 864, 1159],
      [0, 1176, 864, 1160],
      [880, 1176, 864, 1160]
    ]
  },
  bts: {
    w: 1744,
    h: 2336,
    url: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261110_224238_bf8567fa-9d67-4f1e-b4e0-5662c0bf70e4.png&w=1600&q=85",
    cells: [
      [0, 0, 865, 1160],
      [881, 0, 863, 1160],
      [0, 1176, 865, 1160],
      [881, 1176, 863, 1160]
    ]
  }
};

export function initCrops(root: HTMLElement | Document = document) {
  const boxes = root.querySelectorAll<HTMLElement>('.crop[data-crop]');
  boxes.forEach(box => {
    if (box.querySelector('.cell')) return;
    const cropAttr = box.getAttribute('data-crop');
    if (!cropAttr) return;
    const [sheetKey, cellIdxStr] = cropAttr.split(':');
    const sheet = (SHEETS as Record<string, typeof SHEETS.work1>)[sheetKey];
    if (!sheet) return;

    const cellIdx = parseInt(cellIdxStr, 10);
    const cellCoords = sheet.cells[cellIdx];
    if (!cellCoords) return;

    // Inset by 4px on each side so white gutters never show
    let [x, y, w, h] = cellCoords;
    x += 4;
    y += 4;
    w -= 8;
    h -= 8;

    const ar = w / h;
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.setProperty('--ar', String(ar));

    const img = document.createElement('img');
    img.src = sheet.url;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = 'Editorial preview';
    img.style.width = `${(sheet.w / w) * 100}%`;
    img.style.height = `${(sheet.h / h) * 100}%`;
    img.style.left = `${(-x / w) * 100}%`;
    img.style.top = `${(-y / h) * 100}%`;

    cell.appendChild(img);
    box.appendChild(cell);
  });
}
