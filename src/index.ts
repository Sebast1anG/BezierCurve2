import { Bezier } from "./Bezier";
import "./main.css";
import * as PIXI from "pixi.js";

const ANIMATION_TIME = 5000;

class BezierCurveApp {
  private readonly app: PIXI.Application;
  private readonly graphics: PIXI.Graphics;
  private readonly startPoint: PIXI.Point;
  private readonly controlPoint1: PIXI.Point;
  private readonly controlPoint2: PIXI.Point;
  private readonly endPoint: PIXI.Point;

  private currentDraggingPoint?: PIXI.Point;
  private dragTarget?: PIXI.Graphics;

  constructor() {
    this.app = new PIXI.Application({ width: 800, height: 600 });
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    this.graphics = new PIXI.Graphics();
    this.app.stage.addChild(this.graphics);
    this.startPoint = new PIXI.Point(600, 100);
    this.controlPoint1 = new PIXI.Point(250, 150);
    this.controlPoint2 = new PIXI.Point(550, 500);
    this.endPoint = new PIXI.Point(200, 500);

    this.setup();
  }

  private setup() {
    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on("pointerup", this.onDragEnd.bind(this));
    this.app.stage.on("pointerupoutside", this.onDragEnd.bind(this));
    this.app.stage.on("pointermove", this.onDrag.bind(this));

    const controlPoints = [
      this.startPoint,
      this.controlPoint1,
      this.controlPoint2,
      this.endPoint,
    ];
    controlPoints.forEach((controlPoint, index) => {
      const controlPointGraphic = new PIXI.Graphics()
        .beginFill(0x00ff00)
        .lineStyle(2, 0x00ff00)
        .drawCircle(0, 0, 8)
        .endFill();
      controlPointGraphic.cursor = "pointer";
      controlPointGraphic.interactive = true;

      controlPointGraphic.on("pointerdown", () => {
        this.currentDraggingPoint = controlPoint;
        this.dragTarget = controlPointGraphic;
      });

      controlPointGraphic.position.copyFrom(controlPoint);
      controlPointGraphic.zIndex = index;
      this.app.stage.addChild(controlPointGraphic);
    });

    this.updateBezierCurve();
  }

  private onDrag(evt: PIXI.FederatedPointerEvent) {
    if (!this.currentDraggingPoint) {
      return;
    }
    this.currentDraggingPoint.set(evt.x, evt.y);
    this.dragTarget?.position.copyFrom(this.currentDraggingPoint);
    this.updateBezierCurve();
  }


  private onDragEnd() {
    delete this.currentDraggingPoint;
    delete this.dragTarget;
  }

  private updateBezierCurve() {
    this.graphics
      .clear()
      .lineStyle(2, 0xff0000)
      .moveTo(this.startPoint.x, this.startPoint.y)
      .bezierCurveTo(
        this.controlPoint1.x,
        this.controlPoint1.y,
        this.controlPoint2.x,
        this.controlPoint2.y,
        this.endPoint.x,
        this.endPoint.y
      );
  }

  private start() {
    const bezier = new Bezier(
      this.startPoint.x,
      this.startPoint.y,
      this.controlPoint1.x,
      this.controlPoint1.y,
      this.controlPoint2.x,
      this.controlPoint2.y,
      this.endPoint.x,
      this.endPoint.y
    );

    const dot = new PIXI.Graphics()
      .beginFill(0x0000ff)
      .drawRect(-20, -50, 40, 100);

    this.app.stage.addChild(dot);

    let startTime = 0;
    let previousPoint = bezier.getPointAt(0);

    const onUpdate = () => {
      startTime += this.app.ticker.deltaMS;
      const progress = Math.min(1, startTime / ANIMATION_TIME);
      const point = bezier.getPointAt(progress);
      dot.position.copyFrom(point);
        const diffX = point.x - previousPoint.x;
        const diffY = point.y - previousPoint.y;

        const rad = Math.atan2(diffY, diffX);
        // obliczenie ró¿nicy w k¹tach
          dot.rotation = rad; 
          dot.position.copyFrom(point);

          if (progress >= 1) {
              dot.destroy();
              this.app.ticker.remove(onUpdate);
          }

          previousPoint = point;
      };

      this.app.ticker.add(onUpdate);
  }
}

declare global {
  interface Window {
    game: BezierCurveApp;
  }
}

window.game = new BezierCurveApp();


      //to run use game.start() in console