const process = require('process');

process.platform = 'browser';

process.stderr = {
  write: console.error.bind(console)
};
process.stdout = {
  write: console.log.bind(console)
};

const d3 = require('d3');
const d3pca = require('../src');

d3.csv('data.csv')
  .row(function(d) {
    var obj = {
      name: d.name,
      values: {}
    };
    var key;
    for (key in d) {
      if (key !== 'name') {
        obj.values[key] = +d[key];
      }
    }
    return obj;
  })
  .get(function(errors, data) {
    const p = 0.98,
          pca = new d3pca.PCA(data),
          lambda = pca.lambda(),
          sumLambda = lambda.reduce((a, x) => a + x),
          renderer = new d3pca.Renderer()
            .size([400, 400]);

    let i, acc = 0;
    for (i = 0; i < lambda.length; ++i) {
      acc += lambda[i];
      if (acc > sumLambda * p) {
        break;
      }
    }
    const n = i + 1;
    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {
        d3.select('body')
          .append('svg')
          .datum(pca.get(i, j))
          .call(renderer.render());
      }
    }
  });
