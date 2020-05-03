const Meta = imports.gi.Meta;
const St = imports.gi.St;
const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;

const CurrentExtension = imports.misc.extensionUtils.getCurrentExtension();
const Settings = CurrentExtension.imports.settings;

class TopbarColor {
    constructor() {
        this.color = new Clutter.Color;
    }

    update(color, opacity) {
        var extracted_color = Clutter.Color.from_string(color);
        var color = new Clutter.Color();
        if (extracted_color[0] == true) {
            color = extracted_color[1];
        } else {
            global.log(`[smart transparent topbar] could not extract color from ${color}`);
        }
        color.alpha = opacity * 255;

        this.color = color;
    }
}

var Extension = class Extension {
    constructor() {
        this._actorSignalIds = null;
        this._windowSignalIds = null;
        this._prefs = new Settings.Prefs();
        this._topbar_prefs = {
            active: new TopbarColor(),
            inactive: new TopbarColor()
        }
        this._test = "TEST"
    }

    // Called when extension is enabled
    enable() {
        this._actorSignalIds = new Map();
        this._windowSignalIds = new Map();

        this._actorSignalIds.set(Main.overview, [
            Main.overview.connect('showing', this._updateTransparent.bind(this)),
            Main.overview.connect('hiding', this._updateTransparent.bind(this))
        ]);

        this._actorSignalIds.set(Main.sessionMode, [
            Main.sessionMode.connect('updated', this._updateTransparent.bind(this))
        ]);

        for (const metaWindowActor of global.get_window_actors()) {
            this._onWindowActorAdded(metaWindowActor.get_parent(), metaWindowActor);
        }

        this._actorSignalIds.set(global.window_group, [
            global.window_group.connect('actor-added', this._onWindowActorAdded.bind(this)),
            global.window_group.connect('actor-removed', this._onWindowActorRemoved.bind(this))
        ]);

        this._actorSignalIds.set(global.window_manager, [
            global.window_manager.connect('switch-workspace', this._updateTransparent.bind(this))
        ]);

        this._update_prefs();
        this._updateTransparent();
    }

    // Called when extension is disabled
    disable() {
        for (const actorSignalIds of [this._actorSignalIds, this._windowSignalIds]) {
            for (const [actor, signalIds] of actorSignalIds) {
                for (const signalId of signalIds) {
                    actor.disconnect(signalId);
                }
            }
        }
        this._actorSignalIds = null;
        this._windowSignalIds = null;

        Main.panel.remove_style_class_name('transparent-top-bar--solid');
        Main.panel.remove_style_class_name('transparent-top-bar--transparent');
    }

    // Log (to access: `journalctl /usr/bin/gnome-shell`)
    _log(message) {
        global.log(`[smart transparent topbar] ${message}`);
    }

    _onWindowActorAdded(container, metaWindowActor) {
        this._windowSignalIds.set(metaWindowActor, [
            metaWindowActor.connect('allocation-changed', this._updateTransparent.bind(this)),
            metaWindowActor.connect('notify::visible', this._updateTransparent.bind(this))
        ]);
    }

    _onWindowActorRemoved(container, metaWindowActor) {
        for (const signalId of this._windowSignalIds.get(metaWindowActor)) {
            metaWindowActor.disconnect(signalId);
        }
        this._windowSignalIds.delete(metaWindowActor);
        this._updateTransparent();
    }

    _updateTransparent() {
        if (Main.panel.has_style_pseudo_class('overview') || !Main.sessionMode.hasWindows) {
            this._setTransparent(true);
            return;
        }

        if (!Main.layoutManager.primaryMonitor) {
            return;
        }

        // Get all the windows in the active workspace that are in the primary monitor and visible.
        const workspaceManager = global.workspace_manager;
        const activeWorkspace = workspaceManager.get_active_workspace();
        const windows = activeWorkspace.list_windows().filter(metaWindow => {
            return metaWindow.is_on_primary_monitor()
                && metaWindow.showing_on_its_workspace()
                && !metaWindow.is_hidden()
                && metaWindow.get_window_type() !== Meta.WindowType.DESKTOP;
        });

        // Check if at least one window is near enough to the panel.
        const panelTop = Main.panel.get_transformed_position()[1];
        const panelBottom = panelTop + Main.panel.get_height();
        const scale = St.ThemeContext.get_for_stage(global.stage).scale_factor;
        const isNearEnough = windows.some(metaWindow => {
            const verticalPosition = metaWindow.get_frame_rect().y;
            return verticalPosition < panelBottom + 5 * scale;
        });

        this._setTransparent(!isNearEnough);
    }

    // Called when the topbar needs to update its opacity
    _setTransparent(transparent) {
        if (transparent) {
            //! topbar has inactive-color
            Main.panel.background_color = this._topbar_prefs["inactive"].color;
        } else {
            //! topbar has active-color
            Main.panel.background_color = this._topbar_prefs["active"].color;
        }
    }

    // Called on enable or settings change, updates this._topbar_prefs
    _update_prefs() {
        // compute active topbar prefs
        var active_color = this._prefs.ACTIVE_COLOR.get();
        var active_opacity = this._prefs.ACTIVE_OPACITY.get();
        this._topbar_prefs["active"].update(active_color, active_opacity);

        // compute inactive topbar prefs
        var inactive_color = this._prefs.INACTIVE_COLOR.get();
        var inactive_opacity = this._prefs.INACTIVE_OPACITY.get();
        this._topbar_prefs["inactive"].update(inactive_color, inactive_opacity);

        this._log("updated color prefs");
    }
};

// Called on gnome-shell loading, even if extension is deactivated
function init() {
    return new Extension();
}
