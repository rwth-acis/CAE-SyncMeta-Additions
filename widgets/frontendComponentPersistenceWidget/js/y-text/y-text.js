! function e(t, n, r) {
    function i(l, a) {
        if (!n[l]) {
            if (!t[l]) {
                var s = "function" == typeof require && require;
                if (!a && s) return s(l, !0);
                if (o) return o(l, !0);
                var u = new Error("Cannot find module '" + l + "'");
                throw u.code = "MODULE_NOT_FOUND", u
            }
            var c = n[l] = {
                exports: {}
            };
            t[l][0].call(c.exports, function(e) {
                var n = t[l][1][e];
                return i(n ? n : e)
            }, c, c.exports, e, t, n, r)
        }
        return n[l].exports
    }
    for (var o = "function" == typeof require && require, l = 0; l < r.length; l++) i(r[l]);
    return i
}({
    1: [function(e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function l(e) {
            e.requestModules(["Array"]).then(function() {
                var t = function(e) {
                    function t(e, n, o) {
                        r(this, t);
                        var l = i(this, Object.getPrototypeOf(t).call(this, e, n, o));
                        return l.textfields = [], l.aceInstances = [], l
                    }
                    return o(t, e), s(t, [{
                        key: "_destroy",
                        value: function() {
                            this.unbindAll(), this.textfields = null, this.aceInstances = null, u(Object.getPrototypeOf(t.prototype), "_destroy", this).call(this)
                        }
                    }, {
                        key: "toString",
                        value: function() {
                            return this._content.map(function(e) {
                                return e.val
                            }).join("")
                        }
                    }, {
                        key: "insert",
                        value: function(e, n) {
                            u(Object.getPrototypeOf(t.prototype), "insert", this).call(this, e, n.split(""))
                        }
                    }, {
                        key: "unbindAll",
                        value: function() {
                            for (var e = this.textfields.length - 1; e >= 0; e--) this.unbindTextarea(this.textfields[e].editor);
                            for (var t = this.aceInstances.length - 1; t >= 0; t--) this.unbindAce(this.aceInstances[t].editor)
                        }
                    }, {
                        key: "unbindAce",
                        value: function(e) {
                            var t = this.aceInstances.findIndex(function(t) {
                                return t.editor === e
                            });
                            if (t >= 0) {
                                var n = this.aceInstances[t];
                                this.unobserve(n.yCallback), n.editor.off("change", n.aceCallback), this.aceInstances.splice(t, 1)
                            }
                        }
                    }, {
                        key: "bindAce",
                        value: function(e, t) {
                            function n(e) {
                                if (s) {
                                    s = !1;
                                    try {
                                        e()
                                    } catch (e) {
                                        throw s = !0, new Error(e)
                                    }
                                    s = !0
                                }
                            }

                            function r(t) {
                                n(function() {
                                    var n = 0,
                                        r = 0,
                                        i = e.getSession().getDocument();
                                    "insert" === t.action ? (n = i.positionToIndex(t.start, 0), l.insert(n, t.lines.join("\n"))) : "remove" === t.action && (n = i.positionToIndex(t.start, 0), r = t.lines.join("\n").length, l.delete(n, r))
                                })
                            }

                            function i(t, n, r) {
                                if (!u) {
                                    var i = 0;
                                    t.row === n.row && t.column === n.column && (i = 1);
                                    var o = new c(t.row, t.column, n.row, n.column + i),
                                        l = e.session.addMarker(o, r, "text");
                                    e.markers.push({
                                        id: l,
                                        timestamp: Date.now()
                                    })
                                }
                            }

                            function o(t) {
                                var r = e.getSession().getDocument();
                                n(function() {
                                    if ("insert" === t.type) {
                                        var e = r.indexToPosition(t.index, 0),
                                            n = r.indexToPosition(t.index + t.length, 0);
                                        r.insert(e, t.values.join("")), i(e, n, "inserted")
                                    } else if ("delete" === t.type) {
                                        var o = r.indexToPosition(t.index, 0),
                                            l = r.indexToPosition(t.index + t.length, 0),
                                            a = new c(o.row, o.column, l.row, l.column);
                                        r.remove(a), i(o, l, "deleted")
                                    }
                                })
                            }
                            var l = this,
                                s = !0;
                            e.markers = [];
                            var u = !1;
                            "object" === ("undefined" == typeof t ? "undefined" : a(t)) && "undefined" != typeof t.disableMarkers && (u = t.disableMarkers), e.setValue(this.toString()), e.on("change", r), u || (this.inteval && clearInterval(this.inteval), this.inteval = setInterval(function() {
                                for (var t = 0, n = Date.now(), r = 800; t < e.markers.length;) {
                                    var i = e.markers[t];
                                    i.timestamp + r < n && (e.getSession().removeMarker(i.id), e.markers.splice(t, 1), t--), t++
                                }
                            }, 1e3));
                            var c = window.ace.require("ace/range").Range;
                            this.observe(o), this.aceInstances.push({
                                editor: e,
                                yCallback: o,
                                aceCallback: r
                            })
                        }
                    }, {
                        key: "bind",
                        value: function() {
                            var e = arguments[0];
                            e instanceof Element ? this.bindTextarea.apply(this, arguments) : null != e && null != e.session && null != e.getSession && null != e.setValue ? this.bindAce.apply(this, arguments) : console.error("Cannot bind, unsupported editor!")
                        }
                    }, {
                        key: "unbindTextarea",
                        value: function(e) {
                            var t = this.textfields.findIndex(function(t) {
                                return t.editor === e
                            });
                            if (t >= 0) {
                                var n = this.textfields[t];
                                this.unobserve(n.yCallback);
                                var r = n.editor;
                                r.onkeydown = null, r.onkeyup = null, r.onkeypress = null, r.onpaste = null, r.oncut = null, this.textfields.splice(t, 1)
                            }
                        }
                    }, {
                        key: "bindTextarea",
                        value: function(e, t) {
                            function n(e) {
                                if (!i) {
                                    var t, n;
                                    if ("insert" === e.type) {
                                        t = e.index, n = function(e) {
                                            return e <= t ? e : e += 1
                                        };
                                        var r = l(n);
                                        a(r)
                                    } else "delete" === e.type && (t = e.index, n = function(e) {
                                        return e < t ? e : e -= 1
                                    }, r = l(n), a(r))
                                }
                            }
                            t = t || window, null == t.getSelection && (t = window);
                            for (var r = 0; r < this.textfields.length; r++)
                                if (this.textfields[r].editor === e) return;
                            var i = !1,
                                o = this;
                            e.value = this.toString();
                            var l, a, s;
                            null != e.selectionStart && null != e.setSelectionRange ? (l = function(t) {
                                var n = e.selectionStart,
                                    r = e.selectionEnd;
                                return null != t && (n = t(n), r = t(r)), {
                                    left: n,
                                    right: r
                                }
                            }, a = function(t) {
                                s(o.toString()), e.setSelectionRange(t.left, t.right)
                            }, s = function(t) {
                                e.value = t
                            }) : (l = function(n) {
                                var r = {},
                                    i = t.getSelection(),
                                    o = e.textContent.length;
                                r.left = Math.min(i.anchorOffset, o), r.right = Math.min(i.focusOffset, o), null != n && (r.left = n(r.left), r.right = n(r.right));
                                var l = i.focusNode;
                                return l === e || l === e.childNodes[0] ? r.isReal = !0 : r.isReal = !1, r
                            }, a = function(t) {
                                s(o.toString());
                                var n = e.childNodes[0];
                                if (t.isReal && null != n) {
                                    t.left < 0 && (t.left = 0), t.right = Math.max(t.left, t.right), t.right > n.length && (t.right = n.length), t.left = Math.min(t.left, t.right);
                                    var r = document.createRange();
                                    r.setStart(n, t.left), r.setEnd(n, t.right);
                                    var i = window.getSelection();
                                    i.removeAllRanges(), i.addRange(r)
                                }
                            }, s = function(t) {
                                var n = t.replace(new RegExp("\n", "g"), " ").split(" ");
                                e.innerText = "";
                                for (var r = 0; r < n.length; r++) {
                                    var i = n[r];
                                    e.innerText += i, r !== n.length - 1 && (e.innerHTML += "&nbsp;")
                                }
                            }), s(this.toString()), this.observe(n), e.onkeypress = function(t) {
                                if (o.is_deleted) return e.onkeypress = null, !0;
                                i = !0;
                                var n;
                                if (n = 13 === t.keyCode ? "\n" : null != t.key ? 32 === t.charCode ? " " : t.key : window.String.fromCharCode(t.keyCode), n.length > 1) return !0;
                                if (n.length > 0) {
                                    var r = l(),
                                        s = Math.min(r.left, r.right, o.length),
                                        u = Math.abs(r.right - r.left);
                                    o.delete(s, u), o.insert(s, n), r.left = s + n.length, r.right = r.left, a(r)
                                }
                                return t.preventDefault(), i = !1, !1
                            }, e.onpaste = function(t) {
                                return o.is_deleted ? (e.onpaste = null, !0) : void t.preventDefault()
                            }, e.oncut = function(t) {
                                return o.is_deleted ? (e.oncut = null, !0) : void t.preventDefault()
                            }, e.onkeydown = function(t) {
                                if (i = !0, o.is_deleted) return e.onkeydown = null, !0;
                                var n = l(),
                                    r = Math.min(n.left, n.right, o.toString().length),
                                    s = Math.abs(n.left - n.right);
                                if (null != t.keyCode && 8 === t.keyCode) {
                                    if (s > 0) o.delete(r, s), n.left = r, n.right = r, a(n);
                                    else if (null != t.ctrlKey && t.ctrlKey) {
                                        var u = o.toString(),
                                            c = r,
                                            f = 0;
                                        for (r > 0 && (c--, f++); c > 0 && " " !== u[c] && "\n" !== u[c];) c--, f++;
                                        o.delete(c, r - c), n.left = c, n.right = c, a(n)
                                    } else r > 0 && (o.delete(r - 1, 1), n.left = r - 1, n.right = r - 1, a(n));
                                    return t.preventDefault(), i = !1, !1
                                }
                                return null != t.keyCode && 46 === t.keyCode ? (s > 0 ? (o.delete(r, s), n.left = r, n.right = r, a(n)) : (o.delete(r, 1), n.left = r, n.right = r, a(n)), t.preventDefault(), i = !1, !1) : (i = !1, !0)
                            }, this.textfields.push({
                                editor: e,
                                yCallback: n
                            })
                        }
                    }]), t
                }(e.Array.typeDefinition.class);
                e.extend("Text", new e.utils.CustomTypeDefinition({
                    name: "Text",
                    class: t,
                    struct: "List",
                    initType: regeneratorRuntime.mark(function n(r, i) {
                        var o;
                        return regeneratorRuntime.wrap(function(n) {
                            for (;;) switch (n.prev = n.next) {
                                case 0:
                                    return o = [], n.delegateYield(e.Struct.List.map.call(this, i, function(e) {
                                        if (e.hasOwnProperty("opContent")) throw new Error("Text must not contain types!");
                                        e.content.forEach(function(t, n) {
                                            o.push({
                                                id: [e.id[0], e.id[1] + n],
                                                val: e.content[n]
                                            })
                                        })
                                    }), "t0", 2);
                                case 2:
                                    return n.abrupt("return", new t(r, i.id, o));
                                case 3:
                                case "end":
                                    return n.stop()
                            }
                        }, n, this)
                    }),
                    createType: function(e, n) {
                        return new t(e, n.id, [])
                    }
                }))
            })
        }
        var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
            },
            s = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            u = function e(t, n, r) {
                null === t && (t = Function.prototype);
                var i = Object.getOwnPropertyDescriptor(t, n);
                if (void 0 === i) {
                    var o = Object.getPrototypeOf(t);
                    return null === o ? void 0 : e(o, n, r)
                }
                if ("value" in i) return i.value;
                var l = i.get;
                if (void 0 !== l) return l.call(r)
            };
        t.exports = l, "undefined" != typeof Y && l(Y)
    }, {}]
}, {}, [1]);
//# sourceMappingURL=y-text.js.map