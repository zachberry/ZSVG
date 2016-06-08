#ZSVG

Work in progress SVG library

#Building

`browserify js/build.js -o zsvg.js`

# Issues

Chrome removed pathSegList - consider using a polyfill such as `https://github.com/progers/pathseg`

# Usage example

```
var stage = new ZVG.Stage('zsvg').size(1000, 400);
var p = new ZVG.Polygon();
var path = new ZVG.Path();

stage.append(p);
stage.append(path);

p.stroke('red', 10).fill('', 0);
path.stroke('white', 10, 0.5).fill('', 0);