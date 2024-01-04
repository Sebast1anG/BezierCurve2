import './main.css';
import * as PIXI from 'pixi.js';

class BezierCurveApp {
    private app: PIXI.Application;
    private graphics: PIXI.Graphics;
    private startPoint: PIXI.Point;
    private controlPoint1: PIXI.Point;
    private controlPoint2: PIXI.Point;
    private endPoint: PIXI.Point;
    private dragTarget: PIXI.Graphics | null = null;

    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600 });
        document.body.appendChild(this.app.view);

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
        this.app.stage.on('pointerup', this.onDragEnd.bind(this));
        this.app.stage.on('pointerupoutside', this.onDragEnd.bind(this));

        const controlPoints = [this.controlPoint1, this.controlPoint2];
        controlPoints.forEach((controlPoint, index) => {
            const controlPointGraphic = new PIXI.Graphics();
            controlPointGraphic.beginFill(0x00FF00);
            controlPointGraphic.lineStyle(2, 0x00FF00);
            controlPointGraphic.drawCircle(0, 0, 8);
            controlPointGraphic.endFill();
            controlPointGraphic.interactive = true;

            controlPointGraphic
                .on('pointerdown', this.onDragStart.bind(this))
                .on('pointerup', this.onDragEnd.bind(this))
                .on('pointerupoutside', this.onDragEnd.bind(this))
                .on('pointermove', this.onDragMove.bind(this));

            controlPointGraphic.position.copyFrom(controlPoint);
            controlPointGraphic.zIndex = index;
            this.app.stage.addChild(controlPointGraphic);
        });

        this.updateBezierCurve();
    } 
    console.log('text')

    private onDragMove(x: number, y: number) {
        if (this.dragTarget) {
            this.dragTarget.position.set(x, y);
            if (this.dragTarget === this.controlPoint1) {
                this.controlPoint1.copyFrom(this.dragTarget.position);
            } else if (this.dragTarget === this.controlPoint2) {
                this.controlPoint2.copyFrom(this.dragTarget.position);
            }
            this.updateBezierCurve();
        }
    }

    private onDragStart(t: { x: number; y: number; }) {
        if (t.x === this.controlPoint1.x && y === this.controlPoint1.y) {
            this.dragTarget = this.controlPoint1;
        } else if (t.x === this.controlPoint2.x && t.y === this.controlPoint2.y) {
            this.dragTarget = this.controlPoint2;
        }

        if (this.dragTarget) {
            this.dragTarget.alpha = 0.5;
            this.dragTarget.dragPoint = { x, y };
        }
    }

    private onDragEnd() {
        if (this.dragTarget) {
            this.dragTarget.alpha = 1;
            this.dragTarget = null;
        }
    }

    private updateBezierCurve() {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xFF0000);
        this.graphics.moveTo(this.startPoint.x, this.startPoint.y);
        this.graphics.bezierCurveTo(
            this.controlPoint1.x, this.controlPoint1.y,
            this.controlPoint2.x, this.controlPoint2.y,
            this.endPoint.x, this.endPoint.y
        );
    }
}

const bezierApp = new BezierCurveApp();