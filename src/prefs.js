'use strict';

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

let Extension = imports.misc.extensionUtils.getCurrentExtension();
let Settings = Extension.imports.settings;
let config = new Settings.Prefs();

function init() {
}

function buildPrefsWidget() {
    let widget = new PrefsWidget();
    widget.show_all();
    return widget;
}

const PrefsWidget = new GObject.Class({
    Name: "My.Prefs.Widget",
    GTypeName: "PrefsWidget",
    Extends: Gtk.ScrolledWindow,

    _init: function (params) {
        this.parent(params);

        let builder = new Gtk.Builder();
        builder.set_translation_domain('Test preferences');
        builder.add_from_file(Extension.path + '/prefs.ui');
        this.connect("destroy", Gtk.main_quit);

        let parsed_color = new Gdk.RGBA;

        let background_active_color = config.BACKGROUND_ACTIVE_COLOR;
        if (parsed_color.parse(background_active_color.get())) {
            builder.get_object("active_background_color_chooser").set_rgba(parsed_color)
        } else {
            // restore to a known state
            background_active_color.set("rgba(0,0,0,1.0)");
        }

        let background_inactive_color = config.BACKGROUND_INACTIVE_COLOR;
        if (parsed_color.parse(background_inactive_color.get())) {
            builder.get_object("inactive_background_color_chooser").set_rgba(parsed_color)
        } else {
            // restore to a known state
            background_inactive_color.set("rgba(0,0,0,0.0)");
        }

        let SignalHandler = {
            background_active_color_changed(w) {
                let color = w.get_rgba().to_string()
                background_active_color.set(color);
            },

            background_inactive_color_changed(w) {
                let color = w.get_rgba().to_string()
                background_inactive_color.set(color);
            },
        };

        builder.connect_signals_full((builder, object, signal, handler) => {
            object.connect(signal, SignalHandler[handler].bind(this));
        });

        this.add(builder.get_object('main_frame'));
    }
});
