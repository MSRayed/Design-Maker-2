var sliders = {}; // All the sliders will be stored in here
var canvas_sizes = {};

var x = 0;
var y = 0;
var spacing = 10;

var x_limit;

function setup() {
  createCanvas(500, 700);

  sliders = {
    "spacing" : makeSlider(5, 50, 10, 5, initialize, "Spacing"), //min, max, start, step, callback, title_text
    "forward_sl_prob": makeSlider(0, 1, 0.5, 0.1, null, "Probability of the forward slash"),
    "x_limit_dec": makeSlider(-10, 10, 0, 1, null, "X limit decrement or Increment"),
  }

  canvas_sizes = {
    "A3": [842, 1191],
    "A4": [595, 842]
  }

  canvas_size = createSelect();
  canvas_size.parent(select(".control-panel"))
  canvas_size.option('A3');
  canvas_size.option('A4');
  canvas_size.changed(set_canvas_size);
  set_canvas_size();

  x_limit = width;

  initialize(); // Will initialize the shapes
  background(0);
}


function draw() {
  stroke(255);
  if (random(1) < sliders["forward_sl_prob"].value()) {
    line(x, y, x+spacing, y+spacing);
  } else {
    line(x, y+spacing, x+spacing, y);
  }

  x += spacing;

  if (x > x_limit) {
    x = 0;
    y += spacing;

    x_limit += sliders['x_limit_dec'].value() * spacing;
    console.log(sliders['x_limit_dec'].value());
  }
  if (y > height) {
    noLoop();
  }
}

function set_canvas_size() {
  x = 0; // Starting all over again
  y = 0;
  resizeCanvas(canvas_sizes[canvas_size.value()][0], canvas_sizes[canvas_size.value()][1]);
  background(0);
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
  spacing = sliders['spacing'].value();
}

function window_resize() {
	w = sliders['window_width'].value();
	h = sliders['window_height'].value();

	resizeCanvas(w, h);
  background(0);
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