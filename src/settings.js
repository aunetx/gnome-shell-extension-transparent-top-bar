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

        //! text is default color = whether or not to use default colors
        this.TEXT_IS_DEFAULT_COLOR = {
            key: 'text-is-default-color',
            get: function () { return settings.get_boolean(this.key); },
            set: function (v) { settings.set_boolean(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        //! text active color = text color when topbar touched
        this.TEXT_ACTIVE_COLOR = {
            key: 'text-active-color',
            get: function () { return settings.get_string(this.key); },
            set: function (v) { settings.set_string(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        //! text inactive color = text color when topbar not touched
        this.TEXT_INACTIVE_COLOR = {
            key: 'text-inactive-color',
            get: function () { return settings.get_string(this.key); },
            set: function (v) { settings.set_string(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        //! transition duration = time in second of state transition
        this.TRANSITION_DURATION = {
            key: 'transition-duration',
            get: function () { return settings.get_double(this.key); },
            set: function (v) { settings.set_double(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };

        //! transition distance = distance in pixels to trigger state change
        this.TRANSITION_DISTANCE = {
            key: 'transition-distance',
            get: function () { return settings.get_int(this.key); },
            set: function (v) { settings.set_int(this.key, v); },
            changed: function (cb) { return settings.connect('changed::' + this.key, cb); },
            disconnect: function () { return settings.disconnect.apply(settings, arguments); },
        };
    }
};
