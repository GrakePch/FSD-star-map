const svgs = {
  star: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M71,381.8l35.8,-36l28.4,28.4l-36,35.8l-28.2,-28.2Zm169,-261.8c66.2,0 120,53.6 120,120c0,66.2 -53.8,120 -120,120c-66.2,0 -120,-53.8 -120,-120c0,-66.2 53.8,-120 120,-120Zm0,40c-44.153,0 -80,35.847 -80,80c0,44.153 35.847,80 80,80c44.153,0 80,-35.847 80,-80c0,-44.153 -35.847,-80 -80,-80Zm160,100l0,-40l60,0l0,40l-60,0Zm-55.2,114.2l28.4,-28.4l35.8,36l-28.2,28.2l-36,-35.8Zm64.2,-274.2l-35.8,36.2l-28.4,-28.4l36,-35.8l28.2,28Zm-149,-80l0,60l-40,0l0,-60l40,0Zm-124.8,87.8l-28.4,28.4l-35.8,-36.2l28.2,-28l36,35.8Zm-115.2,152.2l0,-40l60,0l0,40l-60,0Zm240,140l0,60l-40,0l0,-60l40,0Z" style="fill-rule:nonzero;"/></svg>`,
  planet: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M240,60c99.345,0 180,80.655 180,180c0,99.345 -80.655,180 -180,180c-99.345,0 -180,-80.655 -180,-180c0,-99.345 80.655,-180 180,-180Zm0,40c-77.268,0 -140,62.732 -140,140c0,77.268 62.732,140 140,140c77.268,0 140,-62.732 140,-140c0,-77.268 -62.732,-140 -140,-140Z"/></svg>`,
  moon: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M369.981,339.507c-32.262,48.502 -87.415,80.493 -149.981,80.493c-99.345,0 -180,-80.655 -180,-180c0,-99.345 80.655,-180 180,-180c62.566,0 117.719,31.991 149.981,80.493c50.513,5.015 90.019,47.684 90.019,99.507c0,51.823 -39.506,94.492 -90.019,99.507Zm-9.981,-159.507c-33.115,0 -60,26.885 -60,60c0,33.115 26.885,60 60,60c33.115,-0 60,-26.885 60,-60c-0,-33.115 -26.885,-60 -60,-60Zm-35.753,-33.409c-25.64,-28.592 -62.858,-46.591 -104.247,-46.591c-77.268,0 -140,62.732 -140,140c0,77.268 62.732,140 140,140c41.389,-0 78.607,-17.999 104.247,-46.591c-37.556,-14.4 -64.247,-50.812 -64.247,-93.409c0,-42.597 26.691,-79.009 64.247,-93.409Z"/></svg>`,
  jump_point: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M146.831,339.982c-10.999,36.58 -27.897,60.018 -46.831,60.018c-33.115,0 -60,-71.694 -60,-160c0,-88.306 26.885,-160 60,-160c18.934,0 35.832,23.438 46.831,60.018c19.997,23.046 51.116,47.482 93.169,47.482c42.053,0 73.172,-24.436 93.169,-47.482c10.999,-36.58 27.897,-60.018 46.831,-60.018c33.115,0 60,71.694 60,160c0,88.306 -26.885,160 -60,160c-18.934,0 -35.832,-23.438 -46.831,-60.018c-19.997,-23.046 -51.116,-47.482 -93.169,-47.482c-42.053,0 -73.172,24.436 -93.169,47.482Zm176.176,-150.101c-22.256,15.944 -50.012,27.619 -83.007,27.619c-32.995,0 -60.751,-11.675 -83.007,-27.619c1.951,15.768 3.007,32.617 3.007,50.119c-0,17.502 -1.056,34.351 -3.007,50.119c22.256,-15.944 50.012,-27.619 83.007,-27.619c32.995,0 60.751,11.675 83.007,27.619c-1.951,-15.768 -3.007,-32.617 -3.007,-50.119c-0,-17.502 1.056,-34.351 3.007,-50.119Zm-223.007,-49.881c-18.397,-0 -33.333,44.808 -33.333,100c-0,55.192 14.936,100 33.333,100c18.397,0 33.333,-44.808 33.333,-100c0,-55.192 -14.936,-100 -33.333,-100Zm280,0c-18.397,0 -33.333,44.808 -33.333,100c-0,55.192 14.936,100 33.333,100c18.397,0 33.333,-44.808 33.333,-100c0,-55.192 -14.936,-100 -33.333,-100Z"/></svg>`,
  lagrange_point: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M290,350c16.557,0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm-247.926,-159.374c21.334,-72.576 88.484,-125.626 167.926,-125.626c13.854,-0 27.335,1.613 40.264,4.662c-6.083,7.952 -9.834,17.779 -10.229,28.458c-9.692,-2.045 -19.739,-3.12 -30.035,-3.12c-64.373,-0 -119.004,42.039 -137.915,100.137c-6.661,-3.289 -14.159,-5.137 -22.085,-5.137c-2.697,-0 -5.344,0.214 -7.926,0.626Zm294.221,-71.716c30.16,31.447 48.705,74.12 48.705,121.09c0,46.97 -18.545,89.643 -48.705,121.09c-3.923,-9.583 -10.737,-17.682 -19.354,-23.209c23.631,-25.801 38.059,-60.17 38.059,-97.881c0,-37.711 -14.428,-72.08 -38.059,-97.881c8.617,-5.527 15.431,-13.626 19.354,-23.209Zm-86.031,291.428c-12.929,3.049 -26.41,4.662 -40.264,4.662c-79.442,0 -146.592,-53.05 -167.926,-125.626c2.582,0.412 5.229,0.626 7.926,0.626c7.926,0 15.424,-1.848 22.085,-5.137c18.911,58.098 73.542,100.137 137.915,100.137c10.296,-0 20.343,-1.075 30.035,-3.12c0.395,10.679 4.146,20.506 10.229,28.458Zm-152.557,-185.338l103.633,-0l52.338,-90.653c6.906,7.3 15.985,12.522 26.197,14.625l-43.894,76.028l26.312,-0c-1.49,4.736 -2.293,9.775 -2.293,15c0,5.225 0.803,10.264 2.293,15l-26.312,-0l43.894,76.028c-10.212,2.103 -19.291,7.325 -26.197,14.625l-52.338,-90.653l-103.633,-0c1.49,-4.736 2.293,-9.775 2.293,-15c0,-5.225 -0.803,-10.264 -2.293,-15Zm192.293,-155c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm140,140c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm-120,-0c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Zm-260,-0c16.557,-0 30,13.443 30,30c0,16.557 -13.443,30 -30,30c-16.557,-0 -30,-13.443 -30,-30c0,-16.557 13.443,-30 30,-30Z"/></svg>`,
  rhombus: `<svg width="100%" height="100%" viewBox="0 0 480 480" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M240,70.294l169.706,169.706l-169.706,169.706l-169.706,-169.706l169.706,-169.706Zm0,56.569l-113.137,113.137l113.137,113.137l113.137,-113.137l-113.137,-113.137Z"/></svg>`,
  space_station: `<svg width="100%" height="100%" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M5.455,10.576l-3.189,-0.938l-0.382,-1.911l2.89,0.85c-0.26,-1.267 -0.098,-2.323 0.558,-2.978c1.403,-1.403 4.638,-0.546 7.856,1.872l-1.158,1.158c-1.523,-0.968 -2.88,-1.289 -3.473,-0.696c-0.413,0.413 -0.383,1.198 0.001,2.151l3.726,1.07l1.725,-1.725l-0.347,-0.347l6.253,-6.254l2.085,2.085l-6.254,6.253l-0.347,-0.347l-0.956,0.955l2.16,0.621l0.754,-0.755c0.202,0.269 0.393,0.538 0.573,0.806l3.445,1.014l0.382,1.91l-2.614,-0.768c0.947,2.097 1.051,3.929 0.086,4.894c-1.73,1.731 -6.249,0.022 -10.084,-3.813c-1.668,-1.668 -2.934,-3.466 -3.69,-5.107Zm3.721,0.708c0.485,0.786 1.146,1.621 1.947,2.422c2.301,2.301 4.887,3.45 5.772,2.565c0.513,-0.513 0.342,-1.598 -0.34,-2.868l-2.906,-0.834l-1.114,1.113c-0.24,-0.21 -0.48,-0.434 -0.718,-0.671c-0.237,-0.238 -0.461,-0.478 -0.671,-0.718l0.344,-0.345l-2.314,-0.664Zm-0.016,5.774l-2.794,2.794l-1.39,-1.389l2.794,-2.795c0.219,0.239 0.446,0.476 0.68,0.71c0.234,0.234 0.471,0.461 0.71,0.68Z"/></svg>`,
  landing_zone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`,
  asteroid_base: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg>`,
  scrapyard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.17 7.91L8.9 8.91L12.08 3.42L14.33 7.31L11.73 8.81L17.19 10.27L18.66 4.81L16.06 6.31L13.81 2.41C13.26 1.45 12.03 1.12 11.08 1.68C10.81 1.83 10.58 2.05 10.41 2.31M10 20V18L3.66 18L5.9 14.1L8.5 15.6L7.04 10.14L1.57 11.6L4.17 13.1L1.92 17C1.37 17.96 1.7 19.18 2.65 19.73C2.92 19.89 3.22 19.97 3.54 20M19.06 11.5L17.32 12.5L20.5 18H16V15L12 19L16 23V20H20.5C21.61 20 22.5 19.11 22.5 18C22.5 17.69 22.42 17.38 22.28 17.11Z" /></svg>`,
  commarray: `<svg width="100%" height="100%" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M19.2,17.4c0.994,-0 1.8,0.806 1.8,1.8c0,0.994 -0.806,1.8 -1.8,1.8c-0.994,-0 -1.8,-0.806 -1.8,-1.8c0,-0.994 0.806,-1.8 1.8,-1.8Zm-16.2,1.8c-0,-8.941 7.259,-16.2 16.2,-16.2l0,2.43c-7.6,-0 -13.77,6.17 -13.77,13.77l-2.43,-0Zm4.86,-0c-0,-6.259 5.081,-11.34 11.34,-11.34l0,2.43c-4.918,-0 -8.91,3.992 -8.91,8.91l-2.43,-0Zm4.86,-0c0,-3.577 2.903,-6.48 6.48,-6.48l0,2.43c-2.236,-0 -4.05,1.814 -4.05,4.05l-2.43,-0Z"/></svg>`,
  racetrack: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 4V2H7V4H2V11C2 12.1 2.9 13 4 13H7.1C7.5 14.96 9.04 16.5 11 16.9V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V16.9C14.96 16.5 16.5 14.96 16.9 13H20C21.1 13 22 12.1 22 11V4H17M4 11V6H7V11L4 11M15 12C15 13.65 13.65 15 12 15S9 13.65 9 12V4H15V12M20 11L17 11V6H20L20 11Z" /></svg>`,
  emergency_shelter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z" /></svg>`,
  cave: `<svg width="100%" height="100%" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M23,18l-22,0l7.25,-10.67l2,2.67l3.75,-5l9,13Zm-8,-1l0,-2c0,-1.656 -1.344,-3 -3,-3c-1.656,0 -3,1.344 -3,3l0,2l6,0Z"/></svg>`,
  distribution_center: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z" /></svg>`,
  settlement: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,3L20,9V21H15V14H9V21H4V9L12,3Z" /></svg>`,
  landmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" /></svg>`,
  circle_medium: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" /></svg>`,
  underground_bunker: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>`,
  prison: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5,20H19V22H5V20M17,2V5H15V2H13V5H11V2H9V5H7V2H5V8H7V18H17V8H19V2H17Z" /></svg>`
};

export const icon = (id) => {
  let svg = svgs[id.toLowerCase()];

  var wrapper = document.createElement("div");
  wrapper.innerHTML = svg || "<svg></svg>";
  var el = wrapper.firstChild;
  return el;
};
