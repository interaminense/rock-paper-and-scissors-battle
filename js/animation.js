class Animation {
  constructor({ id, ...props }) {
    const canvas = document.getElementById(id);

    this.ctx = canvas.getContext("2d");
    this.props = props;
    this.circles = this.generateCircles();
    this.animationRequestId = null;
    this._start = false;

    this.animate();
  }

  areAllTypesEqual() {
    const firstType = this.circles[0].type;

    for (let i = 1; i < this.circles.length; i++) {
      if (this.circles[i].type !== firstType) {
        return false;
      }
    }

    return true;
  }

  generateCircles() {
    const { circleSize, circleTotal, speed, types } = this.props;
    const circles = [];
    const arrLength = Math.floor(circleTotal / Object.keys(types).length);

    for (let i = 0; i < circleTotal; i++) {
      const index = Math.floor(i / arrLength);

      circles.push({
        x: getPos(circleSize, canvas.width),
        y: getPos(circleSize, canvas.height),
        radius: circleSize,
        speed,
        directionX: Math.random() < 0.5 ? -1 : 1,
        directionY: Math.random() < 0.5 ? -1 : 1,
        type: Object.values(types)[index].name,
      });
    }

    return circles;
  }

  detectCollision(circle1, circle2) {
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

  animate() {
    const { circleSize, enableStroke, types } = this.props;

    // Clean up canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    this.animationRequestId = requestAnimationFrame(() => this.animate());
  }

  updateProps(prop, value) {
    // Stop the animation loop
    cancelAnimationFrame(this.animationRequestId);

    this.props = {
      ...this.props,
      [prop]: value,
    };
    this.circles = this.generateCircles();

    this._start = false;

    this.animate();
  }

  start() {
    this._start = true;

    this.animate();
  }
}
