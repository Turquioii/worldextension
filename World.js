// Utility function to split a string into an array
function splitStringToArray(string) {
  return string.split(",");
}

// Utility function to create a vector string
function createVectorString(x, y) {
  return `${x},${y}`;
}

(function (Scratch) {
  'use strict';

  class NoiseExtension {
    getInfo() {
      return {
        id: 'noise',
        name: 'Noise',
        color1: '#66cc99', // Lightest greenish-blue
        color2: '#339966', // Medium greenish-blue
        color3: '#006633',  // Darkest greenish-blue

        blocks: [
          {
            opcode: 'world_distance',
            blockType: Scratch.BlockType.REPORTER,
            text: 'distance from x:[X1] y:[Y1] to x:[X2] y:[Y2]',
            arguments: {
              X1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "-10",
              },
              Y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "-10",
              },
              X2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              Y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
            },
          },
          {
            filter: [Scratch.TargetType.SPRITE],
            opcode: "world_towardso",
            blockType: Scratch.BlockType.COMMAND,
            text: "point towards x: [X] y: [Y]",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            filter: [Scratch.TargetType.SPRITE],
            opcode: "world_towardsc",
            blockType: Scratch.BlockType.REPORTER,
            text: "point towards x: [X2] y: [Y2] from x:[X1] y:[Y1]",
            arguments: {
              X1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              Y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              X2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "-10",
              },
              Y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "-10",
              },
            },
          },
          {
            opcode: "world_vector",
            blockType: Scratch.BlockType.REPORTER,
            text: "x:[X] y:[Y] to vector",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
            },
          },
          {
            opcode: "world_getxy",
            blockType: Scratch.BlockType.REPORTER,
            text: "get [A] component from [V]",
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
                menu: "COMPONENTS",
              },
              V: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0,10",
              },
            },
          },
          {
            opcode: "world_snapto",
            blockType: Scratch.BlockType.REPORTER,
            text: "snap [V] to nearest [INC]",
            arguments: {
              INC: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              V: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0,9",
              },
            },
          },
          {
            hideFromPalette: true,
            opcode: "world_turn",
            blockType: Scratch.BlockType.REPORTER,
            text: "turn [A] around [B] by [D] degrees",
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "10,0",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0,0",
              },
              D: {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: "45",
              },
            },
          },
        ],
        menus: {
          PS: {
            acceptReporters: false,
            items: [
              'width',
              'height',
              'scale',
              'seed',
            ],
          },
          COMPONENTS: {
            acceptReporters: true,
            items: ['x', 'y'],
          },
        },
      };
    }

    world_distance(args, util) {
      const x1 = Scratch.Cast.toNumber(args.X1);
      const y1 = Scratch.Cast.toNumber(args.Y1);
      const x2 = Scratch.Cast.toNumber(args.X2);
      const y2 = Scratch.Cast.toNumber(args.Y2);
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    world_towardso(args, util) {
      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const { target } = util;
      const { x: spriteX, y: spriteY } = target;
      const angle = (180 / Math.PI) * Math.atan((x - spriteX) / (y - spriteY));
      target.setDirection(y >= spriteY ? angle + 180 : angle);
    }

    world_towardsc(args) {
      const x1 = Scratch.Cast.toNumber(args.X1);
      const y1 = Scratch.Cast.toNumber(args.Y1);
      const x2 = Scratch.Cast.toNumber(args.X2);
      const y2 = Scratch.Cast.toNumber(args.Y2);
      const angle = (180 / Math.PI) * Math.atan((x2 - x1) / (y2 - y1));
      return y1 >= y2 ? angle + 180 : angle;
    }

    world_vector(args) {
      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      return createVectorString(x, y);
    }

    world_getxy(args) {
      const A = Scratch.Cast.toString(args.A);
      const V = splitStringToArray(Scratch.Cast.toString(args.V));
      if (A === "x") {
        return Scratch.Cast.toNumber(V[0]);
      } else if (A === "y") {
        return Scratch.Cast.toNumber(V[1]);
      } else {
        return "";
      }
    }

    world_snapto(args) {
      const V = splitStringToArray(Scratch.Cast.toString(args.V));
      const INC = Scratch.Cast.toNumber(args.INC);
      let ret = "";
      for (let i = 0; i < V.length; i++) {
        ret += (Math.round(V[i] / INC)) * INC;
        if (i < V.length - 1) {
          ret += ",";
        }
      }
      return ret;
    }

    world_turn(args) {
      const A = splitStringToArray(Scratch.Cast.toString(args.A));
      const B = splitStringToArray(Scratch.Cast.toString(args.B));
      const x1 = A[0];
      const y1 = A[1];
      const x2 = B[0];
      const y2 = B[1];
      const angle = Scratch.Cast.toNumber(args.D);
      const radians = angle;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const newx = (x1 - x2) * cos - (y1 - y2) * sin + x2;
      const newy = (x1 - x2) * sin + (y1 - y2) * cos + y2;
      return createVectorString(newx, newy);
    }
  }

  Scratch.extensions.register(new NoiseExtension());
})(Scratch);
