import { getPos } from "../utils.ts/utils";

interface CircleType {
  name: string;
  icon: string;
  img?: HTMLImageElement;
}

interface AnimationProps {
  onFinish: () => void;
  canvas: HTMLCanvasElement;
  circleSize: number;
  circleTotal: number;
  speed: number;
  types: Record<string, CircleType>;
  enableStroke: boolean;
  enableCollision: boolean;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  directionX: number;
  directionY: number;
  type: string;
  img?: HTMLImageElement;
}

export class Animation {
  private ctx: CanvasRenderingContext2D;
  private props: AnimationProps;
  private circles: Circle[];
  private animationRequestId: any;
  private _start: boolean;

  constructor(props: AnimationProps) {
    const { canvas } = props;

    this.ctx = canvas.getContext("2d")!;
    this.props = props;
    this.circles = this.generateCircles();
    this.animationRequestId = null;
    this._start = false;
  }

  private generateCircles() {
    const { canvas } = this.props;

    const { circleSize, circleTotal, speed, types } = this.props;
    const circles: Circle[] = [];
    const arrLength = Math.floor(circleTotal / Object.keys(types).length);

    for (let i = 0; i < circleTotal; i++) {
      const index = Math.floor(i / arrLength);
      const circle: Circle = {
        x: getPos(circleSize, canvas.width),
        y: getPos(circleSize, canvas.height),
        radius: circleSize,
        speed,
        directionX: Math.random() < 0.5 ? -1 : 1,
        directionY: Math.random() < 0.5 ? -1 : 1,
        type: Object.values(types)[index].name,
      };

      if (Object.values(types)[index].img) {
        circle.img = Object.values(types)[index].img;
      }

      circles.push(circle);
    }

    return circles;
  }

  private detectCollision(circle1: Circle, circle2: Circle) {
    const { enableCollision, types } = this.props;
    const distanceX = circle1.x - circle2.x;
    const distanceY = circle1.y - circle2.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance <= circle1.radius + circle2.radius) {
      const angle = Math.atan2(distanceY, distanceX);

      if (enableCollision) {
        circle1.directionX = Math.cos(angle);
        circle1.directionY = Math.sin(angle);
        circle2.directionX = -Math.cos(angle);
        circle2.directionY = -Math.sin(angle);
      }

      for (let i = 0; i < Object.keys(types).length; i++) {
        const currentType = Object.values(types)[i].name;
        const nextType =
          Object.values(types)[(i + 1) % Object.keys(types).length].name;

        if (
          (circle1.type === currentType && circle2.type === nextType) ||
          (circle1.type === nextType && circle2.type === currentType)
        ) {
          if (circle1.type === currentType) {
            circle1.type = nextType;
          } else {
            circle2.type = nextType;
          }
          break;
        }
      }
    }
  }

  private drawBackground() {
    const { canvas } = this.props;

    this.ctx.beginPath();

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.closePath();
  }

  private drawWatermark() {
    const { canvas } = this.props;

    this.ctx.beginPath();

    this.ctx.fillStyle = "black";
    this.ctx.font = "14px Kanit";
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillText("github.com/interaminense", 20, canvas.height - 20);

    this.ctx.closePath();

    this.ctx.globalAlpha = 1;
  }

  private drawImage(circle: Circle) {
    const { circleSize, enableStroke, types } = this.props;

    enableStroke && this.ctx.stroke();

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.clip();

    this.ctx.drawImage(
      types[circle.type].img as CanvasImageSource,
      circle.x - circleSize,
      circle.y - circleSize,
      circleSize * 2,
      circleSize * 2
    );

    this.ctx.beginPath();
    this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    this.ctx.clip();
    this.ctx.closePath();
    this.ctx.restore();
  }

  private drawIcon(circle: Circle) {
    const { circleSize, enableStroke, types } = this.props;

    this.ctx.beginPath();
    this.ctx.font = `${circleSize * 2}px Arial`;
    this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);

    enableStroke && this.ctx.stroke();

    const text = types[circle.type].icon;
    const textWidth = this.ctx.measureText(text).width;

    this.ctx.fillText(
      text,
      circle.x - textWidth / 2,
      circle.y + circleSize / 1.5
    );

    this.ctx.closePath();
  }

  private animate() {
    const { canvas, types } = this.props;

    // Clean up canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawBackground();

    // Draw the footer text at the bottom center of the canvas
    this.drawWatermark();

    this.circles.forEach((circle) => {
      // Add logic for bouncing the circles on the edges of the canvas
      if (
        circle.x + circle.radius >= canvas.width ||
        circle.x - circle.radius <= 0
      ) {
        circle.directionX = -circle.directionX;
      }
      if (
        circle.y + circle.radius >= canvas.height ||
        circle.y - circle.radius <= 0
      ) {
        circle.directionY = -circle.directionY;
      }

      // Update circle position
      circle.x += circle.speed * circle.directionX;
      circle.y += circle.speed * circle.directionY;

      if (types[circle.type].img) {
        this.drawImage(circle);
      } else {
        this.drawIcon(circle);
      }
    });

    // Call the collision detection function to check if the circles are colliding
    for (let i = 0; i < this.circles.length; i++) {
      for (let j = i + 1; j < this.circles.length; j++) {
        this.detectCollision(this.circles[i], this.circles[j]);
      }
    }

    if (!this._start) {
      return;
    }

    if (this.areAllTypesEqual()) {
      this.props.onFinish();

      this.stop();
    }

    this.animationRequestId = requestAnimationFrame(() => this.animate());
  }

  private areAllTypesEqual() {
    const firstType = this.circles[0].type;
    for (let i = 1; i < this.circles.length; i++) {
      if (this.circles[i].type !== firstType) {
        return false;
      }
    }
    return true;
  }

  private dispose() {
    cancelAnimationFrame(this.animationRequestId);
    this.ctx.clearRect(0, 0, this.props.canvas.width, this.props.canvas.height);
  }

  public updateProps(prop: string, value: any) {
    this.dispose();

    this.props = {
      ...this.props,
      [prop]: value,
    };

    this.circles = this.generateCircles();

    this._start = false;

    this.animate();
  }

  public start() {
    this.dispose();

    this.circles = this.generateCircles();

    this._start = true;

    this.animate();
  }

  public stop() {
    this.dispose();

    this._start = false;

    this.animate();
  }
}
