export function extractPercentClicks(clicks: any) {
  return clicks.map((click) => ({ x: click.xPercent, y: click.yPercent }));
}
