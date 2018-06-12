# image-editor
## Setup and build
`npm install` - install dependencies

`broccoli build dist` - build project and save it to dist directory

`broccoli serve` - run live-reload server on your local machine.

## Configure colors, size, opacity, text options
### Colors
index.html
```
<div class="col-12">
  <div class="btn-group my-2" role="group" aria-label="drawing-palette-control">
    <button type="button" class="btn btn-light set-drawing-color" data-color="#ff0000" data-toggle="button" aria-pressed="false"><span class="icon"><svg><use href="images/icons.svg#square-full"></use></svg></span></button>

    ...

    <button type="button" class="btn btn-light set-drawing-color" data-color="#0000ff" data-toggle="button" aria-pressed="false"><span class="icon"><svg><use href="images/icons.svg#square-full"></use></svg></span></button>
  </div>
```

Just add another <button>...</button> block with your color in data-color attribute

### Opacity, width, height
app.js
```
var editor = new ImageEditor({ id: 'editor', width: 800, height: 600, opacity: 0.5 });

```

### Text options
app.js
```
editor.addText('default text', { 
    fontSize: 12,
    fontFamily: 'Sans Serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    scaleX: 2,
    scaleY: 2,
    lineHeight: 1.15 }
);
```