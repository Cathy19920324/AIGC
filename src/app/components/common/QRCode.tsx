export function QRCode({ size = 100 }: { size?: number }) {
  // 简单的二维码占位图案（伪随机方格）
  const cells = 21;
  const grid: number[][] = [];
  let seed = 12345;
  for (let i = 0; i < cells; i++) {
    grid[i] = [];
    for (let j = 0; j < cells; j++) {
      seed = (seed * 9301 + 49297) % 233280;
      grid[i][j] = seed / 233280 > 0.5 ? 1 : 0;
    }
  }
  // 三个定位角
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const border = i === 0 || i === 6 || j === 0 || j === 6;
        const center = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = border || center ? 1 : 0;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, cells - 7);
  drawFinder(cells - 7, 0);

  const cellSize = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {grid.flatMap((row, i) =>
        row.map((v, j) =>
          v ? (
            <rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#1a1a1a"
            />
          ) : null
        )
      )}
    </svg>
  );
}
