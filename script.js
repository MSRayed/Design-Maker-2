var sliders = {}; // All the sliders will be stored in here
var canvas_sizes = {};
var lines = [];

var x = 0;
var y = 0;
var spacing = 10;

var x_limit;
var graphics;


function setup() {
  createCanvas(500, 700);

  sliders = {
    "spacing" : makeSlider(5, 50, 10, 2, initialize, "Spacing"), //min, max, start, step, callback, title_text
    "forward_sl_prob": makeSlider(0, 1, 0.5, 0.1, null, "Probability of the forward slash"),
    "x_limit_dec": makeSlider(-10, 10, 0, 1, null, "X limit decrement or Increment"),
    "width": makeSlider(0, width, width, 5, set_canvas_size, "Side margin"),
    "height": makeSlider(0, height, height, 5, set_canvas_size, "Top bottom margin"),

    // Circle of doom
    "codSize": makeSlider(0, 200, 50, 5, null, "COD Size"),
    "codX": makeSlider(0, 100, 50, 1, null, "COD x"),
    "codY": makeSlider(0, 100, 50, 1, null, "COD y"),
  }

  canvas_sizes = {
    "A3": [842, 1191],
    "A4": [595, 842],
    "A5": [420, 595],
    "A6": [298, 420],
  }

  graphics = createGraphics(sliders['width'].value(), sliders['height'].value());

  // Some other dom elements
  canvas_size = createSelect(); // The selection of sizes object
  canvas_size.parent(select(".control-panel"))
  
  for (const property in canvas_sizes) {
    canvas_size.option(property)
  }

  canvas_size.changed(set_canvas_size);

  set_canvas_size();

  x_limit = width;

  initialize(); // Will initialize the shapes
  graphics.background(200);
}


function draw() {
  background(200);

  image(graphics, 0, 0);

  push();
  rectMode(CENTER);
  strokeWeight(10);
  stroke(0);
  noFill();
  rect(width/2, height/2, sliders['width'].value(), sliders['height'].value());
  pop();

  // Drawing the circle of doom
  if (sliders['codSize'].value() != 0) {
    codsize = sliders['codSize'].value();
    codx = map(sliders['codX'].value(), 0, 100, 0, width);
    cody = map(sliders['codY'].value(), 0, 100, 0, height);
    ellipse(codx, cody, codsize, codsize);
  }

  graphics.stroke(0);
  
  if (random(1) < sliders["forward_sl_prob"].value()) {
    graphics.line(x, y, x+spacing, y+spacing);
  } else {
    graphics.line(x, y+spacing, x+spacing, y);
  }

  x += spacing;

  if (x > x_limit) {
    x = 0;
    y += spacing;

    x_limit += sliders['x_limit_dec'].value() * spacing;
  }

  if (y > height) {
    graphics.noLoop();
  }
}

function set_canvas_size() {
  x = 0; // Starting all over again
  y = 0;
  resizeCanvas(canvas_sizes[canvas_size.value()][0], canvas_sizes[canvas_size.value()][1]);
  graphics.resizeCanvas(canvas_sizes[canvas_size.value()][0], canvas_sizes[canvas_size.value()][1]);
  background(200);
}

function reset() {
  x = 0;
  y = 0;
  sliders['x_limit_dec'].value(0);
  x_limit = width;
}

function makeSlider(min, max, start, step, callback=null, title_text) { // To create the slider adding an input event to it
  slider = createSlider(min, max, start, step);
  if (callback) {
    slider.changed(callback);
  }

  controlPanel = select(".control-panel");
  sliderContainer = createDiv();
  sliderContainer.addClass('slider-container');

  slider.parent(sliderContainer);
  title_p = createP(title_text);

  title_p.parent(sliderContainer);
  sliderContainer.parent(controlPanel);
  return slider;
}

function initialize() {
  graphics.background(200);
  reset();
  spacing = sliders['spacing'].value();
}

function window_resize() {
	w1 = sliders['window_width'].value();
	h1 = sliders['window_height'].value();

  w2 = sliders['width'].value();
  h2 = sliders['height'].value();

	resizeCanvas(w1, h1);
  graphics.resizeCanvas(w2, h2);
  background(200);
}

function download(canvas, filename) {
  canvas = document.getElementsByTagName("canvas");
  filename = "design.svg"
  /// create an "off-screen" anchor tag
  var lnk = document.createElement('a'), e;

  /// the key here is to set the download attribute of the a tag
  lnk.download = filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = canvas[0].toDataURL("image/svg;base64");

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
                     0, 0, 0, 0, 0, false, false, false,
                     false, 0, null);

    lnk.dispatchEvent(e);
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }
}