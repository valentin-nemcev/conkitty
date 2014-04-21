$C.tpl = {};


var $ConkittyEventHandlers = [];

$C.on = function on(callback) {
    $ConkittyEventHandlers.push(callback);
};

$C.off = function off(callback) {
    if (callback) {
        var i = $ConkittyEventHandlers.length - 1;

        while (i >= 0) {
            if ($ConkittyEventHandlers[i] === callback) {
                $ConkittyEventHandlers.splice(i, 1);
            } else {
                i--;
            }
        }
    } else {
        $ConkittyEventHandlers = [];
    }
};

$C.define('trigger', function(val, key, obj, args) {
    var i,
        arg;

    for (i = 0; i < args.length; i++) {
        if (typeof ((arg = args[i])) === 'function') {
            args[i] = arg.call(this, val, key, obj);
        }
    }

    for (i = 0; i < $ConkittyEventHandlers.length; i++) {
        $ConkittyEventHandlers[i].apply(this, args);
    }
});

function EnvClass(parent, payload) {
    this.p = parent;
    this.d = payload;
}

EnvClass.prototype.l = function getPayload(parent) {
    var self = this,
        ret;

    if (self.d) {
        // Trying to get cached payload.
        if (!((ret = self._p))) {
            ret = self._p = self.d();
        }

        if (!parent) {
            return ret.firstChild ? ret : undefined;
        }

        ret && parent.appendChild(ret);
        delete self._p;
    }
};

function getEnv(obj) {
    return obj instanceof EnvClass ? obj : new EnvClass(obj instanceof Node ? obj : undefined);
}

function joinClasses() {
    var i, ret = [], arg;
    for (i = 0; i < arguments.length; i++) {
        if ((arg = arguments[i])) { ret.push(arg); }
    }
    return ret.length ? ret.join(' ') : undefined;
}

function getModClass(name, val) {
    if (val) { return val === true ? name : name + '_' + val; }
}
