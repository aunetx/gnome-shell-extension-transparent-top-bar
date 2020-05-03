const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

const SCHEMA_PATH = 'org.gnome.shell.extensions.fully-transparent-top-bar';

function get_local_gsettings(schema_path) {
    const GioSSS = Gio.SettingsSchemaSource;

    let schemaDir = Extension.dir.get_child('schemas');

    let schemaSource = GioSSS.get_default();
    if (schemaDir.query_exists(null)) {
        schemaSource = GioSSS.new_from_directory(
            schemaDir.get_path(),
            schemaSource,
            false);
    }

    let schemaObj = schemaSource.lookup(schema_path, true);
    if (!schemaObj) {
        throw new Error(
            `Schema ${schema_path} could not be found for extension ${Extension.metadata.uuid}`
        );
    }
    return new Gio.Settings({ settings_schema: schemaObj });
};

class Prefs {
    constructor() {
        var settings = this.settings = get_local_gsettings(SCHEMA_PATH);

        // active opacity = opacity when topbar touched
        this.ACTIVE_OPACITY = {
            key: 'active-opacity',
            get: function () { return settings.get_double(this.key); },
            set: function (v) { settings.set_double(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        // inactive opacity = opacity when topbar not touched
        this.INACTIVE_OPACITY = {
            key: 'inactive-opacity',
            get: function () { return settings.get_double(this.key); },
            set: function (v) { settings.set_double(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        // active color = color when topbar touched
        this.ACTIVE_COLOR = {
            key: 'active-color',
            get: function () { return settings.get_string(this.key); },
            set: function (v) { settings.set_string(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        // inactive color = color when topbar not touched
        this.INACTIVE_COLOR = {
            key: 'inactive-color',
            get: function () { return settings.get_string(this.key); },
            set: function (v) { settings.set_string(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        // active blended = color when topbar touched, created from active-color and active-opacity
        this.ACTIVE_BLENDED = {
            key: 'active-blended',
            get: function () {
                var str_color = settings.get_string(this.key);
                return Clutter.Color.from_string(str_color)[1];
            },
            set: function (color, opacity) {
                var color = new Clutter.Color;
                var extracted_color = Clutter.Color.from_string(color);
                if (extracted_color[0] == true) {
                    color = extracted_color[1];
                } else {
                    global.log(`[smart transparent topbar] could not extract color from ${color}`);
                }
                color.alpha = opacity * 255;

                global.log(`[smart transparent topbar] new active color: ${color.to_string()}`);
                settings.set_string(this.key, color.to_string());
            },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        // inactive blended = color when topbar not touched, created from inactive-color and inactive-opacity
        this.INACTIVE_BLENDED = {
            key: 'inactive-blended',
            get: function () {
                var str_color = settings.get_string(this.key);
                return Clutter.Color.from_string(str_color)[1];
            },
            set: function (color, opacity) {
                var color = new Clutter.Color;
                var extracted_color = Clutter.Color.from_string(color);
                if (extracted_color[0] == true) {
                    color = extracted_color[1];
                } else {
                    global.log(`[smart transparent topbar] could not extract color from ${color}`);
                }
                color.alpha = opacity * 255;

                global.log(`[smart transparent topbar] new inactive color: ${color.to_string()}`);
                settings.set_string(this.key, color.to_string());
            },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };
    }
};
