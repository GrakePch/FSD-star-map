const svgs = {
  star: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M71,381.8l35.8,-36l28.4,28.4l-36,35.8l-28.2,-28.2Zm169,-261.8c66.2,0 120,53.6 120,120c0,66.2 -53.8,120 -120,120c-66.2,0 -120,-53.8 -120,-120c0,-66.2 53.8,-120 120,-120Zm0,40c-44.153,0 -80,35.847 -80,80c0,44.153 35.847,80 80,80c44.153,0 80,-35.847 80,-80c0,-44.153 -35.847,-80 -80,-80Zm160,100l0,-40l60,0l0,40l-60,0Zm-55.2,114.2l28.4,-28.4l35.8,36l-28.2,28.2l-36,-35.8Zm64.2,-274.2l-35.8,36.2l-28.4,-28.4l36,-35.8l28.2,28Zm-149,-80l0,60l-40,0l0,-60l40,0Zm-124.8,87.8l-28.4,28.4l-35.8,-36.2l28.2,-28l36,35.8Zm-115.2,152.2l0,-40l60,0l0,40l-60,0Zm240,140l0,60l-40,0l0,-60l40,0Z" style="fill-rule:nonzero;"/></svg>`,
  planet: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M240,60c99.345,0 180,80.655 180,180c0,99.345 -80.655,180 -180,180c-99.345,0 -180,-80.655 -180,-180c0,-99.345 80.655,-180 180,-180Zm0,40c-77.268,0 -140,62.732 -140,140c0,77.268 62.732,140 140,140c77.268,0 140,-62.732 140,-140c0,-77.268 -62.732,-140 -140,-140Z"/></svg>`,
  moon: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M369.981,339.507c-32.262,48.502 -87.415,80.493 -149.981,80.493c-99.345,0 -180,-80.655 -180,-180c0,-99.345 80.655,-180 180,-180c62.566,0 117.719,31.991 149.981,80.493c50.513,5.015 90.019,47.684 90.019,99.507c0,51.823 -39.506,94.492 -90.019,99.507Zm-9.981,-159.507c-33.115,0 -60,26.885 -60,60c0,33.115 26.885,60 60,60c33.115,-0 60,-26.885 60,-60c-0,-33.115 -26.885,-60 -60,-60Zm-35.753,-33.409c-25.64,-28.592 -62.858,-46.591 -104.247,-46.591c-77.268,0 -140,62.732 -140,140c0,77.268 62.732,140 140,140c41.389,-0 78.607,-17.999 104.247,-46.591c-37.556,-14.4 -64.247,-50.812 -64.247,-93.409c0,-42.597 26.691,-79.009 64.247,-93.409Z"/></svg>`,
  jump_point: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M146.831,339.982c-10.999,36.58 -27.897,60.018 -46.831,60.018c-33.115,0 -60,-71.694 -60,-160c0,-88.306 26.885,-160 60,-160c18.934,0 35.832,23.438 46.831,60.018c19.997,23.046 51.116,47.482 93.169,47.482c42.053,0 73.172,-24.436 93.169,-47.482c10.999,-36.58 27.897,-60.018 46.831,-60.018c33.115,0 60,71.694 60,160c0,88.306 -26.885,160 -60,160c-18.934,0 -35.832,-23.438 -46.831,-60.018c-19.997,-23.046 -51.116,-47.482 -93.169,-47.482c-42.053,0 -73.172,24.436 -93.169,47.482Zm176.176,-150.101c-22.256,15.944 -50.012,27.619 -83.007,27.619c-32.995,0 -60.751,-11.675 -83.007,-27.619c1.951,15.768 3.007,32.617 3.007,50.119c-0,17.502 -1.056,34.351 -3.007,50.119c22.256,-15.944 50.012,-27.619 83.007,-27.619c32.995,0 60.751,11.675 83.007,27.619c-1.951,-15.768 -3.007,-32.617 -3.007,-50.119c-0,-17.502 1.056,-34.351 3.007,-50.119Zm-223.007,-49.881c-18.397,-0 -33.333,44.808 -33.333,100c-0,55.192 14.936,100 33.333,100c18.397,0 33.333,-44.808 33.333,-100c0,-55.192 -14.936,-100 -33.333,-100Zm280,0c-18.397,0 -33.333,44.808 -33.333,100c-0,55.192 14.936,100 33.333,100c18.397,0 33.333,-44.808 33.333,-100c0,-55.192 -14.936,-100 -33.333,-100Z"/></svg>`,
  lagrange_point: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M290,350c16.557,0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm-247.926,-159.374c21.334,-72.576 88.484,-125.626 167.926,-125.626c13.854,-0 27.335,1.613 40.264,4.662c-6.083,7.952 -9.834,17.779 -10.229,28.458c-9.692,-2.045 -19.739,-3.12 -30.035,-3.12c-64.373,-0 -119.004,42.039 -137.915,100.137c-6.661,-3.289 -14.159,-5.137 -22.085,-5.137c-2.697,-0 -5.344,0.214 -7.926,0.626Zm294.221,-71.716c30.16,31.447 48.705,74.12 48.705,121.09c0,46.97 -18.545,89.643 -48.705,121.09c-3.923,-9.583 -10.737,-17.682 -19.354,-23.209c23.631,-25.801 38.059,-60.17 38.059,-97.881c0,-37.711 -14.428,-72.08 -38.059,-97.881c8.617,-5.527 15.431,-13.626 19.354,-23.209Zm-86.031,291.428c-12.929,3.049 -26.41,4.662 -40.264,4.662c-79.442,0 -146.592,-53.05 -167.926,-125.626c2.582,0.412 5.229,0.626 7.926,0.626c7.926,0 15.424,-1.848 22.085,-5.137c18.911,58.098 73.542,100.137 137.915,100.137c10.296,-0 20.343,-1.075 30.035,-3.12c0.395,10.679 4.146,20.506 10.229,28.458Zm-152.557,-185.338l103.633,-0l52.338,-90.653c6.906,7.3 15.985,12.522 26.197,14.625l-43.894,76.028l26.312,-0c-1.49,4.736 -2.293,9.775 -2.293,15c0,5.225 0.803,10.264 2.293,15l-26.312,-0l43.894,76.028c-10.212,2.103 -19.291,7.325 -26.197,14.625l-52.338,-90.653l-103.633,-0c1.49,-4.736 2.293,-9.775 2.293,-15c0,-5.225 -0.803,-10.264 -2.293,-15Zm192.293,-155c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm140,140c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm-120,-0c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm-260,-0c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Z"/></svg>`,
  rhombus: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M240,70.294l169.706,169.706l-169.706,169.706l-169.706,-169.706l169.706,-169.706Zm0,56.569l-113.137,113.137l113.137,113.137l113.137,-113.137l-113.137,-113.137Z"/></svg>`,
};

export const icon = (id) => {
  let svg = svgs[id.toLowerCase()];

  var wrapper = document.createElement("div");
  wrapper.innerHTML = svg || "<svg></svg>";
  var el = wrapper.firstChild;
  return el;
};