Package.describe({
  name: '<%= packageName %>',
});

Package.onUse((api) => {
  api.use([
    <%= dependencies.join(", \n    "); %>
  ]);

  api.mainModule('<%= serverEntryPoint %>', 'server');
  api.mainModule('<%= clientEntryPoint %>', 'client');
});
