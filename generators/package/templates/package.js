Package.describe({
  name: '<%= packageName %>',
});

Package.onUse((api) => {
  api.use([
    <%= dependencies.join(", \n    "); %>
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
