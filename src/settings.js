'use strict';

const Gio = imports.gi.Gio;
const Extension = imports.misc.extensionUtils.getCurrentExtension();

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

        //! background active color = bg color when topbar touched
        this.BACKGROUND_ACTIVE_COLOR = {
            key: 'background-active-color',
            get: function () { return settings.get_string(this.key); },
            set: function (v) { settings.set_string(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        //! background inactive color = bg color when topbar not touched
        this.BACKGROUND_INACTIVE_COLOR = {
            key: 'background-inactive-color',
            get: function () { return settings.get_string(this.key); },
            set: function (v) { settings.set_string(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };
    }
};
