'use strict';

const Meta = imports.gi.Meta;
const St = imports.gi.St;
const Main = imports.ui.main;

const CurrentExtension = imports.misc.extensionUtils.getCurrentExtension();
const Settings = CurrentExtension.imports.settings;


var Extension = class Extension {
    constructor() {
        this._actorSignalIds = null;
        this._windowSignalIds = null;
        this._prefs = new Settings.Prefs();
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

        // disable corners, too hard to theme them
        Main.panel.get_children().forEach((panelPart) => {
            if (panelPart instanceof imports.ui.panel.PanelCorner) {
                panelPart.hide();
            }
        })

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

        // reset transparency
        this._resetTransparent();

        // enable again corners
        Main.panel.get_children().forEach((panelPart) => {
            if (panelPart instanceof imports.ui.panel.PanelCorner) {
                panelPart.show();
            }
        })
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
            let distance = this._prefs.TRANSITION_DISTANCE.get();
            return verticalPosition < panelBottom + distance * scale;
        });

        this._setTransparent(!isNearEnough);
    }

    // Called when the topbar needs to update its opacity
    _setTransparent(is_transparent) {
        var background_color, text_color;
        if (!is_transparent) {
            background_color = this._prefs.BACKGROUND_ACTIVE_COLOR.get();
            text_color = this._prefs.TEXT_ACTIVE_COLOR.get();
        } else {
            background_color = this._prefs.BACKGROUND_INACTIVE_COLOR.get();
            text_color = this._prefs.TEXT_INACTIVE_COLOR.get();
        }
        let transition_duration = this._prefs.TRANSITION_DURATION.get();

        Main.panel.set_style("background-color:" + background_color + ";transition-duration:" + transition_duration + "s;");

        // TODO improve performances by checking if already set to "null" (needs A LOT of testing)
        if (!this._prefs.TEXT_IS_DEFAULT_COLOR.get()) {
            // TODO add transition-duration for text color
            // TODO style tray icons too
            this._setTextStyle("color:" + text_color);
        } else {
            this._removeTextStyle();
        }
    }

    // Called when extension is disabled
    _resetTransparent() {
        Main.panel.set_style(null);
        this._removeTextStyle();
    }

    _setTextStyle(style) {
        Main.panel.get_children().forEach((panelPart) => {
            switch (panelPart.get_name()) {
                case "panelLeft":
                case "panelCenter":
                case "panelRight":
                    panelPart.get_children().forEach((child) => { child.get_child_at_index(0).set_style(style) })
                    break;
                default:
                    break;
            }
        })
    }

    _removeTextStyle() {
        Main.panel.get_children().forEach((panelPart) => {
            switch (panelPart.get_name()) {
                case "panelLeft":
                case "panelCenter":
                case "panelRight":
                    panelPart.get_children().forEach((child) => { child.get_child_at_index(0).set_style(null) })
                    break;
                default:
                    break;
            }
        })
    }
};

// Called on gnome-shell loading, even if extension is deactivated
function init() {
    return new Extension();
}
