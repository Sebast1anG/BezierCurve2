import { Point } from "pixi.js";

export class Bezier {
  public constructor(
    public startX: number,
    public startY: number,
    public cpX: number,
    public cpY: number,
    public cpX2: number,
    public cpY2: number,
    public endX: number,
    public endY: number
  ) {}

  public getPointAt(progress: number): Point {
    const dt = 1 - progress;
    const dt2 = dt * dt;
    const dt3 = dt2 * dt;

    const t2 = progress * progress;
    const t3 = t2 * progress;

    return new Point(
      dt3 * this.startX +
        3 * dt2 * progress * this.cpX +
        3 * dt * t2 * this.cpX2 +
        t3 * this.endX,
      dt3 * this.startY +
        3 * dt2 * progress * this.cpY +
        3 * dt * t2 * this.cpY2 +
        t3 * this.endY
    );
  }

  public getPoints(count: number): Point[] {
    const points: Point[] = [];
    for (let i = 0; i <= count; ++i) {
      const progress = i / count;
      points.push(this.getPointAt(progress));
    }
    return points;
  }
}
