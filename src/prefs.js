const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

let Extension = imports.misc.extensionUtils.getCurrentExtension();
let Settings = Extension.imports.settings;

function init() {
}

function buildPrefsWidget() {
    let config = new Settings.Prefs();
    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 10
    });

    (function () {

        // "#rrrrggggbbbb" -> "#rrggbb" to prevent incompatibilies btw Gdk & Clutter string color representations
        function convert_rgb(rrrrggggbbbb) {
            var rrggbb = "#";
            rrggbb += rrrrggggbbbb.slice(1, 3) + rrrrggggbbbb.slice(5, 7) + rrrrggggbbbb.slice(9, 11);
            return rrggbb;
        }

        // ! ------ topbar colors frame ------
        let topbar_colors_frame = new Gtk.Frame({
            label: " Topbar color "
        });
        topbar_colors_frame.set_label_align(0.5, 0.5);

        let topbar_colors_box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            border_width: 10,
            spacing: 5
        });

        // ! active color prefs
        // construct color chooser button
        let hbox_active_color = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });
        hbox_active_color.add(
            new Gtk.Label({
                label: "When any window touches the topbar",
                use_markup: true,
            })
        );
        let active_color_button = new Gtk.ColorButton();
        hbox_active_color.pack_end(
            active_color_button, true, true, 0
        );

        // set color selector to current active color
        var current_active_color = config.ACTIVE_COLOR;
        var current_active_color_string = current_active_color.get();
        var current_active_color_Gdk = Gdk.Color.parse(current_active_color_string);
        if (current_active_color_Gdk[0]) {
            active_color_button.set_color(current_active_color_Gdk[1]);
        }

        // change stored color if not the same
        active_color_button.connect('color-set', function () {
            var selected_active_color = active_color_button.get_color().to_string();
            if (selected_active_color != current_active_color_string) {
                current_active_color.set(convert_rgb(selected_active_color));
                // TODO automatically call `Extension._update_prefs()`
            }
        });

        // ! inactive color prefs
        // construct color chooser button
        let hbox_inactive_color = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });
        hbox_inactive_color.add(
            new Gtk.Label({
                label: "When no window touches the topbar  ",
                use_markup: true,
            })
        );
        let inactive_color_button = new Gtk.ColorButton();
        hbox_inactive_color.pack_end(
            inactive_color_button, true, true, 0
        );

        // set color selector to current inactive color
        var current_inactive_color = config.INACTIVE_COLOR;
        var current_inactive_color_string = current_inactive_color.get();
        var current_inactive_color_Gdk = Gdk.Color.parse(current_inactive_color_string);
        if (current_inactive_color_Gdk[0]) {
            inactive_color_button.set_color(current_inactive_color_Gdk[1]);
        }

        // change stored color if not the same
        inactive_color_button.connect('color-set', function () {
            var selected_inactive_color = inactive_color_button.get_color().to_string();
            if (selected_inactive_color != current_inactive_color_string) {
                current_inactive_color.set(convert_rgb(selected_inactive_color));
                // TODO automatically call `Extension._update_prefs()`
            }
        });

        topbar_colors_box.add(hbox_active_color);
        topbar_colors_box.add(hbox_inactive_color);
        topbar_colors_frame.add(topbar_colors_box);


        // ! ------ topbar opacities frame ------
        let topbar_opacities_frame = new Gtk.Frame({
            label: " Topbar opacity "
        });
        topbar_opacities_frame.set_label_align(0.5, 0.5);

        let topbar_opacities_box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            border_width: 10,
            spacing: 5
        });

        // ! active opacity prefs
        // construct opacity chooser button
        let hbox_active_opacity = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });
        hbox_active_opacity.add(
            new Gtk.Label({
                label: "When any window touches the topbar",
                use_markup: true,
            })
        );
        let active_opacity_scale = new Gtk.HScale({
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 1,
                step_increment: 0.05
            }),
            value_pos: Gtk.PositionType.RIGHT
        });
        hbox_active_opacity.pack_end(
            active_opacity_scale, true, true, 0
        );

        // set opacity selector to current active opacity
        var current_active_opacity = config.ACTIVE_OPACITY;
        active_opacity_scale.set_value(current_active_opacity.get());

        // change stored opacity if not the same
        active_opacity_scale.connect('value-changed', function (sw) {
            var newval = sw.get_value();
            if (newval != current_active_opacity.get()) {
                current_active_opacity.set(newval);
                // TODO automatically call `Extension._update_prefs()`
            }
        });

        // ! inactive opacity prefs
        // construct opacity chooser button
        let hbox_inactive_opacity = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });
        hbox_inactive_opacity.add(
            new Gtk.Label({
                label: "When no window touches the topbar  ",
                use_markup: true,
            })
        );
        let inactive_opacity_scale = new Gtk.HScale({
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 1,
                step_increment: 0.05
            }),
            value_pos: Gtk.PositionType.RIGHT
        });
        hbox_inactive_opacity.pack_end(
            inactive_opacity_scale, true, true, 0
        );

        // set opacity selector to current inactive opacity
        var current_inactive_opacity = config.INACTIVE_OPACITY;
        inactive_opacity_scale.set_value(current_inactive_opacity.get());

        // change stored opacity if not the same
        inactive_opacity_scale.connect('value-changed', function (sw) {
            var newval = sw.get_value();
            if (newval != current_inactive_opacity.get()) {
                current_inactive_opacity.set(newval);
                // TODO automatically call `Extension._update_prefs()`
            }
        });

        topbar_opacities_box.add(hbox_active_opacity);
        topbar_opacities_box.add(hbox_inactive_opacity);
        topbar_opacities_frame.add(topbar_opacities_box);


        // ! ----- add to frame -----

        frame.add(topbar_colors_frame);
        frame.add(topbar_opacities_frame);

        frame.pack_end(
            new Gtk.Label({
                label: "note: you will need to reload the extension to take changes in effect",
                use_markup: true,
            }), true, true, 0
        );

    })();

    frame.show_all();
    return frame;
}