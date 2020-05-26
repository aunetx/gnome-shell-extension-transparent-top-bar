# GNOME Shell Extension - Smart transparent topbar

A GNOME Shell extension that allows customizing the topbar when free-floating.

This extension now supports changing:

- topbar background color / opacity
- topbar text color / opacity
- transition duration
- transition distance

Between free-floating and non free-floating states :)

Originally based on zhanghai's [work](https://github.com/zhanghai/gnome-shell-extension-transparent-top-bar); by the way, thanks to him!

*Note: this extension may contain some bugs, if you find one, please report it!*

## Screenshots

With a non-maximized window:

![screenshot free-floating](screenshot_free-floating.png)

With a maximized one:

![screenshot fullscreen](screenshot_fullscreen.png)

## Advanced

### Install from source

To install the latest version (though maybe unstable), use the makefile:

```sh
git clone https://github.com/aunetx/smart-transparent-top-bar
cd smart-transparent-top-bar
make install
```

And restart GNOME Shell if needed.

### Versions support

The current extension supports those GNOME Shell versions:

- 3.32
- 3.34
- 3.36

## License

This program is distributed under the terms of the GNU General Public License, version 2 or later.
