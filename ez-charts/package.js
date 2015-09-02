Package.describe({
  name: 'lerayj:ez-charts',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'easy to use generics SVG charts generator',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/lerayj/EzCharts.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('ez-charts.js');
  api.use("templating", "client");
  api.use("underscore", "client");
  api.use("agnito:d3-chart", "client");
  api.addFiles('ez-chartsTemplates.html', 'client');
  api.addFiles('verticalBar.js', 'client');
  api.addFiles('ez-charts-UiHelpers.js', 'client');


});
