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

        // ! background active color
        let background_active_color = config.BACKGROUND_ACTIVE_COLOR;
        if (parsed_color.parse(background_active_color.get())) {
            builder.get_object("active_background_color_chooser").set_rgba(parsed_color)
        } else {
            // restore to a known state
            background_active_color.set("rgba(0,0,0,1.0)");
            parsed_color.parse("rgba(0,0,0,1.0)");
            builder.get_object("active_background_color_chooser").set_rgba(parsed_color);
        }

        // ! background inactive color
        let background_inactive_color = config.BACKGROUND_INACTIVE_COLOR;
        if (parsed_color.parse(background_inactive_color.get())) {
            builder.get_object("inactive_background_color_chooser").set_rgba(parsed_color)
        } else {
            // restore to a known state
            background_inactive_color.set("rgba(0,0,0,0.0)");
            parsed_color.parse("rgba(0,0,0,0.0)");
            builder.get_object("inactive_background_color_chooser").set_rgba(parsed_color);
        }

        // ! text default color
        let text_default_color_state = config.TEXT_IS_DEFAULT_COLOR;
        builder.get_object("default_text_color_switch").set_state(text_default_color_state.get());

        // ! text active color
        let text_active_color = config.TEXT_ACTIVE_COLOR;
        if (parsed_color.parse(text_active_color.get())) {
            builder.get_object("active_text_color_chooser").set_rgba(parsed_color)
        } else {
            // restore to a known state
            text_active_color.set("rgba(255,255,255,1.0)");
            parsed_color.parse("rgba(255,255,255,1.0)");
            builder.get_object("active_text_color_chooser").set_rgba(parsed_color);
        }

        // ! text inactive color
        let text_inactive_color = config.TEXT_INACTIVE_COLOR;
        if (parsed_color.parse(text_inactive_color.get())) {
            builder.get_object("inactive_text_color_chooser").set_rgba(parsed_color)
        } else {
            // restore to a known state
            text_inactive_color.set("rgba(255,255,255,1.0)");
            parsed_color.parse("rgba(255,255,255,1.0)");
            builder.get_object("inactive_text_color_chooser").set_rgba(parsed_color);
        }

        // ! transition duration
        let transition_duration = config.TRANSITION_DURATION;
        builder.get_object("transition_duration_scale").set_value(transition_duration.get());

        // ! transition distance
        let transition_distance = config.TRANSITION_DISTANCE;
        builder.get_object("transition_distance_scale").set_value(transition_distance.get());

        // ! connect
        let SignalHandler = {
            // ! background colors
            background_active_color_changed(w) {
                let color = w.get_rgba().to_string();
                background_active_color.set(color);
            },
            background_inactive_color_changed(w) {
                let color = w.get_rgba().to_string();
                background_inactive_color.set(color);
            },

            // ! text default colors
            text_default_color_changed(w) {
                let state = !w.get_state();
                text_default_color_state.set(state);
            },

            // ! text colors
            text_active_color_changed(w) {
                let color = w.get_rgba().to_string();
                text_active_color.set(color);
            },
            text_inactive_color_changed(w) {
                let color = w.get_rgba().to_string();
                text_inactive_color.set(color);
            },

            // ! transition duration
            transition_duration_changed(w) {
                let value = w.get_value();
                transition_duration.set(value);
            },

            // ! transition distance
            transition_distance_changed(w) {
                let value = w.get_value();
                transition_distance.set(value);
            },

            // ! reset preferences
            reset_all() {
                // ! background active color
                background_active_color.set("rgba(0,0,0,1.0)");
                parsed_color.parse("rgba(0,0,0,1.0)");
                builder.get_object("active_background_color_chooser").set_rgba(parsed_color);

                // ! background inactive color
                background_inactive_color.set("rgba(0,0,0,0.0)");
                parsed_color.parse("rgba(0,0,0,0.0)");
                builder.get_object("inactive_background_color_chooser").set_rgba(parsed_color);

                // ! text default color
                text_default_color_state.set(true);
                builder.get_object("default_text_color_switch").set_state(true);

                // ! text active color
                text_active_color.set("rgba(255,255,255,1.0)");
                parsed_color.parse("rgba(255,255,255,1.0)");
                builder.get_object("active_text_color_chooser").set_rgba(parsed_color);

                // ! text inactive color
                text_inactive_color.set("rgba(255,255,255,1.0)");
                parsed_color.parse("rgba(255,255,255,1.0)");
                builder.get_object("inactive_text_color_chooser").set_rgba(parsed_color);

                // ! transition duration
                transition_duration.set(0.4)
                builder.get_object("transition_duration_scale").set_value(0.4);

                // ! transition distance
                transition_distance.set(5)
                builder.get_object("transition_distance_scale").set_value(5);

                log("[smart transparent top bar] preferences reset");
            }
        };

        builder.connect_signals_full((builder, object, signal, handler) => {
            object.connect(signal, SignalHandler[handler].bind(this));
        });

        this.add(builder.get_object('main_frame'));
    }
});
