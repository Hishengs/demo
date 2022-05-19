module.exports = class MyPlugin {
  apply (compiler) {
    compiler.hooks.done.tap('MyPlugin', () => {
      console.log('[MyPlugin] call at done');
    });
  }
}