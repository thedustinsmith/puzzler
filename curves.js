// top down
function drawShape(ctx, xoff, yoff) {
  ctx.beginPath();
  ctx.moveTo(0 + xoff, 92 + yoff);
  ctx.bezierCurveTo(295 + xoff, 96 + yoff, 269 + xoff, 110 + yoff, 256 + xoff, 139 + yoff);
  ctx.bezierCurveTo(246 + xoff, 161 + yoff, 257 + xoff, 201 + yoff, 303 + xoff, 200 + yoff);
  ctx.bezierCurveTo(349 + xoff, 199 + yoff, 356 + xoff, 161 + yoff, 344 + xoff, 136 + yoff);
  ctx.bezierCurveTo(332 + xoff, 111 + yoff, 297 + xoff, 96 + yoff, 599 + xoff, 91 + yoff);
  ctx.stroke();
}

// top up
function drawShape(ctx, xoff, yoff) {
  ctx.beginPath();
  ctx.moveTo(0 + xoff, 92 + yoff);
  ctx.bezierCurveTo(295 + xoff, 96 + yoff, 272 + xoff, 92 + yoff, 253 + xoff, 50 + yoff);
  ctx.bezierCurveTo(243 + xoff, 28 + yoff, 249 + xoff, 1 + yoff, 295 + xoff, 0 + yoff);
  ctx.bezierCurveTo(341 + xoff, -1 + yoff, 340 + xoff, 28 + yoff, 332 + xoff, 55 + yoff);
  ctx.bezierCurveTo(320 + xoff, 94 + yoff, 297 + xoff, 96 + yoff, 599 + xoff, 91 + yoff);
  ctx.stroke();
}