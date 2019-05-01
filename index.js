'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var stdoutColor = require('supports-color').stdout;

var template = require('./templates.js');

var isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
var levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
var skipModels = new Set(['gray']);

var styles = Object.create(null);

function applyOptions(obj) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	if (options.level > 3 || options.level < 0) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	var scLevel = stdoutColor ? stdoutColor.level : 0;
	obj.level = options.level === undefined ? scLevel : options.level;
	obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
}

function Chalk(options) {
	// We check for this.template here since calling `chalk.constructor()`
	// by itself will have a `this` of a previously constructed chalk object
	if (!this || !(this instanceof Chalk) || this.template) {
		var chalk = {};
		applyOptions(chalk, options);

		chalk.template = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return chalkTag.apply(undefined, _toConsumableArray([chalk.template].concat(args)));
		};

		Object.setPrototypeOf(chalk, Chalk.prototype);
		Object.setPrototypeOf(chalk.template, chalk);

		chalk.template.constructor = Chalk;

		return chalk.template;
	}

	applyOptions(this, options);
}

// Use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\x1B[94m';
}

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	var _loop = function _loop() {
		var key = _step.value;

		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		styles[key] = {
			get: function get() {
				var codes = ansiStyles[key];
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
			}
		};
	};

	for (var _iterator = Object.keys(ansiStyles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		_loop();
	}
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}

styles.visible = {
	get: function get() {
		return build.call(this, this._styles || [], true, 'visible');
	}
};

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
	var _loop2 = function _loop2() {
		var model = _step2.value;

		if (skipModels.has(model)) {
			return 'continue';
		}

		styles[model] = {
			get: function get() {
				var level = this.level;

				return function () {
					var _ansiStyles$color$lev;

					var open = (_ansiStyles$color$lev = ansiStyles.color[levelMapping[level]])[model].apply(_ansiStyles$color$lev, arguments);
					var codes = {
						open: open,
						close: ansiStyles.color.close,
						closeRe: ansiStyles.color.closeRe
					};
					return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
				};
			}
		};
	};

	for (var _iterator2 = Object.keys(ansiStyles.color.ansi)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
		var _ret2 = _loop2();

		if (_ret2 === 'continue') continue;
	}
} catch (err) {
	_didIteratorError2 = true;
	_iteratorError2 = err;
} finally {
	try {
		if (!_iteratorNormalCompletion2 && _iterator2.return) {
			_iterator2.return();
		}
	} finally {
		if (_didIteratorError2) {
			throw _iteratorError2;
		}
	}
}

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
var _iteratorNormalCompletion3 = true;
var _didIteratorError3 = false;
var _iteratorError3 = undefined;

try {
	var _loop3 = function _loop3() {
		var model = _step3.value;

		if (skipModels.has(model)) {
			return 'continue';
		}

		var bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
		styles[bgModel] = {
			get: function get() {
				var level = this.level;

				return function () {
					var _ansiStyles$bgColor$l;

					var open = (_ansiStyles$bgColor$l = ansiStyles.bgColor[levelMapping[level]])[model].apply(_ansiStyles$bgColor$l, arguments);
					var codes = {
						open: open,
						close: ansiStyles.bgColor.close,
						closeRe: ansiStyles.bgColor.closeRe
					};
					return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
				};
			}
		};
	};

	for (var _iterator3 = Object.keys(ansiStyles.bgColor.ansi)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
		var _ret3 = _loop3();

		if (_ret3 === 'continue') continue;
	}
} catch (err) {
	_didIteratorError3 = true;
	_iteratorError3 = err;
} finally {
	try {
		if (!_iteratorNormalCompletion3 && _iterator3.return) {
			_iterator3.return();
		}
	} finally {
		if (_didIteratorError3) {
			throw _iteratorError3;
		}
	}
}

var proto = Object.defineProperties(function () {}, styles);

function build(_styles, _empty, key) {
	var builder = function builder() {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return applyStyle.call.apply(applyStyle, [builder].concat(args));
	};
	builder._styles = _styles;
	builder._empty = _empty;

	var self = this;

	Object.defineProperty(builder, 'level', {
		enumerable: true,
		get: function get() {
			return self.level;
		},
		set: function set(level) {
			self.level = level;
		}
	});

	Object.defineProperty(builder, 'enabled', {
		enumerable: true,
		get: function get() {
			return self.enabled;
		},
		set: function set(enabled) {
			self.enabled = enabled;
		}
	});

	// See below for fix regarding invisible grey/dim combination on Windows
	builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	return builder;
}

function applyStyle() {
	for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		args[_key3] = arguments[_key3];
	}

	// Support varags, but simply cast to string in case there's only one arg
	var argsLen = args.length;
	var str = String(args[0]);

	if (argsLen === 0) {
		return '';
	}

	if (argsLen > 1) {
		// Don't slice `arguments`, it prevents V8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || this.level <= 0 || !str) {
		return this._empty ? '' : str;
	}

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && this.hasGrey) {
		ansiStyles.dim.open = '';
	}

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = this._styles.slice().reverse()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var code = _step4.value;

			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;

			// Close the styling before a linebreak and reopen
			// after next line to fix a bleed issue on macOS
			// https://github.com/chalk/chalk/pull/92
			str = str.replace(/\r?\n/g, code.close + '$&' + code.open);
		}

		// Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4.return) {
				_iterator4.return();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}

	ansiStyles.dim.open = originalDim;

	return str;
}

function chalkTag(chalk) {
	for (var _len4 = arguments.length, strings = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
		strings[_key4 - 1] = arguments[_key4];
	}

	var firstString = strings[0];

	if (!Array.isArray(firstString)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	var args = strings.slice(1);
	var parts = [firstString.raw[0]];

	for (var i = 1; i < firstString.length; i++) {
		parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
		parts.push(String(firstString.raw[i]));
	}

	return template(chalk, parts.join(''));
}

Object.defineProperties(Chalk.prototype, styles);

module.exports = Chalk(); // eslint-disable-line new-cap
module.exports.supportsColor = stdoutColor;
module.exports.default = module.exports; // For TypeScript
