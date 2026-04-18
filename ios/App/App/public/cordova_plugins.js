
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-purchase.CdvPurchase",
          "file": "plugins/cordova-plugin-purchase/www/store.js",
          "pluginId": "cordova-plugin-purchase",
        "clobbers": [
          "CdvPurchase",
          "store"
        ]
        },
      {
          "id": "cordova-plugin-video-editor.VideoEditor",
          "file": "plugins/cordova-plugin-video-editor/www/VideoEditor.js",
          "pluginId": "cordova-plugin-video-editor",
        "clobbers": [
          "VideoEditor"
        ]
        },
      {
          "id": "cordova-plugin-video-editor.VideoEditorOptions",
          "file": "plugins/cordova-plugin-video-editor/www/VideoEditorOptions.js",
          "pluginId": "cordova-plugin-video-editor",
        "clobbers": [
          "VideoEditorOptions"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-purchase": "13.12.1",
      "cordova-plugin-video-editor": "1.1.3"
    };
    // BOTTOM OF METADATA
    });
    