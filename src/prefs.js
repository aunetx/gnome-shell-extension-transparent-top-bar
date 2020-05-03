const Gtk = imports.gi.Gtk;

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
        // ! active opacity prefs
        let hbox_active_opacity = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });
        let label_active_opacity = new Gtk.Label({
            label: "Opacity when active",
            use_markup: true,
        });
        let adjustment_active_opacity = new Gtk.Adjustment({
            lower: 0,
            upper: 1,
            step_increment: 0.05
        });
        let scale_active_opacity = new Gtk.HScale({
            digits: 2,
            adjustment: adjustment_active_opacity,
            value_pos: Gtk.PositionType.RIGHT
        });

        hbox_active_opacity.add(label_active_opacity);
        hbox_active_opacity.pack_end(scale_active_opacity, true, true, 0);
        frame.add(hbox_active_opacity);

        var current_active_opacity = config.ACTIVE_OPACITY;
        scale_active_opacity.set_value(current_active_opacity.get());
        scale_active_opacity.connect('value-changed', function (sw) {
            var newval = sw.get_value();
            if (newval != current_active_opacity.get()) {
                current_active_opacity.set(newval);
                config.ACTIVE_BLENDED.set(config.ACTIVE_COLOR.get(), config.ACTIVE_OPACITY.get());
            }
        });

        // ! inactive opacity config
        let hbox_inactive_opacity = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });
        let label_inactive_opacity = new Gtk.Label({
            label: "Opacity when inactive",
            use_markup: true,
        });
        let adjustment_inactive_opacity = new Gtk.Adjustment({
            lower: 0,
            upper: 1,
            step_increment: 0.05
        });
        let scale_inactive_opacity = new Gtk.HScale({
            digits: 2,
            adjustment: adjustment_inactive_opacity,
            value_pos: Gtk.PositionType.RIGHT
        });

        hbox_inactive_opacity.add(label_inactive_opacity);
        hbox_inactive_opacity.pack_end(scale_inactive_opacity, true, true, 0);
        frame.add(hbox_inactive_opacity);

        var current_inactive_opacity = config.INACTIVE_OPACITY;
        scale_inactive_opacity.set_value(current_inactive_opacity.get());
        scale_inactive_opacity.connect('value-changed', function (sw) {
            var newval = sw.get_value();
            if (newval != current_inactive_opacity.get()) {
                current_inactive_opacity.set(newval);
                config.INACTIVE_BLENDED.set(config.INACTIVE_COLOR.get(), config.INACTIVE_OPACITY.get());
            }
        });

        // ! active color config
        let hbox_active_color = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });

        let label_active_color = new Gtk.Label({
            label: "Color when active",
            use_markup: true,
        });
        let entry_active_color = new Gtk.Entry({
            hexpand: true
        });
        let button_active_color = new Gtk.Button({
            label: "Apply"
        })

        hbox_active_color.add(label_active_color);
        hbox_active_color.add(entry_active_color);
        hbox_active_color.pack_end(button_active_color, true, true, 0);
        frame.add(hbox_active_color);

        var current_active_color = config.ACTIVE_COLOR;
        entry_active_color.set_text(current_active_color.get());
        button_active_color.connect('clicked', function () {
            var newval = entry_active_color.get_text();
            if (newval != current_active_color.get()) {
                current_active_color.set(newval);
                config.ACTIVE_BLENDED.set(config.ACTIVE_COLOR.get(), config.ACTIVE_OPACITY.get());
            }
        });

        // ! inactive color config
        let hbox_inactive_color = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 20
        });

        let label_inactive_color = new Gtk.Label({
            label: "Color when active",
            use_markup: true,
        });
        let entry_inactive_color = new Gtk.Entry({
            hexpand: true
        });
        let button_inactive_color = new Gtk.Button({
            label: "Apply"
        })

        hbox_inactive_color.add(label_inactive_color);
        hbox_inactive_color.add(entry_inactive_color);
        hbox_inactive_color.pack_end(button_inactive_color, true, true, 0);
        frame.add(hbox_inactive_color);

        var current_inactive_color = config.INACTIVE_COLOR;
        entry_inactive_color.set_text(current_inactive_color.get());
        button_inactive_color.connect('clicked', function () {
            var newval = entry_inactive_color.get_text();
            if (newval != current_inactive_color.get()) {
                current_inactive_color.set(newval);
                config.INACTIVE_BLENDED.set(config.INACTIVE_COLOR.get(), config.INACTIVE_OPACITY.get());
            }
        });

    })();

    frame.show_all();
    return frame;
}