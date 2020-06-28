
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /** @type {import('svelte/store').Writable<RouteNode>} */
    const route = writable(null); // the actual route being rendered
    const routes = writable([]); // all routes

    /** @type {import('svelte/store').Writable<RouteNode>} */
    const urlRoute = writable(null);  // the route matching the url

    /** 
     * @typedef {import('svelte/store').Writable<String>} Basepath
     * @type {Basepath} */
    const basepath = (() => {
        const { set, subscribe } = writable("");

        return {
            subscribe,
            set(value) {
                if (value.match(/^\//))
                    set(value);
                else console.warn('Basepaths must start with /');
            },
            update() { console.warn('Use assignment or set to update basepaths.'); }
        }
    })();

    const location$1 = derived( // the part of the url matching the basepath
        [basepath, urlRoute],
        ([$basepath, $route]) => {
            const url = window.location.pathname;
            const [, base, path] = url.match(`^(${$basepath})(${$route.regex})`) || [];
            return { base, path }
        }
    );

    const MATCH_PARAM = RegExp(/\:([^/()]+)/g);

    function handleScroll(element) {
      if (navigator.userAgent.includes('jsdom')) return false
      scrollAncestorsToTop(element);
      handleHash();
    }

    function handleHash() {
      if (navigator.userAgent.includes('jsdom')) return false
      const { hash } = window.location;
      if (hash) {
        const el = document.querySelector(hash);
        if (hash && el) el.scrollIntoView();
      }
    }

    function scrollAncestorsToTop(element) {
      if (
        element &&
        element.scrollTo &&
        element.dataset.routify !== 'scroll-lock' &&
        element.dataset['routify-scroll'] !== 'lock'
      ) {
        element.style['scroll-behavior'] = "auto";
        element.scrollTo({ top: 0, behavior: 'auto' });
        element.style['scroll-behavior'] = "";
        scrollAncestorsToTop(element.parentElement);
      }
    }

    const pathToRegex = (str, recursive) => {
      const suffix = recursive ? '' : '/?$'; //fallbacks should match recursively
      str = str.replace(/\/_fallback?$/, '(/|$)');
      str = str.replace(/\/index$/, '(/index)?'); //index files should be matched even if not present in url
      str = str.replace(MATCH_PARAM, '([^/]+)') + suffix;
      return str
    };

    const pathToParams = string => {
      const params = [];
      let matches;
      while (matches = MATCH_PARAM.exec(string))
        params.push(matches[1]);
      return params
    };

    const pathToRank = ({ path }) => {
      return path
        .split('/')
        .filter(Boolean)
        .map(str => (str === '_fallback' ? 'A' : str.startsWith(':') ? 'B' : 'C'))
        .join('')
    };

    let warningSuppressed = false;

    /* eslint no-console: 0 */
    function suppressWarnings() {
      if (warningSuppressed) return
      const consoleWarn = console.warn;
      console.warn = function (msg, ...msgs) {
        const ignores = [
          "was created with unknown prop 'scoped'",
          "was created with unknown prop 'scopedSync'",
        ];
        if (!ignores.find(iMsg => msg.includes(iMsg)))
          return consoleWarn(msg, ...msgs)
      };
      warningSuppressed = true;
    }

    var defaultConfig = {
        queryHandler: {
            parse: search => fromEntries(new URLSearchParams(search)),
            stringify: params => '?' + (new URLSearchParams(params)).toString()
        }
    };


    function fromEntries(iterable) {
        return [...iterable].reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj
        }, {})
    }

    /// <reference path="../typedef.js" />

    /** @ts-check */
    /**
     * @typedef {Object} RoutifyContext
     * @prop {ClientNode} component
     * @prop {ClientNode} layout
     * @prop {any} componentFile 
     * 
     *  @returns {import('svelte/store').Readable<RoutifyContext>} */
    function getRoutifyContext() {
      return getContext('routify')
    }

    /**
     * @callback AfterPageLoadHelper
     * @param {function} callback
     * 
     * @typedef {import('svelte/store').Readable<AfterPageLoadHelper> & {_hooks:Array<function>}} AfterPageLoadHelperStore
     * @type {AfterPageLoadHelperStore}
     */
    const afterPageLoad = {
      _hooks: [],
      subscribe: hookHandler
    };

    /** 
     * @callback BeforeUrlChangeHelper
     * @param {function} callback
     *
     * @typedef {import('svelte/store').Readable<BeforeUrlChangeHelper> & {_hooks:Array<function>}} BeforeUrlChangeHelperStore
     * @type {BeforeUrlChangeHelperStore}
     **/
    const beforeUrlChange = {
      _hooks: [],
      subscribe: hookHandler
    };

    function hookHandler(listener) {
      const hooks = this._hooks;
      const index = hooks.length;
      listener(callback => { hooks[index] = callback; });
      return () => delete hooks[index]
    }

    /**
     * @callback UrlHelper
     * @param {String=} path
     * @param {UrlParams=} params
     * @param {UrlOptions=} options
     * @return {String}
     *
     * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
     * @type {UrlHelperStore} 
     * */
    const url = {
      subscribe(listener) {
        const ctx = getRoutifyContext();
        return derived(
          [ctx, route, routes, location$1],
          args => makeUrlHelper(...args)
        ).subscribe(
          listener
        )
      }
    };

    /** 
     * @param {{component: ClientNode}} $ctx 
     * @param {RouteNode} $oldRoute 
     * @param {RouteNode[]} $routes 
     * @param {{base: string, path: string}} $location
     * @returns {UrlHelper}
     */
    function makeUrlHelper($ctx, $oldRoute, $routes, $location) {
      return function url(path, params, options) {
        const { component } = $ctx;
        path = path || './';

        const strict = options && options.strict !== false;
        if (!strict) path = path.replace(/index$/, '');

        if (path.match(/^\.\.?\//)) {
          //RELATIVE PATH
          let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/);
          let dir = component.path.replace(/\/$/, '');
          const traverse = breadcrumbs.match(/\.\.\//g) || [];
          traverse.forEach(() => dir = dir.replace(/\/[^\/]+\/?$/, ''));
          path = `${dir}/${relativePath}`.replace(/\/$/, '');

        } else if (path.match(/^\//)) ; else {
          // NAMED PATH
          const matchingRoute = $routes.find(route => route.meta.name === path);
          if (matchingRoute) path = matchingRoute.shortPath;
        }

        /** @type {Object<string, *>} Parameters */
        const allParams = Object.assign({}, $oldRoute.params, component.params, params);
        let pathWithParams = path;
        for (const [key, value] of Object.entries(allParams)) {
          pathWithParams = pathWithParams.replace(`:${key}`, value);
        }

        const fullPath = $location.base + pathWithParams + _getQueryString(path, params);
        return fullPath.replace(/\?$/, '')
      }
    }

    /**
     * 
     * @param {string} path 
     * @param {object} params 
     */
    function _getQueryString(path, params) {
      if (!defaultConfig.queryHandler) return ""
      const pathParamKeys = pathToParams(path);
      const queryParams = {};
      if (params) Object.entries(params).forEach(([key, value]) => {
        if (!pathParamKeys.includes(key))
          queryParams[key] = value;
      });
      return defaultConfig.queryHandler.stringify(queryParams)
    }

    /**
     * @callback IsActiveHelper
     * @param {String=} path
     * @param {UrlParams=} params
     * @param {UrlOptions=} options
     * @returns {Boolean}
     * 
     * @typedef {import('svelte/store').Readable<IsActiveHelper>} IsActiveHelperStore
     * @type {IsActiveHelperStore} 
     * */
    const isActive = {
      subscribe(run) {
        return derived(
          [url, route],
          ([url, route]) => function isActive(path = "", params = {}, { strict } = { strict: true }) {
            path = url(path, null, { strict });
            const currentPath = url(route.path, null, { strict });
            const re = new RegExp('^' + path + '($|/)');
            return !!currentPath.match(re)
          }
        ).subscribe(run)
      },
    };



    const _metatags = {
      props: {},
      templates: {},
      services: {
        plain: { propField: 'name', valueField: 'content' },
        twitter: { propField: 'name', valueField: 'content' },
        og: { propField: 'property', valueField: 'content' },
      },
      plugins: [
        {
          name: 'applyTemplate',
          condition: () => true,
          action: (prop, value) => {
            const template = _metatags.getLongest(_metatags.templates, prop) || (x => x);
            return [prop, template(value)]
          }
        },
        {
          name: 'createMeta',
          condition: () => true,
          action(prop, value) {
            _metatags.writeMeta(prop, value);
          }
        },
        {
          name: 'createOG',
          condition: prop => !prop.match(':'),
          action(prop, value) {
            _metatags.writeMeta(`og:${prop}`, value);
          }
        },
        {
          name: 'createTitle',
          condition: prop => prop === 'title',
          action(prop, value) {
            document.title = value;
          }
        }
      ],
      getLongest(repo, name) {
        const providers = repo[name];
        if (providers) {
          const currentPath = get_store_value(route).path;
          const allPaths = Object.keys(repo[name]);
          const matchingPaths = allPaths.filter(path => currentPath.includes(path));

          const longestKey = matchingPaths.sort((a, b) => b.length - a.length)[0];

          return providers[longestKey]
        }
      },
      writeMeta(prop, value) {
        const head = document.getElementsByTagName('head')[0];
        const match = prop.match(/(.+)\:/);
        const serviceName = match && match[1] || 'plain';
        const { propField, valueField } = metatags.services[serviceName] || metatags.services.plain;
        const oldElement = document.querySelector(`meta[${propField}='${prop}']`);
        if (oldElement) oldElement.remove();

        const newElement = document.createElement('meta');
        newElement.setAttribute(propField, prop);
        newElement.setAttribute(valueField, value);
        newElement.setAttribute('data-origin', 'routify');
        head.appendChild(newElement);
      },
      set(prop, value) {
        _metatags.plugins.forEach(plugin => {
          if (plugin.condition(prop, value))
            [prop, value] = plugin.action(prop, value) || [prop, value];
        });
      },
      clear() {
        const oldElement = document.querySelector(`meta`);
        if (oldElement) oldElement.remove();
      },
      template(name, fn) {
        const origin = _metatags.getOrigin();
        _metatags.templates[name] = _metatags.templates[name] || {};
        _metatags.templates[name][origin] = fn;
      },
      update() {
        Object.keys(_metatags.props).forEach((prop) => {
          let value = (_metatags.getLongest(_metatags.props, prop));
          _metatags.plugins.forEach(plugin => {
            if (plugin.condition(prop, value)) {
              [prop, value] = plugin.action(prop, value) || [prop, value];

            }
          });
        });
      },
      batchedUpdate() {
        if (!_metatags._pendingUpdate) {
          _metatags._pendingUpdate = true;
          setTimeout(() => {
            _metatags._pendingUpdate = false;
            this.update();
          });
        }
      },
      _updateQueued: false,
      getOrigin() {
        const routifyCtx = getRoutifyContext();
        return routifyCtx && get_store_value(routifyCtx).path || '/'
      },
      _pendingUpdate: false
    };


    /**
     * metatags
     * @prop {Object.<string, string>}
     */
    const metatags = new Proxy(_metatags, {
      set(target, name, value, receiver) {
        const { props, getOrigin } = target;

        if (Reflect.has(target, name))
          Reflect.set(target, name, value, receiver);
        else {
          props[name] = props[name] || {};
          props[name][getOrigin()] = value;
        }

        if (window['routify'].appLoaded)
          target.batchedUpdate();
        return true
      }
    });

    /* node_modules/@sveltech/routify/runtime/Route.svelte generated by Svelte v3.23.2 */
    const file = "node_modules/@sveltech/routify/runtime/Route.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i].component;
    	child_ctx[21] = list[i].componentFile;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i].component;
    	child_ctx[21] = list[i].componentFile;
    	return child_ctx;
    }

    // (122:0) {#if $context}
    function create_if_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$context*/ ctx[6].component.isLayout === false) return 0;
    		if (/*remainingLayouts*/ ctx[5].length) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(122:0) {#if $context}",
    		ctx
    	});

    	return block;
    }

    // (134:36) 
    function create_if_block_3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = [/*$context*/ ctx[6]];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*component*/ ctx[20].path;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$context, scoped, scopedSync, layout, remainingLayouts, decorator, Decorator, scopeToChild*/ 201326711) {
    				const each_value_1 = [/*$context*/ ctx[6]];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(134:36) ",
    		ctx
    	});

    	return block;
    }

    // (123:2) {#if $context.component.isLayout === false}
    function create_if_block_2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = [/*$context*/ ctx[6]];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*component*/ ctx[20].path;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$context, scoped, scopedSync, layout*/ 85) {
    				const each_value = [/*$context*/ ctx[6]];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(123:2) {#if $context.component.isLayout === false}",
    		ctx
    	});

    	return block;
    }

    // (136:6) <svelte:component         this={componentFile}         let:scoped={scopeToChild}         let:decorator         {scoped}         {scopedSync}         {...layout.param || {}}>
    function create_default_slot(ctx) {
    	let route_1;
    	let t;
    	let current;

    	route_1 = new Route({
    			props: {
    				layouts: [.../*remainingLayouts*/ ctx[5]],
    				Decorator: typeof /*decorator*/ ctx[27] !== "undefined"
    				? /*decorator*/ ctx[27]
    				: /*Decorator*/ ctx[1],
    				childOfDecorator: /*layout*/ ctx[4].isDecorator,
    				scoped: {
    					.../*scoped*/ ctx[0],
    					.../*scopeToChild*/ ctx[26]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route_1.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(route_1, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_1_changes = {};
    			if (dirty & /*remainingLayouts*/ 32) route_1_changes.layouts = [.../*remainingLayouts*/ ctx[5]];

    			if (dirty & /*decorator, Decorator*/ 134217730) route_1_changes.Decorator = typeof /*decorator*/ ctx[27] !== "undefined"
    			? /*decorator*/ ctx[27]
    			: /*Decorator*/ ctx[1];

    			if (dirty & /*layout*/ 16) route_1_changes.childOfDecorator = /*layout*/ ctx[4].isDecorator;

    			if (dirty & /*scoped, scopeToChild*/ 67108865) route_1_changes.scoped = {
    				.../*scoped*/ ctx[0],
    				.../*scopeToChild*/ ctx[26]
    			};

    			route_1.$set(route_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route_1, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(136:6) <svelte:component         this={componentFile}         let:scoped={scopeToChild}         let:decorator         {scoped}         {scopedSync}         {...layout.param || {}}>",
    		ctx
    	});

    	return block;
    }

    // (135:4) {#each [$context] as { component, componentFile }
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ scoped: /*scoped*/ ctx[0] },
    		{ scopedSync: /*scopedSync*/ ctx[2] },
    		/*layout*/ ctx[4].param || {}
    	];

    	var switch_value = /*componentFile*/ ctx[21];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: {
    				default: [
    					create_default_slot,
    					({ scoped: scopeToChild, decorator }) => ({ 26: scopeToChild, 27: decorator }),
    					({ scoped: scopeToChild, decorator }) => (scopeToChild ? 67108864 : 0) | (decorator ? 134217728 : 0)
    				]
    			},
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*scoped, scopedSync, layout*/ 21)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*scoped*/ 1 && { scoped: /*scoped*/ ctx[0] },
    					dirty & /*scopedSync*/ 4 && { scopedSync: /*scopedSync*/ ctx[2] },
    					dirty & /*layout*/ 16 && get_spread_object(/*layout*/ ctx[4].param || {})
    				])
    			: {};

    			if (dirty & /*$$scope, remainingLayouts, decorator, Decorator, layout, scoped, scopeToChild*/ 469762099) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*componentFile*/ ctx[21])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(135:4) {#each [$context] as { component, componentFile }",
    		ctx
    	});

    	return block;
    }

    // (124:4) {#each [$context] as { component, componentFile }
    function create_each_block(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ scoped: /*scoped*/ ctx[0] },
    		{ scopedSync: /*scopedSync*/ ctx[2] },
    		/*layout*/ ctx[4].param || {}
    	];

    	var switch_value = /*componentFile*/ ctx[21];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*scoped, scopedSync, layout*/ 21)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*scoped*/ 1 && { scoped: /*scoped*/ ctx[0] },
    					dirty & /*scopedSync*/ 4 && { scopedSync: /*scopedSync*/ ctx[2] },
    					dirty & /*layout*/ 16 && get_spread_object(/*layout*/ ctx[4].param || {})
    				])
    			: {};

    			if (switch_value !== (switch_value = /*componentFile*/ ctx[21])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(124:4) {#each [$context] as { component, componentFile }",
    		ctx
    	});

    	return block;
    }

    // (154:0) {#if !parentElement}
    function create_if_block(ctx) {
    	let span;
    	let setParent_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			add_location(span, file, 154, 2, 4477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(setParent_action = /*setParent*/ ctx[8].call(null, span));
    				mounted = true;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(154:0) {#if !parentElement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*$context*/ ctx[6] && create_if_block_1(ctx);
    	let if_block1 = !/*parentElement*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$context*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$context*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*parentElement*/ ctx[3]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $context;
    	let $route;
    	validate_store(route, "route");
    	component_subscribe($$self, route, $$value => $$invalidate(14, $route = $$value));
    	let { layouts = [] } = $$props;
    	let { scoped = {} } = $$props;
    	let { Decorator = null } = $$props;
    	let { childOfDecorator = false } = $$props;
    	let scopedSync = {};
    	let layoutIsUpdated = false;
    	let isDecorator = false;

    	/** @type {HTMLElement} */
    	let parentElement;

    	/** @type {LayoutOrDecorator} */
    	let layout = null;

    	/** @type {LayoutOrDecorator} */
    	let lastLayout = null;

    	/** @type {LayoutOrDecorator[]} */
    	let remainingLayouts = [];

    	const context = writable(null);
    	validate_store(context, "context");
    	component_subscribe($$self, context, value => $$invalidate(6, $context = value));

    	/** @type {import("svelte/store").Writable<Context>} */
    	const parentContextStore = getContext("routify");

    	isDecorator = Decorator && !childOfDecorator;
    	setContext("routify", context);

    	/** @param {HTMLElement} el */
    	function setParent(el) {
    		$$invalidate(3, parentElement = el.parentElement);
    	}

    	/** @param {SvelteComponent} componentFile */
    	function onComponentLoaded(componentFile) {
    		/** @type {Context} */
    		const parentContext = get_store_value(parentContextStore);

    		$$invalidate(2, scopedSync = { ...scoped });
    		$$invalidate(13, lastLayout = layout);
    		if (remainingLayouts.length === 0) onLastComponentLoaded();

    		context.set({
    			layout: isDecorator ? parentContext.layout : layout,
    			component: layout,
    			componentFile,
    			child: isDecorator
    			? parentContext.child
    			: get_store_value(context) && get_store_value(context).child
    		});

    		if (parentContext && !isDecorator) parentContextStore.update(store => {
    			store.child = layout || store.child;
    			return store;
    		});
    	}

    	/**  @param {LayoutOrDecorator} layout */
    	function setComponent(layout) {
    		let PendingComponent = layout.component();
    		if (PendingComponent instanceof Promise) PendingComponent.then(onComponentLoaded); else onComponentLoaded(PendingComponent);
    	}

    	async function onLastComponentLoaded() {
    		afterPageLoad._hooks.forEach(hook => hook(layout.api));
    		await tick();
    		handleScroll(parentElement);
    		metatags.update();
    		if (!window["routify"].appLoaded) onAppLoaded();
    	}

    	async function onAppLoaded() {
    		const pagePath = $context.component.path;
    		const routePath = $route.path;
    		const isOnCurrentRoute = pagePath === routePath; //maybe we're getting redirected

    		// Let everyone know the last child has rendered
    		if (!window["routify"].stopAutoReady && isOnCurrentRoute) {
    			dispatchEvent(new CustomEvent("app-loaded"));
    			window["routify"].appLoaded = true;
    		}
    	}

    	const writable_props = ["layouts", "scoped", "Decorator", "childOfDecorator"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Route", $$slots, []);

    	$$self.$set = $$props => {
    		if ("layouts" in $$props) $$invalidate(9, layouts = $$props.layouts);
    		if ("scoped" in $$props) $$invalidate(0, scoped = $$props.scoped);
    		if ("Decorator" in $$props) $$invalidate(1, Decorator = $$props.Decorator);
    		if ("childOfDecorator" in $$props) $$invalidate(10, childOfDecorator = $$props.childOfDecorator);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onDestroy,
    		onMount,
    		tick,
    		writable,
    		get: get_store_value,
    		metatags,
    		afterPageLoad,
    		route,
    		routes,
    		handleScroll,
    		layouts,
    		scoped,
    		Decorator,
    		childOfDecorator,
    		scopedSync,
    		layoutIsUpdated,
    		isDecorator,
    		parentElement,
    		layout,
    		lastLayout,
    		remainingLayouts,
    		context,
    		parentContextStore,
    		setParent,
    		onComponentLoaded,
    		setComponent,
    		onLastComponentLoaded,
    		onAppLoaded,
    		$context,
    		$route
    	});

    	$$self.$inject_state = $$props => {
    		if ("layouts" in $$props) $$invalidate(9, layouts = $$props.layouts);
    		if ("scoped" in $$props) $$invalidate(0, scoped = $$props.scoped);
    		if ("Decorator" in $$props) $$invalidate(1, Decorator = $$props.Decorator);
    		if ("childOfDecorator" in $$props) $$invalidate(10, childOfDecorator = $$props.childOfDecorator);
    		if ("scopedSync" in $$props) $$invalidate(2, scopedSync = $$props.scopedSync);
    		if ("layoutIsUpdated" in $$props) layoutIsUpdated = $$props.layoutIsUpdated;
    		if ("isDecorator" in $$props) $$invalidate(12, isDecorator = $$props.isDecorator);
    		if ("parentElement" in $$props) $$invalidate(3, parentElement = $$props.parentElement);
    		if ("layout" in $$props) $$invalidate(4, layout = $$props.layout);
    		if ("lastLayout" in $$props) $$invalidate(13, lastLayout = $$props.lastLayout);
    		if ("remainingLayouts" in $$props) $$invalidate(5, remainingLayouts = $$props.remainingLayouts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isDecorator, Decorator, layouts*/ 4610) {
    			 if (isDecorator) {
    				const decoratorLayout = {
    					component: () => Decorator,
    					path: `${layouts[0].path}__decorator`,
    					isDecorator: true
    				};

    				$$invalidate(9, layouts = [decoratorLayout, ...layouts]);
    			}
    		}

    		if ($$self.$$.dirty & /*layouts*/ 512) {
    			 $$invalidate(4, [layout, ...remainingLayouts] = layouts, layout, ((($$invalidate(5, remainingLayouts), $$invalidate(9, layouts)), $$invalidate(12, isDecorator)), $$invalidate(1, Decorator)));
    		}

    		if ($$self.$$.dirty & /*lastLayout, layout*/ 8208) {
    			 layoutIsUpdated = !lastLayout || lastLayout.path !== layout.path;
    		}

    		if ($$self.$$.dirty & /*layout*/ 16) {
    			 setComponent(layout);
    		}
    	};

    	return [
    		scoped,
    		Decorator,
    		scopedSync,
    		parentElement,
    		layout,
    		remainingLayouts,
    		$context,
    		context,
    		setParent,
    		layouts,
    		childOfDecorator
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			layouts: 9,
    			scoped: 0,
    			Decorator: 1,
    			childOfDecorator: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get layouts() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layouts(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scoped() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scoped(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Decorator() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Decorator(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childOfDecorator() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childOfDecorator(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const { _hooks } = beforeUrlChange;

    function init$1(routes, callback) {
      /** @type { ClientNode | false } */
      let lastRoute = false;

      function updatePage(proxyToUrl, shallow) {
        const currentUrl = window.location.pathname;
        const url = proxyToUrl || currentUrl;

        const route$1 = urlToRoute(url, routes);
        const currentRoute = shallow && urlToRoute(currentUrl, routes);
        const contextRoute = currentRoute || route$1;
        const layouts = [...contextRoute.layouts, route$1];
        if (lastRoute) delete lastRoute.last; //todo is a page component the right place for the previous route?
        route$1.last = lastRoute;
        lastRoute = route$1;

        //set the route in the store
        if (!proxyToUrl)
          urlRoute.set(route$1);
        route.set(route$1);

        //run callback in Router.svelte
        callback(layouts);
      }

      const destroy = createEventListeners(updatePage);

      return { updatePage, destroy }
    }

    /**
     * svelte:window events doesn't work on refresh
     * @param {Function} updatePage
     */
    function createEventListeners(updatePage) {
    ['pushState', 'replaceState'].forEach(eventName => {
        const fn = history[eventName];
        history[eventName] = async function (state = {}, title, url) {
          const { id, path, params } = get_store_value(route);
          state = { id, path, params, ...state };
          const event = new Event(eventName.toLowerCase());
          Object.assign(event, { state, title, url });

          if (await runHooksBeforeUrlChange(event)) {
            fn.apply(this, [state, title, url]);
            return dispatchEvent(event)
          }
        };
      });

      let _ignoreNextPop = false;

      const listeners = {
        click: handleClick,
        pushstate: () => updatePage(),
        replacestate: () => updatePage(),
        popstate: async event => {
          if (_ignoreNextPop)
            _ignoreNextPop = false;
          else {
            if (await runHooksBeforeUrlChange(event)) {
              updatePage();
            } else {
              _ignoreNextPop = true;
              event.preventDefault();
              history.go(1);
            }
          }
        },
      };

      Object.entries(listeners).forEach(args => addEventListener(...args));

      const unregister = () => {
        Object.entries(listeners).forEach(args => removeEventListener(...args));
      };

      return unregister
    }

    function handleClick(event) {
      const el = event.target.closest('a');
      const href = el && el.getAttribute('href');

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button ||
        event.defaultPrevented
      )
        return
      if (!href || el.target || el.host !== location.host) return

      event.preventDefault();
      history.pushState({}, '', href);
    }

    async function runHooksBeforeUrlChange(event) {
      const route$1 = get_store_value(route);
      for (const hook of _hooks.filter(Boolean)) {
        // return false if the hook returns false
        if (await !hook(event, route$1)) return false //todo remove route from hook. Its API Can be accessed as $page
      }
      return true
    }

    function urlToRoute(url, routes) {
      const basepath$1 = get_store_value(basepath);
      const route = routes.find(route => url.match(`^${basepath$1}${route.regex}`));
      if (!route)
        throw new Error(
          `Route could not be found. Make sure ${url}.svelte or ${url}/index.svelte exists. A restart may be required.`
        )

      const [, base, path] = url.match(`^(${get_store_value(basepath)})(${route.regex})`);
      if (defaultConfig.queryHandler)
        route.params = defaultConfig.queryHandler.parse(window.location.search);

      if (route.paramKeys) {
        const layouts = layoutByPos(route.layouts);
        const fragments = path.split('/').filter(Boolean);
        const routeProps = getRouteProps(route.path);

        routeProps.forEach((prop, i) => {
          if (prop) {
            const fragment = decodeURI(fragments[i]);
            route.params[prop] = fragment;
            if (layouts[i]) layouts[i].param = { [prop]: fragment };
            else route.param = { [prop]: fragment };
          }
        });
      }

      route.leftover = url.replace(new RegExp(base + route.regex), '');

      return route
    }

    /**
     *
     * @param {array} layouts
     */
    function layoutByPos(layouts) {
      const arr = [];
      layouts.forEach(layout => {
        arr[layout.path.split('/').filter(Boolean).length - 1] = layout;
      });
      return arr
    }

    /**
     *
     * @param {string} url
     */
    function getRouteProps(url) {
      return url
        .split('/')
        .filter(Boolean)
        .map(f => f.match(/\:(.+)/))
        .map(f => f && f[1])
    }

    /* node_modules/@sveltech/routify/runtime/Router.svelte generated by Svelte v3.23.2 */

    const { Object: Object_1 } = globals;

    // (63:0) {#if layouts && $route !== null}
    function create_if_block$1(ctx) {
    	let route_1;
    	let current;

    	route_1 = new Route({
    			props: { layouts: /*layouts*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_1_changes = {};
    			if (dirty & /*layouts*/ 1) route_1_changes.layouts = /*layouts*/ ctx[0];
    			route_1.$set(route_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(63:0) {#if layouts && $route !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*layouts*/ ctx[0] && /*$route*/ ctx[1] !== null && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*layouts*/ ctx[0] && /*$route*/ ctx[1] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*layouts, $route*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $route;
    	validate_store(route, "route");
    	component_subscribe($$self, route, $$value => $$invalidate(1, $route = $$value));
    	let { routes: routes$1 } = $$props;
    	let { config = {} } = $$props;
    	let layouts;
    	let navigator;

    	Object.entries(config).forEach(([key, value]) => {
    		defaultConfig[key] = value;
    	});

    	suppressWarnings();

    	if (!window.routify) {
    		window.routify = {};
    	}

    	const updatePage = (...args) => navigator && navigator.updatePage(...args);
    	setContext("routifyupdatepage", updatePage);
    	const callback = res => $$invalidate(0, layouts = res);

    	const cleanup = () => {
    		if (!navigator) return;
    		navigator.destroy();
    		navigator = null;
    	};

    	let initTimeout = null;

    	// init is async to prevent a horrible bug that completely disable reactivity
    	// in the host component -- something like the component's update function is
    	// called before its fragment is created, and since the component is then seen
    	// as already dirty, it is never scheduled for update again, and remains dirty
    	// forever... I failed to isolate the precise conditions for the bug, but the
    	// faulty update is triggered by a change in the route store, and so offseting
    	// store initialization by one tick gives the host component some time to
    	// create its fragment. The root cause it probably a bug in Svelte with deeply
    	// intertwinned store and reactivity.
    	const doInit = () => {
    		clearTimeout(initTimeout);

    		initTimeout = setTimeout(() => {
    			cleanup();
    			navigator = init$1(routes$1, callback);
    			routes.set(routes$1);
    			navigator.updatePage();
    		});
    	};

    	onDestroy(cleanup);
    	const writable_props = ["routes", "config"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes$1 = $$props.routes);
    		if ("config" in $$props) $$invalidate(3, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onDestroy,
    		Route,
    		init: init$1,
    		route,
    		routesStore: routes,
    		suppressWarnings,
    		defaultConfig,
    		routes: routes$1,
    		config,
    		layouts,
    		navigator,
    		updatePage,
    		callback,
    		cleanup,
    		initTimeout,
    		doInit,
    		$route
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes$1 = $$props.routes);
    		if ("config" in $$props) $$invalidate(3, config = $$props.config);
    		if ("layouts" in $$props) $$invalidate(0, layouts = $$props.layouts);
    		if ("navigator" in $$props) navigator = $$props.navigator;
    		if ("initTimeout" in $$props) initTimeout = $$props.initTimeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*routes*/ 4) {
    			 if (routes$1) doInit();
    		}
    	};

    	return [layouts, $route, routes$1, config];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { routes: 2, config: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*routes*/ ctx[2] === undefined && !("routes" in props)) {
    			console.warn("<Router> was created without expected prop 'routes'");
    		}
    	}

    	get routes() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get config() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /** 
     * Node payload
     * @typedef {Object} NodePayload
     * @property {RouteNode=} file current node
     * @property {RouteNode=} parent parent of the current node
     * @property {StateObject=} state state shared by every node in the walker
     * @property {Object=} scope scope inherited by descendants in the scope
     *
     * State Object
     * @typedef {Object} StateObject
     * @prop {TreePayload=} treePayload payload from the tree
     * 
     * Node walker proxy
     * @callback NodeWalkerProxy
     * @param {NodePayload} NodePayload
     */


    /**
     * Node middleware
     * @description Walks through the nodes of a tree
     * @example middleware = createNodeMiddleware(payload => {payload.file.name = 'hello'})(treePayload))
     * @param {NodeWalkerProxy} fn 
     */
    function createNodeMiddleware(fn) {

        /**    
         * NodeMiddleware payload receiver
         * @param {TreePayload} payload
         */
        const inner = async function execute(payload) {
            return await nodeMiddleware(payload.tree, fn, { state: { treePayload: payload } })
        };

        /**    
         * NodeMiddleware sync payload receiver
         * @param {TreePayload} payload
         */
        inner.sync = function executeSync(payload) {
            return nodeMiddlewareSync(payload.tree, fn, { state: { treePayload: payload } })
        };

        return inner
    }

    /**
     * Node walker
     * @param {Object} file mutable file
     * @param {NodeWalkerProxy} fn function to be called for each file
     * @param {NodePayload=} payload 
     */
    async function nodeMiddleware(file, fn, payload) {
        const { state, scope, parent } = payload || {};
        payload = {
            file,
            parent,
            state: state || {},            //state is shared by all files in the walk
            scope: clone(scope || {}),     //scope is inherited by descendants
        };

        await fn(payload);

        if (file.children) {
            payload.parent = file;
            await Promise.all(file.children.map(_file => nodeMiddleware(_file, fn, payload)));
        }
        return payload
    }

    /**
     * Node walker (sync version)
     * @param {Object} file mutable file
     * @param {NodeWalkerProxy} fn function to be called for each file
     * @param {NodePayload=} payload 
     */
    function nodeMiddlewareSync(file, fn, payload) {
        const { state, scope, parent } = payload || {};
        payload = {
            file,
            parent,
            state: state || {},            //state is shared by all files in the walk
            scope: clone(scope || {}),     //scope is inherited by descendants
        };

        fn(payload);

        if (file.children) {
            payload.parent = file;
            file.children.map(_file => nodeMiddlewareSync(_file, fn, payload));
        }
        return payload
    }


    /**
     * Clone with JSON
     * @param {T} obj 
     * @returns {T} JSON cloned object
     * @template T
     */
    function clone(obj) { return JSON.parse(JSON.stringify(obj)) }



    var middleware = { createNodeMiddleware, nodeMiddleware };
    var middleware_1 = middleware.createNodeMiddleware;

    const setRegex = middleware_1(({ file }) => {
        if (file.isPage || file.isFallback)
            file.regex = pathToRegex(file.path, file.isFallback);
    });
    const setParamKeys = middleware_1(({ file }) => {
        file.paramKeys = pathToParams(file.path);
    });

    const setShortPath = middleware_1(({ file }) => {
        if (file.isFallback || file.isIndex)
            file.shortPath = file.path.replace(/\/[^/]+$/, '');
        else file.shortPath = file.path;
    });
    const setRank = middleware_1(({ file }) => {
        file.ranking = pathToRank(file);
    });


    // todo delete?
    const addMetaChildren = middleware_1(({ file }) => {
        const node = file;
        const metaChildren = file.meta && file.meta.children || [];
        if (metaChildren.length) {
            node.children = node.children || [];
            node.children.push(...metaChildren.map(meta => ({ isMeta: true, ...meta, meta })));
        }
    });

    const setIsIndexable = middleware_1(payload => {
        const { file } = payload;
        const { isLayout, isFallback, meta } = file;
        file.isIndexable = !isLayout && !isFallback && meta.index !== false;
        file.isNonIndexable = !file.isIndexable;
    });


    const assignRelations = middleware_1(({ file, parent }) => {
        Object.defineProperty(file, 'parent', { get: () => parent });
        Object.defineProperty(file, 'nextSibling', { get: () => _getSibling(file, 1) });
        Object.defineProperty(file, 'prevSibling', { get: () => _getSibling(file, -1) });
        Object.defineProperty(file, 'lineage', { get: () => _getLineage(parent) });
    });

    function _getLineage(node, lineage = []){
        if(node){
            lineage.unshift(node);
            _getLineage(node.parent, lineage);
        }
        return lineage
    }

    /**
     * 
     * @param {RouteNode} file 
     * @param {Number} direction 
     */
    function _getSibling(file, direction) {
        if (!file.root) {
            const siblings = file.parent.children.filter(c => c.isIndexable);
            const index = siblings.indexOf(file);
            return siblings[index + direction]
        }
    }

    const assignIndex = middleware_1(({ file, parent }) => {
        if (file.isIndex) Object.defineProperty(parent, 'index', { get: () => file });
        if (file.isLayout)
            Object.defineProperty(parent, 'layout', { get: () => file });
    });

    const assignLayout = middleware_1(({ file, scope }) => {
        Object.defineProperty(file, 'layouts', { get: () => getLayouts(file) });
        function getLayouts(file) {
            const { parent } = file;
            const layout = parent && parent.layout;
            const isReset = layout && layout.isReset;
            const layouts = (parent && !isReset && getLayouts(parent)) || [];
            if (layout) layouts.push(layout);
            return layouts
        }
    });


    const createFlatList = treePayload => {
        middleware_1(payload => {
            if (payload.file.isPage || payload.file.isFallback)
            payload.state.treePayload.routes.push(payload.file);
        }).sync(treePayload);    
        treePayload.routes.sort((c, p) => (c.ranking >= p.ranking ? -1 : 1));
    };

    const setPrototype = middleware_1(({ file }) => {
        const Prototype = file.root
            ? Root
            : file.children
                ? file.isFile ? PageDir : Dir
                : file.isReset
                    ? Reset
                    : file.isLayout
                        ? Layout
                        : file.isFallback
                            ? Fallback
                            : Page;
        Object.setPrototypeOf(file, Prototype.prototype);

        function Layout() { }
        function Dir() { }
        function Fallback() { }
        function Page() { }
        function PageDir() { }
        function Reset() { }
        function Root() { }
    });

    var miscPlugins = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setRegex: setRegex,
        setParamKeys: setParamKeys,
        setShortPath: setShortPath,
        setRank: setRank,
        addMetaChildren: addMetaChildren,
        setIsIndexable: setIsIndexable,
        assignRelations: assignRelations,
        assignIndex: assignIndex,
        assignLayout: assignLayout,
        createFlatList: createFlatList,
        setPrototype: setPrototype
    });

    const assignAPI = middleware_1(({ file }) => {
        file.api = new ClientApi(file);
    });

    class ClientApi {
        constructor(file) {
            this.__file = file;
            Object.defineProperty(this, '__file', { enumerable: false });
            this.isMeta = !!file.isMeta;
            this.path = file.path;
            this.title = _prettyName(file);
            this.meta = file.meta;
        }

        get parent() { return !this.__file.root && this.__file.parent.api }
        get children() {
            return (this.__file.children || this.__file.isLayout && this.__file.parent.children || [])
                .filter(c => !c.isNonIndexable)
                .sort((a, b) => {
                    if(a.isMeta && b.isMeta) return 0
                    a = (a.meta.index || a.meta.title || a.path).toString();
                    b = (b.meta.index || b.meta.title || b.path).toString();
                    return a.localeCompare((b), undefined, { numeric: true, sensitivity: 'base' })
                })
                .map(({ api }) => api)
        }
        get next() { return _navigate(this, +1) }
        get prev() { return _navigate(this, -1) }
    }

    function _navigate(node, direction) {
        if (!node.__file.root) {
            const siblings = node.parent.children;
            const index = siblings.indexOf(node);
            return node.parent.children[index + direction]
        }
    }


    function _prettyName(file) {
        if (typeof file.meta.title !== 'undefined') return file.meta.title
        else return (file.shortPath || file.path)
            .split('/')
            .pop()
            .replace(/-/g, ' ')
    }

    const plugins = {...miscPlugins, assignAPI};

    function buildClientTree(tree) {
      const order = [
        // pages
        "setParamKeys", //pages only
        "setRegex", //pages only
        "setShortPath", //pages only
        "setRank", //pages only
        "assignLayout", //pages only,
        // all
        "setPrototype",
        "addMetaChildren",
        "assignRelations", //all (except meta components?)
        "setIsIndexable", //all
        "assignIndex", //all
        "assignAPI", //all
        // routes
        "createFlatList"
      ];

      const payload = { tree, routes: [] };
      for (let name of order) {
        const syncFn = plugins[name].sync || plugins[name];
        syncFn(payload);
      }
      return payload
    }

    /* src/pages/_fallback.svelte generated by Svelte v3.23.2 */
    const file$1 = "src/pages/_fallback.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let a;
    	let t3;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "404";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Page not found. \n  \n  ");
    			a = element("a");
    			t3 = text("Go back");
    			attr_dev(div0, "class", "huge svelte-viq1pm");
    			add_location(div0, file$1, 18, 2, 268);
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0]("../"));
    			add_location(a, file$1, 21, 2, 391);
    			attr_dev(div1, "class", "big");
    			add_location(div1, file$1, 19, 2, 298);
    			attr_dev(div2, "class", "e404 svelte-viq1pm");
    			add_location(div2, file$1, 17, 0, 247);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, a);
    			append_dev(a, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0]("../"))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $url;
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Fallback> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Fallback", $$slots, []);
    	$$self.$capture_state = () => ({ url, $url });
    	return [$url];
    }

    class Fallback extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fallback",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/SiteBrand.svelte generated by Svelte v3.23.2 */
    const file$2 = "src/components/SiteBrand.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let a;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h106.8v94.135H0z");
    			attr_dev(path0, "class", "svelte-1230ble");
    			add_location(path0, file$2, 696, 12, 14305);
    			attr_dev(path1, "fill", "#000");
    			attr_dev(path1, "d", "M106.057 46.481l-26.25 45.466h-52.5l26.25-45.466h52.5zM79.807 1.015L53.557 46.48h-52.5l26.25-45.466h52.5z");
    			attr_dev(path1, "class", "svelte-1230ble");
    			add_location(path1, file$2, 697, 12, 14363);
    			attr_dev(path2, "d", "M79.807 1.015l26.25 45.466-26.25 45.467-26.25-45.467 26.25-45.466zM27.307 1.015l26.25 45.466-26.25 45.467L1.058 46.48l26.25-45.466z");
    			attr_dev(path2, "class", "svelte-1230ble");
    			add_location(path2, file$2, 699, 12, 14522);
    			attr_dev(svg, "class", "logo-hexa-2 svelte-1230ble");
    			attr_dev(svg, "viewBox", "0 0 105 91");
    			add_location(svg, file$2, 695, 8, 14246);
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0](/*home*/ ctx[1]));
    			attr_dev(a, "class", "SiteBrand svelte-1230ble");
    			attr_dev(a, "alt", "Brand Logo");
    			add_location(a, file$2, 694, 4, 14179);
    			attr_dev(div, "class", "svelte-1230ble");
    			add_location(div, file$2, 693, 0, 14169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0](/*home*/ ctx[1]))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $url;
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
    	let home = "/";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SiteBrand> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SiteBrand", $$slots, []);
    	$$self.$capture_state = () => ({ url, home, $url });

    	$$self.$inject_state = $$props => {
    		if ("home" in $$props) $$invalidate(1, home = $$props.home);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$url, home];
    }

    class SiteBrand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SiteBrand",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Nav.svelte generated by Svelte v3.23.2 */
    const file$3 = "src/Nav.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i][0];
    	child_ctx[6] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i][0];
    	child_ctx[6] = list[i][1];
    	return child_ctx;
    }

    // (744:4) {#each _linksLeft as [path, name]}
    function create_each_block_1$1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*name*/ ctx[6] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0](/*path*/ ctx[5]));
    			attr_dev(a, "class", "svelte-bgmfyc");
    			toggle_class(a, "selected", /*$isActive*/ ctx[1](/*path*/ ctx[5]));
    			add_location(a, file$3, 745, 6, 15030);
    			attr_dev(li, "class", "svelte-bgmfyc");
    			add_location(li, file$3, 744, 4, 15019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0](/*path*/ ctx[5]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, _linksLeft*/ 6) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[1](/*path*/ ctx[5]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(744:4) {#each _linksLeft as [path, name]}",
    		ctx
    	});

    	return block;
    }

    // (756:4) {#each _linksRight as [path, name]}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*name*/ ctx[6] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0](/*path*/ ctx[5]));
    			attr_dev(a, "class", "svelte-bgmfyc");
    			toggle_class(a, "selected", /*$isActive*/ ctx[1](/*path*/ ctx[5]));
    			add_location(a, file$3, 757, 6, 15274);
    			attr_dev(li, "class", "svelte-bgmfyc");
    			add_location(li, file$3, 756, 4, 15263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0](/*path*/ ctx[5]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, _linksRight*/ 10) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[1](/*path*/ ctx[5]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(756:4) {#each _linksRight as [path, name]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let nav;
    	let ul0;
    	let t0;
    	let div;
    	let sitebrand;
    	let t1;
    	let ul1;
    	let current;
    	let each_value_1 = /*_linksLeft*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	sitebrand = new SiteBrand({ $$inline: true });
    	let each_value = /*_linksRight*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			create_component(sitebrand.$$.fragment);
    			t1 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul0, "class", "NavBar__left svelte-bgmfyc");
    			add_location(ul0, file$3, 742, 2, 14950);
    			attr_dev(div, "class", "NavBar__center svelte-bgmfyc");
    			add_location(div, file$3, 750, 2, 15134);
    			attr_dev(ul1, "class", "NavBar__right svelte-bgmfyc");
    			add_location(ul1, file$3, 754, 2, 15192);
    			attr_dev(nav, "class", "NavBar svelte-bgmfyc");
    			add_location(nav, file$3, 741, 0, 14927);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul0, null);
    			}

    			append_dev(nav, t0);
    			append_dev(nav, div);
    			mount_component(sitebrand, div, null);
    			append_dev(nav, t1);
    			append_dev(nav, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$url, _linksLeft, $isActive*/ 7) {
    				each_value_1 = /*_linksLeft*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*$url, _linksRight, $isActive*/ 11) {
    				each_value = /*_linksRight*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sitebrand.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sitebrand.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks_1, detaching);
    			destroy_component(sitebrand);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $url;
    	let $isActive;
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
    	validate_store(isActive, "isActive");
    	component_subscribe($$self, isActive, $$value => $$invalidate(1, $isActive = $$value));
    	const _linksLeft = [["./about", "TODH"], ["./styleguide", "LAB"]];
    	const _linksRight = [["./products", "Artifacts"], ["./blog", "Blog"]];

    	// let showControls = false;
    	// const toggleControls = () => (showControls = !showControls);
    	let y;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Nav", $$slots, []);

    	$$self.$capture_state = () => ({
    		url,
    		isActive,
    		SiteBrand,
    		_linksLeft,
    		_linksRight,
    		y,
    		$url,
    		$isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("y" in $$props) y = $$props.y;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$url, $isActive, _linksLeft, _linksRight];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/SiteFooter.svelte generated by Svelte v3.23.2 */

    const file$4 = "src/components/SiteFooter.svelte";

    function create_fragment$5(ctx) {
    	let footer;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let p;
    	let strong;
    	let t2;
    	let t3;
    	let ul;
    	let li;
    	let a0;
    	let svg0;
    	let title0;
    	let t4;
    	let circle;
    	let path0;
    	let path1;
    	let t5;
    	let a1;
    	let svg1;
    	let title1;
    	let t6;
    	let path2;
    	let t7;
    	let a2;
    	let svg2;
    	let title2;
    	let t8;
    	let path3;
    	let t9;
    	let a3;
    	let svg3;
    	let title3;
    	let t10;
    	let path4;
    	let t11;
    	let a4;
    	let svg4;
    	let title4;
    	let t12;
    	let path5;
    	let t13;
    	let a5;
    	let svg5;
    	let title5;
    	let t14;
    	let path6;
    	let t15;
    	let a6;
    	let svg6;
    	let title6;
    	let t16;
    	let rect;
    	let polygon;
    	let t17;
    	let div2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "Sergio Forés";
    			t2 = text("\n      es artista plástico y diseñador. Le encanta prototipar en el navegador usando Sass, CSS-Grid, SvelteJS, etc, pero\n      también plasmar ideas en cuadros 3D y re(li)garlo TODO desde una visión/percepción holística que denomina TODH.");
    			t3 = space();
    			ul = element("ul");
    			li = element("li");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			title0 = svg_element("title");
    			t4 = text("logo instagram");
    			circle = svg_element("circle");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t5 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			title1 = svg_element("title");
    			t6 = text("logo linkedin");
    			path2 = svg_element("path");
    			t7 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			title2 = svg_element("title");
    			t8 = text("logo medium");
    			path3 = svg_element("path");
    			t9 = space();
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			title3 = svg_element("title");
    			t10 = text("logo twitter");
    			path4 = svg_element("path");
    			t11 = space();
    			a4 = element("a");
    			svg4 = svg_element("svg");
    			title4 = svg_element("title");
    			t12 = text("logo github");
    			path5 = svg_element("path");
    			t13 = space();
    			a5 = element("a");
    			svg5 = svg_element("svg");
    			title5 = svg_element("title");
    			t14 = text("logo facebook");
    			path6 = svg_element("path");
    			t15 = space();
    			a6 = element("a");
    			svg6 = svg_element("svg");
    			title6 = svg_element("title");
    			t16 = text("logo medium");
    			rect = svg_element("rect");
    			polygon = svg_element("polygon");
    			t17 = space();
    			div2 = element("div");
    			if (img.src !== (img_src_value = "/img/avatar.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sergio Forés avatar");
    			attr_dev(img, "class", "BioAvatar svelte-stdhtz");
    			add_location(img, file$4, 727, 4, 14950);
    			attr_dev(div0, "class", "Avatar svelte-stdhtz");
    			add_location(div0, file$4, 726, 2, 14925);
    			attr_dev(strong, "class", "svelte-stdhtz");
    			add_location(strong, file$4, 732, 6, 15068);
    			attr_dev(p, "class", "svelte-stdhtz");
    			add_location(p, file$4, 731, 4, 15058);
    			attr_dev(div1, "class", "Bio svelte-stdhtz");
    			add_location(div1, file$4, 730, 2, 15036);
    			attr_dev(title0, "class", "svelte-stdhtz");
    			add_location(title0, file$4, 742, 10, 15547);
    			attr_dev(circle, "fill", "#111111");
    			attr_dev(circle, "cx", "12.145");
    			attr_dev(circle, "cy", "3.892");
    			attr_dev(circle, "r", "0.96");
    			attr_dev(circle, "class", "svelte-stdhtz");
    			add_location(circle, file$4, 743, 10, 15587);
    			attr_dev(path0, "d", "M8,12c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S10.206,12,8,12z\n                M8,6C6.897,6,6,6.897,6,8\n                s0.897,2,2,2s2-0.897,2-2S9.103,6,8,6z");
    			attr_dev(path0, "class", "svelte-stdhtz");
    			add_location(path0, file$4, 744, 10, 15655);
    			attr_dev(path1, "d", "M12,16H4c-2.056,0-4-1.944-4-4V4c0-2.056,1.944-4,4-4h8c2.056,0,4,1.944,4,4v8C16,14.056,14.056,16,12,16z\n                M4,2C3.065,2,2,3.065,2,4v8c0,0.953,1.047,2,2,2h8c0.935,0,2-1.065,2-2V4c0-0.935-1.065-2-2-2H4z");
    			attr_dev(path1, "class", "svelte-stdhtz");
    			add_location(path1, file$4, 747, 10, 15840);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 16 16");
    			attr_dev(svg0, "class", "svelte-stdhtz");
    			add_location(svg0, file$4, 741, 8, 15476);
    			attr_dev(a0, "href", "https://www.instagram.com/t.o.d.h/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener");
    			attr_dev(a0, "class", "svelte-stdhtz");
    			add_location(a0, file$4, 740, 6, 15391);
    			attr_dev(title1, "class", "svelte-stdhtz");
    			add_location(title1, file$4, 753, 10, 16260);
    			attr_dev(path2, "d", "M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16h14.7c0.4,0,0.7-0.3,0.7-0.7V0.7\n                C16,0.3,15.7,0,15.3,0z M4.7,13.6H2.4V6h2.4V13.6z\n                M3.6,5C2.8,5,2.2,4.3,2.2,3.6c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4\n                C4.9,4.3,4.3,5,3.6,5z\n                M13.6,13.6h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6h2.3v1h0c0.3-0.6,1.1-1.2,2.2-1.2\n                c2.4,0,2.8,1.6,2.8,3.6V13.6z");
    			attr_dev(path2, "class", "svelte-stdhtz");
    			add_location(path2, file$4, 754, 10, 16299);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 16 16");
    			attr_dev(svg1, "class", "svelte-stdhtz");
    			add_location(svg1, file$4, 752, 8, 16189);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/sergiofores/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener");
    			attr_dev(a1, "class", "svelte-stdhtz");
    			add_location(a1, file$4, 751, 6, 16098);
    			attr_dev(title2, "class", "svelte-stdhtz");
    			add_location(title2, file$4, 764, 10, 16927);
    			attr_dev(path3, "d", "M15,0H1A1,1,0,0,0,0,1V15a1,1,0,0,0,1,1H15a1,1,0,0,0,1-1V1A1,1,0,0,0,15,0ZM13.292,3.791l-.858.823a.251.251,0,0,0-.1.241V10.9a.251.251,0,0,0,.1.241l.838.823v.181H9.057v-.181l.868-.843c.085-.085.085-.11.085-.241V5.993L7.6,12.124H7.271l-2.81-6.13V10.1a.567.567,0,0,0,.156.472l1.129,1.37v.181h-3.2v-.181l1.129-1.37a.547.547,0,0,0,.146-.472V5.351A.416.416,0,0,0,3.683,5l-1-1.209V3.61H5.8L8.2,8.893,10.322,3.61h2.971Z");
    			attr_dev(path3, "class", "svelte-stdhtz");
    			add_location(path3, file$4, 765, 10, 16964);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 16 16");
    			attr_dev(svg2, "class", "svelte-stdhtz");
    			add_location(svg2, file$4, 763, 8, 16856);
    			attr_dev(a2, "href", "https://medium.com/@todh");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener");
    			attr_dev(a2, "class", "svelte-stdhtz");
    			add_location(a2, file$4, 762, 6, 16781);
    			attr_dev(title3, "class", "svelte-stdhtz");
    			add_location(title3, file$4, 771, 10, 17584);
    			attr_dev(path4, "d", "M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1\n                C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7\n                c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3\n                c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z");
    			attr_dev(path4, "class", "svelte-stdhtz");
    			add_location(path4, file$4, 772, 10, 17622);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 16 16");
    			attr_dev(svg3, "class", "svelte-stdhtz");
    			add_location(svg3, file$4, 770, 8, 17513);
    			attr_dev(a3, "href", "https://twitter.com/t0tinspire");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener");
    			attr_dev(a3, "class", "svelte-stdhtz");
    			add_location(a3, file$4, 769, 6, 17432);
    			attr_dev(title4, "class", "svelte-stdhtz");
    			add_location(title4, file$4, 781, 10, 18330);
    			attr_dev(path5, "fill-rule", "evenodd");
    			attr_dev(path5, "clip-rule", "evenodd");
    			attr_dev(path5, "d", "M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6\n                C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5\n                c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1\n                c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8\n                c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2\n                c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z");
    			attr_dev(path5, "class", "svelte-stdhtz");
    			add_location(path5, file$4, 782, 10, 18367);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 16 16");
    			attr_dev(svg4, "class", "svelte-stdhtz");
    			add_location(svg4, file$4, 780, 8, 18259);
    			attr_dev(a4, "href", "https://github.com/t0t");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener");
    			attr_dev(a4, "class", "svelte-stdhtz");
    			add_location(a4, file$4, 779, 6, 18186);
    			attr_dev(title5, "class", "svelte-stdhtz");
    			add_location(title5, file$4, 792, 10, 19268);
    			attr_dev(path6, "d", "M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3\n                c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z");
    			attr_dev(path6, "class", "svelte-stdhtz");
    			add_location(path6, file$4, 793, 10, 19307);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "viewBox", "0 0 16 16");
    			attr_dev(svg5, "class", "svelte-stdhtz");
    			add_location(svg5, file$4, 791, 8, 19197);
    			attr_dev(a5, "href", "https://www.facebook.com/TODH-2139705836275088");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noopener");
    			attr_dev(a5, "class", "svelte-stdhtz");
    			add_location(a5, file$4, 790, 6, 19100);
    			attr_dev(title6, "class", "svelte-stdhtz");
    			add_location(title6, file$4, 800, 10, 19721);
    			attr_dev(rect, "x", "5");
    			attr_dev(rect, "width", "6");
    			attr_dev(rect, "height", "4.5");
    			attr_dev(rect, "class", "svelte-stdhtz");
    			add_location(rect, file$4, 801, 10, 19758);
    			attr_dev(polygon, "points", "11 7 16 7 16 16 0 16 0 7 5 7 5 11.5 11 11.5 11 7");
    			attr_dev(polygon, "class", "svelte-stdhtz");
    			add_location(polygon, file$4, 802, 10, 19806);
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "viewBox", "0 0 16 16");
    			attr_dev(svg6, "class", "svelte-stdhtz");
    			add_location(svg6, file$4, 799, 8, 19650);
    			attr_dev(a6, "href", "https://unsplash.com/@todh");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener");
    			attr_dev(a6, "class", "svelte-stdhtz");
    			add_location(a6, file$4, 798, 6, 19573);
    			attr_dev(li, "class", "svelte-stdhtz");
    			add_location(li, file$4, 739, 4, 15380);
    			attr_dev(ul, "class", "Links svelte-stdhtz");
    			add_location(ul, file$4, 738, 2, 15357);
    			attr_dev(div2, "class", "Player svelte-stdhtz");
    			add_location(div2, file$4, 808, 2, 19923);
    			attr_dev(footer, "class", "Main__footer svelte-stdhtz");
    			add_location(footer, file$4, 724, 0, 14892);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div0);
    			append_dev(div0, img);
    			append_dev(footer, t0);
    			append_dev(footer, div1);
    			append_dev(div1, p);
    			append_dev(p, strong);
    			append_dev(p, t2);
    			append_dev(footer, t3);
    			append_dev(footer, ul);
    			append_dev(ul, li);
    			append_dev(li, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, title0);
    			append_dev(title0, t4);
    			append_dev(svg0, circle);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(li, t5);
    			append_dev(li, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, title1);
    			append_dev(title1, t6);
    			append_dev(svg1, path2);
    			append_dev(li, t7);
    			append_dev(li, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, title2);
    			append_dev(title2, t8);
    			append_dev(svg2, path3);
    			append_dev(li, t9);
    			append_dev(li, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, title3);
    			append_dev(title3, t10);
    			append_dev(svg3, path4);
    			append_dev(li, t11);
    			append_dev(li, a4);
    			append_dev(a4, svg4);
    			append_dev(svg4, title4);
    			append_dev(title4, t12);
    			append_dev(svg4, path5);
    			append_dev(li, t13);
    			append_dev(li, a5);
    			append_dev(a5, svg5);
    			append_dev(svg5, title5);
    			append_dev(title5, t14);
    			append_dev(svg5, path6);
    			append_dev(li, t15);
    			append_dev(li, a6);
    			append_dev(a6, svg6);
    			append_dev(svg6, title6);
    			append_dev(title6, t16);
    			append_dev(svg6, rect);
    			append_dev(svg6, polygon);
    			append_dev(footer, t17);
    			append_dev(footer, div2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SiteFooter> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SiteFooter", $$slots, []);
    	return [];
    }

    class SiteFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SiteFooter",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/VanishingHeader.svelte generated by Svelte v3.23.2 */

    const file$5 = "src/components/VanishingHeader.svelte";

    function create_fragment$6(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let div;
    	let div_class_value;
    	let setTransitionDuration_action;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[8]);
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*headerClass*/ ctx[0]) + " svelte-1fhdaqd"));
    			add_location(div, file$5, 717, 2, 14497);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[8]();
    					}),
    					action_destroyer(setTransitionDuration_action = /*setTransitionDuration*/ ctx[2].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*y*/ ctx[1]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*headerClass*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*headerClass*/ ctx[0]) + " svelte-1fhdaqd"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { duration = "300ms" } = $$props;
    	let { offset = 0 } = $$props;
    	let { tolerance = 0 } = $$props;
    	let headerClass = "show";
    	let y = 0;
    	let lastY = 0;

    	function deriveClass(y, dy) {
    		if (y < offset) {
    			return "show";
    		}

    		if (Math.abs(dy) <= tolerance) {
    			return headerClass;
    		}

    		if (dy < 0) {
    			return "show";
    		}

    		return "hide";
    	}

    	function updateClass(y) {
    		const dy = lastY - y;
    		lastY = y;
    		return deriveClass(y, dy);
    	}

    	function setTransitionDuration(node) {
    		node.style.transitionDuration = duration;
    	}

    	const writable_props = ["duration", "offset", "tolerance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VanishingHeader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("VanishingHeader", $$slots, ['default']);

    	function onwindowscroll() {
    		$$invalidate(1, y = window.pageYOffset);
    	}

    	$$self.$set = $$props => {
    		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
    		if ("offset" in $$props) $$invalidate(4, offset = $$props.offset);
    		if ("tolerance" in $$props) $$invalidate(5, tolerance = $$props.tolerance);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		duration,
    		offset,
    		tolerance,
    		headerClass,
    		y,
    		lastY,
    		deriveClass,
    		updateClass,
    		setTransitionDuration
    	});

    	$$self.$inject_state = $$props => {
    		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
    		if ("offset" in $$props) $$invalidate(4, offset = $$props.offset);
    		if ("tolerance" in $$props) $$invalidate(5, tolerance = $$props.tolerance);
    		if ("headerClass" in $$props) $$invalidate(0, headerClass = $$props.headerClass);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("lastY" in $$props) lastY = $$props.lastY;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*y*/ 2) {
    			 $$invalidate(0, headerClass = updateClass(y));
    		}
    	};

    	return [
    		headerClass,
    		y,
    		setTransitionDuration,
    		duration,
    		offset,
    		tolerance,
    		$$scope,
    		$$slots,
    		onwindowscroll
    	];
    }

    class VanishingHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { duration: 3, offset: 4, tolerance: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VanishingHeader",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get duration() {
    		throw new Error("<VanishingHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<VanishingHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<VanishingHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<VanishingHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tolerance() {
    		throw new Error("<VanishingHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tolerance(value) {
    		throw new Error("<VanishingHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/_layout.svelte generated by Svelte v3.23.2 */
    const file$6 = "src/pages/_layout.svelte";

    // (690:4) <VanishingHeader duration="350ms" offset={50} tolerance={5}>
    function create_default_slot$1(ctx) {
    	let nav1;
    	let nav0;
    	let current;
    	nav0 = new Nav({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav1 = element("nav");
    			create_component(nav0.$$.fragment);
    			attr_dev(nav1, "class", "Main__nav svelte-svo180");
    			add_location(nav1, file$6, 690, 8, 14432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav1, anchor);
    			mount_component(nav0, nav1, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav0.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav1);
    			destroy_component(nav0);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(690:4) <VanishingHeader duration=\\\"350ms\\\" offset={50} tolerance={5}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let link0;
    	let link1;
    	let t0;
    	let main;
    	let vanishingheader;
    	let t1;
    	let t2;
    	let sitefooter;
    	let current;

    	vanishingheader = new VanishingHeader({
    			props: {
    				duration: "350ms",
    				offset: 50,
    				tolerance: 5,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*$$slots*/ ctx[0].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	sitefooter = new SiteFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t0 = space();
    			main = element("main");
    			create_component(vanishingheader.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			create_component(sitefooter.$$.fragment);
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;1,200;1,300;1,400&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "class", "svelte-svo180");
    			add_location(link0, file$6, 8, 4, 224);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,400&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "class", "svelte-svo180");
    			add_location(link1, file$6, 10, 4, 492);
    			attr_dev(main, "class", "Main svelte-svo180");
    			add_location(main, file$6, 687, 0, 14338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(vanishingheader, main, null);
    			append_dev(main, t1);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			append_dev(main, t2);
    			mount_component(sitefooter, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const vanishingheader_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				vanishingheader_changes.$$scope = { dirty, ctx };
    			}

    			vanishingheader.$set(vanishingheader_changes);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(vanishingheader.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(sitefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(vanishingheader.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(sitefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(vanishingheader);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(sitefooter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let y = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Layout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Nav, SiteFooter, VanishingHeader, y });

    	$$self.$inject_state = $$props => {
    		if ("y" in $$props) y = $$props.y;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$$slots, $$scope];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/PageTitle.svelte generated by Svelte v3.23.2 */

    const file$7 = "src/components/PageTitle.svelte";

    function create_fragment$8(ctx) {
    	let header;
    	let hgroup;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;

    	const block = {
    		c: function create() {
    			header = element("header");
    			hgroup = element("hgroup");
    			h1 = element("h1");
    			t0 = text(/*pageTitle*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*pageSubTitle*/ ctx[1]);
    			attr_dev(h1, "class", "svelte-ocudny");
    			add_location(h1, file$7, 670, 6, 13666);
    			attr_dev(h2, "class", "svelte-ocudny");
    			add_location(h2, file$7, 671, 6, 13693);
    			attr_dev(hgroup, "class", "text-center svelte-ocudny");
    			add_location(hgroup, file$7, 669, 4, 13631);
    			attr_dev(header, "class", "Main__header svelte-ocudny");
    			add_location(header, file$7, 668, 0, 13597);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, hgroup);
    			append_dev(hgroup, h1);
    			append_dev(h1, t0);
    			append_dev(hgroup, t1);
    			append_dev(hgroup, h2);
    			append_dev(h2, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pageTitle*/ 1) set_data_dev(t0, /*pageTitle*/ ctx[0]);
    			if (dirty & /*pageSubTitle*/ 2) set_data_dev(t2, /*pageSubTitle*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { pageTitle } = $$props;
    	let { pageSubTitle } = $$props;
    	const writable_props = ["pageTitle", "pageSubTitle"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PageTitle> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PageTitle", $$slots, []);

    	$$self.$set = $$props => {
    		if ("pageTitle" in $$props) $$invalidate(0, pageTitle = $$props.pageTitle);
    		if ("pageSubTitle" in $$props) $$invalidate(1, pageSubTitle = $$props.pageSubTitle);
    	};

    	$$self.$capture_state = () => ({ pageTitle, pageSubTitle });

    	$$self.$inject_state = $$props => {
    		if ("pageTitle" in $$props) $$invalidate(0, pageTitle = $$props.pageTitle);
    		if ("pageSubTitle" in $$props) $$invalidate(1, pageSubTitle = $$props.pageSubTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageTitle, pageSubTitle];
    }

    class PageTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { pageTitle: 0, pageSubTitle: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageTitle",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pageTitle*/ ctx[0] === undefined && !("pageTitle" in props)) {
    			console.warn("<PageTitle> was created without expected prop 'pageTitle'");
    		}

    		if (/*pageSubTitle*/ ctx[1] === undefined && !("pageSubTitle" in props)) {
    			console.warn("<PageTitle> was created without expected prop 'pageSubTitle'");
    		}
    	}

    	get pageTitle() {
    		throw new Error("<PageTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageTitle(value) {
    		throw new Error("<PageTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSubTitle() {
    		throw new Error("<PageTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSubTitle(value) {
    		throw new Error("<PageTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/TODH.svelte generated by Svelte v3.23.2 */

    const file$8 = "src/components/TODH.svelte";

    function create_fragment$9(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let div3;
    	let t6;
    	let t7;
    	let div4;
    	let t8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text(/*cero*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*uno*/ ctx[1]);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(/*dos*/ ctx[2]);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(/*tres*/ ctx[3]);
    			t7 = space();
    			div4 = element("div");
    			t8 = text(/*cuatro*/ ctx[4]);
    			attr_dev(div0, "class", "TCero svelte-1tztzvk");
    			add_location(div0, file$8, 725, 4, 14850);
    			attr_dev(div1, "class", "TUno svelte-1tztzvk");
    			add_location(div1, file$8, 726, 4, 14886);
    			attr_dev(div2, "class", "TDos svelte-1tztzvk");
    			add_location(div2, file$8, 727, 4, 14920);
    			attr_dev(div3, "class", "TTres svelte-1tztzvk");
    			add_location(div3, file$8, 728, 4, 14954);
    			attr_dev(div4, "class", "TCuatro svelte-1tztzvk");
    			add_location(div4, file$8, 729, 4, 14990);
    			attr_dev(div5, "class", "T svelte-1tztzvk");
    			add_location(div5, file$8, 724, 0, 14821);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div1, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div2);
    			append_dev(div2, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, t6);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, t8);

    			if (!mounted) {
    				dispose = listen_dev(div5, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cero*/ 1) set_data_dev(t0, /*cero*/ ctx[0]);
    			if (dirty & /*uno*/ 2) set_data_dev(t2, /*uno*/ ctx[1]);
    			if (dirty & /*dos*/ 4) set_data_dev(t4, /*dos*/ ctx[2]);
    			if (dirty & /*tres*/ 8) set_data_dev(t6, /*tres*/ ctx[3]);
    			if (dirty & /*cuatro*/ 16) set_data_dev(t8, /*cuatro*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { cero } = $$props,
    		{ uno } = $$props,
    		{ dos } = $$props,
    		{ tres } = $$props,
    		{ cuatro = "default" } = $$props;

    	const writable_props = ["cero", "uno", "dos", "tres", "cuatro"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TODH> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TODH", $$slots, []);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("cero" in $$props) $$invalidate(0, cero = $$props.cero);
    		if ("uno" in $$props) $$invalidate(1, uno = $$props.uno);
    		if ("dos" in $$props) $$invalidate(2, dos = $$props.dos);
    		if ("tres" in $$props) $$invalidate(3, tres = $$props.tres);
    		if ("cuatro" in $$props) $$invalidate(4, cuatro = $$props.cuatro);
    	};

    	$$self.$capture_state = () => ({ cero, uno, dos, tres, cuatro });

    	$$self.$inject_state = $$props => {
    		if ("cero" in $$props) $$invalidate(0, cero = $$props.cero);
    		if ("uno" in $$props) $$invalidate(1, uno = $$props.uno);
    		if ("dos" in $$props) $$invalidate(2, dos = $$props.dos);
    		if ("tres" in $$props) $$invalidate(3, tres = $$props.tres);
    		if ("cuatro" in $$props) $$invalidate(4, cuatro = $$props.cuatro);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cero, uno, dos, tres, cuatro, click_handler];
    }

    class TODH extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			cero: 0,
    			uno: 1,
    			dos: 2,
    			tres: 3,
    			cuatro: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TODH",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*cero*/ ctx[0] === undefined && !("cero" in props)) {
    			console.warn("<TODH> was created without expected prop 'cero'");
    		}

    		if (/*uno*/ ctx[1] === undefined && !("uno" in props)) {
    			console.warn("<TODH> was created without expected prop 'uno'");
    		}

    		if (/*dos*/ ctx[2] === undefined && !("dos" in props)) {
    			console.warn("<TODH> was created without expected prop 'dos'");
    		}

    		if (/*tres*/ ctx[3] === undefined && !("tres" in props)) {
    			console.warn("<TODH> was created without expected prop 'tres'");
    		}
    	}

    	get cero() {
    		throw new Error("<TODH>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cero(value) {
    		throw new Error("<TODH>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uno() {
    		throw new Error("<TODH>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uno(value) {
    		throw new Error("<TODH>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dos() {
    		throw new Error("<TODH>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dos(value) {
    		throw new Error("<TODH>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tres() {
    		throw new Error("<TODH>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tres(value) {
    		throw new Error("<TODH>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cuatro() {
    		throw new Error("<TODH>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cuatro(value) {
    		throw new Error("<TODH>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/BlockQuote.svelte generated by Svelte v3.23.2 */

    const file$9 = "src/components/BlockQuote.svelte";

    function create_fragment$a(ctx) {
    	let blockquote;
    	let t0;
    	let t1;
    	let small;
    	let t2;
    	let blockquote_class_value;

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			t0 = text(/*quote*/ ctx[0]);
    			t1 = space();
    			small = element("small");
    			t2 = text(/*author*/ ctx[1]);
    			attr_dev(small, "class", "svelte-c5u5gc");
    			add_location(small, file$9, 676, 4, 13788);
    			attr_dev(blockquote, "class", blockquote_class_value = "Quote QuoteLine " + /*modificador*/ ctx[3][/*variante*/ ctx[2]] + " svelte-c5u5gc");
    			add_location(blockquote, file$9, 674, 0, 13711);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);
    			append_dev(blockquote, t0);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, small);
    			append_dev(small, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*quote*/ 1) set_data_dev(t0, /*quote*/ ctx[0]);
    			if (dirty & /*author*/ 2) set_data_dev(t2, /*author*/ ctx[1]);

    			if (dirty & /*modificador, variante*/ 12 && blockquote_class_value !== (blockquote_class_value = "Quote QuoteLine " + /*modificador*/ ctx[3][/*variante*/ ctx[2]] + " svelte-c5u5gc")) {
    				attr_dev(blockquote, "class", blockquote_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { quote } = $$props;
    	let { author } = $$props;
    	let { variante = 0 } = $$props;
    	let { modificador = ["Default", "Grey", "Invert"] } = $$props;
    	const writable_props = ["quote", "author", "variante", "modificador"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BlockQuote> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BlockQuote", $$slots, []);

    	$$self.$set = $$props => {
    		if ("quote" in $$props) $$invalidate(0, quote = $$props.quote);
    		if ("author" in $$props) $$invalidate(1, author = $$props.author);
    		if ("variante" in $$props) $$invalidate(2, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(3, modificador = $$props.modificador);
    	};

    	$$self.$capture_state = () => ({ quote, author, variante, modificador });

    	$$self.$inject_state = $$props => {
    		if ("quote" in $$props) $$invalidate(0, quote = $$props.quote);
    		if ("author" in $$props) $$invalidate(1, author = $$props.author);
    		if ("variante" in $$props) $$invalidate(2, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(3, modificador = $$props.modificador);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quote, author, variante, modificador];
    }

    class BlockQuote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			quote: 0,
    			author: 1,
    			variante: 2,
    			modificador: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockQuote",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quote*/ ctx[0] === undefined && !("quote" in props)) {
    			console.warn("<BlockQuote> was created without expected prop 'quote'");
    		}

    		if (/*author*/ ctx[1] === undefined && !("author" in props)) {
    			console.warn("<BlockQuote> was created without expected prop 'author'");
    		}
    	}

    	get quote() {
    		throw new Error("<BlockQuote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quote(value) {
    		throw new Error("<BlockQuote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get author() {
    		throw new Error("<BlockQuote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set author(value) {
    		throw new Error("<BlockQuote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variante() {
    		throw new Error("<BlockQuote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variante(value) {
    		throw new Error("<BlockQuote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modificador() {
    		throw new Error("<BlockQuote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modificador(value) {
    		throw new Error("<BlockQuote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Content.svelte generated by Svelte v3.23.2 */

    const file$a = "src/components/Content.svelte";

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "Content svelte-1p3j7tg");
    			add_location(div0, file$a, 664, 4, 13556);
    			attr_dev(div1, "class", "Main__content svelte-1p3j7tg");
    			add_location(div1, file$a, 663, 0, 13524);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Content", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/ContentArea.svelte generated by Svelte v3.23.2 */

    const file$b = "src/components/ContentArea.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Content__area svelte-btriot");
    			add_location(div, file$b, 669, 0, 13643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ContentArea> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ContentArea", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class ContentArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentArea",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/Area.svelte generated by Svelte v3.23.2 */

    const file$c = "src/components/Area.svelte";

    // (693:4) {#if title}
    function create_if_block$2(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-1gb29ar");
    			add_location(h3, file$c, 693, 8, 14124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(693:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let article;
    	let t;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$2(ctx);
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			article = element("article");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(article, "class", "Area svelte-1gb29ar");
    			add_location(article, file$c, 691, 0, 14077);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			if (if_block) if_block.m(article, null);
    			append_dev(article, t);

    			if (default_slot) {
    				default_slot.m(article, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(article, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { title = "" } = $$props;
    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Area> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Area", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $$scope, $$slots];
    }

    class Area extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Area",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get title() {
    		throw new Error("<Area>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Area>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Banner.svelte generated by Svelte v3.23.2 */

    const file$d = "src/components/Banner.svelte";
    const get_image_slot_changes = dirty => ({});
    const get_image_slot_context = ctx => ({});

    // (684:10) xx
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("xx");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(684:10) xx",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	const image_slot_template = /*$$slots*/ ctx[3].image;
    	const image_slot = create_slot(image_slot_template, ctx, /*$$scope*/ ctx[2], get_image_slot_context);
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (image_slot) image_slot.c();
    			t = space();
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(div, "class", div_class_value = "Banner " + /*modificador*/ ctx[1][/*variante*/ ctx[0]] + " svelte-1bvnjsk");
    			add_location(div, file$d, 681, 0, 13846);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (image_slot) {
    				image_slot.m(div, null);
    			}

    			append_dev(div, t);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (image_slot) {
    				if (image_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(image_slot, image_slot_template, ctx, /*$$scope*/ ctx[2], dirty, get_image_slot_changes, get_image_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*modificador, variante*/ 3 && div_class_value !== (div_class_value = "Banner " + /*modificador*/ ctx[1][/*variante*/ ctx[0]] + " svelte-1bvnjsk")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image_slot, local);
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image_slot, local);
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (image_slot) image_slot.d(detaching);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { variante = 0 } = $$props;
    	let { modificador = ["BannerBlack", "BannerDefault", "BgColorAlert"] } = $$props;
    	const writable_props = ["variante", "modificador"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Banner> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Banner", $$slots, ['image','default']);

    	$$self.$set = $$props => {
    		if ("variante" in $$props) $$invalidate(0, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(1, modificador = $$props.modificador);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ variante, modificador });

    	$$self.$inject_state = $$props => {
    		if ("variante" in $$props) $$invalidate(0, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(1, modificador = $$props.modificador);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [variante, modificador, $$scope, $$slots];
    }

    class Banner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { variante: 0, modificador: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Banner",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get variante() {
    		throw new Error("<Banner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variante(value) {
    		throw new Error("<Banner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modificador() {
    		throw new Error("<Banner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modificador(value) {
    		throw new Error("<Banner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/List.svelte generated by Svelte v3.23.2 */

    const file$e = "src/components/List.svelte";

    // (679:0) {:else}
    function create_else_block(ctx) {
    	let ol;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			ol = element("ol");
    			if (default_slot) default_slot.c();
    			attr_dev(ol, "class", "List ListDefault svelte-1kpt9ja");
    			add_location(ol, file$e, 679, 0, 13790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			if (default_slot) {
    				default_slot.m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(679:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (675:0) {#if type === "numbered"}
    function create_if_block$3(ctx) {
    	let ol;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			ol = element("ol");
    			if (default_slot) default_slot.c();
    			attr_dev(ol, "class", "List ListNumbered svelte-1kpt9ja");
    			add_location(ol, file$e, 675, 0, 13733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			if (default_slot) {
    				default_slot.m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(675:0) {#if type === \\\"numbered\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[0] === "numbered") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { type = "numbered" } = $$props;
    	const writable_props = ["type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("List", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, $$scope, $$slots];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { type: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get type() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Cards.svelte generated by Svelte v3.23.2 */

    const file$f = "src/components/Cards.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Cards svelte-126awla");
    			add_location(div, file$f, 680, 0, 13966);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cards> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Cards", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Cards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cards",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.23.2 */

    const file$g = "src/components/Card.svelte";
    const get_hasSvg_slot_changes = dirty => ({});
    const get_hasSvg_slot_context = ctx => ({});

    // (726:4) {#if hasImage}
    function create_if_block_2$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "class", "svelte-3e7olp");
    			add_location(img, file$g, 726, 8, 14777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 8 && img.src !== (img_src_value = /*image*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(726:4) {#if hasImage}",
    		ctx
    	});

    	return block;
    }

    // (729:4) {#if hasInlineSvg}
    function create_if_block_1$1(ctx) {
    	let current;
    	const hasSvg_slot_template = /*$$slots*/ ctx[10].hasSvg;
    	const hasSvg_slot = create_slot(hasSvg_slot_template, ctx, /*$$scope*/ ctx[9], get_hasSvg_slot_context);
    	const hasSvg_slot_or_fallback = hasSvg_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (hasSvg_slot_or_fallback) hasSvg_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (hasSvg_slot_or_fallback) {
    				hasSvg_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (hasSvg_slot) {
    				if (hasSvg_slot.p && dirty & /*$$scope*/ 512) {
    					update_slot(hasSvg_slot, hasSvg_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_hasSvg_slot_changes, get_hasSvg_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hasSvg_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hasSvg_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (hasSvg_slot_or_fallback) hasSvg_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(729:4) {#if hasInlineSvg}",
    		ctx
    	});

    	return block;
    }

    // (730:24) Put here inline-svg
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Put here inline-svg");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(730:24) Put here inline-svg",
    		ctx
    	});

    	return block;
    }

    // (734:8) {#if description}
    function create_if_block$4(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*description*/ ctx[1]);
    			attr_dev(p, "class", "CardContent svelte-3e7olp");
    			add_location(p, file$g, 734, 8, 15007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*description*/ 2) set_data_dev(t, /*description*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(734:8) {#if description}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let h4;
    	let t2;
    	let t3;
    	let t4;
    	let div1_class_value;
    	let current;
    	let if_block0 = /*hasImage*/ ctx[4] && create_if_block_2$1(ctx);
    	let if_block1 = /*hasInlineSvg*/ ctx[5] && create_if_block_1$1(ctx);
    	let if_block2 = /*description*/ ctx[1] && create_if_block$4(ctx);
    	const default_slot_template = /*$$slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			h4 = element("h4");
    			t2 = text(/*title*/ ctx[0]);
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(h4, "class", "CardTitle svelte-3e7olp");
    			add_location(h4, file$g, 732, 8, 14938);
    			attr_dev(div0, "class", "CardMain svelte-3e7olp");
    			add_location(div0, file$g, 731, 4, 14907);
    			attr_dev(div1, "class", div1_class_value = "Card  " + /*modificador*/ ctx[7][/*variante*/ ctx[6]] + " svelte-3e7olp");
    			add_location(div1, file$g, 722, 0, 14703);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h4);
    			append_dev(h4, t2);
    			append_dev(div0, t3);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t4);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*hasImage*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*hasInlineSvg*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*hasInlineSvg*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t2, /*title*/ ctx[0]);

    			if (/*description*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					if_block2.m(div0, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 512) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*variante*/ 64 && div1_class_value !== (div1_class_value = "Card  " + /*modificador*/ ctx[7][/*variante*/ ctx[6]] + " svelte-3e7olp")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { title = "Default title" } = $$props;
    	let { description = "Default content" } = $$props;
    	const caption = "Default caption";
    	const alt = "Default alt";
    	let { image = "img/img0.jpg" } = $$props;
    	let { hasImage = true } = $$props;
    	let { hasInlineSvg = false } = $$props;
    	let { variante = 2 } = $$props;
    	let modificador = ["Default", "Inverse", "White", "Line", "Transparent"];
    	const writable_props = ["title", "description", "image", "hasImage", "hasInlineSvg", "variante"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Card", $$slots, ['hasSvg','default']);

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("image" in $$props) $$invalidate(3, image = $$props.image);
    		if ("hasImage" in $$props) $$invalidate(4, hasImage = $$props.hasImage);
    		if ("hasInlineSvg" in $$props) $$invalidate(5, hasInlineSvg = $$props.hasInlineSvg);
    		if ("variante" in $$props) $$invalidate(6, variante = $$props.variante);
    		if ("$$scope" in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		description,
    		caption,
    		alt,
    		image,
    		hasImage,
    		hasInlineSvg,
    		variante,
    		modificador
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("image" in $$props) $$invalidate(3, image = $$props.image);
    		if ("hasImage" in $$props) $$invalidate(4, hasImage = $$props.hasImage);
    		if ("hasInlineSvg" in $$props) $$invalidate(5, hasInlineSvg = $$props.hasInlineSvg);
    		if ("variante" in $$props) $$invalidate(6, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(7, modificador = $$props.modificador);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		description,
    		alt,
    		image,
    		hasImage,
    		hasInlineSvg,
    		variante,
    		modificador,
    		caption,
    		$$scope,
    		$$slots
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			title: 0,
    			description: 1,
    			caption: 8,
    			alt: 2,
    			image: 3,
    			hasImage: 4,
    			hasInlineSvg: 5,
    			variante: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		return this.$$.ctx[8];
    	}

    	set caption(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		return this.$$.ctx[2];
    	}

    	set alt(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasImage() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasImage(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasInlineSvg() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasInlineSvg(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variante() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variante(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Figure.svelte generated by Svelte v3.23.2 */

    const file$h = "src/components/Figure.svelte";

    function create_fragment$i(ctx) {
    	let figure;
    	let t0;
    	let figcaption;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			figcaption = element("figcaption");
    			t1 = text(/*caption*/ ctx[0]);
    			attr_dev(figcaption, "class", "svelte-1pm3ncp");
    			add_location(figcaption, file$h, 674, 4, 13739);
    			attr_dev(figure, "class", "svelte-1pm3ncp");
    			add_location(figure, file$h, 672, 0, 13714);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);

    			if (default_slot) {
    				default_slot.m(figure, null);
    			}

    			append_dev(figure, t0);
    			append_dev(figure, figcaption);
    			append_dev(figcaption, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*caption*/ 1) set_data_dev(t1, /*caption*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { caption = "Default figure caption" } = $$props;
    	const writable_props = ["caption"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Figure> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Figure", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("caption" in $$props) $$invalidate(0, caption = $$props.caption);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ caption });

    	$$self.$inject_state = $$props => {
    		if ("caption" in $$props) $$invalidate(0, caption = $$props.caption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [caption, $$scope, $$slots];
    }

    class Figure extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { caption: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Figure",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get caption() {
    		throw new Error("<Figure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Figure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/icons/IconCero.svelte generated by Svelte v3.23.2 */

    const file$i = "src/components/icons/IconCero.svelte";

    function create_fragment$j(ctx) {
    	let svg;
    	let circle;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", "15135.5");
    			attr_dev(circle, "cy", "3089.34");
    			attr_dev(circle, "r", "1097.64");
    			attr_dev(circle, "transform", "matrix(.07646 0 0 .07646 -1073.328 -152.287)");
    			attr_dev(circle, "class", "svelte-28a4k1");
    			add_location(circle, file$i, 664, 4, 13632);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 168 168");
    			attr_dev(svg, "class", "svelte-28a4k1");
    			add_location(svg, file$i, 663, 0, 13525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconCero> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconCero", $$slots, []);
    	return [];
    }

    class IconCero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCero",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/icons/IconUno.svelte generated by Svelte v3.23.2 */

    const file$j = "src/components/icons/IconUno.svelte";

    function create_fragment$k(ctx) {
    	let svg;
    	let circle;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", "15135.5");
    			attr_dev(circle, "cy", "3089.34");
    			attr_dev(circle, "r", "1097.64");
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle, "transform", "matrix(.07646 0 0 .07646 -1073.328 -152.287)");
    			attr_dev(circle, "class", "svelte-rhy7zm");
    			add_location(circle, file$j, 664, 4, 13631);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 168 168");
    			attr_dev(svg, "class", "svelte-rhy7zm");
    			add_location(svg, file$j, 663, 0, 13524);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconUno> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconUno", $$slots, []);
    	return [];
    }

    class IconUno extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUno",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/components/icons/IconDos.svelte generated by Svelte v3.23.2 */

    const file$k = "src/components/icons/IconDos.svelte";

    function create_fragment$l(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "cx", "15135.5");
    			attr_dev(circle0, "cy", "3089.34");
    			attr_dev(circle0, "r", "1097.64");
    			attr_dev(circle0, "transform", "matrix(.03822 0 0 .03822 -452.1 -33.67)");
    			attr_dev(circle0, "class", "svelte-1sbegk4");
    			add_location(circle0, file$k, 665, 4, 13681);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.67)");
    			attr_dev(circle1, "class", "svelte-1sbegk4");
    			add_location(circle1, file$k, 666, 4, 13786);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle2, "class", "svelte-1sbegk4");
    			add_location(circle2, file$k, 667, 4, 13889);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-1sbegk4");
    			add_location(svg, file$k, 663, 0, 13524);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconDos> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconDos", $$slots, []);
    	return [];
    }

    class IconDos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconDos",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/icons/IconTres.svelte generated by Svelte v3.23.2 */

    const file$l = "src/components/icons/IconTres.svelte";

    function create_fragment$m(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			attr_dev(circle0, "cx", "15135.5");
    			attr_dev(circle0, "cy", "3089.34");
    			attr_dev(circle0, "r", "1097.64");
    			attr_dev(circle0, "fill", "none");
    			attr_dev(circle0, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle0, "transform", "matrix(.03822 0 0 .03822 -452.1 -33.668)");
    			attr_dev(circle0, "class", "svelte-ksn16w");
    			add_location(circle0, file$l, 665, 2, 13678);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.668)");
    			attr_dev(circle1, "class", "svelte-ksn16w");
    			add_location(circle1, file$l, 667, 2, 13833);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.03822 0 0 .03822 -493.61 -33.668)");
    			attr_dev(circle2, "class", "svelte-ksn16w");
    			add_location(circle2, file$l, 669, 2, 13986);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "fill", "none");
    			attr_dev(circle3, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle3, "stroke-width", "13.08");
    			attr_dev(circle3, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle3, "class", "svelte-ksn16w");
    			add_location(circle3, file$l, 671, 2, 14142);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-ksn16w");
    			add_location(svg, file$l, 663, 0, 13525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    			append_dev(svg, circle3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconTres> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconTres", $$slots, []);
    	return [];
    }

    class IconTres extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconTres",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/components/icons/IconCuatro.svelte generated by Svelte v3.23.2 */

    const file$m = "src/components/icons/IconCuatro.svelte";

    function create_fragment$n(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let circle6;
    	let circle7;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			circle7 = svg_element("circle");
    			attr_dev(circle0, "cx", "15135.5");
    			attr_dev(circle0, "cy", "3089.34");
    			attr_dev(circle0, "r", "1097.64");
    			attr_dev(circle0, "transform", "matrix(.0191 0 0 .0191 -225.8 25.37)");
    			attr_dev(circle0, "class", "svelte-dje9hw");
    			add_location(circle0, file$m, 664, 4, 13634);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "transform", "matrix(.0191 0 0 .0191 -141.88 25.37)");
    			attr_dev(circle1, "class", "svelte-dje9hw");
    			add_location(circle1, file$m, 665, 4, 13736);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "transform", "matrix(.0191 0 0 .0191 -267.75 25.37)");
    			attr_dev(circle2, "class", "svelte-dje9hw");
    			add_location(circle2, file$m, 666, 4, 13839);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "transform", "matrix(.0191 0 0 .0191 -183.76 25.37)");
    			attr_dev(circle3, "class", "svelte-dje9hw");
    			add_location(circle3, file$m, 667, 4, 13942);
    			attr_dev(circle4, "cx", "15135.5");
    			attr_dev(circle4, "cy", "3089.34");
    			attr_dev(circle4, "r", "1097.64");
    			attr_dev(circle4, "fill", "none");
    			attr_dev(circle4, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle4, "transform", "matrix(.03822 0 0 .03822 -493.93 -33.67)");
    			attr_dev(circle4, "class", "svelte-dje9hw");
    			add_location(circle4, file$m, 668, 4, 14045);
    			attr_dev(circle5, "cx", "15135.5");
    			attr_dev(circle5, "cy", "3089.34");
    			attr_dev(circle5, "r", "1097.64");
    			attr_dev(circle5, "fill", "none");
    			attr_dev(circle5, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle5, "transform", "matrix(.03822 0 0 .03822 -452.1 -33.67)");
    			attr_dev(circle5, "class", "svelte-dje9hw");
    			add_location(circle5, file$m, 669, 4, 14198);
    			attr_dev(circle6, "cx", "15135.5");
    			attr_dev(circle6, "cy", "3089.34");
    			attr_dev(circle6, "r", "1097.64");
    			attr_dev(circle6, "fill", "none");
    			attr_dev(circle6, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle6, "transform", "matrix(.03822 0 0 .03822 -536 -33.67)");
    			attr_dev(circle6, "class", "svelte-dje9hw");
    			add_location(circle6, file$m, 671, 4, 14358);
    			attr_dev(circle7, "cx", "15135.5");
    			attr_dev(circle7, "cy", "3089.34");
    			attr_dev(circle7, "r", "1097.64");
    			attr_dev(circle7, "fill", "none");
    			attr_dev(circle7, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle7, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle7, "class", "svelte-dje9hw");
    			add_location(circle7, file$m, 673, 4, 14516);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-dje9hw");
    			add_location(svg, file$m, 663, 0, 13527);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    			append_dev(svg, circle3);
    			append_dev(svg, circle4);
    			append_dev(svg, circle5);
    			append_dev(svg, circle6);
    			append_dev(svg, circle7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconCuatro> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconCuatro", $$slots, []);
    	return [];
    }

    class IconCuatro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCuatro",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/components/icons/IconEspiral.svelte generated by Svelte v3.23.2 */

    const file$n = "src/components/icons/IconEspiral.svelte";

    function create_fragment$o(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			attr_dev(path0, "d", "M238.42 113.958L26.696 211.404M60.396 110.54l102.31 103.458");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "stroke", "#ff3b05");
    			attr_dev(path0, "stroke-width", ".9705592000000001");
    			attr_dev(path0, "stroke-dasharray", "8.3,8.3");
    			attr_dev(path0, "stroke-dashoffset", "1.87");
    			attr_dev(path0, "class", "svelte-xt5w7p");
    			add_location(path0, file$n, 675, 4, 13884);
    			attr_dev(path1, "d", "M136.483 135.962c-9.786-3.27-20.483-1.824-28.77 3.88-8.317 5.694-13.197 14.975-13.172 24.92M94.541 164.762c.027 6.18 3.097 12.017 8.23 15.753 5.141 3.706 11.77 4.84 17.805 3.056M120.576 183.57c3.745-1.084 6.664-3.874 7.868-7.48 1.205-3.607.54-7.56-1.79-10.71M94.096 9.677l288.649 208.564M382.745 218.24l-356.049-6.836M26.696 211.404l67.4-201.727M94.096 9.677l68.61 204.32M162.706 213.998L94.54 164.762M136.483 135.962l-15.907 47.609M126.654 165.38l-32.113-.618M114.388 165.152l6.188 18.419M126.654 165.38l-9.908 6.801M118.182 167.884l-1.436 4.297M136.483 135.962L26.696 211.404M120.544 169.58l-6.156-4.428M114.388 165.152c-.88 1.17-1.1 2.666-.661 4.067a4.828 4.828 0 003.02 2.962");
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "stroke", "#fff");
    			attr_dev(path1, "stroke-width", ".9705592000000001");
    			attr_dev(path1, "class", "svelte-xt5w7p");
    			add_location(path1, file$n, 677, 4, 14083);
    			attr_dev(path2, "d", "M126.654 165.38c-1.421-1.904-3.71-3.087-6.137-3.13-2.425-.044-4.706 1.042-6.13 2.902M120.544 169.58a1.74 1.74 0 00-.752-1.402c-.48-.335-1.066-.46-1.61-.294M118.182 167.884c-.314.104-.606.355-.711.668a1.14 1.14 0 00.156.994");
    			attr_dev(path2, "fill", "none");
    			attr_dev(path2, "stroke", "#fff");
    			attr_dev(path2, "stroke-width", ".9705592000000001");
    			attr_dev(path2, "class", "svelte-xt5w7p");
    			add_location(path2, file$n, 680, 4, 14855);
    			attr_dev(path3, "d", "M116.746 172.181c.878.293 1.861.168 2.594-.355.764-.51 1.214-1.336 1.204-2.247M382.745 218.24c-.183-68.324-34.122-133.18-91.218-174.43C234.409 2.519 161.002-10.153 94.096 9.678M94.096 9.677C52.73 21.935 20.356 52.78 7.016 92.706c-13.329 39.894-6.009 84.037 19.68 118.698M26.696 211.404c15.859 21.406 41.186 34.4 68.102 34.921 26.884.51 52.135-11.519 67.908-32.327");
    			attr_dev(path3, "fill", "none");
    			attr_dev(path3, "stroke", "#fff");
    			attr_dev(path3, "stroke-width", ".9705592000000001");
    			attr_dev(path3, "class", "svelte-xt5w7p");
    			add_location(path3, file$n, 683, 4, 15170);
    			attr_dev(path4, "d", "M162.706 213.998c9.734-12.855 12.401-29.605 7.236-45.032-5.197-15.438-17.621-27.712-33.459-33.004");
    			attr_dev(path4, "fill", "none");
    			attr_dev(path4, "stroke", "#fff");
    			attr_dev(path4, "stroke-width", ".9705592000000001");
    			attr_dev(path4, "class", "svelte-xt5w7p");
    			add_location(path4, file$n, 686, 4, 15626);
    			attr_dev(svg, "viewBox", "0 0 384 247");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			set_style(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-xt5w7p");
    			toggle_class(svg, "active", /*active*/ ctx[1]);
    			add_location(svg, file$n, 673, 0, 13666);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*active*/ 2) {
    				toggle_class(svg, "active", /*active*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let active = false;
    	const writable_props = ["size"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconEspiral> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconEspiral", $$slots, []);
    	const click_handler = () => $$invalidate(1, active = !active);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size, active });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, active, click_handler];
    }

    class IconEspiral extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconEspiral",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get size() {
    		throw new Error("<IconEspiral>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconEspiral>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/icons/IconTetractys.svelte generated by Svelte v3.23.2 */

    const file$o = "src/components/icons/IconTetractys.svelte";

    function create_fragment$p(ctx) {
    	let svg;
    	let path;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let circle6;
    	let circle7;
    	let circle8;
    	let circle9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			circle7 = svg_element("circle");
    			circle8 = svg_element("circle");
    			circle9 = svg_element("circle");
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "d", "M4.054 164.65l30.564-52.938 30.563 52.938H4.054zM65.763\n      164.65l30.563-52.938 30.562 52.938H65.763zM127.186\n      164.65l30.563-52.938 30.563 52.938h-61.126zM34.936 111.176L65.5\n      58.24l30.564 52.936H34.936zM96.442 111.176l30.563-52.936 30.564\n      52.936H96.442zM65.787 57.84L96.35 4.902l30.562 52.936H65.787z");
    			attr_dev(path, "vector-effect", "non-scaling-stroke");
    			attr_dev(path, "class", "svelte-1qsbwgj");
    			add_location(path, file$o, 679, 2, 13910);
    			attr_dev(circle0, "cx", "168.317");
    			attr_dev(circle0, "cy", "18.147");
    			attr_dev(circle0, "r", "6.044");
    			attr_dev(circle0, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle0, "class", "svelte-1qsbwgj");
    			add_location(circle0, file$o, 684, 2, 14293);
    			attr_dev(circle1, "cx", "214.102");
    			attr_dev(circle1, "cy", "98.498");
    			attr_dev(circle1, "r", "6.045");
    			attr_dev(circle1, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle1, "class", "svelte-1qsbwgj");
    			add_location(circle1, file$o, 685, 2, 14391);
    			attr_dev(circle2, "cx", "259.858");
    			attr_dev(circle2, "cy", "178.241");
    			attr_dev(circle2, "r", "6.045");
    			attr_dev(circle2, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle2, "class", "svelte-1qsbwgj");
    			add_location(circle2, file$o, 686, 2, 14489);
    			attr_dev(circle3, "cx", "305.727");
    			attr_dev(circle3, "cy", "257.757");
    			attr_dev(circle3, "r", "6.045");
    			attr_dev(circle3, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle3, "class", "svelte-1qsbwgj");
    			add_location(circle3, file$o, 687, 2, 14588);
    			attr_dev(circle4, "cx", "214.102");
    			attr_dev(circle4, "cy", "257.757");
    			attr_dev(circle4, "r", "6.045");
    			attr_dev(circle4, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle4, "class", "svelte-1qsbwgj");
    			add_location(circle4, file$o, 688, 2, 14687);
    			attr_dev(circle5, "cx", "123.237");
    			attr_dev(circle5, "cy", "257.757");
    			attr_dev(circle5, "r", "6.044");
    			attr_dev(circle5, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle5, "class", "svelte-1qsbwgj");
    			add_location(circle5, file$o, 689, 2, 14786);
    			attr_dev(circle6, "cx", "30.816");
    			attr_dev(circle6, "cy", "257.757");
    			attr_dev(circle6, "r", "6.045");
    			attr_dev(circle6, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle6, "class", "svelte-1qsbwgj");
    			add_location(circle6, file$o, 690, 2, 14885);
    			attr_dev(circle7, "cx", "76.892");
    			attr_dev(circle7, "cy", "178.241");
    			attr_dev(circle7, "r", "6.045");
    			attr_dev(circle7, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle7, "class", "svelte-1qsbwgj");
    			add_location(circle7, file$o, 691, 2, 14983);
    			attr_dev(circle8, "cx", "168.317");
    			attr_dev(circle8, "cy", "178.241");
    			attr_dev(circle8, "r", "6.045");
    			attr_dev(circle8, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle8, "class", "svelte-1qsbwgj");
    			add_location(circle8, file$o, 692, 2, 15081);
    			attr_dev(circle9, "cx", "123.237");
    			attr_dev(circle9, "cy", "98.498");
    			attr_dev(circle9, "r", "6.044");
    			attr_dev(circle9, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle9, "class", "svelte-1qsbwgj");
    			add_location(circle9, file$o, 693, 2, 15180);
    			set_style(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 193 169");
    			attr_dev(svg, "class", "svelte-1qsbwgj");
    			toggle_class(svg, "active", /*active*/ ctx[1]);
    			add_location(svg, file$o, 677, 0, 13720);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    			append_dev(svg, circle3);
    			append_dev(svg, circle4);
    			append_dev(svg, circle5);
    			append_dev(svg, circle6);
    			append_dev(svg, circle7);
    			append_dev(svg, circle8);
    			append_dev(svg, circle9);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*active*/ 2) {
    				toggle_class(svg, "active", /*active*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let active = false;
    	const writable_props = ["size"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconTetractys> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconTetractys", $$slots, []);
    	const click_handler = () => $$invalidate(1, active = !active);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size, active });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, active, click_handler];
    }

    class IconTetractys extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconTetractys",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get size() {
    		throw new Error("<IconTetractys>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconTetractys>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Loading.svelte generated by Svelte v3.23.2 */

    const file$p = "src/components/Loading.svelte";

    function create_fragment$q(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			attr_dev(div, "class", "svelte-sbi7hj");
    			add_location(div, file$p, 7, 0, 109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Loading", $$slots, []);
    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src/components/Libros.svelte generated by Svelte v3.23.2 */
    const file$q = "src/components/Libros.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (681:4) {:else}
    function create_else_block$1(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(681:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (679:4) {#each libros as item}
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let t_value = /*item*/ ctx[1].link + "";
    	let t;
    	let a_href_value;
    	let a_target_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[1].href);
    			attr_dev(a, "target", a_target_value = /*item*/ ctx[1].target);
    			attr_dev(a, "class", "svelte-1ggiiq6");
    			add_location(a, file$q, 679, 12, 13851);
    			attr_dev(li, "class", "svelte-1ggiiq6");
    			add_location(li, file$q, 679, 8, 13847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*libros*/ 1 && t_value !== (t_value = /*item*/ ctx[1].link + "")) set_data_dev(t, t_value);

    			if (dirty & /*libros*/ 1 && a_href_value !== (a_href_value = /*item*/ ctx[1].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*libros*/ 1 && a_target_value !== (a_target_value = /*item*/ ctx[1].target)) {
    				attr_dev(a, "target", a_target_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(679:4) {#each libros as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let ul;
    	let each_value = /*libros*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(ul, "class", "svelte-1ggiiq6");
    			add_location(ul, file$q, 677, 0, 13807);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*libros*/ 1) {
    				each_value = /*libros*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { libros = [] } = $$props;

    	onMount(async () => {
    		const res = await fetch("/data/libros.json");
    		$$invalidate(0, libros = [...await res.json()]);
    	});

    	const writable_props = ["libros"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Libros> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Libros", $$slots, []);

    	$$self.$set = $$props => {
    		if ("libros" in $$props) $$invalidate(0, libros = $$props.libros);
    	};

    	$$self.$capture_state = () => ({ Loading, onMount, libros });

    	$$self.$inject_state = $$props => {
    		if ("libros" in $$props) $$invalidate(0, libros = $$props.libros);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [libros];
    }

    class Libros extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { libros: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Libros",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get libros() {
    		throw new Error("<Libros>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set libros(value) {
    		throw new Error("<Libros>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Conceptos.svelte generated by Svelte v3.23.2 */

    const file$r = "src/components/Conceptos.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (680:0) {#each conceptos as concepto}
    function create_each_block$3(ctx) {
    	let dt;
    	let t0_value = /*concepto*/ ctx[1].title + "";
    	let t0;
    	let dd;
    	let html_tag;
    	let raw_value = /*concepto*/ ctx[1].text + "";
    	let t1;
    	let a;
    	let t2_value = /*concepto*/ ctx[1].link + "";
    	let t2;
    	let a_href_value;
    	let a_target_value;
    	let t3;

    	const block = {
    		c: function create() {
    			dt = element("dt");
    			t0 = text(t0_value);
    			dd = element("dd");
    			t1 = space();
    			a = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(dt, "class", "svelte-1b8q1at");
    			add_location(dt, file$r, 680, 4, 13911);
    			html_tag = new HtmlTag(t1);
    			attr_dev(a, "href", a_href_value = /*concepto*/ ctx[1].href);
    			attr_dev(a, "target", a_target_value = /*concepto*/ ctx[1].target);
    			attr_dev(a, "class", "svelte-1b8q1at");
    			add_location(a, file$r, 683, 8, 13984);
    			attr_dev(dd, "class", "svelte-1b8q1at");
    			add_location(dd, file$r, 681, 4, 13941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dt, anchor);
    			append_dev(dt, t0);
    			insert_dev(target, dd, anchor);
    			html_tag.m(raw_value, dd);
    			append_dev(dd, t1);
    			append_dev(dd, a);
    			append_dev(a, t2);
    			append_dev(dd, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conceptos*/ 1 && t0_value !== (t0_value = /*concepto*/ ctx[1].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*conceptos*/ 1 && raw_value !== (raw_value = /*concepto*/ ctx[1].text + "")) html_tag.p(raw_value);
    			if (dirty & /*conceptos*/ 1 && t2_value !== (t2_value = /*concepto*/ ctx[1].link + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*conceptos*/ 1 && a_href_value !== (a_href_value = /*concepto*/ ctx[1].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*conceptos*/ 1 && a_target_value !== (a_target_value = /*concepto*/ ctx[1].target)) {
    				attr_dev(a, "target", a_target_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dt);
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(680:0) {#each conceptos as concepto}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let dl;
    	let each_value = /*conceptos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			dl = element("dl");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(dl, "class", "svelte-1b8q1at");
    			add_location(dl, file$r, 678, 0, 13872);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dl, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(dl, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*conceptos*/ 1) {
    				each_value = /*conceptos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(dl, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dl);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { conceptos = [] } = $$props;

    	onMount(async () => {
    		const res = await fetch("/data/conceptos.json");
    		$$invalidate(0, conceptos = [...await res.json()]);
    	});

    	const writable_props = ["conceptos"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Conceptos> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Conceptos", $$slots, []);

    	$$self.$set = $$props => {
    		if ("conceptos" in $$props) $$invalidate(0, conceptos = $$props.conceptos);
    	};

    	$$self.$capture_state = () => ({ Loading, onMount, conceptos });

    	$$self.$inject_state = $$props => {
    		if ("conceptos" in $$props) $$invalidate(0, conceptos = $$props.conceptos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [conceptos];
    }

    class Conceptos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { conceptos: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conceptos",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get conceptos() {
    		throw new Error("<Conceptos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set conceptos(value) {
    		throw new Error("<Conceptos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let counterStore = writable(0);

    const todh = readable([
      {
        tags: [
            "Potencial", 
            "Unidad", 
            "Lo incognoscible",
            "Posibilidades",
            "Fuente",
            "Océano",
            "Caos",
            "Lo absoluto"
        ],
        description: "lwkdfnkerjnv erlkvj"
      },
      {
        tags: [
          "mónada",
          "punto",
          "pensar",
          "ser",
          "fuego",
          "orden",
          "discernir",
          "nigredo"
        ],
        description: ""
      },
      {
        tags: [
          "díada",
          "línea",
          "sentir",
          "dualidad",
          "agua",
          "incubar",
          "empatizar",
          "albedo"
        ]
      },
      {
        tags: [
          "tríada",
          "superficie",
          "decir",
          "símbolo",
          "aire",
          "conexión",
          "testear",
          "citrinitas"
        ]
      },
      {
        tags: [
          "tétrada",
          "objeto",
          "hacer",
          "estructura",
          "tierra",
          "forma",
          "prototipar",
          "rubedo"
        ]
      },
    ]);

    /* src/pages/about.svelte generated by Svelte v3.23.2 */
    const file$s = "src/pages/about.svelte";

    // (714:2) <Area>
    function create_default_slot_9(ctx) {
    	let todh_1;
    	let current;

    	todh_1 = new TODH({
    			props: {
    				cero: /*$todh*/ ctx[1][0].tags[/*$counterStore*/ ctx[0]],
    				uno: /*$todh*/ ctx[1][1].tags[/*$counterStore*/ ctx[0]],
    				dos: /*$todh*/ ctx[1][2].tags[/*$counterStore*/ ctx[0]],
    				tres: /*$todh*/ ctx[1][3].tags[/*$counterStore*/ ctx[0]],
    				cuatro: /*$todh*/ ctx[1][4].tags[/*$counterStore*/ ctx[0]]
    			},
    			$$inline: true
    		});

    	todh_1.$on("click", /*incrementCounter*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(todh_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(todh_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const todh_1_changes = {};
    			if (dirty & /*$todh, $counterStore*/ 3) todh_1_changes.cero = /*$todh*/ ctx[1][0].tags[/*$counterStore*/ ctx[0]];
    			if (dirty & /*$todh, $counterStore*/ 3) todh_1_changes.uno = /*$todh*/ ctx[1][1].tags[/*$counterStore*/ ctx[0]];
    			if (dirty & /*$todh, $counterStore*/ 3) todh_1_changes.dos = /*$todh*/ ctx[1][2].tags[/*$counterStore*/ ctx[0]];
    			if (dirty & /*$todh, $counterStore*/ 3) todh_1_changes.tres = /*$todh*/ ctx[1][3].tags[/*$counterStore*/ ctx[0]];
    			if (dirty & /*$todh, $counterStore*/ 3) todh_1_changes.cuatro = /*$todh*/ ctx[1][4].tags[/*$counterStore*/ ctx[0]];
    			todh_1.$set(todh_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todh_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todh_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(todh_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(714:2) <Area>",
    		ctx
    	});

    	return block;
    }

    // (720:4) <figure slot="image">
    function create_image_slot(ctx) {
    	let figure;
    	let iconespiral;
    	let current;
    	iconespiral = new IconEspiral({ $$inline: true });

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			create_component(iconespiral.$$.fragment);
    			attr_dev(figure, "slot", "image");
    			attr_dev(figure, "class", "svelte-y3lvc");
    			add_location(figure, file$s, 719, 4, 15449);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			mount_component(iconespiral, figure, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconespiral.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconespiral.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			destroy_component(iconespiral);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_image_slot.name,
    		type: "slot",
    		source: "(720:4) <figure slot=\\\"image\\\">",
    		ctx
    	});

    	return block;
    }

    // (719:2) <Banner>
    function create_default_slot_8(ctx) {
    	let t;
    	let blockquote;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				quote: "La raíz profunda de la Creación es el orden y sentirlo nos reconecta con todo lo que existe.",
    				author: "TODH",
    				variante: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(blockquote.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(blockquote, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(719:2) <Banner>",
    		ctx
    	});

    	return block;
    }

    // (730:6) <Figure caption="0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1">
    function create_default_slot_7(ctx) {
    	let icontetractys;
    	let current;
    	icontetractys = new IconTetractys({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icontetractys.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icontetractys, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icontetractys.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icontetractys.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icontetractys, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(730:6) <Figure caption=\\\"0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1\\\">",
    		ctx
    	});

    	return block;
    }

    // (728:4) <Area title="Tetractys">
    function create_default_slot_6(ctx) {
    	let div;
    	let figure;
    	let current;

    	figure = new Figure({
    			props: {
    				caption: "0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(figure.$$.fragment);
    			attr_dev(div, "class", "center svelte-y3lvc");
    			add_location(div, file$s, 728, 4, 15722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(figure, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const figure_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				figure_changes.$$scope = { dirty, ctx };
    			}

    			figure.$set(figure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(figure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(figure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(figure);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(728:4) <Area title=\\\"Tetractys\\\">",
    		ctx
    	});

    	return block;
    }

    // (736:4) <Area title="Una lógica de la observación">
    function create_default_slot_5(ctx) {
    	let p0;
    	let t0;
    	let strong;
    	let t2;
    	let t3;
    	let blockquote;
    	let t4;
    	let p1;
    	let t6;
    	let p2;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				quote: "Un viaje que es de regreso a la Unidad.",
    				author: "TODH",
    				variante: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text("La base de lo que es TODH, para mí queda sobradamente explicada\n      contemplando la Tetractys, la vesica Piscis o el número-idea Pitagórico.\n      Es un contemplar dejándose penetrar por lo que se observa. Un rendirse ante la evidencia. Es mirar hasta que ves,\n      nada más. Es una escucha atenta. Todo lo que hay es agua, fuego, tierra, aire y un quinto elemento... No són sólo\n      elementos naturales, son principios abstractos,\n      hechos de una sustancia que se encuentra en nuestras ideas, nuestras\n      formas de ser, hay fuego en las ideas, agua en las emociones, tierra en los hechos, y aire en nuestros discursos.\n      ");
    			strong = element("strong");
    			strong.textContent = "Antes es la espiral que el caracol. El caracol es la expresión de un principio anterior.";
    			t2 = text("\n      Conforme vas cayendo en lo que la esencia de las cosas es, te van\n      importando cada vez menos las formas y más las relaciones. Mi ánimo es el de transmitir esta vivencia profunda y\n      no tanto perseguir una base teórica intelectual. Mucho se ha escrito ya por gente de talla muy superior a la mía,\n      de modo que me parecería absurdo tratar de llenar más páginas al respecto.");
    			t3 = space();
    			create_component(blockquote.$$.fragment);
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Recalcar la naturaleza sintética de este proyecto que apunta siempre al origen, a lo original, a lo obvio. Un\n      viaje que es de regreso a la Unidad.\n      Una incursión. El símbolo tiene ese poder, condensa un vasto campo de significados y los disuelve quedándose con\n      lo esencial.";
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Me gusta comparar TODH con el juego del Tetris cuyo objetivo es desintegrar los objetos que van cayendo. El\n      jugador no añade más cosas al escenario, simplemente reconoce unas formas que aparecen sobre un fondo y comprende\n      cual es su orden. Nada más. Los objetos aparecen y desaparecen por sí mismos, tú no los creas, sólo los ves y\n      reconoces cual es su sitio.\n      No inventas nada, no añades nada. TODH es simplemente orden \"elemental\".";
    			attr_dev(strong, "class", "svelte-y3lvc");
    			add_location(strong, file$s, 744, 6, 16569);
    			attr_dev(p0, "class", "svelte-y3lvc");
    			add_location(p0, file$s, 736, 4, 15921);
    			attr_dev(p1, "class", "svelte-y3lvc");
    			add_location(p1, file$s, 753, 4, 17190);
    			attr_dev(p2, "class", "svelte-y3lvc");
    			add_location(p2, file$s, 759, 4, 17504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			append_dev(p0, strong);
    			append_dev(p0, t2);
    			insert_dev(target, t3, anchor);
    			mount_component(blockquote, target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p2, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			destroy_component(blockquote, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(736:4) <Area title=\\\"Una lógica de la observación\\\">",
    		ctx
    	});

    	return block;
    }

    // (769:4) <Area title="Términos clave">
    function create_default_slot_4(ctx) {
    	let conceptos;
    	let current;
    	conceptos = new Conceptos({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(conceptos.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(conceptos, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(conceptos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(conceptos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(conceptos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(769:4) <Area title=\\\"Términos clave\\\">",
    		ctx
    	});

    	return block;
    }

    // (773:4) <Area title="Libros">
    function create_default_slot_3(ctx) {
    	let libros;
    	let current;
    	libros = new Libros({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(libros.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(libros, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(libros.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(libros.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(libros, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(773:4) <Area title=\\\"Libros\\\">",
    		ctx
    	});

    	return block;
    }

    // (777:4) <Banner variante={0}>
    function create_default_slot_2(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let t;
    	let blockquote;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "La creatividad es un proceso universal",
    				author: "Jaime Buhigas"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			t = space();
    			create_component(blockquote.$$.fragment);
    			attr_dev(path0, "class", "triangle svelte-y3lvc");
    			attr_dev(path0, "vector-effect", "non-scaling-stroke");
    			attr_dev(path0, "d", "M39 0l14 23H26z");
    			add_location(path0, file$s, 778, 8, 18196);
    			attr_dev(path1, "class", "triangle svelte-y3lvc");
    			attr_dev(path1, "vector-effect", "non-scaling-stroke");
    			attr_dev(path1, "d", "M13 0l13 23H0z");
    			add_location(path1, file$s, 779, 8, 18284);
    			attr_dev(path2, "class", "triangle svelte-y3lvc");
    			attr_dev(path2, "vector-effect", "non-scaling-stroke");
    			attr_dev(path2, "d", "M26 23l13 22H13z");
    			add_location(path2, file$s, 780, 8, 18371);
    			attr_dev(path3, "class", "triangle svelte-y3lvc");
    			attr_dev(path3, "vector-effect", "non-scaling-stroke");
    			attr_dev(path3, "d", "M53 23L39 45 26 23z");
    			add_location(path3, file$s, 781, 8, 18460);
    			attr_dev(path4, "class", "triangle svelte-y3lvc");
    			attr_dev(path4, "vector-effect", "non-scaling-stroke");
    			attr_dev(path4, "d", "M39 0L26 23 13 0z");
    			add_location(path4, file$s, 782, 8, 18552);
    			attr_dev(path5, "class", "triangle svelte-y3lvc");
    			attr_dev(path5, "vector-effect", "non-scaling-stroke");
    			attr_dev(path5, "d", "M26 23L13 45 0 23z");
    			add_location(path5, file$s, 783, 8, 18642);
    			attr_dev(svg, "class", "logo-hexa svelte-y3lvc");
    			attr_dev(svg, "viewBox", "0 0 53 46");
    			add_location(svg, file$s, 777, 6, 18144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			insert_dev(target, t, anchor);
    			mount_component(blockquote, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(777:4) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (727:2) <ContentArea>
    function create_default_slot_1(ctx) {
    	let area0;
    	let t0;
    	let area1;
    	let t1;
    	let area2;
    	let t2;
    	let area3;
    	let t3;
    	let banner;
    	let current;

    	area0 = new Area({
    			props: {
    				title: "Tetractys",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				title: "Una lógica de la observación",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area2 = new Area({
    			props: {
    				title: "Términos clave",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area3 = new Area({
    			props: {
    				title: "Libros",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t0 = space();
    			create_component(area1.$$.fragment);
    			t1 = space();
    			create_component(area2.$$.fragment);
    			t2 = space();
    			create_component(area3.$$.fragment);
    			t3 = space();
    			create_component(banner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(area1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(area3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(banner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    			const area2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				area2_changes.$$scope = { dirty, ctx };
    			}

    			area2.$set(area2_changes);
    			const area3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				area3_changes.$$scope = { dirty, ctx };
    			}

    			area3.$set(area3_changes);
    			const banner_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				banner_changes.$$scope = { dirty, ctx };
    			}

    			banner.$set(banner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			transition_in(area2.$$.fragment, local);
    			transition_in(area3.$$.fragment, local);
    			transition_in(banner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			transition_out(area2.$$.fragment, local);
    			transition_out(area3.$$.fragment, local);
    			transition_out(banner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(area1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(area3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(banner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(727:2) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (713:0) <Content>
    function create_default_slot$2(ctx) {
    	let area;
    	let t0;
    	let banner;
    	let t1;
    	let contentarea;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner = new Banner({
    			props: {
    				$$slots: {
    					default: [create_default_slot_8],
    					image: [create_image_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area.$$.fragment);
    			t0 = space();
    			create_component(banner.$$.fragment);
    			t1 = space();
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(banner, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_changes = {};

    			if (dirty & /*$$scope, $todh, $counterStore*/ 19) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    			const banner_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				banner_changes.$$scope = { dirty, ctx };
    			}

    			banner.$set(banner_changes);
    			const contentarea_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				contentarea_changes.$$scope = { dirty, ctx };
    			}

    			contentarea.$set(contentarea_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area.$$.fragment, local);
    			transition_in(banner.$$.fragment, local);
    			transition_in(contentarea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area.$$.fragment, local);
    			transition_out(banner.$$.fragment, local);
    			transition_out(contentarea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(banner, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(713:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let t0;
    	let pagetitle;
    	let t1;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "El proceso de la Creación",
    				pageSubTitle: "Matriz-modelo-prototipo base de cualquier cosa."
    			},
    			$$inline: true
    		});

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(pagetitle.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    			document.title = "TODH | About";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(pagetitle, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope, $todh, $counterStore*/ 19) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(pagetitle, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $counterStore;
    	let $todh;
    	validate_store(counterStore, "counterStore");
    	component_subscribe($$self, counterStore, $$value => $$invalidate(0, $counterStore = $$value));
    	validate_store(todh, "todh");
    	component_subscribe($$self, todh, $$value => $$invalidate(1, $todh = $$value));
    	let visible = true;

    	let incrementCounter = () => {
    		if ($counterStore < 7) {
    			set_store_value(counterStore, $counterStore++, $counterStore);
    		} else {
    			set_store_value(counterStore, $counterStore = 0);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("About", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		PageTitle,
    		TODH,
    		BlockQuote,
    		Content,
    		ContentArea,
    		Area,
    		Banner,
    		List,
    		Cards,
    		Card,
    		Figure,
    		IconCero,
    		IconUno,
    		IconDos,
    		IconTres,
    		IconCuatro,
    		IconEspiral,
    		IconTetractys,
    		Loading,
    		Libros,
    		Conceptos,
    		visible,
    		todh,
    		counterStore,
    		incrementCounter,
    		$counterStore,
    		$todh
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) visible = $$props.visible;
    		if ("incrementCounter" in $$props) $$invalidate(2, incrementCounter = $$props.incrementCounter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$counterStore, $todh, incrementCounter];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src/pages/blog/[slug].svelte generated by Svelte v3.23.2 */
    const file$t = "src/pages/blog/[slug].svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (720:0) {#if (post.slug === slug)}
    function create_if_block_10(ctx) {
    	let pagetitle;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: /*post*/ ctx[2].title,
    				pageSubTitle: /*post*/ ctx[2].subtitle
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagetitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagetitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagetitle_changes = {};
    			if (dirty & /*elpost*/ 2) pagetitle_changes.pageTitle = /*post*/ ctx[2].title;
    			if (dirty & /*elpost*/ 2) pagetitle_changes.pageSubTitle = /*post*/ ctx[2].subtitle;
    			pagetitle.$set(pagetitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagetitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(720:0) {#if (post.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (719:0) {#each elpost as post}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*post*/ ctx[2].slug === /*slug*/ ctx[0] && create_if_block_10(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*post*/ ctx[2].slug === /*slug*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*elpost, slug*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_10(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(719:0) {#each elpost as post}",
    		ctx
    	});

    	return block;
    }

    // (727:4) {#if (post.slug === slug)}
    function create_if_block_9(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (img.src !== (img_src_value = "/" + /*post*/ ctx[2].imagen)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*post*/ ctx[2].title);
    			attr_dev(img, "class", "svelte-m3gqf");
    			add_location(img, file$t, 728, 8, 14962);
    			attr_dev(div, "class", "PostImgContainer svelte-m3gqf");
    			add_location(div, file$t, 727, 4, 14923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && img.src !== (img_src_value = "/" + /*post*/ ctx[2].imagen)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*elpost*/ 2 && img_alt_value !== (img_alt_value = /*post*/ ctx[2].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(727:4) {#if (post.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (726:4) {#each elpost as post}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*post*/ ctx[2].slug === /*slug*/ ctx[0] && create_if_block_9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*post*/ ctx[2].slug === /*slug*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(726:4) {#each elpost as post}",
    		ctx
    	});

    	return block;
    }

    // (737:12) {#if (post.slug === slug)}
    function create_if_block$5(ctx) {
    	let article;
    	let div;
    	let h3;
    	let raw0_value = /*post*/ ctx[2].content.h1 + "";
    	let t0;
    	let p0;
    	let raw1_value = /*post*/ ctx[2].content.p + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let p1;
    	let raw2_value = /*post*/ ctx[2].content.p7 + "";
    	let t9;
    	let p2;
    	let raw3_value = /*post*/ ctx[2].content.p8 + "";
    	let t10;
    	let p3;
    	let raw4_value = /*post*/ ctx[2].content.p9 + "";
    	let t11;
    	let p4;
    	let raw5_value = /*post*/ ctx[2].content.p10 + "";
    	let t12;
    	let t13;
    	let p5;
    	let raw6_value = /*post*/ ctx[2].content.p11 + "";
    	let t14;
    	let p6;
    	let raw7_value = /*post*/ ctx[2].content.p12 + "";
    	let t15;
    	let p7;
    	let raw8_value = /*post*/ ctx[2].content.p13 + "";
    	let t16;
    	let if_block0 = /*post*/ ctx[2].content.blockquote && create_if_block_8(ctx);
    	let if_block1 = /*post*/ ctx[2].content.p2 && create_if_block_7(ctx);
    	let if_block2 = /*post*/ ctx[2].content.p3 && create_if_block_6(ctx);
    	let if_block3 = /*post*/ ctx[2].content.p4 && create_if_block_5(ctx);
    	let if_block4 = /*post*/ ctx[2].content.p5 && create_if_block_4(ctx);
    	let if_block5 = /*post*/ ctx[2].content.p6 && create_if_block_3$1(ctx);
    	let if_block6 = /*post*/ ctx[2].content.img1 && create_if_block_2$2(ctx);
    	let if_block7 = /*post*/ ctx[2].content.img2 && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			div = element("div");
    			h3 = element("h3");
    			t0 = space();
    			p0 = element("p");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if (if_block6) if_block6.c();
    			t8 = space();
    			p1 = element("p");
    			t9 = space();
    			p2 = element("p");
    			t10 = space();
    			p3 = element("p");
    			t11 = space();
    			p4 = element("p");
    			t12 = space();
    			if (if_block7) if_block7.c();
    			t13 = space();
    			p5 = element("p");
    			t14 = space();
    			p6 = element("p");
    			t15 = space();
    			p7 = element("p");
    			t16 = space();
    			attr_dev(h3, "class", "svelte-m3gqf");
    			add_location(h3, file$t, 739, 24, 15296);
    			attr_dev(p0, "class", "svelte-m3gqf");
    			add_location(p0, file$t, 740, 24, 15353);
    			attr_dev(p1, "class", "svelte-m3gqf");
    			add_location(p1, file$t, 765, 24, 16553);
    			attr_dev(p2, "class", "svelte-m3gqf");
    			add_location(p2, file$t, 766, 24, 16608);
    			attr_dev(p3, "class", "svelte-m3gqf");
    			add_location(p3, file$t, 767, 24, 16663);
    			attr_dev(p4, "class", "svelte-m3gqf");
    			add_location(p4, file$t, 768, 24, 16718);
    			attr_dev(p5, "class", "svelte-m3gqf");
    			add_location(p5, file$t, 772, 24, 16927);
    			attr_dev(p6, "class", "svelte-m3gqf");
    			add_location(p6, file$t, 773, 24, 16983);
    			attr_dev(p7, "class", "svelte-m3gqf");
    			add_location(p7, file$t, 774, 24, 17039);
    			attr_dev(div, "class", "PostContent svelte-m3gqf");
    			add_location(div, file$t, 738, 20, 15246);
    			attr_dev(article, "class", "PostArticle svelte-m3gqf");
    			add_location(article, file$t, 737, 16, 15196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div);
    			append_dev(div, h3);
    			h3.innerHTML = raw0_value;
    			append_dev(div, t0);
    			append_dev(div, p0);
    			p0.innerHTML = raw1_value;
    			append_dev(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t3);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t4);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t5);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t6);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t7);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t8);
    			append_dev(div, p1);
    			p1.innerHTML = raw2_value;
    			append_dev(div, t9);
    			append_dev(div, p2);
    			p2.innerHTML = raw3_value;
    			append_dev(div, t10);
    			append_dev(div, p3);
    			p3.innerHTML = raw4_value;
    			append_dev(div, t11);
    			append_dev(div, p4);
    			p4.innerHTML = raw5_value;
    			append_dev(div, t12);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t13);
    			append_dev(div, p5);
    			p5.innerHTML = raw6_value;
    			append_dev(div, t14);
    			append_dev(div, p6);
    			p6.innerHTML = raw7_value;
    			append_dev(div, t15);
    			append_dev(div, p7);
    			p7.innerHTML = raw8_value;
    			append_dev(article, t16);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && raw0_value !== (raw0_value = /*post*/ ctx[2].content.h1 + "")) h3.innerHTML = raw0_value;			if (dirty & /*elpost*/ 2 && raw1_value !== (raw1_value = /*post*/ ctx[2].content.p + "")) p0.innerHTML = raw1_value;
    			if (/*post*/ ctx[2].content.blockquote) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*post*/ ctx[2].content.p2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(div, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*post*/ ctx[2].content.p3) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_6(ctx);
    					if_block2.c();
    					if_block2.m(div, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*post*/ ctx[2].content.p4) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_5(ctx);
    					if_block3.c();
    					if_block3.m(div, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*post*/ ctx[2].content.p5) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_4(ctx);
    					if_block4.c();
    					if_block4.m(div, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*post*/ ctx[2].content.p6) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_3$1(ctx);
    					if_block5.c();
    					if_block5.m(div, t7);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*post*/ ctx[2].content.img1) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_2$2(ctx);
    					if_block6.c();
    					if_block6.m(div, t8);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (dirty & /*elpost*/ 2 && raw2_value !== (raw2_value = /*post*/ ctx[2].content.p7 + "")) p1.innerHTML = raw2_value;			if (dirty & /*elpost*/ 2 && raw3_value !== (raw3_value = /*post*/ ctx[2].content.p8 + "")) p2.innerHTML = raw3_value;			if (dirty & /*elpost*/ 2 && raw4_value !== (raw4_value = /*post*/ ctx[2].content.p9 + "")) p3.innerHTML = raw4_value;			if (dirty & /*elpost*/ 2 && raw5_value !== (raw5_value = /*post*/ ctx[2].content.p10 + "")) p4.innerHTML = raw5_value;
    			if (/*post*/ ctx[2].content.img2) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_1$2(ctx);
    					if_block7.c();
    					if_block7.m(div, t13);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (dirty & /*elpost*/ 2 && raw6_value !== (raw6_value = /*post*/ ctx[2].content.p11 + "")) p5.innerHTML = raw6_value;			if (dirty & /*elpost*/ 2 && raw7_value !== (raw7_value = /*post*/ ctx[2].content.p12 + "")) p6.innerHTML = raw7_value;			if (dirty & /*elpost*/ 2 && raw8_value !== (raw8_value = /*post*/ ctx[2].content.p13 + "")) p7.innerHTML = raw8_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(737:12) {#if (post.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (742:24) {#if post.content.blockquote}
    function create_if_block_8(ctx) {
    	let blockquote;
    	let strong;
    	let t0_value = /*post*/ ctx[2].content.blockquote.quote + "";
    	let t0;
    	let t1;
    	let small;
    	let t2_value = /*post*/ ctx[2].content.blockquote.author + "";
    	let t2;

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			t2 = text(t2_value);
    			attr_dev(strong, "class", "svelte-m3gqf");
    			add_location(strong, file$t, 743, 28, 15502);
    			attr_dev(small, "class", "svelte-m3gqf");
    			add_location(small, file$t, 744, 28, 15579);
    			attr_dev(blockquote, "class", "svelte-m3gqf");
    			add_location(blockquote, file$t, 742, 24, 15461);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);
    			append_dev(blockquote, strong);
    			append_dev(strong, t0);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, small);
    			append_dev(small, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && t0_value !== (t0_value = /*post*/ ctx[2].content.blockquote.quote + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*elpost*/ 2 && t2_value !== (t2_value = /*post*/ ctx[2].content.blockquote.author + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(742:24) {#if post.content.blockquote}",
    		ctx
    	});

    	return block;
    }

    // (748:24) {#if post.content.p2}
    function create_if_block_7(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p2 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-m3gqf");
    			add_location(p, file$t, 748, 28, 15770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && raw_value !== (raw_value = /*post*/ ctx[2].content.p2 + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(748:24) {#if post.content.p2}",
    		ctx
    	});

    	return block;
    }

    // (751:24) {#if post.content.p3}
    function create_if_block_6(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p3 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-m3gqf");
    			add_location(p, file$t, 751, 28, 15906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && raw_value !== (raw_value = /*post*/ ctx[2].content.p3 + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(751:24) {#if post.content.p3}",
    		ctx
    	});

    	return block;
    }

    // (754:24) {#if post.content.p4}
    function create_if_block_5(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p4 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-m3gqf");
    			add_location(p, file$t, 754, 28, 16042);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && raw_value !== (raw_value = /*post*/ ctx[2].content.p4 + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(754:24) {#if post.content.p4}",
    		ctx
    	});

    	return block;
    }

    // (757:24) {#if post.content.p5}
    function create_if_block_4(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p5 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-m3gqf");
    			add_location(p, file$t, 757, 28, 16178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && raw_value !== (raw_value = /*post*/ ctx[2].content.p5 + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(757:24) {#if post.content.p5}",
    		ctx
    	});

    	return block;
    }

    // (760:24) {#if post.content.p6}
    function create_if_block_3$1(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p6 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-m3gqf");
    			add_location(p, file$t, 760, 28, 16314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && raw_value !== (raw_value = /*post*/ ctx[2].content.p6 + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(760:24) {#if post.content.p6}",
    		ctx
    	});

    	return block;
    }

    // (763:24) {#if post.content.img1}
    function create_if_block_2$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/" + /*post*/ ctx[2].content.img1)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Imagen");
    			attr_dev(img, "class", "svelte-m3gqf");
    			add_location(img, file$t, 763, 28, 16452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && img.src !== (img_src_value = "/" + /*post*/ ctx[2].content.img1)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(763:24) {#if post.content.img1}",
    		ctx
    	});

    	return block;
    }

    // (770:24) {#if post.content.img2}
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/" + /*post*/ ctx[2].content.img2)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Imagen");
    			attr_dev(img, "class", "svelte-m3gqf");
    			add_location(img, file$t, 770, 28, 16826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && img.src !== (img_src_value = "/" + /*post*/ ctx[2].content.img2)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(770:24) {#if post.content.img2}",
    		ctx
    	});

    	return block;
    }

    // (736:12) {#each elpost as post}
    function create_each_block$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*post*/ ctx[2].slug === /*slug*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*post*/ ctx[2].slug === /*slug*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(736:12) {#each elpost as post}",
    		ctx
    	});

    	return block;
    }

    // (734:8) <Area>
    function create_default_slot_2$1(ctx) {
    	let div;
    	let each_value = /*elpost*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "Post svelte-m3gqf");
    			add_location(div, file$t, 734, 12, 15087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost, slug*/ 3) {
    				each_value = /*elpost*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(734:8) <Area>",
    		ctx
    	});

    	return block;
    }

    // (733:4) <ContentArea>
    function create_default_slot_1$1(ctx) {
    	let area;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_changes = {};

    			if (dirty & /*$$scope, elpost, slug*/ 515) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(733:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (725:0) <Content>
    function create_default_slot$3(ctx) {
    	let t;
    	let contentarea;
    	let current;
    	let each_value_1 = /*elpost*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost, slug*/ 3) {
    				each_value_1 = /*elpost*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			const contentarea_changes = {};

    			if (dirty & /*$$scope, elpost, slug*/ 515) {
    				contentarea_changes.$$scope = { dirty, ctx };
    			}

    			contentarea.$set(contentarea_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentarea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentarea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(725:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let t0;
    	let t1;
    	let content;
    	let current;
    	let each_value_2 = /*elpost*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(content.$$.fragment);
    			document.title = "Blog de TODH";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*elpost, slug*/ 3) {
    				each_value_2 = /*elpost*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const content_changes = {};

    			if (dirty & /*$$scope, elpost, slug*/ 515) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { slug } = $$props;
    	let elpost = [];

    	onMount(async () => {
    		const res = await fetch("/data/posts.json");
    		$$invalidate(1, elpost = [...await res.json()]);
    	});

    	const writable_props = ["slug"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<U5Bslugu5D> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("U5Bslugu5D", $$slots, []);

    	$$self.$set = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		url,
    		PageTitle,
    		Content,
    		ContentArea,
    		Area,
    		slug,
    		elpost
    	});

    	$$self.$inject_state = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    		if ("elpost" in $$props) $$invalidate(1, elpost = $$props.elpost);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [slug, elpost];
    }

    class U5Bslugu5D extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { slug: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "U5Bslugu5D",
    			options,
    			id: create_fragment$u.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*slug*/ ctx[0] === undefined && !("slug" in props)) {
    			console.warn("<U5Bslugu5D> was created without expected prop 'slug'");
    		}
    	}

    	get slug() {
    		throw new Error("<U5Bslugu5D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slug(value) {
    		throw new Error("<U5Bslugu5D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/blog/index.svelte generated by Svelte v3.23.2 */
    const file$u = "src/pages/blog/index.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (695:4) {#each posts as post}
    function create_each_block$5(ctx) {
    	let div;
    	let a;
    	let card;
    	let a_href_value;
    	let t;
    	let current;

    	card = new Card({
    			props: {
    				title: /*post*/ ctx[2].title,
    				description: "",
    				image: /*post*/ ctx[2].imagen,
    				variante: 3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			create_component(card.$$.fragment);
    			t = space();
    			attr_dev(a, "href", a_href_value = "/blog/" + /*$url*/ ctx[1](/*post*/ ctx[2].slug));
    			attr_dev(a, "class", "svelte-57yy9z");
    			add_location(a, file$u, 696, 6, 14362);
    			attr_dev(div, "class", "svelte-57yy9z");
    			add_location(div, file$u, 695, 4, 14350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			mount_component(card, a, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*posts*/ 1) card_changes.title = /*post*/ ctx[2].title;
    			if (dirty & /*posts*/ 1) card_changes.image = /*post*/ ctx[2].imagen;

    			if (dirty & /*$$scope*/ 32) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);

    			if (!current || dirty & /*$url, posts*/ 3 && a_href_value !== (a_href_value = "/blog/" + /*$url*/ ctx[1](/*post*/ ctx[2].slug))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(695:4) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    // (694:2) <Cards>
    function create_default_slot_1$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*posts*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url, posts*/ 3) {
    				each_value = /*posts*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(694:2) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (693:0) <Content>
    function create_default_slot$4(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cards.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cards, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cards_changes = {};

    			if (dirty & /*$$scope, posts, $url*/ 35) {
    				cards_changes.$$scope = { dirty, ctx };
    			}

    			cards.$set(cards_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(693:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let t0;
    	let pagetitle;
    	let t1;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "Blog",
    				pageSubTitle: "My crazy thoughts"
    			},
    			$$inline: true
    		});

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(pagetitle.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    			document.title = "Blog de TODH";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(pagetitle, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope, posts, $url*/ 35) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(pagetitle, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $url;
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(1, $url = $$value));
    	let posts = [];

    	onMount(async () => {
    		const res = await fetch("/data/posts.json");
    		$$invalidate(0, posts = [...await res.json()]);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Blog", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		url,
    		isActive,
    		PageTitle,
    		Loading,
    		Content,
    		ContentArea,
    		Area,
    		Cards,
    		Card,
    		posts,
    		$url
    	});

    	$$self.$inject_state = $$props => {
    		if ("posts" in $$props) $$invalidate(0, posts = $$props.posts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [posts, $url];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/components/CodeBlock.svelte generated by Svelte v3.23.2 */

    const file$v = "src/components/CodeBlock.svelte";

    // (701:4) {#if header}
    function create_if_block$6(ctx) {
    	let h5;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t = text(/*header*/ ctx[2]);
    			attr_dev(h5, "class", "svelte-1i4njt");
    			add_location(h5, file$v, 701, 8, 14179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*header*/ 4) set_data_dev(t, /*header*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(701:4) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let div;
    	let t0;
    	let pre;
    	let code_1;
    	let t1;
    	let code_1_class_value;
    	let if_block = /*header*/ ctx[2] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			pre = element("pre");
    			code_1 = element("code");
    			t1 = text(/*code*/ ctx[1]);
    			attr_dev(code_1, "class", code_1_class_value = "language-" + /*language*/ ctx[0] + " svelte-1i4njt");
    			add_location(code_1, file$v, 703, 9, 14216);
    			attr_dev(pre, "class", "svelte-1i4njt");
    			add_location(pre, file$v, 703, 4, 14211);
    			attr_dev(div, "class", "CodeBlock svelte-1i4njt");
    			add_location(div, file$v, 699, 0, 14130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, pre);
    			append_dev(pre, code_1);
    			append_dev(code_1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*header*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*code*/ 2) set_data_dev(t1, /*code*/ ctx[1]);

    			if (dirty & /*language*/ 1 && code_1_class_value !== (code_1_class_value = "language-" + /*language*/ ctx[0] + " svelte-1i4njt")) {
    				attr_dev(code_1, "class", code_1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { language } = $$props;
    	let { code } = $$props;
    	let { header } = $$props;
    	const writable_props = ["language", "code", "header"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CodeBlock> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CodeBlock", $$slots, []);

    	$$self.$set = $$props => {
    		if ("language" in $$props) $$invalidate(0, language = $$props.language);
    		if ("code" in $$props) $$invalidate(1, code = $$props.code);
    		if ("header" in $$props) $$invalidate(2, header = $$props.header);
    	};

    	$$self.$capture_state = () => ({ language, code, header });

    	$$self.$inject_state = $$props => {
    		if ("language" in $$props) $$invalidate(0, language = $$props.language);
    		if ("code" in $$props) $$invalidate(1, code = $$props.code);
    		if ("header" in $$props) $$invalidate(2, header = $$props.header);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [language, code, header];
    }

    class CodeBlock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { language: 0, code: 1, header: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CodeBlock",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*language*/ ctx[0] === undefined && !("language" in props)) {
    			console.warn("<CodeBlock> was created without expected prop 'language'");
    		}

    		if (/*code*/ ctx[1] === undefined && !("code" in props)) {
    			console.warn("<CodeBlock> was created without expected prop 'code'");
    		}

    		if (/*header*/ ctx[2] === undefined && !("header" in props)) {
    			console.warn("<CodeBlock> was created without expected prop 'header'");
    		}
    	}

    	get language() {
    		throw new Error("<CodeBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set language(value) {
    		throw new Error("<CodeBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get code() {
    		throw new Error("<CodeBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<CodeBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<CodeBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<CodeBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MainFeatures.svelte generated by Svelte v3.23.2 */
    const file$w = "src/components/MainFeatures.svelte";

    function create_fragment$x(ctx) {
    	let div3;
    	let div0;
    	let a0;
    	let figure0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let figcaption0;
    	let h40;
    	let t2;
    	let p0;
    	let t4;
    	let small0;
    	let t6;
    	let div1;
    	let a1;
    	let figure1;
    	let codeblock;
    	let t7;
    	let figcaption1;
    	let h41;
    	let t9;
    	let p1;
    	let t11;
    	let small1;
    	let t13;
    	let div2;
    	let a2;
    	let figure2;
    	let img1;
    	let img1_src_value;
    	let t14;
    	let figcaption2;
    	let h42;
    	let t16;
    	let p2;
    	let t18;
    	let small2;
    	let current;

    	codeblock = new CodeBlock({
    			props: {
    				header: false,
    				language: "javascript",
    				code: /*code_javascript*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			figure0 = element("figure");
    			img0 = element("img");
    			t0 = space();
    			figcaption0 = element("figcaption");
    			h40 = element("h4");
    			h40.textContent = "Coagulando la vibración";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "TODH traído a la materia como objeto de contemplación. Obra plástica e impresiones 3D";
    			t4 = space();
    			small0 = element("small");
    			small0.textContent = "Learn more >";
    			t6 = space();
    			div1 = element("div");
    			a1 = element("a");
    			figure1 = element("figure");
    			create_component(codeblock.$$.fragment);
    			t7 = space();
    			figcaption1 = element("figcaption");
    			h41 = element("h4");
    			h41.textContent = "Hello Cosmos!";
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "TODH en el diseño Frontend y mi workflow de creación digital ideal.";
    			t11 = space();
    			small1 = element("small");
    			small1.textContent = "Learn more >";
    			t13 = space();
    			div2 = element("div");
    			a2 = element("a");
    			figure2 = element("figure");
    			img1 = element("img");
    			t14 = space();
    			figcaption2 = element("figcaption");
    			h42 = element("h4");
    			h42.textContent = "Sentir-Orden-Forma-Conexión";
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "Laboratorio de experiencias y bitácora de reflexiones en torno al proceso de la Creación desde la Sabiduría Primigenia.";
    			t18 = space();
    			small2 = element("small");
    			small2.textContent = "Learn more >";
    			if (img0.src !== (img0_src_value = "img/img1.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-13vmpk6");
    			add_location(img0, file$w, 731, 16, 15300);
    			attr_dev(h40, "class", "svelte-13vmpk6");
    			add_location(h40, file$w, 733, 20, 15410);
    			attr_dev(p0, "class", "svelte-13vmpk6");
    			add_location(p0, file$w, 734, 20, 15463);
    			attr_dev(small0, "class", "svelte-13vmpk6");
    			add_location(small0, file$w, 735, 20, 15576);
    			attr_dev(figcaption0, "class", "MainFeature__caption svelte-13vmpk6");
    			add_location(figcaption0, file$w, 732, 16, 15348);
    			attr_dev(figure0, "class", "MainFeature svelte-13vmpk6");
    			add_location(figure0, file$w, 730, 12, 15255);
    			attr_dev(a0, "href", "/products");
    			attr_dev(a0, "class", "svelte-13vmpk6");
    			add_location(a0, file$w, 729, 8, 15222);
    			attr_dev(div0, "class", "svelte-13vmpk6");
    			add_location(div0, file$w, 728, 4, 15208);
    			attr_dev(h41, "class", "svelte-13vmpk6");
    			add_location(h41, file$w, 745, 20, 15927);
    			attr_dev(p1, "class", "svelte-13vmpk6");
    			add_location(p1, file$w, 746, 12, 15962);
    			attr_dev(small1, "class", "svelte-13vmpk6");
    			add_location(small1, file$w, 747, 12, 16049);
    			attr_dev(figcaption1, "class", "MainFeature__caption svelte-13vmpk6");
    			add_location(figcaption1, file$w, 744, 16, 15865);
    			attr_dev(figure1, "class", "MainFeature svelte-13vmpk6");
    			add_location(figure1, file$w, 742, 12, 15733);
    			attr_dev(a1, "href", "/styleguide");
    			attr_dev(a1, "class", "svelte-13vmpk6");
    			add_location(a1, file$w, 741, 8, 15698);
    			attr_dev(div1, "class", "svelte-13vmpk6");
    			add_location(div1, file$w, 740, 4, 15684);
    			if (img1.src !== (img1_src_value = "img/grafico-6.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-13vmpk6");
    			add_location(img1, file$w, 755, 16, 16245);
    			attr_dev(h42, "class", "svelte-13vmpk6");
    			add_location(h42, file$w, 757, 16, 16352);
    			attr_dev(p2, "class", "svelte-13vmpk6");
    			add_location(p2, file$w, 758, 12, 16401);
    			attr_dev(small2, "class", "svelte-13vmpk6");
    			add_location(small2, file$w, 759, 12, 16540);
    			attr_dev(figcaption2, "class", "MainFeature__caption svelte-13vmpk6");
    			add_location(figcaption2, file$w, 756, 12, 16294);
    			attr_dev(figure2, "class", "MainFeature svelte-13vmpk6");
    			add_location(figure2, file$w, 754, 12, 16200);
    			attr_dev(a2, "href", "/blog");
    			attr_dev(a2, "class", "svelte-13vmpk6");
    			add_location(a2, file$w, 753, 8, 16171);
    			attr_dev(div2, "class", "svelte-13vmpk6");
    			add_location(div2, file$w, 752, 4, 16157);
    			attr_dev(div3, "class", "MainFeatures svelte-13vmpk6");
    			add_location(div3, file$w, 727, 0, 15177);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, a0);
    			append_dev(a0, figure0);
    			append_dev(figure0, img0);
    			append_dev(figure0, t0);
    			append_dev(figure0, figcaption0);
    			append_dev(figcaption0, h40);
    			append_dev(figcaption0, t2);
    			append_dev(figcaption0, p0);
    			append_dev(figcaption0, t4);
    			append_dev(figcaption0, small0);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, a1);
    			append_dev(a1, figure1);
    			mount_component(codeblock, figure1, null);
    			append_dev(figure1, t7);
    			append_dev(figure1, figcaption1);
    			append_dev(figcaption1, h41);
    			append_dev(figcaption1, t9);
    			append_dev(figcaption1, p1);
    			append_dev(figcaption1, t11);
    			append_dev(figcaption1, small1);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, a2);
    			append_dev(a2, figure2);
    			append_dev(figure2, img1);
    			append_dev(figure2, t14);
    			append_dev(figure2, figcaption2);
    			append_dev(figcaption2, h42);
    			append_dev(figcaption2, t16);
    			append_dev(figcaption2, p2);
    			append_dev(figcaption2, t18);
    			append_dev(figcaption2, small2);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(codeblock);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let code_javascript = `let message = "Cosmos";
.helloCosmos {
    background-color: black;
}
<p class="helloCosmos">
    Hello { message }!
</p>`;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainFeatures> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("MainFeatures", $$slots, []);
    	$$self.$capture_state = () => ({ IconCuatro, code_javascript, CodeBlock });

    	$$self.$inject_state = $$props => {
    		if ("code_javascript" in $$props) $$invalidate(0, code_javascript = $$props.code_javascript);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [code_javascript];
    }

    class MainFeatures extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainFeatures",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* src/components/CoverIntroCarousel.svelte generated by Svelte v3.23.2 */

    const file$x = "src/components/CoverIntroCarousel.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (694:1) {#each [carouselPhotos[index]] as src (index)}
    function create_each_block$6(key_1, ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*src*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1v2o1pv");
    			add_location(img, file$x, 694, 2, 14213);
    			this.first = img;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*next*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 1 && img.src !== (img_src_value = /*src*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(694:1) {#each [carouselPhotos[index]] as src (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = [/*carouselPhotos*/ ctx[1][/*index*/ ctx[0]]];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[0];
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ImageCarouselContainer svelte-1v2o1pv");
    			add_location(div, file$x, 692, 0, 14126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*carouselPhotos, index, next*/ 7) {
    				const each_value = [/*carouselPhotos*/ ctx[1][/*index*/ ctx[0]]];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$6, null, get_each_context$6);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	const carouselPhotos = [
    		"img/grafico-cero.svg",
    		"img/grafico-uno.svg",
    		"img/grafico-dos.svg",
    		"img/grafico-tres.svg",
    		"img/grafico-cuatro.svg"
    	];

    	let index = 0;

    	const next = () => {
    		$$invalidate(0, index = (index + 1) % carouselPhotos.length);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CoverIntroCarousel> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CoverIntroCarousel", $$slots, []);
    	$$self.$capture_state = () => ({ carouselPhotos, index, next });

    	$$self.$inject_state = $$props => {
    		if ("index" in $$props) $$invalidate(0, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [index, carouselPhotos, next];
    }

    class CoverIntroCarousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CoverIntroCarousel",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(compare) {
      if (compare.length === 1) compare = ascendingComparator(compare);
      return {
        left: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        },
        right: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) > 0) hi = mid;
            else lo = mid + 1;
          }
          return lo;
        }
      };
    }

    function ascendingComparator(f) {
      return function(d, x) {
        return ascending(f(d), x);
      };
    }

    var ascendingBisect = bisector(ascending);
    var bisectRight = ascendingBisect.right;

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));
        while (++i < n) ticks[i] = (start + i) * step;
      } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));
        while (++i < n) ticks[i] = (start - i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    var prefix = "$";

    function Map$1() {}

    Map$1.prototype = map.prototype = {
      constructor: Map$1,
      has: function(key) {
        return (prefix + key) in this;
      },
      get: function(key) {
        return this[prefix + key];
      },
      set: function(key, value) {
        this[prefix + key] = value;
        return this;
      },
      remove: function(key) {
        var property = prefix + key;
        return property in this && delete this[property];
      },
      clear: function() {
        for (var property in this) if (property[0] === prefix) delete this[property];
      },
      keys: function() {
        var keys = [];
        for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
        return keys;
      },
      values: function() {
        var values = [];
        for (var property in this) if (property[0] === prefix) values.push(this[property]);
        return values;
      },
      entries: function() {
        var entries = [];
        for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
        return entries;
      },
      size: function() {
        var size = 0;
        for (var property in this) if (property[0] === prefix) ++size;
        return size;
      },
      empty: function() {
        for (var property in this) if (property[0] === prefix) return false;
        return true;
      },
      each: function(f) {
        for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
      }
    };

    function map(object, f) {
      var map = new Map$1;

      // Copy constructor.
      if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

      // Index array by numeric index or specified key function.
      else if (Array.isArray(object)) {
        var i = -1,
            n = object.length,
            o;

        if (f == null) while (++i < n) map.set(i, object[i]);
        else while (++i < n) map.set(f(o = object[i], i, object), o);
      }

      // Convert object to map.
      else if (object) for (var key in object) map.set(key, object[key]);

      return map;
    }

    function Set$1() {}

    var proto = map.prototype;

    Set$1.prototype = set.prototype = {
      constructor: Set$1,
      has: proto.has,
      add: function(value) {
        value += "";
        this[prefix + value] = value;
        return this;
      },
      remove: proto.remove,
      clear: proto.clear,
      values: proto.keys,
      size: proto.size,
      empty: proto.empty,
      each: proto.each
    };

    function set(object, f) {
      var set = new Set$1;

      // Copy constructor.
      if (object instanceof Set$1) object.each(function(value) { set.add(value); });

      // Otherwise, assume it’s an array.
      else if (object) {
        var i = -1, n = object.length;
        if (f == null) while (++i < n) set.add(object[i]);
        else while (++i < n) set.add(f(object[i], i, object));
      }

      return set;
    }

    var array = Array.prototype;

    var map$1 = array.map;
    var slice = array.slice;

    var implicit = {name: "implicit"};

    function ordinal() {
      var index = map(),
          domain = [],
          range = [],
          unknown = implicit;

      function scale(d) {
        var key = d + "", i = index.get(key);
        if (!i) {
          if (unknown !== implicit) return unknown;
          index.set(key, i = domain.push(d));
        }
        return range[(i - 1) % range.length];
      }

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = map();
        var i = -1, n = _.length, d, key;
        while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
        return scale;
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), scale) : range.slice();
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return ordinal(domain, range).unknown(unknown);
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    function constant(x) {
      return function() {
        return x;
      };
    }

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolateValue(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function interpolateString(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolateValue(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    var degrees = 180 / Math.PI;

    var identity$1 = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1
    };

    function decompose(a, b, c, d, e, f) {
      var scaleX, scaleY, skewX;
      if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
      if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
      if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
      if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
      return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
      };
    }

    var cssNode,
        cssRoot,
        cssView,
        svgNode;

    function parseCss(value) {
      if (value === "none") return identity$1;
      if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
      cssNode.style.transform = value;
      value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
      cssRoot.removeChild(cssNode);
      value = value.slice(7, -1).split(",");
      return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
    }

    function parseSvg(value) {
      if (value == null) return identity$1;
      if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svgNode.setAttribute("transform", value);
      if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
      value = value.matrix;
      return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
    }

    function interpolateTransform(parse, pxComma, pxParen, degParen) {

      function pop(s) {
        return s.length ? s.pop() + " " : "";
      }

      function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push("translate(", null, pxComma, null, pxParen);
          q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
        } else if (xb || yb) {
          s.push("translate(" + xb + pxComma + yb + pxParen);
        }
      }

      function rotate(a, b, s, q) {
        if (a !== b) {
          if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
          q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
        } else if (b) {
          s.push(pop(s) + "rotate(" + b + degParen);
        }
      }

      function skewX(a, b, s, q) {
        if (a !== b) {
          q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
        } else if (b) {
          s.push(pop(s) + "skewX(" + b + degParen);
        }
      }

      function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push(pop(s) + "scale(", null, ",", null, ")");
          q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
        } else if (xb !== 1 || yb !== 1) {
          s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
      }

      return function(a, b) {
        var s = [], // string constants and placeholders
            q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
          var i = -1, n = q.length, o;
          while (++i < n) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        };
      };
    }

    var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
    var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

    var rho = Math.SQRT2,
        rho2 = 2,
        rho4 = 4,
        epsilon2 = 1e-12;

    function cosh(x) {
      return ((x = Math.exp(x)) + 1 / x) / 2;
    }

    function sinh(x) {
      return ((x = Math.exp(x)) - 1 / x) / 2;
    }

    function tanh(x) {
      return ((x = Math.exp(2 * x)) - 1) / (x + 1);
    }

    // p0 = [ux0, uy0, w0]
    // p1 = [ux1, uy1, w1]
    function interpolateZoom(p0, p1) {
      var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
          ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
          dx = ux1 - ux0,
          dy = uy1 - uy0,
          d2 = dx * dx + dy * dy,
          i,
          S;

      // Special case for u0 ≅ u1.
      if (d2 < epsilon2) {
        S = Math.log(w1 / w0) / rho;
        i = function(t) {
          return [
            ux0 + t * dx,
            uy0 + t * dy,
            w0 * Math.exp(rho * t * S)
          ];
        };
      }

      // General case.
      else {
        var d1 = Math.sqrt(d2),
            b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
            b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
            r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
            r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
        S = (r1 - r0) / rho;
        i = function(t) {
          var s = t * S,
              coshr0 = cosh(r0),
              u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
          return [
            ux0 + u * dx,
            uy0 + u * dy,
            w0 * coshr0 / cosh(rho * s + r0)
          ];
        };
      }

      i.duration = S * 1000;

      return i;
    }

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$2(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constant$1(isNaN(b) ? NaN : 0.5);
    }

    function clamper(domain) {
      var a = domain[0], b = domain[domain.length - 1], t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate = interpolateValue,
          transform,
          untransform,
          unknown,
          clamp = identity$2,
          piecewise,
          output,
          input;

      function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = map$1.call(_, number), clamp === identity$2 || (clamp = clamper(domain)), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = slice.call(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? clamper(domain) : identity$2, scale) : clamp !== identity$2;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous(transform, untransform) {
      return transformer()(transform, untransform);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimal(1.23) returns ["123", 0].
    function formatDecimal(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": function(x, p) { return (x * 100).toFixed(p); },
      "b": function(x) { return Math.round(x).toString(2); },
      "c": function(x) { return x + ""; },
      "d": function(x) { return Math.round(x).toString(10); },
      "e": function(x, p) { return x.toExponential(p); },
      "f": function(x, p) { return x.toFixed(p); },
      "g": function(x, p) { return x.toPrecision(p); },
      "o": function(x) { return Math.round(x).toString(8); },
      "p": function(x, p) { return formatRounded(x * 100, p); },
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
      "x": function(x) { return Math.round(x).toString(16); }
    };

    function identity$3(x) {
      return x;
    }

    var map$2 = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$3 : formatGroup(map$2.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$3 : formatNumerals(map$2.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "-" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""],
      minus: "-"
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain(),
            i0 = 0,
            i1 = d.length - 1,
            start = d[i0],
            stop = d[i1],
            step;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }

        step = tickIncrement(start, stop, count);

        if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
          step = tickIncrement(start, stop, count);
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
          step = tickIncrement(start, stop, count);
        }

        if (step > 0) {
          d[i0] = Math.floor(start / step) * step;
          d[i1] = Math.ceil(stop / step) * step;
          domain(d);
        } else if (step < 0) {
          d[i0] = Math.ceil(start * step) / step;
          d[i1] = Math.floor(stop * step) / step;
          domain(d);
        }

        return scale;
      };

      return scale;
    }

    function linear$1() {
      var scale = continuous(identity$2, identity$2);

      scale.copy = function() {
        return copy(scale, linear$1());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    var noop$1 = {value: function() {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set$1(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function empty$1() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty$1 : function() {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll(select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function matcher(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant$2(x) {
      return function() {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (keyValue in nodeByKeyValue) {
            exit[i] = node;
          } else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue[keyValue] = null;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
          exit[i] = node;
        }
      }
    }

    function selection_data(value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function(d) { data[++j] = d; });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$2(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit() {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_join(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
      if (onupdate != null) update = onupdate(update);
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge(selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending$1;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      var nodes = new Array(this.size()), i = -1;
      this.each(function() { nodes[++i] = this; });
      return nodes;
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      var size = 0;
      this.each(function() { ++size; });
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)
          : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove : typeof value === "function"
                ? styleFunction
                : styleConstant)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction
              : textConstant)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_cloneShallow() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    var filterEvents = {};

    var event = null;

    if (typeof document !== "undefined") {
      var element$1 = document.documentElement;
      if (!("onmouseenter" in element$1)) {
        filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function(event) {
        var related = event.relatedTarget;
        if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function(event1) {
        var event0 = event; // Events can be reentrant (e.g., focus).
        event = event1;
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
          event = event0;
        }
      };
    }

    function parseTypenames$1(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, capture) {
      var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
      return this;
    }

    function customEvent(event1, listener, that, args) {
      var event0 = event;
      event1.sourceEvent = event;
      event = event1;
      try {
        return listener.apply(that, args);
      } finally {
        event = event0;
      }
    }

    function dispatchEvent$1(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent$1(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent$1(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection([[document.documentElement]], root);
    }

    Selection.prototype = selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      join: selection_join,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      clone: selection_clone,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection([[document.querySelector(selector)]], [document.documentElement])
          : new Selection([[selector]], root);
    }

    function sourceEvent() {
      var current = event, source;
      while (source = current.sourceEvent) current = source;
      return current;
    }

    function point(node, event) {
      var svg = node.ownerSVGElement || node;

      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }

      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }

    function mouse(node) {
      var event = sourceEvent();
      if (event.changedTouches) event = event.changedTouches[0];
      return point(node, event);
    }

    function selectAll(selector) {
      return typeof selector === "string"
          ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
          : new Selection([selector == null ? [] : selector], root);
    }

    function touch(node, touches, identifier) {
      if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

      for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
        if ((touch = touches[i]).identifier === identifier) {
          return point(node, touch);
        }
      }

      return null;
    }

    function nopropagation() {
      event.stopImmediatePropagation();
    }

    function noevent() {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function dragDisable(view) {
      var root = view.document.documentElement,
          selection = select(view).on("dragstart.drag", noevent, true);
      if ("onselectstart" in root) {
        selection.on("selectstart.drag", noevent, true);
      } else {
        root.__noselect = root.style.MozUserSelect;
        root.style.MozUserSelect = "none";
      }
    }

    function yesdrag(view, noclick) {
      var root = view.document.documentElement,
          selection = select(view).on("dragstart.drag", null);
      if (noclick) {
        selection.on("click.drag", noevent, true);
        setTimeout(function() { selection.on("click.drag", null); }, 0);
      }
      if ("onselectstart" in root) {
        selection.on("selectstart.drag", null);
      } else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
      }
    }

    function constant$3(x) {
      return function() {
        return x;
      };
    }

    function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
      this.target = target;
      this.type = type;
      this.subject = subject;
      this.identifier = id;
      this.active = active;
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this._ = dispatch;
    }

    DragEvent.prototype.on = function() {
      var value = this._.on.apply(this._, arguments);
      return value === this._ ? this : value;
    };

    // Ignore right-click, since that should open the context menu.
    function defaultFilter() {
      return !event.ctrlKey && !event.button;
    }

    function defaultContainer() {
      return this.parentNode;
    }

    function defaultSubject(d) {
      return d == null ? {x: event.x, y: event.y} : d;
    }

    function defaultTouchable() {
      return navigator.maxTouchPoints || ("ontouchstart" in this);
    }

    function drag() {
      var filter = defaultFilter,
          container = defaultContainer,
          subject = defaultSubject,
          touchable = defaultTouchable,
          gestures = {},
          listeners = dispatch("start", "drag", "end"),
          active = 0,
          mousedownx,
          mousedowny,
          mousemoving,
          touchending,
          clickDistance2 = 0;

      function drag(selection) {
        selection
            .on("mousedown.drag", mousedowned)
          .filter(touchable)
            .on("touchstart.drag", touchstarted)
            .on("touchmove.drag", touchmoved)
            .on("touchend.drag touchcancel.drag", touchended)
            .style("touch-action", "none")
            .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
      }

      function mousedowned() {
        if (touchending || !filter.apply(this, arguments)) return;
        var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
        if (!gesture) return;
        select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
        dragDisable(event.view);
        nopropagation();
        mousemoving = false;
        mousedownx = event.clientX;
        mousedowny = event.clientY;
        gesture("start");
      }

      function mousemoved() {
        noevent();
        if (!mousemoving) {
          var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
          mousemoving = dx * dx + dy * dy > clickDistance2;
        }
        gestures.mouse("drag");
      }

      function mouseupped() {
        select(event.view).on("mousemove.drag mouseup.drag", null);
        yesdrag(event.view, mousemoving);
        noevent();
        gestures.mouse("end");
      }

      function touchstarted() {
        if (!filter.apply(this, arguments)) return;
        var touches = event.changedTouches,
            c = container.apply(this, arguments),
            n = touches.length, i, gesture;

        for (i = 0; i < n; ++i) {
          if (gesture = beforestart(touches[i].identifier, c, touch, this, arguments)) {
            nopropagation();
            gesture("start");
          }
        }
      }

      function touchmoved() {
        var touches = event.changedTouches,
            n = touches.length, i, gesture;

        for (i = 0; i < n; ++i) {
          if (gesture = gestures[touches[i].identifier]) {
            noevent();
            gesture("drag");
          }
        }
      }

      function touchended() {
        var touches = event.changedTouches,
            n = touches.length, i, gesture;

        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
        for (i = 0; i < n; ++i) {
          if (gesture = gestures[touches[i].identifier]) {
            nopropagation();
            gesture("end");
          }
        }
      }

      function beforestart(id, container, point, that, args) {
        var p = point(container, id), s, dx, dy,
            sublisteners = listeners.copy();

        if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
          if ((event.subject = s = subject.apply(that, args)) == null) return false;
          dx = s.x - p[0] || 0;
          dy = s.y - p[1] || 0;
          return true;
        })) return;

        return function gesture(type) {
          var p0 = p, n;
          switch (type) {
            case "start": gestures[id] = gesture, n = active++; break;
            case "end": delete gestures[id], --active; // nobreak
            case "drag": p = point(container, id), n = active; break;
          }
          customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
        };
      }

      drag.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant$3(!!_), drag) : filter;
      };

      drag.container = function(_) {
        return arguments.length ? (container = typeof _ === "function" ? _ : constant$3(_), drag) : container;
      };

      drag.subject = function(_) {
        return arguments.length ? (subject = typeof _ === "function" ? _ : constant$3(_), drag) : subject;
      };

      drag.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$3(!!_), drag) : touchable;
      };

      drag.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? drag : value;
      };

      drag.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
      };

      return drag;
    }

    var frame = 0, // is an animation frame pending?
        timeout = 0, // is a timeout pending?
        interval = 0, // are any timers active?
        pokeDelay = 1000, // how frequently we check for clock skew
        taskHead,
        taskTail,
        clockLast = 0,
        clockNow = 0,
        clockSkew = 0,
        clock = typeof performance === "object" && performance.now ? performance : Date,
        setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call =
      this._time =
      this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;
          else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer;
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead, e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(), delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0, t1 = taskHead, t2, time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout) timeout = clearTimeout(timeout);
      var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
      if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    function timeout$1(callback, delay, time) {
      var t = new Timer;
      delay = delay == null ? 0 : +delay;
      t.restart(function(elapsed) {
        t.stop();
        callback(elapsed + delay);
      }, delay, time);
      return t;
    }

    var emptyOn = dispatch("start", "end", "cancel", "interrupt");
    var emptyTween = [];

    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;

    function schedule(node, name, id, index, group, timing) {
      var schedules = node.__transition;
      if (!schedules) node.__transition = {};
      else if (id in schedules) return;
      create(node, id, {
        name: name,
        index: index, // For context during callback.
        group: group, // For context during callback.
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
      });
    }

    function init$2(node, id) {
      var schedule = get$1(node, id);
      if (schedule.state > CREATED) throw new Error("too late; already scheduled");
      return schedule;
    }

    function set$2(node, id) {
      var schedule = get$1(node, id);
      if (schedule.state > STARTED) throw new Error("too late; already running");
      return schedule;
    }

    function get$1(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
      return schedule;
    }

    function create(node, id, self) {
      var schedules = node.__transition,
          tween;

      // Initialize the self timer when the transition is created.
      // Note the actual delay is not known until the first callback!
      schedules[id] = self;
      self.timer = timer(schedule, 0, self.time);

      function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);

        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
      }

      function start(elapsed) {
        var i, j, n, o;

        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();

        for (i in schedules) {
          o = schedules[i];
          if (o.name !== self.name) continue;

          // While this element already has a starting transition during this frame,
          // defer starting an interrupting transition until that transition has a
          // chance to tick (and possibly end); see d3/d3-transition#54!
          if (o.state === STARTED) return timeout$1(start);

          // Interrupt the active transition, if any.
          if (o.state === RUNNING) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("interrupt", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }

          // Cancel any pre-empted transitions.
          else if (+i < id) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("cancel", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }
        }

        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        timeout$1(function() {
          if (self.state === STARTED) {
            self.state = RUNNING;
            self.timer.restart(tick, self.delay, self.time);
            tick(elapsed);
          }
        });

        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;

        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for (i = 0, j = -1; i < n; ++i) {
          if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
            tween[++j] = o;
          }
        }
        tween.length = j + 1;
      }

      function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
            i = -1,
            n = tween.length;

        while (++i < n) {
          tween[i].call(node, t);
        }

        // Dispatch the end event.
        if (self.state === ENDING) {
          self.on.call("end", node, node.__data__, self.index, self.group);
          stop();
        }
      }

      function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for (var i in schedules) return; // eslint-disable-line no-unused-vars
        delete node.__transition;
      }
    }

    function interrupt(node, name) {
      var schedules = node.__transition,
          schedule,
          active,
          empty = true,
          i;

      if (!schedules) return;

      name = name == null ? null : name + "";

      for (i in schedules) {
        if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
        active = schedule.state > STARTING && schedule.state < ENDING;
        schedule.state = ENDED;
        schedule.timer.stop();
        schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
      }

      if (empty) delete node.__transition;
    }

    function selection_interrupt(name) {
      return this.each(function() {
        interrupt(this, name);
      });
    }

    function tweenRemove(id, name) {
      var tween0, tween1;
      return function() {
        var schedule = set$2(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = tween0 = tween;
          for (var i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1 = tween1.slice();
              tween1.splice(i, 1);
              break;
            }
          }
        }

        schedule.tween = tween1;
      };
    }

    function tweenFunction(id, name, value) {
      var tween0, tween1;
      if (typeof value !== "function") throw new Error;
      return function() {
        var schedule = set$2(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = (tween0 = tween).slice();
          for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1[i] = t;
              break;
            }
          }
          if (i === n) tween1.push(t);
        }

        schedule.tween = tween1;
      };
    }

    function transition_tween(name, value) {
      var id = this._id;

      name += "";

      if (arguments.length < 2) {
        var tween = get$1(this.node(), id).tween;
        for (var i = 0, n = tween.length, t; i < n; ++i) {
          if ((t = tween[i]).name === name) {
            return t.value;
          }
        }
        return null;
      }

      return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
    }

    function tweenValue(transition, name, value) {
      var id = transition._id;

      transition.each(function() {
        var schedule = set$2(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
      });

      return function(node) {
        return get$1(node, id).value[name];
      };
    }

    function interpolate(a, b) {
      var c;
      return (typeof b === "number" ? interpolateNumber
          : b instanceof color ? interpolateRgb
          : (c = color(b)) ? (b = c, interpolateRgb)
          : interpolateString)(a, b);
    }

    function attrRemove$1(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function attrConstantNS$1(fullname, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function attrFunction$1(name, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function attrFunctionNS$1(fullname, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function transition_attr(name, value) {
      var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
      return this.attrTween(name, typeof value === "function"
          ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
          : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
          : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
    }

    function attrInterpolate(name, i) {
      return function(t) {
        this.setAttribute(name, i.call(this, t));
      };
    }

    function attrInterpolateNS(fullname, i) {
      return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
      };
    }

    function attrTweenNS(fullname, value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function attrTween(name, value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function transition_attrTween(name, value) {
      var key = "attr." + name;
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      var fullname = namespace(name);
      return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    }

    function delayFunction(id, value) {
      return function() {
        init$2(this, id).delay = +value.apply(this, arguments);
      };
    }

    function delayConstant(id, value) {
      return value = +value, function() {
        init$2(this, id).delay = value;
      };
    }

    function transition_delay(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? delayFunction
              : delayConstant)(id, value))
          : get$1(this.node(), id).delay;
    }

    function durationFunction(id, value) {
      return function() {
        set$2(this, id).duration = +value.apply(this, arguments);
      };
    }

    function durationConstant(id, value) {
      return value = +value, function() {
        set$2(this, id).duration = value;
      };
    }

    function transition_duration(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? durationFunction
              : durationConstant)(id, value))
          : get$1(this.node(), id).duration;
    }

    function easeConstant(id, value) {
      if (typeof value !== "function") throw new Error;
      return function() {
        set$2(this, id).ease = value;
      };
    }

    function transition_ease(value) {
      var id = this._id;

      return arguments.length
          ? this.each(easeConstant(id, value))
          : get$1(this.node(), id).ease;
    }

    function transition_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Transition(subgroups, this._parents, this._name, this._id);
    }

    function transition_merge(transition) {
      if (transition._id !== this._id) throw new Error;

      for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Transition(merges, this._parents, this._name, this._id);
    }

    function start(name) {
      return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
      });
    }

    function onFunction(id, name, listener) {
      var on0, on1, sit = start(name) ? init$2 : set$2;
      return function() {
        var schedule = sit(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

        schedule.on = on1;
      };
    }

    function transition_on(name, listener) {
      var id = this._id;

      return arguments.length < 2
          ? get$1(this.node(), id).on.on(name)
          : this.each(onFunction(id, name, listener));
    }

    function removeFunction(id) {
      return function() {
        var parent = this.parentNode;
        for (var i in this.__transition) if (+i !== id) return;
        if (parent) parent.removeChild(this);
      };
    }

    function transition_remove() {
      return this.on("end.remove", removeFunction(this._id));
    }

    function transition_select(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
            schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
          }
        }
      }

      return new Transition(subgroups, this._parents, name, id);
    }

    function transition_selectAll(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
              if (child = children[k]) {
                schedule(child, name, id, k, children, inherit);
              }
            }
            subgroups.push(children);
            parents.push(node);
          }
        }
      }

      return new Transition(subgroups, parents, name, id);
    }

    var Selection$1 = selection.prototype.constructor;

    function transition_selection() {
      return new Selection$1(this._groups, this._parents);
    }

    function styleNull(name, interpolate) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0 = styleValue(this, name),
            string1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, string10 = string1);
      };
    }

    function styleRemove$1(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant$1(name, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = styleValue(this, name);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function styleFunction$1(name, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0 = styleValue(this, name),
            value1 = value(this),
            string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function styleMaybeRemove(id, name) {
      var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
      return function() {
        var schedule = set$2(this, id),
            on = schedule.on,
            listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

        schedule.on = on1;
      };
    }

    function transition_style(name, value, priority) {
      var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
      return value == null ? this
          .styleTween(name, styleNull(name, i))
          .on("end.style." + name, styleRemove$1(name))
        : typeof value === "function" ? this
          .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
          .each(styleMaybeRemove(this._id, name))
        : this
          .styleTween(name, styleConstant$1(name, i, value), priority)
          .on("end.style." + name, null);
    }

    function styleInterpolate(name, i, priority) {
      return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
      };
    }

    function styleTween(name, value, priority) {
      var t, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
      }
      tween._value = value;
      return tween;
    }

    function transition_styleTween(name, value, priority) {
      var key = "style." + (name += "");
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    }

    function textConstant$1(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
      };
    }

    function transition_text(value) {
      return this.tween("text", typeof value === "function"
          ? textFunction$1(tweenValue(this, "text", value))
          : textConstant$1(value == null ? "" : value + ""));
    }

    function textInterpolate(i) {
      return function(t) {
        this.textContent = i.call(this, t);
      };
    }

    function textTween(value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function transition_textTween(value) {
      var key = "text";
      if (arguments.length < 1) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, textTween(value));
    }

    function transition_transition() {
      var name = this._name,
          id0 = this._id,
          id1 = newId();

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            var inherit = get$1(node, id0);
            schedule(node, name, id1, i, group, {
              time: inherit.time + inherit.delay + inherit.duration,
              delay: 0,
              duration: inherit.duration,
              ease: inherit.ease
            });
          }
        }
      }

      return new Transition(groups, this._parents, name, id1);
    }

    function transition_end() {
      var on0, on1, that = this, id = that._id, size = that.size();
      return new Promise(function(resolve, reject) {
        var cancel = {value: reject},
            end = {value: function() { if (--size === 0) resolve(); }};

        that.each(function() {
          var schedule = set$2(this, id),
              on = schedule.on;

          // If this node shared a dispatch with the previous node,
          // just assign the updated shared dispatch and we’re done!
          // Otherwise, copy-on-write.
          if (on !== on0) {
            on1 = (on0 = on).copy();
            on1._.cancel.push(cancel);
            on1._.interrupt.push(cancel);
            on1._.end.push(end);
          }

          schedule.on = on1;
        });
      });
    }

    var id = 0;

    function Transition(groups, parents, name, id) {
      this._groups = groups;
      this._parents = parents;
      this._name = name;
      this._id = id;
    }

    function transition(name) {
      return selection().transition(name);
    }

    function newId() {
      return ++id;
    }

    var selection_prototype = selection.prototype;

    Transition.prototype = transition.prototype = {
      constructor: Transition,
      select: transition_select,
      selectAll: transition_selectAll,
      filter: transition_filter,
      merge: transition_merge,
      selection: transition_selection,
      transition: transition_transition,
      call: selection_prototype.call,
      nodes: selection_prototype.nodes,
      node: selection_prototype.node,
      size: selection_prototype.size,
      empty: selection_prototype.empty,
      each: selection_prototype.each,
      on: transition_on,
      attr: transition_attr,
      attrTween: transition_attrTween,
      style: transition_style,
      styleTween: transition_styleTween,
      text: transition_text,
      textTween: transition_textTween,
      remove: transition_remove,
      tween: transition_tween,
      delay: transition_delay,
      duration: transition_duration,
      ease: transition_ease,
      end: transition_end
    };

    function cubicInOut(t) {
      return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }

    var defaultTiming = {
      time: null, // Set on use.
      delay: 0,
      duration: 250,
      ease: cubicInOut
    };

    function inherit(node, id) {
      var timing;
      while (!(timing = node.__transition) || !(timing = timing[id])) {
        if (!(node = node.parentNode)) {
          return defaultTiming.time = now(), defaultTiming;
        }
      }
      return timing;
    }

    function selection_transition(name) {
      var id,
          timing;

      if (name instanceof Transition) {
        id = name._id, name = name._name;
      } else {
        id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
      }

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            schedule(node, name, id, i, group, timing || inherit(node, id));
          }
        }
      }

      return new Transition(groups, this._parents, name, id);
    }

    selection.prototype.interrupt = selection_interrupt;
    selection.prototype.transition = selection_transition;

    function constant$4(x) {
      return function() {
        return x;
      };
    }

    function ZoomEvent(target, type, transform) {
      this.target = target;
      this.type = type;
      this.transform = transform;
    }

    function Transform(k, x, y) {
      this.k = k;
      this.x = x;
      this.y = y;
    }

    Transform.prototype = {
      constructor: Transform,
      scale: function(k) {
        return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
      },
      translate: function(x, y) {
        return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
      },
      apply: function(point) {
        return [point[0] * this.k + this.x, point[1] * this.k + this.y];
      },
      applyX: function(x) {
        return x * this.k + this.x;
      },
      applyY: function(y) {
        return y * this.k + this.y;
      },
      invert: function(location) {
        return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
      },
      invertX: function(x) {
        return (x - this.x) / this.k;
      },
      invertY: function(y) {
        return (y - this.y) / this.k;
      },
      rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
      },
      rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
      },
      toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
      }
    };

    var identity$4 = new Transform(1, 0, 0);

    function nopropagation$1() {
      event.stopImmediatePropagation();
    }

    function noevent$1() {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    // Ignore right-click, since that should open the context menu.
    function defaultFilter$1() {
      return !event.ctrlKey && !event.button;
    }

    function defaultExtent() {
      var e = this;
      if (e instanceof SVGElement) {
        e = e.ownerSVGElement || e;
        if (e.hasAttribute("viewBox")) {
          e = e.viewBox.baseVal;
          return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
        }
        return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
      }
      return [[0, 0], [e.clientWidth, e.clientHeight]];
    }

    function defaultTransform() {
      return this.__zoom || identity$4;
    }

    function defaultWheelDelta() {
      return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
    }

    function defaultTouchable$1() {
      return navigator.maxTouchPoints || ("ontouchstart" in this);
    }

    function defaultConstrain(transform, extent, translateExtent) {
      var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
          dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
          dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
          dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
      return transform.translate(
        dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
        dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
      );
    }

    function zoom() {
      var filter = defaultFilter$1,
          extent = defaultExtent,
          constrain = defaultConstrain,
          wheelDelta = defaultWheelDelta,
          touchable = defaultTouchable$1,
          scaleExtent = [0, Infinity],
          translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
          duration = 250,
          interpolate = interpolateZoom,
          listeners = dispatch("start", "zoom", "end"),
          touchstarting,
          touchending,
          touchDelay = 500,
          wheelDelay = 150,
          clickDistance2 = 0;

      function zoom(selection) {
        selection
            .property("__zoom", defaultTransform)
            .on("wheel.zoom", wheeled)
            .on("mousedown.zoom", mousedowned)
            .on("dblclick.zoom", dblclicked)
          .filter(touchable)
            .on("touchstart.zoom", touchstarted)
            .on("touchmove.zoom", touchmoved)
            .on("touchend.zoom touchcancel.zoom", touchended)
            .style("touch-action", "none")
            .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
      }

      zoom.transform = function(collection, transform, point) {
        var selection = collection.selection ? collection.selection() : collection;
        selection.property("__zoom", defaultTransform);
        if (collection !== selection) {
          schedule(collection, transform, point);
        } else {
          selection.interrupt().each(function() {
            gesture(this, arguments)
                .start()
                .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
                .end();
          });
        }
      };

      zoom.scaleBy = function(selection, k, p) {
        zoom.scaleTo(selection, function() {
          var k0 = this.__zoom.k,
              k1 = typeof k === "function" ? k.apply(this, arguments) : k;
          return k0 * k1;
        }, p);
      };

      zoom.scaleTo = function(selection, k, p) {
        zoom.transform(selection, function() {
          var e = extent.apply(this, arguments),
              t0 = this.__zoom,
              p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
              p1 = t0.invert(p0),
              k1 = typeof k === "function" ? k.apply(this, arguments) : k;
          return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
        }, p);
      };

      zoom.translateBy = function(selection, x, y) {
        zoom.transform(selection, function() {
          return constrain(this.__zoom.translate(
            typeof x === "function" ? x.apply(this, arguments) : x,
            typeof y === "function" ? y.apply(this, arguments) : y
          ), extent.apply(this, arguments), translateExtent);
        });
      };

      zoom.translateTo = function(selection, x, y, p) {
        zoom.transform(selection, function() {
          var e = extent.apply(this, arguments),
              t = this.__zoom,
              p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
          return constrain(identity$4.translate(p0[0], p0[1]).scale(t.k).translate(
            typeof x === "function" ? -x.apply(this, arguments) : -x,
            typeof y === "function" ? -y.apply(this, arguments) : -y
          ), e, translateExtent);
        }, p);
      };

      function scale(transform, k) {
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
        return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
      }

      function translate(transform, p0, p1) {
        var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
        return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
      }

      function centroid(extent) {
        return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
      }

      function schedule(transition, transform, point) {
        transition
            .on("start.zoom", function() { gesture(this, arguments).start(); })
            .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).end(); })
            .tween("zoom", function() {
              var that = this,
                  args = arguments,
                  g = gesture(that, args),
                  e = extent.apply(that, args),
                  p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
                  w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
                  a = that.__zoom,
                  b = typeof transform === "function" ? transform.apply(that, args) : transform,
                  i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
              return function(t) {
                if (t === 1) t = b; // Avoid rounding error on end.
                else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
                g.zoom(null, t);
              };
            });
      }

      function gesture(that, args, clean) {
        return (!clean && that.__zooming) || new Gesture(that, args);
      }

      function Gesture(that, args) {
        this.that = that;
        this.args = args;
        this.active = 0;
        this.extent = extent.apply(that, args);
        this.taps = 0;
      }

      Gesture.prototype = {
        start: function() {
          if (++this.active === 1) {
            this.that.__zooming = this;
            this.emit("start");
          }
          return this;
        },
        zoom: function(key, transform) {
          if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
          if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
          if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
          this.that.__zoom = transform;
          this.emit("zoom");
          return this;
        },
        end: function() {
          if (--this.active === 0) {
            delete this.that.__zooming;
            this.emit("end");
          }
          return this;
        },
        emit: function(type) {
          customEvent(new ZoomEvent(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
        }
      };

      function wheeled() {
        if (!filter.apply(this, arguments)) return;
        var g = gesture(this, arguments),
            t = this.__zoom,
            k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
            p = mouse(this);

        // If the mouse is in the same location as before, reuse it.
        // If there were recent wheel events, reset the wheel idle timeout.
        if (g.wheel) {
          if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
            g.mouse[1] = t.invert(g.mouse[0] = p);
          }
          clearTimeout(g.wheel);
        }

        // If this wheel event won’t trigger a transform change, ignore it.
        else if (t.k === k) return;

        // Otherwise, capture the mouse point and location at the start.
        else {
          g.mouse = [p, t.invert(p)];
          interrupt(this);
          g.start();
        }

        noevent$1();
        g.wheel = setTimeout(wheelidled, wheelDelay);
        g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

        function wheelidled() {
          g.wheel = null;
          g.end();
        }
      }

      function mousedowned() {
        if (touchending || !filter.apply(this, arguments)) return;
        var g = gesture(this, arguments, true),
            v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
            p = mouse(this),
            x0 = event.clientX,
            y0 = event.clientY;

        dragDisable(event.view);
        nopropagation$1();
        g.mouse = [p, this.__zoom.invert(p)];
        interrupt(this);
        g.start();

        function mousemoved() {
          noevent$1();
          if (!g.moved) {
            var dx = event.clientX - x0, dy = event.clientY - y0;
            g.moved = dx * dx + dy * dy > clickDistance2;
          }
          g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = mouse(g.that), g.mouse[1]), g.extent, translateExtent));
        }

        function mouseupped() {
          v.on("mousemove.zoom mouseup.zoom", null);
          yesdrag(event.view, g.moved);
          noevent$1();
          g.end();
        }
      }

      function dblclicked() {
        if (!filter.apply(this, arguments)) return;
        var t0 = this.__zoom,
            p0 = mouse(this),
            p1 = t0.invert(p0),
            k1 = t0.k * (event.shiftKey ? 0.5 : 2),
            t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments), translateExtent);

        noevent$1();
        if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0);
        else select(this).call(zoom.transform, t1);
      }

      function touchstarted() {
        if (!filter.apply(this, arguments)) return;
        var touches = event.touches,
            n = touches.length,
            g = gesture(this, arguments, event.changedTouches.length === n),
            started, i, t, p;

        nopropagation$1();
        for (i = 0; i < n; ++i) {
          t = touches[i], p = touch(this, touches, t.identifier);
          p = [p, this.__zoom.invert(p), t.identifier];
          if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
          else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
        }

        if (touchstarting) touchstarting = clearTimeout(touchstarting);

        if (started) {
          if (g.taps < 2) touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
          interrupt(this);
          g.start();
        }
      }

      function touchmoved() {
        if (!this.__zooming) return;
        var g = gesture(this, arguments),
            touches = event.changedTouches,
            n = touches.length, i, t, p, l;

        noevent$1();
        if (touchstarting) touchstarting = clearTimeout(touchstarting);
        g.taps = 0;
        for (i = 0; i < n; ++i) {
          t = touches[i], p = touch(this, touches, t.identifier);
          if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
          else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
        }
        t = g.that.__zoom;
        if (g.touch1) {
          var p0 = g.touch0[0], l0 = g.touch0[1],
              p1 = g.touch1[0], l1 = g.touch1[1],
              dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
              dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
          t = scale(t, Math.sqrt(dp / dl));
          p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
          l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
        }
        else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
        else return;
        g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
      }

      function touchended() {
        if (!this.__zooming) return;
        var g = gesture(this, arguments),
            touches = event.changedTouches,
            n = touches.length, i, t;

        nopropagation$1();
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() { touchending = null; }, touchDelay);
        for (i = 0; i < n; ++i) {
          t = touches[i];
          if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
          else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
        }
        if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
        if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
        else {
          g.end();
          // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
          if (g.taps === 2) {
            var p = select(this).on("dblclick.zoom");
            if (p) p.apply(this, arguments);
          }
        }
      }

      zoom.wheelDelta = function(_) {
        return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$4(+_), zoom) : wheelDelta;
      };

      zoom.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant$4(!!_), zoom) : filter;
      };

      zoom.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$4(!!_), zoom) : touchable;
      };

      zoom.extent = function(_) {
        return arguments.length ? (extent = typeof _ === "function" ? _ : constant$4([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
      };

      zoom.scaleExtent = function(_) {
        return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
      };

      zoom.translateExtent = function(_) {
        return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
      };

      zoom.constrain = function(_) {
        return arguments.length ? (constrain = _, zoom) : constrain;
      };

      zoom.duration = function(_) {
        return arguments.length ? (duration = +_, zoom) : duration;
      };

      zoom.interpolate = function(_) {
        return arguments.length ? (interpolate = _, zoom) : interpolate;
      };

      zoom.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? zoom : value;
      };

      zoom.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
      };

      return zoom;
    }

    function colors(specifier) {
      var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
      while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
      return colors;
    }

    var schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

    function forceCenter(x, y) {
      var nodes;

      if (x == null) x = 0;
      if (y == null) y = 0;

      function force() {
        var i,
            n = nodes.length,
            node,
            sx = 0,
            sy = 0;

        for (i = 0; i < n; ++i) {
          node = nodes[i], sx += node.x, sy += node.y;
        }

        for (sx = sx / n - x, sy = sy / n - y, i = 0; i < n; ++i) {
          node = nodes[i], node.x -= sx, node.y -= sy;
        }
      }

      force.initialize = function(_) {
        nodes = _;
      };

      force.x = function(_) {
        return arguments.length ? (x = +_, force) : x;
      };

      force.y = function(_) {
        return arguments.length ? (y = +_, force) : y;
      };

      return force;
    }

    function constant$5(x) {
      return function() {
        return x;
      };
    }

    function jiggle() {
      return (Math.random() - 0.5) * 1e-6;
    }

    function tree_add(d) {
      var x = +this._x.call(null, d),
          y = +this._y.call(null, d);
      return add(this.cover(x, y), x, y, d);
    }

    function add(tree, x, y, d) {
      if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

      var parent,
          node = tree._root,
          leaf = {data: d},
          x0 = tree._x0,
          y0 = tree._y0,
          x1 = tree._x1,
          y1 = tree._y1,
          xm,
          ym,
          xp,
          yp,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return tree._root = leaf, tree;

      // Find the existing leaf for the new point, or add it.
      while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
      }

      // Is the new point is exactly coincident with the existing point?
      xp = +tree._x.call(null, node.data);
      yp = +tree._y.call(null, node.data);
      if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

      // Otherwise, split the leaf node until the old and new point are separated.
      do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
      return parent[j] = node, parent[i] = leaf, tree;
    }

    function addAll(data) {
      var d, i, n = data.length,
          x,
          y,
          xz = new Array(n),
          yz = new Array(n),
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      // Compute the points and their extent.
      for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      // If there were no (valid) points, abort.
      if (x0 > x1 || y0 > y1) return this;

      // Expand the tree to cover the new points.
      this.cover(x0, y0).cover(x1, y1);

      // Add the new points.
      for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], data[i]);
      }

      return this;
    }

    function tree_cover(x, y) {
      if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

      var x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1;

      // If the quadtree has no extent, initialize them.
      // Integer extent are necessary so that if we later double the extent,
      // the existing quadrant boundaries don’t change due to floating point error!
      if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
      }

      // Otherwise, double repeatedly to cover.
      else {
        var z = x1 - x0,
            node = this._root,
            parent,
            i;

        while (x0 > x || x >= x1 || y0 > y || y >= y1) {
          i = (y < y0) << 1 | (x < x0);
          parent = new Array(4), parent[i] = node, node = parent, z *= 2;
          switch (i) {
            case 0: x1 = x0 + z, y1 = y0 + z; break;
            case 1: x0 = x1 - z, y1 = y0 + z; break;
            case 2: x1 = x0 + z, y0 = y1 - z; break;
            case 3: x0 = x1 - z, y0 = y1 - z; break;
          }
        }

        if (this._root && this._root.length) this._root = node;
      }

      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      return this;
    }

    function tree_data() {
      var data = [];
      this.visit(function(node) {
        if (!node.length) do data.push(node.data); while (node = node.next)
      });
      return data;
    }

    function tree_extent(_) {
      return arguments.length
          ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
          : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
    }

    function Quad(node, x0, y0, x1, y1) {
      this.node = node;
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    function tree_find(x, y, radius) {
      var data,
          x0 = this._x0,
          y0 = this._y0,
          x1,
          y1,
          x2,
          y2,
          x3 = this._x1,
          y3 = this._y1,
          quads = [],
          node = this._root,
          q,
          i;

      if (node) quads.push(new Quad(node, x0, y0, x3, y3));
      if (radius == null) radius = Infinity;
      else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
      }

      while (q = quads.pop()) {

        // Stop searching if this quadrant can’t contain a closer node.
        if (!(node = q.node)
            || (x1 = q.x0) > x3
            || (y1 = q.y0) > y3
            || (x2 = q.x1) < x0
            || (y2 = q.y1) < y0) continue;

        // Bisect the current quadrant.
        if (node.length) {
          var xm = (x1 + x2) / 2,
              ym = (y1 + y2) / 2;

          quads.push(
            new Quad(node[3], xm, ym, x2, y2),
            new Quad(node[2], x1, ym, xm, y2),
            new Quad(node[1], xm, y1, x2, ym),
            new Quad(node[0], x1, y1, xm, ym)
          );

          // Visit the closest quadrant first.
          if (i = (y >= ym) << 1 | (x >= xm)) {
            q = quads[quads.length - 1];
            quads[quads.length - 1] = quads[quads.length - 1 - i];
            quads[quads.length - 1 - i] = q;
          }
        }

        // Visit this point. (Visiting coincident points isn’t necessary!)
        else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
      }

      return data;
    }

    function tree_remove(d) {
      if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

      var parent,
          node = this._root,
          retainer,
          previous,
          next,
          x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1,
          x,
          y,
          xm,
          ym,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return this;

      // Find the leaf node for the point.
      // While descending, also retain the deepest parent with a non-removed sibling.
      if (node.length) while (true) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
      }

      // Find the point to remove.
      while (node.data !== d) if (!(previous = node, node = node.next)) return this;
      if (next = node.next) delete node.next;

      // If there are multiple coincident points, remove just the point.
      if (previous) return (next ? previous.next = next : delete previous.next), this;

      // If this is the root point, remove it.
      if (!parent) return this._root = next, this;

      // Remove this leaf.
      next ? parent[i] = next : delete parent[i];

      // If the parent now contains exactly one leaf, collapse superfluous parents.
      if ((node = parent[0] || parent[1] || parent[2] || parent[3])
          && node === (parent[3] || parent[2] || parent[1] || parent[0])
          && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
      }

      return this;
    }

    function removeAll(data) {
      for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
      return this;
    }

    function tree_root() {
      return this._root;
    }

    function tree_size() {
      var size = 0;
      this.visit(function(node) {
        if (!node.length) do ++size; while (node = node.next)
      });
      return size;
    }

    function tree_visit(callback) {
      var quads = [], q, node = this._root, child, x0, y0, x1, y1;
      if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
          var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
      }
      return this;
    }

    function tree_visitAfter(callback) {
      var quads = [], next = [], q;
      if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        var node = q.node;
        if (node.length) {
          var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
      }
      while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
      }
      return this;
    }

    function defaultX(d) {
      return d[0];
    }

    function tree_x(_) {
      return arguments.length ? (this._x = _, this) : this._x;
    }

    function defaultY(d) {
      return d[1];
    }

    function tree_y(_) {
      return arguments.length ? (this._y = _, this) : this._y;
    }

    function quadtree(nodes, x, y) {
      var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
      return nodes == null ? tree : tree.addAll(nodes);
    }

    function Quadtree(x, y, x0, y0, x1, y1) {
      this._x = x;
      this._y = y;
      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      this._root = undefined;
    }

    function leaf_copy(leaf) {
      var copy = {data: leaf.data}, next = copy;
      while (leaf = leaf.next) next = next.next = {data: leaf.data};
      return copy;
    }

    var treeProto = quadtree.prototype = Quadtree.prototype;

    treeProto.copy = function() {
      var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          node = this._root,
          nodes,
          child;

      if (!node) return copy;

      if (!node.length) return copy._root = leaf_copy(node), copy;

      nodes = [{source: node, target: copy._root = new Array(4)}];
      while (node = nodes.pop()) {
        for (var i = 0; i < 4; ++i) {
          if (child = node.source[i]) {
            if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
            else node.target[i] = leaf_copy(child);
          }
        }
      }

      return copy;
    };

    treeProto.add = tree_add;
    treeProto.addAll = addAll;
    treeProto.cover = tree_cover;
    treeProto.data = tree_data;
    treeProto.extent = tree_extent;
    treeProto.find = tree_find;
    treeProto.remove = tree_remove;
    treeProto.removeAll = removeAll;
    treeProto.root = tree_root;
    treeProto.size = tree_size;
    treeProto.visit = tree_visit;
    treeProto.visitAfter = tree_visitAfter;
    treeProto.x = tree_x;
    treeProto.y = tree_y;

    function index(d) {
      return d.index;
    }

    function find(nodeById, nodeId) {
      var node = nodeById.get(nodeId);
      if (!node) throw new Error("missing: " + nodeId);
      return node;
    }

    function forceLink(links) {
      var id = index,
          strength = defaultStrength,
          strengths,
          distance = constant$5(30),
          distances,
          nodes,
          count,
          bias,
          iterations = 1;

      if (links == null) links = [];

      function defaultStrength(link) {
        return 1 / Math.min(count[link.source.index], count[link.target.index]);
      }

      function force(alpha) {
        for (var k = 0, n = links.length; k < iterations; ++k) {
          for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
            link = links[i], source = link.source, target = link.target;
            x = target.x + target.vx - source.x - source.vx || jiggle();
            y = target.y + target.vy - source.y - source.vy || jiggle();
            l = Math.sqrt(x * x + y * y);
            l = (l - distances[i]) / l * alpha * strengths[i];
            x *= l, y *= l;
            target.vx -= x * (b = bias[i]);
            target.vy -= y * b;
            source.vx += x * (b = 1 - b);
            source.vy += y * b;
          }
        }
      }

      function initialize() {
        if (!nodes) return;

        var i,
            n = nodes.length,
            m = links.length,
            nodeById = map(nodes, id),
            link;

        for (i = 0, count = new Array(n); i < m; ++i) {
          link = links[i], link.index = i;
          if (typeof link.source !== "object") link.source = find(nodeById, link.source);
          if (typeof link.target !== "object") link.target = find(nodeById, link.target);
          count[link.source.index] = (count[link.source.index] || 0) + 1;
          count[link.target.index] = (count[link.target.index] || 0) + 1;
        }

        for (i = 0, bias = new Array(m); i < m; ++i) {
          link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
        }

        strengths = new Array(m), initializeStrength();
        distances = new Array(m), initializeDistance();
      }

      function initializeStrength() {
        if (!nodes) return;

        for (var i = 0, n = links.length; i < n; ++i) {
          strengths[i] = +strength(links[i], i, links);
        }
      }

      function initializeDistance() {
        if (!nodes) return;

        for (var i = 0, n = links.length; i < n; ++i) {
          distances[i] = +distance(links[i], i, links);
        }
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.links = function(_) {
        return arguments.length ? (links = _, initialize(), force) : links;
      };

      force.id = function(_) {
        return arguments.length ? (id = _, force) : id;
      };

      force.iterations = function(_) {
        return arguments.length ? (iterations = +_, force) : iterations;
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant$5(+_), initializeStrength(), force) : strength;
      };

      force.distance = function(_) {
        return arguments.length ? (distance = typeof _ === "function" ? _ : constant$5(+_), initializeDistance(), force) : distance;
      };

      return force;
    }

    function x(d) {
      return d.x;
    }

    function y(d) {
      return d.y;
    }

    var initialRadius = 10,
        initialAngle = Math.PI * (3 - Math.sqrt(5));

    function forceSimulation(nodes) {
      var simulation,
          alpha = 1,
          alphaMin = 0.001,
          alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
          alphaTarget = 0,
          velocityDecay = 0.6,
          forces = map(),
          stepper = timer(step),
          event = dispatch("tick", "end");

      if (nodes == null) nodes = [];

      function step() {
        tick();
        event.call("tick", simulation);
        if (alpha < alphaMin) {
          stepper.stop();
          event.call("end", simulation);
        }
      }

      function tick(iterations) {
        var i, n = nodes.length, node;

        if (iterations === undefined) iterations = 1;

        for (var k = 0; k < iterations; ++k) {
          alpha += (alphaTarget - alpha) * alphaDecay;

          forces.each(function (force) {
            force(alpha);
          });

          for (i = 0; i < n; ++i) {
            node = nodes[i];
            if (node.fx == null) node.x += node.vx *= velocityDecay;
            else node.x = node.fx, node.vx = 0;
            if (node.fy == null) node.y += node.vy *= velocityDecay;
            else node.y = node.fy, node.vy = 0;
          }
        }

        return simulation;
      }

      function initializeNodes() {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.index = i;
          if (node.fx != null) node.x = node.fx;
          if (node.fy != null) node.y = node.fy;
          if (isNaN(node.x) || isNaN(node.y)) {
            var radius = initialRadius * Math.sqrt(i), angle = i * initialAngle;
            node.x = radius * Math.cos(angle);
            node.y = radius * Math.sin(angle);
          }
          if (isNaN(node.vx) || isNaN(node.vy)) {
            node.vx = node.vy = 0;
          }
        }
      }

      function initializeForce(force) {
        if (force.initialize) force.initialize(nodes);
        return force;
      }

      initializeNodes();

      return simulation = {
        tick: tick,

        restart: function() {
          return stepper.restart(step), simulation;
        },

        stop: function() {
          return stepper.stop(), simulation;
        },

        nodes: function(_) {
          return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
        },

        alpha: function(_) {
          return arguments.length ? (alpha = +_, simulation) : alpha;
        },

        alphaMin: function(_) {
          return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
        },

        alphaDecay: function(_) {
          return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
        },

        alphaTarget: function(_) {
          return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
        },

        velocityDecay: function(_) {
          return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
        },

        force: function(name, _) {
          return arguments.length > 1 ? ((_ == null ? forces.remove(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
        },

        find: function(x, y, radius) {
          var i = 0,
              n = nodes.length,
              dx,
              dy,
              d2,
              node,
              closest;

          if (radius == null) radius = Infinity;
          else radius *= radius;

          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dx = x - node.x;
            dy = y - node.y;
            d2 = dx * dx + dy * dy;
            if (d2 < radius) closest = node, radius = d2;
          }

          return closest;
        },

        on: function(name, _) {
          return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
        }
      };
    }

    function forceManyBody() {
      var nodes,
          node,
          alpha,
          strength = constant$5(-30),
          strengths,
          distanceMin2 = 1,
          distanceMax2 = Infinity,
          theta2 = 0.81;

      function force(_) {
        var i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate);
        for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        strengths = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
      }

      function accumulate(quad) {
        var strength = 0, q, c, weight = 0, x, y, i;

        // For internal nodes, accumulate forces from child quadrants.
        if (quad.length) {
          for (x = y = i = 0; i < 4; ++i) {
            if ((q = quad[i]) && (c = Math.abs(q.value))) {
              strength += q.value, weight += c, x += c * q.x, y += c * q.y;
            }
          }
          quad.x = x / weight;
          quad.y = y / weight;
        }

        // For leaf nodes, accumulate forces from coincident quadrants.
        else {
          q = quad;
          q.x = q.data.x;
          q.y = q.data.y;
          do strength += strengths[q.data.index];
          while (q = q.next);
        }

        quad.value = strength;
      }

      function apply(quad, x1, _, x2) {
        if (!quad.value) return true;

        var x = quad.x - node.x,
            y = quad.y - node.y,
            w = x2 - x1,
            l = x * x + y * y;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
          if (l < distanceMax2) {
            if (x === 0) x = jiggle(), l += x * x;
            if (y === 0) y = jiggle(), l += y * y;
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
            node.vx += x * quad.value * alpha / l;
            node.vy += y * quad.value * alpha / l;
          }
          return true;
        }

        // Otherwise, process points directly.
        else if (quad.length || l >= distanceMax2) return;

        // Limit forces for very close nodes; randomize direction if coincident.
        if (quad.data !== node || quad.next) {
          if (x === 0) x = jiggle(), l += x * x;
          if (y === 0) y = jiggle(), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        }

        do if (quad.data !== node) {
          w = strengths[quad.data.index] * alpha / l;
          node.vx += x * w;
          node.vy += y * w;
        } while (quad = quad.next);
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant$5(+_), initialize(), force) : strength;
      };

      force.distanceMin = function(_) {
        return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
      };

      force.distanceMax = function(_) {
        return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
      };

      force.theta = function(_) {
        return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
      };

      return force;
    }

    /* src/components/NetworkGraphSvelteSVG.svelte generated by Svelte v3.23.2 */

    const { Object: Object_1$1, console: console_1 } = globals;
    const file$y = "src/components/NetworkGraphSvelteSVG.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (116:1) {#each links as link}
    function create_each_block_1$3(ctx) {
    	let g;
    	let line;
    	let title;
    	let t_value = /*link*/ ctx[26].source.id + "";
    	let t;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;
    	let line_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");
    			title = svg_element("title");
    			t = text(t_value);
    			add_location(title, file$y, 120, 12, 3567);
    			attr_dev(line, "x1", line_x__value = /*link*/ ctx[26].source.x);
    			attr_dev(line, "y1", line_y__value = /*link*/ ctx[26].source.y);
    			attr_dev(line, "x2", line_x__value_1 = /*link*/ ctx[26].target.x);
    			attr_dev(line, "y2", line_y__value_1 = /*link*/ ctx[26].target.y);
    			attr_dev(line, "transform", line_transform_value = "translate(" + /*transform*/ ctx[4].x + " " + /*transform*/ ctx[4].y + ") scale(" + /*transform*/ ctx[4].k + " " + /*transform*/ ctx[4].k + ")");
    			add_location(line, file$y, 117, 6, 3353);
    			attr_dev(g, "stroke", "#999");
    			attr_dev(g, "stroke-opacity", "0.6");
    			add_location(g, file$y, 116, 4, 3308);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);
    			append_dev(line, title);
    			append_dev(title, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 32 && t_value !== (t_value = /*link*/ ctx[26].source.id + "")) set_data_dev(t, t_value);

    			if (dirty & /*links*/ 32 && line_x__value !== (line_x__value = /*link*/ ctx[26].source.x)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*links*/ 32 && line_y__value !== (line_y__value = /*link*/ ctx[26].source.y)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*links*/ 32 && line_x__value_1 !== (line_x__value_1 = /*link*/ ctx[26].target.x)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*links*/ 32 && line_y__value_1 !== (line_y__value_1 = /*link*/ ctx[26].target.y)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*transform*/ 16 && line_transform_value !== (line_transform_value = "translate(" + /*transform*/ ctx[4].x + " " + /*transform*/ ctx[4].y + ") scale(" + /*transform*/ ctx[4].k + " " + /*transform*/ ctx[4].k + ")")) {
    				attr_dev(line, "transform", line_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(116:1) {#each links as link}",
    		ctx
    	});

    	return block;
    }

    // (126:1) {#each nodes as point}
    function create_each_block$7(ctx) {
    	let circle;
    	let title;
    	let t_value = /*point*/ ctx[23].id + "";
    	let t;
    	let circle_fill_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_transform_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			title = svg_element("title");
    			t = text(t_value);
    			add_location(title, file$y, 128, 4, 3847);
    			attr_dev(circle, "class", "node svelte-144su2n");
    			attr_dev(circle, "r", "5");
    			attr_dev(circle, "fill", circle_fill_value = /*colourScale*/ ctx[7](/*point*/ ctx[23].group));
    			attr_dev(circle, "cx", circle_cx_value = /*point*/ ctx[23].x);
    			attr_dev(circle, "cy", circle_cy_value = /*point*/ ctx[23].y);
    			attr_dev(circle, "transform", circle_transform_value = "translate(" + /*transform*/ ctx[4].x + " " + /*transform*/ ctx[4].y + ") scale(" + /*transform*/ ctx[4].k + " " + /*transform*/ ctx[4].k + ")");
    			add_location(circle, file$y, 126, 4, 3660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    			append_dev(circle, title);
    			append_dev(title, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nodes*/ 64 && t_value !== (t_value = /*point*/ ctx[23].id + "")) set_data_dev(t, t_value);

    			if (dirty & /*nodes*/ 64 && circle_fill_value !== (circle_fill_value = /*colourScale*/ ctx[7](/*point*/ ctx[23].group))) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if (dirty & /*nodes*/ 64 && circle_cx_value !== (circle_cx_value = /*point*/ ctx[23].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*nodes*/ 64 && circle_cy_value !== (circle_cy_value = /*point*/ ctx[23].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*transform*/ 16 && circle_transform_value !== (circle_transform_value = "translate(" + /*transform*/ ctx[4].x + " " + /*transform*/ ctx[4].y + ") scale(" + /*transform*/ ctx[4].k + " " + /*transform*/ ctx[4].k + ")")) {
    				attr_dev(circle, "transform", circle_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(126:1) {#each nodes as point}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let svg_1;
    	let each0_anchor;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*links*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*nodes*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			svg_1 = svg_element("svg");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(svg_1, "width", /*width*/ ctx[2]);
    			attr_dev(svg_1, "height", /*height*/ ctx[3]);
    			attr_dev(svg_1, "class", "svelte-144su2n");
    			add_location(svg_1, file$y, 114, 0, 3225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg_1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(svg_1, null);
    			}

    			append_dev(svg_1, each0_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg_1, null);
    			}

    			/*svg_1_binding*/ ctx[9](svg_1);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*resize*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*links, transform*/ 48) {
    				each_value_1 = /*links*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(svg_1, each0_anchor);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*colourScale, nodes, transform*/ 208) {
    				each_value = /*nodes*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg_1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*width*/ 4) {
    				attr_dev(svg_1, "width", /*width*/ ctx[2]);
    			}

    			if (dirty & /*height*/ 8) {
    				attr_dev(svg_1, "height", /*height*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg_1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*svg_1_binding*/ ctx[9](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const nodeRadius = 5;

    function instance$z($$self, $$props, $$invalidate) {
    	let $graph,
    		$$unsubscribe_graph = noop,
    		$$subscribe_graph = () => ($$unsubscribe_graph(), $$unsubscribe_graph = subscribe(graph, $$value => $$invalidate(12, $graph = $$value)), graph);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_graph());

    	let d3 = {
    		zoom,
    		zoomIdentity: identity$4,
    		scaleLinear: linear$1,
    		scaleOrdinal: ordinal,
    		schemeCategory10,
    		select,
    		selectAll,
    		drag,
    		forceSimulation,
    		forceLink,
    		forceManyBody,
    		forceCenter
    	};

    	let { graph } = $$props;
    	validate_store(graph, "graph");
    	$$subscribe_graph();
    	let svg;
    	let width = 500;
    	let height = 600;
    	const padding = { top: 20, right: 40, bottom: 40, left: 25 };

    	const unsubscribe = graph.subscribe(async $data => {
    		// Have to use tick so links and nodes can catch up
    		await tick();

    		render();
    	});

    	onDestroy(() => {
    		console.log("onDestroy()");
    		unsubscribe();
    	});

    	const colourScale = d3.scaleOrdinal(d3.schemeCategory10);
    	let transform = d3.zoomIdentity;
    	let simulation;

    	function render() {
    		if (simulation) {
    			simulation.nodes([]).force("link", d3.forceLink([]));
    			simulation = undefined;
    		}

    		simulation = d3.forceSimulation(nodes).force("link", d3.forceLink(links).id(d => d.id)).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(width / 2, height / 2)).on("tick", simulationUpdate);
    		d3.select(svg).call(d3.drag().container(svg).subject(dragsubject).on("start", dragstarted).on("drag", dragged).on("end", dragended)).call(d3.zoom().scaleExtent([1 / 10, 8]).on("zoom", zoomed));
    	}

    	function simulationUpdate() {
    		simulation.tick();
    		$$invalidate(6, nodes = [...nodes]);
    		$$invalidate(5, links = [...links]);
    	}

    	function zoomed() {
    		$$invalidate(4, transform = event.transform);
    		simulationUpdate();
    	}

    	function dragsubject() {
    		const node = simulation.find(transform.invertX(event.x), transform.invertY(event.y), nodeRadius);

    		if (node) {
    			node.x = transform.applyX(node.x);
    			node.y = transform.applyY(node.y);
    		}

    		return node;
    	}

    	function dragstarted() {
    		if (!event.active) simulation.alphaTarget(0.3).restart();
    		event.subject.fx = transform.invertX(event.subject.x);
    		event.subject.fy = transform.invertY(event.subject.y);
    	}

    	function dragged() {
    		event.subject.fx = transform.invertX(event.x);
    		event.subject.fy = transform.invertY(event.y);
    	}

    	function dragended() {
    		if (!event.active) simulation.alphaTarget(0);
    		event.subject.fx = null;
    		event.subject.fy = null;
    	}

    	function resize() {
    		$$invalidate(2, { width, height } = svg.getBoundingClientRect(), width, $$invalidate(3, height));
    	}

    	const writable_props = ["graph"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<NetworkGraphSvelteSVG> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NetworkGraphSvelteSVG", $$slots, []);

    	function svg_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			svg = $$value;
    			$$invalidate(1, svg);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("graph" in $$props) $$subscribe_graph($$invalidate(0, graph = $$props.graph));
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		tick,
    		scaleLinear: linear$1,
    		scaleOrdinal: ordinal,
    		zoom,
    		zoomIdentity: identity$4,
    		schemeCategory10,
    		select,
    		selectAll,
    		drag,
    		forceSimulation,
    		forceLink,
    		forceManyBody,
    		forceCenter,
    		currentEvent: event,
    		d3,
    		graph,
    		svg,
    		width,
    		height,
    		nodeRadius,
    		padding,
    		unsubscribe,
    		colourScale,
    		transform,
    		simulation,
    		render,
    		simulationUpdate,
    		zoomed,
    		dragsubject,
    		dragstarted,
    		dragged,
    		dragended,
    		resize,
    		links,
    		$graph,
    		nodes
    	});

    	$$self.$inject_state = $$props => {
    		if ("d3" in $$props) d3 = $$props.d3;
    		if ("graph" in $$props) $$subscribe_graph($$invalidate(0, graph = $$props.graph));
    		if ("svg" in $$props) $$invalidate(1, svg = $$props.svg);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("transform" in $$props) $$invalidate(4, transform = $$props.transform);
    		if ("simulation" in $$props) simulation = $$props.simulation;
    		if ("links" in $$props) $$invalidate(5, links = $$props.links);
    		if ("nodes" in $$props) $$invalidate(6, nodes = $$props.nodes);
    	};

    	let links;
    	let nodes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$graph*/ 4096) {
    			 $$invalidate(5, links = $graph.links.map(d => Object.create(d)));
    		}

    		if ($$self.$$.dirty & /*$graph*/ 4096) {
    			 $$invalidate(6, nodes = $graph.nodes.map(d => Object.create(d)));
    		}
    	};

    	return [
    		graph,
    		svg,
    		width,
    		height,
    		transform,
    		links,
    		nodes,
    		colourScale,
    		resize,
    		svg_1_binding
    	];
    }

    class NetworkGraphSvelteSVG extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { graph: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NetworkGraphSvelteSVG",
    			options,
    			id: create_fragment$z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*graph*/ ctx[0] === undefined && !("graph" in props)) {
    			console_1.warn("<NetworkGraphSvelteSVG> was created without expected prop 'graph'");
    		}
    	}

    	get graph() {
    		throw new Error("<NetworkGraphSvelteSVG>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graph(value) {
    		throw new Error("<NetworkGraphSvelteSVG>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/NetworkGraphCanvas.svelte generated by Svelte v3.23.2 */

    const { Object: Object_1$2 } = globals;
    const file$z = "src/components/NetworkGraphCanvas.svelte";

    function create_fragment$A(ctx) {
    	let div;
    	let canvas0;
    	let t;
    	let canvas1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			canvas0 = element("canvas");
    			t = space();
    			canvas1 = element("canvas");
    			attr_dev(canvas0, "width", "600");
    			attr_dev(canvas0, "height", "500");
    			attr_dev(canvas0, "class", "svelte-icjvnf");
    			add_location(canvas0, file$z, 186, 4, 6217);
    			attr_dev(canvas1, "width", "600");
    			attr_dev(canvas1, "height", "500");
    			canvas1.hidden = "true";
    			attr_dev(canvas1, "class", "svelte-icjvnf");
    			add_location(canvas1, file$z, 187, 4, 6275);
    			attr_dev(div, "class", "container");
    			add_location(div, file$z, 185, 0, 6189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, canvas0);
    			/*canvas0_binding*/ ctx[4](canvas0);
    			append_dev(div, t);
    			append_dev(div, canvas1);
    			/*canvas1_binding*/ ctx[5](canvas1);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*resize*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*canvas0_binding*/ ctx[4](null);
    			/*canvas1_binding*/ ctx[5](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function indexToColor(index) {
    	const color = "#" + (index + 1).toString(16).padStart(6, "0");
    	return color;
    }

    function colorToIndex(color) {
    	const index = (color[0] << 16) + (color[1] << 8) + color[2] - 1;
    	return index;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let d3 = {
    		zoom,
    		zoomIdentity: identity$4,
    		scaleLinear: linear$1,
    		scaleOrdinal: ordinal,
    		schemeCategory10,
    		select,
    		selectAll,
    		mouse,
    		drag,
    		forceSimulation,
    		forceLink,
    		forceManyBody,
    		forceCenter
    	};

    	let { graph } = $$props;
    	let svg;
    	let canvas, idCanvas;
    	let width = 500;
    	let height = 600;
    	const padding = { top: 20, right: 40, bottom: 40, left: 25 };
    	const groupColour = d3.scaleOrdinal(d3.schemeCategory10);
    	let transform = d3.zoomIdentity;
    	let simulation, context, idContext;

    	onMount(() => {
    		context = canvas.getContext("2d");
    		idContext = idCanvas.getContext("2d");
    		resize();
    		simulation = d3.forceSimulation(nodes).force("link", d3.forceLink(links).id(d => d.id)).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(width / 2, height / 2)).on("tick", simulationUpdate);

    		// title
    		d3.select(context.canvas).on("mousemove", tooltip);

    		function tooltip() {
    			const d = getNodeFromMouseEvent();
    			if (d) context.canvas.title = d.id; else context.canvas.title = "";
    		}

    		
    		d3.select(canvas).call(d3.drag().container(canvas).subject(dragsubject).on("start", dragstarted).on("drag", dragged).on("end", dragended)).call(d3.zoom().scaleExtent([1 / 10, 8]).on("zoom", zoomed));
    	});

    	function simulationUpdate() {
    		nodes = [...nodes];
    		links = [...links];
    		context.save();
    		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    		context.translate(transform.x, transform.y);
    		context.scale(transform.k, transform.k);
    		idContext.save();
    		idContext.clearRect(0, 0, idContext.canvas.width, idContext.canvas.height);
    		idContext.translate(transform.x, transform.y);
    		idContext.scale(transform.k, transform.k);

    		links.forEach(d => {
    			context.beginPath();
    			context.moveTo(d.source.x, d.source.y);
    			context.lineTo(d.target.x, d.target.y);
    			context.globalAlpha = 0.6;
    			context.strokeStyle = "#999";
    			context.lineWidth = Math.sqrt(d.value);
    			context.stroke();
    			context.globalAlpha = 1;
    		});

    		nodes.forEach((d, i) => {
    			context.beginPath();
    			context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
    			context.strokeStyle = "#fff";
    			context.lineWidth = 1.5;
    			context.stroke();
    			context.fillStyle = groupColour(d.group);
    			context.fill();
    			idContext.beginPath();
    			idContext.arc(d.x, d.y, 5, 0, 2 * Math.PI);
    			idContext.fillStyle = indexToColor(i);
    			idContext.fill();
    		});

    		context.restore();
    		idContext.restore();
    	}

    	function zoomed() {
    		transform = event.transform;
    		simulationUpdate();
    	}

    	function dragsubject() {
    		const node = getNodeFromMouseEvent();

    		if (node) {
    			node.x = transform.applyX(node.x);
    			node.y = transform.applyY(node.y);
    		}

    		return node;
    	}

    	// This method of hit detection is poor on small devices because fat fingers
    	// can't hit small targets. Alternatives:
    	//  - add a hit radius to this (larger for small touch screens)
    	//  - use simulation.find() with a hit radius (larger for small touch screens)
    	function getNodeFromMouseEvent() {
    		let mouse = d3.mouse(context.canvas);
    		const color = idContext.getImageData(mouse[0], mouse[1], 1, 1).data;
    		const index = colorToIndex(color);
    		const node = nodes[index];
    		return node;
    	}

    	

    	function dragstarted() {
    		if (!event.active) simulation.alphaTarget(0.3).restart();
    		event.subject.fx = transform.invertX(event.subject.x);
    		event.subject.fy = transform.invertY(event.subject.y);
    	}

    	function dragged() {
    		event.subject.fx = transform.invertX(event.x);
    		event.subject.fy = transform.invertY(event.y);
    	}

    	function dragended() {
    		if (!event.active) simulation.alphaTarget(0);
    		event.subject.fx = null;
    		event.subject.fy = null;
    	}

    	function resize() {
    		$$invalidate(7, { width, height } = canvas, width, $$invalidate(8, height));
    	}

    	const writable_props = ["graph"];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NetworkGraphCanvas> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NetworkGraphCanvas", $$slots, []);

    	function canvas0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	function canvas1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			idCanvas = $$value;
    			$$invalidate(1, idCanvas);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("graph" in $$props) $$invalidate(3, graph = $$props.graph);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		scaleLinear: linear$1,
    		scaleOrdinal: ordinal,
    		zoom,
    		zoomIdentity: identity$4,
    		schemeCategory10,
    		select,
    		selectAll,
    		mouse,
    		drag,
    		forceSimulation,
    		forceLink,
    		forceManyBody,
    		forceCenter,
    		currentEvent: event,
    		d3,
    		graph,
    		svg,
    		canvas,
    		idCanvas,
    		width,
    		height,
    		padding,
    		groupColour,
    		transform,
    		simulation,
    		context,
    		idContext,
    		simulationUpdate,
    		zoomed,
    		dragsubject,
    		getNodeFromMouseEvent,
    		dragstarted,
    		dragged,
    		dragended,
    		indexToColor,
    		colorToIndex,
    		resize,
    		xScale,
    		yScale,
    		d3yScale,
    		links,
    		nodes
    	});

    	$$self.$inject_state = $$props => {
    		if ("d3" in $$props) d3 = $$props.d3;
    		if ("graph" in $$props) $$invalidate(3, graph = $$props.graph);
    		if ("svg" in $$props) svg = $$props.svg;
    		if ("canvas" in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ("idCanvas" in $$props) $$invalidate(1, idCanvas = $$props.idCanvas);
    		if ("width" in $$props) $$invalidate(7, width = $$props.width);
    		if ("height" in $$props) $$invalidate(8, height = $$props.height);
    		if ("transform" in $$props) transform = $$props.transform;
    		if ("simulation" in $$props) simulation = $$props.simulation;
    		if ("context" in $$props) context = $$props.context;
    		if ("idContext" in $$props) idContext = $$props.idContext;
    		if ("xScale" in $$props) xScale = $$props.xScale;
    		if ("yScale" in $$props) yScale = $$props.yScale;
    		if ("d3yScale" in $$props) d3yScale = $$props.d3yScale;
    		if ("links" in $$props) links = $$props.links;
    		if ("nodes" in $$props) nodes = $$props.nodes;
    	};

    	let xScale;
    	let yScale;
    	let d3yScale;
    	let links;
    	let nodes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 128) {
    			 xScale = linear$1().domain([0, 20]).range([padding.left, width - padding.right]);
    		}

    		if ($$self.$$.dirty & /*height*/ 256) {
    			 yScale = linear$1().domain([0, 12]).range([height - padding.bottom, padding.top]);
    		}

    		if ($$self.$$.dirty & /*height*/ 256) {
    			 d3yScale = linear$1().domain([0, height]).range([height, 0]);
    		}

    		if ($$self.$$.dirty & /*graph*/ 8) {
    			 links = graph.links.map(d => Object.create(d));
    		}

    		if ($$self.$$.dirty & /*graph*/ 8) {
    			 nodes = graph.nodes.map(d => Object.create(d));
    		}
    	};

    	return [canvas, idCanvas, resize, graph, canvas0_binding, canvas1_binding];
    }

    class NetworkGraphCanvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { graph: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NetworkGraphCanvas",
    			options,
    			id: create_fragment$A.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*graph*/ ctx[3] === undefined && !("graph" in props)) {
    			console.warn("<NetworkGraphCanvas> was created without expected prop 'graph'");
    		}
    	}

    	get graph() {
    		throw new Error("<NetworkGraphCanvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graph(value) {
    		throw new Error("<NetworkGraphCanvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var data = {
    	"nodes": [
    	  {"id": "Myriel", "group": 1},
    	  {"id": "Napoleon", "group": 1},
    	  {"id": "Mlle.Baptistine", "group": 1},
    	  {"id": "Mme.Magloire", "group": 1},
    	  {"id": "CountessdeLo", "group": 1},
    	  {"id": "Geborand", "group": 1},
    	  {"id": "Champtercier", "group": 1},
    	  {"id": "Cravatte", "group": 1},
    	  {"id": "Count", "group": 1},
    	  {"id": "OldMan", "group": 1},
    	  {"id": "Labarre", "group": 2},
    	  {"id": "Valjean", "group": 2},
    	  {"id": "Marguerite", "group": 3},
    	  {"id": "Mme.deR", "group": 2},
    	  {"id": "Isabeau", "group": 2},
    	  {"id": "Gervais", "group": 2},
    	  {"id": "Tholomyes", "group": 3},
    	  {"id": "Listolier", "group": 3},
    	  {"id": "Fameuil", "group": 3},
    	  {"id": "Blacheville", "group": 3},
    	  {"id": "Favourite", "group": 3},
    	  {"id": "Dahlia", "group": 3},
    	  {"id": "Zephine", "group": 3},
    	  {"id": "Fantine", "group": 3},
    	  {"id": "Mme.Thenardier", "group": 4},
    	  {"id": "Thenardier", "group": 4},
    	  {"id": "Cosette", "group": 5},
    	  {"id": "Javert", "group": 4},
    	  {"id": "Fauchelevent", "group": 0},
    	  {"id": "Bamatabois", "group": 2},
    	  {"id": "Perpetue", "group": 3},
    	  {"id": "Simplice", "group": 2},
    	  {"id": "Scaufflaire", "group": 2},
    	  {"id": "Woman1", "group": 2},
    	  {"id": "Judge", "group": 2},
    	  {"id": "Champmathieu", "group": 2},
    	  {"id": "Brevet", "group": 2},
    	  {"id": "Chenildieu", "group": 2},
    	  {"id": "Cochepaille", "group": 2},
    	  {"id": "Pontmercy", "group": 4},
    	  {"id": "Boulatruelle", "group": 6},
    	  {"id": "Eponine", "group": 4},
    	  {"id": "Anzelma", "group": 4},
    	  {"id": "Woman2", "group": 5},
    	  {"id": "MotherInnocent", "group": 0},
    	  {"id": "Gribier", "group": 0},
    	  {"id": "Jondrette", "group": 7},
    	  {"id": "Mme.Burgon", "group": 7},
    	  {"id": "Gavroche", "group": 8},
    	  {"id": "Gillenormand", "group": 5},
    	  {"id": "Magnon", "group": 5},
    	  {"id": "Mlle.Gillenormand", "group": 5},
    	  {"id": "Mme.Pontmercy", "group": 5},
    	  {"id": "Mlle.Vaubois", "group": 5},
    	  {"id": "Lt.Gillenormand", "group": 5},
    	  {"id": "Marius", "group": 8},
    	  {"id": "BaronessT", "group": 5},
    	  {"id": "Mabeuf", "group": 8},
    	  {"id": "Enjolras", "group": 8},
    	  {"id": "Combeferre", "group": 8},
    	  {"id": "Prouvaire", "group": 8},
    	  {"id": "Feuilly", "group": 8},
    	  {"id": "Courfeyrac", "group": 8},
    	  {"id": "Bahorel", "group": 8},
    	  {"id": "Bossuet", "group": 8},
    	  {"id": "Joly", "group": 8},
    	  {"id": "Grantaire", "group": 8},
    	  {"id": "MotherPlutarch", "group": 9},
    	  {"id": "Gueulemer", "group": 4},
    	  {"id": "Babet", "group": 4},
    	  {"id": "Claquesous", "group": 4},
    	  {"id": "Montparnasse", "group": 4},
    	  {"id": "Toussaint", "group": 5},
    	  {"id": "Child1", "group": 10},
    	  {"id": "Child2", "group": 10},
    	  {"id": "Brujon", "group": 4},
    	  {"id": "Mme.Hucheloup", "group": 8}
    	],
    	"links": [
    	  {"source": "Napoleon", "target": "Myriel", "value": 1},
    	  {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
    	  {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
    	  {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6},
    	  {"source": "CountessdeLo", "target": "Myriel", "value": 1},
    	  {"source": "Geborand", "target": "Myriel", "value": 1},
    	  {"source": "Champtercier", "target": "Myriel", "value": 1},
    	  {"source": "Cravatte", "target": "Myriel", "value": 1},
    	  {"source": "Count", "target": "Myriel", "value": 2},
    	  {"source": "OldMan", "target": "Myriel", "value": 1},
    	  {"source": "Valjean", "target": "Labarre", "value": 1},
    	  {"source": "Valjean", "target": "Mme.Magloire", "value": 3},
    	  {"source": "Valjean", "target": "Mlle.Baptistine", "value": 3},
    	  {"source": "Valjean", "target": "Myriel", "value": 5},
    	  {"source": "Marguerite", "target": "Valjean", "value": 1},
    	  {"source": "Mme.deR", "target": "Valjean", "value": 1},
    	  {"source": "Isabeau", "target": "Valjean", "value": 1},
    	  {"source": "Gervais", "target": "Valjean", "value": 1},
    	  {"source": "Listolier", "target": "Tholomyes", "value": 4},
    	  {"source": "Fameuil", "target": "Tholomyes", "value": 4},
    	  {"source": "Fameuil", "target": "Listolier", "value": 4},
    	  {"source": "Blacheville", "target": "Tholomyes", "value": 4},
    	  {"source": "Blacheville", "target": "Listolier", "value": 4},
    	  {"source": "Blacheville", "target": "Fameuil", "value": 4},
    	  {"source": "Favourite", "target": "Tholomyes", "value": 3},
    	  {"source": "Favourite", "target": "Listolier", "value": 3},
    	  {"source": "Favourite", "target": "Fameuil", "value": 3},
    	  {"source": "Favourite", "target": "Blacheville", "value": 4},
    	  {"source": "Dahlia", "target": "Tholomyes", "value": 3},
    	  {"source": "Dahlia", "target": "Listolier", "value": 3},
    	  {"source": "Dahlia", "target": "Fameuil", "value": 3},
    	  {"source": "Dahlia", "target": "Blacheville", "value": 3},
    	  {"source": "Dahlia", "target": "Favourite", "value": 5},
    	  {"source": "Zephine", "target": "Tholomyes", "value": 3},
    	  {"source": "Zephine", "target": "Listolier", "value": 3},
    	  {"source": "Zephine", "target": "Fameuil", "value": 3},
    	  {"source": "Zephine", "target": "Blacheville", "value": 3},
    	  {"source": "Zephine", "target": "Favourite", "value": 4},
    	  {"source": "Zephine", "target": "Dahlia", "value": 4},
    	  {"source": "Fantine", "target": "Tholomyes", "value": 3},
    	  {"source": "Fantine", "target": "Listolier", "value": 3},
    	  {"source": "Fantine", "target": "Fameuil", "value": 3},
    	  {"source": "Fantine", "target": "Blacheville", "value": 3},
    	  {"source": "Fantine", "target": "Favourite", "value": 4},
    	  {"source": "Fantine", "target": "Dahlia", "value": 4},
    	  {"source": "Fantine", "target": "Zephine", "value": 4},
    	  {"source": "Fantine", "target": "Marguerite", "value": 2},
    	  {"source": "Fantine", "target": "Valjean", "value": 9},
    	  {"source": "Mme.Thenardier", "target": "Fantine", "value": 2},
    	  {"source": "Mme.Thenardier", "target": "Valjean", "value": 7},
    	  {"source": "Thenardier", "target": "Mme.Thenardier", "value": 13},
    	  {"source": "Thenardier", "target": "Fantine", "value": 1},
    	  {"source": "Thenardier", "target": "Valjean", "value": 12},
    	  {"source": "Cosette", "target": "Mme.Thenardier", "value": 4},
    	  {"source": "Cosette", "target": "Valjean", "value": 31},
    	  {"source": "Cosette", "target": "Tholomyes", "value": 1},
    	  {"source": "Cosette", "target": "Thenardier", "value": 1},
    	  {"source": "Javert", "target": "Valjean", "value": 17},
    	  {"source": "Javert", "target": "Fantine", "value": 5},
    	  {"source": "Javert", "target": "Thenardier", "value": 5},
    	  {"source": "Javert", "target": "Mme.Thenardier", "value": 1},
    	  {"source": "Javert", "target": "Cosette", "value": 1},
    	  {"source": "Fauchelevent", "target": "Valjean", "value": 8},
    	  {"source": "Fauchelevent", "target": "Javert", "value": 1},
    	  {"source": "Bamatabois", "target": "Fantine", "value": 1},
    	  {"source": "Bamatabois", "target": "Javert", "value": 1},
    	  {"source": "Bamatabois", "target": "Valjean", "value": 2},
    	  {"source": "Perpetue", "target": "Fantine", "value": 1},
    	  {"source": "Simplice", "target": "Perpetue", "value": 2},
    	  {"source": "Simplice", "target": "Valjean", "value": 3},
    	  {"source": "Simplice", "target": "Fantine", "value": 2},
    	  {"source": "Simplice", "target": "Javert", "value": 1},
    	  {"source": "Scaufflaire", "target": "Valjean", "value": 1},
    	  {"source": "Woman1", "target": "Valjean", "value": 2},
    	  {"source": "Woman1", "target": "Javert", "value": 1},
    	  {"source": "Judge", "target": "Valjean", "value": 3},
    	  {"source": "Judge", "target": "Bamatabois", "value": 2},
    	  {"source": "Champmathieu", "target": "Valjean", "value": 3},
    	  {"source": "Champmathieu", "target": "Judge", "value": 3},
    	  {"source": "Champmathieu", "target": "Bamatabois", "value": 2},
    	  {"source": "Brevet", "target": "Judge", "value": 2},
    	  {"source": "Brevet", "target": "Champmathieu", "value": 2},
    	  {"source": "Brevet", "target": "Valjean", "value": 2},
    	  {"source": "Brevet", "target": "Bamatabois", "value": 1},
    	  {"source": "Chenildieu", "target": "Judge", "value": 2},
    	  {"source": "Chenildieu", "target": "Champmathieu", "value": 2},
    	  {"source": "Chenildieu", "target": "Brevet", "value": 2},
    	  {"source": "Chenildieu", "target": "Valjean", "value": 2},
    	  {"source": "Chenildieu", "target": "Bamatabois", "value": 1},
    	  {"source": "Cochepaille", "target": "Judge", "value": 2},
    	  {"source": "Cochepaille", "target": "Champmathieu", "value": 2},
    	  {"source": "Cochepaille", "target": "Brevet", "value": 2},
    	  {"source": "Cochepaille", "target": "Chenildieu", "value": 2},
    	  {"source": "Cochepaille", "target": "Valjean", "value": 2},
    	  {"source": "Cochepaille", "target": "Bamatabois", "value": 1},
    	  {"source": "Pontmercy", "target": "Thenardier", "value": 1},
    	  {"source": "Boulatruelle", "target": "Thenardier", "value": 1},
    	  {"source": "Eponine", "target": "Mme.Thenardier", "value": 2},
    	  {"source": "Eponine", "target": "Thenardier", "value": 3},
    	  {"source": "Anzelma", "target": "Eponine", "value": 2},
    	  {"source": "Anzelma", "target": "Thenardier", "value": 2},
    	  {"source": "Anzelma", "target": "Mme.Thenardier", "value": 1},
    	  {"source": "Woman2", "target": "Valjean", "value": 3},
    	  {"source": "Woman2", "target": "Cosette", "value": 1},
    	  {"source": "Woman2", "target": "Javert", "value": 1},
    	  {"source": "MotherInnocent", "target": "Fauchelevent", "value": 3},
    	  {"source": "MotherInnocent", "target": "Valjean", "value": 1},
    	  {"source": "Gribier", "target": "Fauchelevent", "value": 2},
    	  {"source": "Mme.Burgon", "target": "Jondrette", "value": 1},
    	  {"source": "Gavroche", "target": "Mme.Burgon", "value": 2},
    	  {"source": "Gavroche", "target": "Thenardier", "value": 1},
    	  {"source": "Gavroche", "target": "Javert", "value": 1},
    	  {"source": "Gavroche", "target": "Valjean", "value": 1},
    	  {"source": "Gillenormand", "target": "Cosette", "value": 3},
    	  {"source": "Gillenormand", "target": "Valjean", "value": 2},
    	  {"source": "Magnon", "target": "Gillenormand", "value": 1},
    	  {"source": "Magnon", "target": "Mme.Thenardier", "value": 1},
    	  {"source": "Mlle.Gillenormand", "target": "Gillenormand", "value": 9},
    	  {"source": "Mlle.Gillenormand", "target": "Cosette", "value": 2},
    	  {"source": "Mlle.Gillenormand", "target": "Valjean", "value": 2},
    	  {"source": "Mme.Pontmercy", "target": "Mlle.Gillenormand", "value": 1},
    	  {"source": "Mme.Pontmercy", "target": "Pontmercy", "value": 1},
    	  {"source": "Mlle.Vaubois", "target": "Mlle.Gillenormand", "value": 1},
    	  {"source": "Lt.Gillenormand", "target": "Mlle.Gillenormand", "value": 2},
    	  {"source": "Lt.Gillenormand", "target": "Gillenormand", "value": 1},
    	  {"source": "Lt.Gillenormand", "target": "Cosette", "value": 1},
    	  {"source": "Marius", "target": "Mlle.Gillenormand", "value": 6},
    	  {"source": "Marius", "target": "Gillenormand", "value": 12},
    	  {"source": "Marius", "target": "Pontmercy", "value": 1},
    	  {"source": "Marius", "target": "Lt.Gillenormand", "value": 1},
    	  {"source": "Marius", "target": "Cosette", "value": 21},
    	  {"source": "Marius", "target": "Valjean", "value": 19},
    	  {"source": "Marius", "target": "Tholomyes", "value": 1},
    	  {"source": "Marius", "target": "Thenardier", "value": 2},
    	  {"source": "Marius", "target": "Eponine", "value": 5},
    	  {"source": "Marius", "target": "Gavroche", "value": 4},
    	  {"source": "BaronessT", "target": "Gillenormand", "value": 1},
    	  {"source": "BaronessT", "target": "Marius", "value": 1},
    	  {"source": "Mabeuf", "target": "Marius", "value": 1},
    	  {"source": "Mabeuf", "target": "Eponine", "value": 1},
    	  {"source": "Mabeuf", "target": "Gavroche", "value": 1},
    	  {"source": "Enjolras", "target": "Marius", "value": 7},
    	  {"source": "Enjolras", "target": "Gavroche", "value": 7},
    	  {"source": "Enjolras", "target": "Javert", "value": 6},
    	  {"source": "Enjolras", "target": "Mabeuf", "value": 1},
    	  {"source": "Enjolras", "target": "Valjean", "value": 4},
    	  {"source": "Combeferre", "target": "Enjolras", "value": 15},
    	  {"source": "Combeferre", "target": "Marius", "value": 5},
    	  {"source": "Combeferre", "target": "Gavroche", "value": 6},
    	  {"source": "Combeferre", "target": "Mabeuf", "value": 2},
    	  {"source": "Prouvaire", "target": "Gavroche", "value": 1},
    	  {"source": "Prouvaire", "target": "Enjolras", "value": 4},
    	  {"source": "Prouvaire", "target": "Combeferre", "value": 2},
    	  {"source": "Feuilly", "target": "Gavroche", "value": 2},
    	  {"source": "Feuilly", "target": "Enjolras", "value": 6},
    	  {"source": "Feuilly", "target": "Prouvaire", "value": 2},
    	  {"source": "Feuilly", "target": "Combeferre", "value": 5},
    	  {"source": "Feuilly", "target": "Mabeuf", "value": 1},
    	  {"source": "Feuilly", "target": "Marius", "value": 1},
    	  {"source": "Courfeyrac", "target": "Marius", "value": 9},
    	  {"source": "Courfeyrac", "target": "Enjolras", "value": 17},
    	  {"source": "Courfeyrac", "target": "Combeferre", "value": 13},
    	  {"source": "Courfeyrac", "target": "Gavroche", "value": 7},
    	  {"source": "Courfeyrac", "target": "Mabeuf", "value": 2},
    	  {"source": "Courfeyrac", "target": "Eponine", "value": 1},
    	  {"source": "Courfeyrac", "target": "Feuilly", "value": 6},
    	  {"source": "Courfeyrac", "target": "Prouvaire", "value": 3},
    	  {"source": "Bahorel", "target": "Combeferre", "value": 5},
    	  {"source": "Bahorel", "target": "Gavroche", "value": 5},
    	  {"source": "Bahorel", "target": "Courfeyrac", "value": 6},
    	  {"source": "Bahorel", "target": "Mabeuf", "value": 2},
    	  {"source": "Bahorel", "target": "Enjolras", "value": 4},
    	  {"source": "Bahorel", "target": "Feuilly", "value": 3},
    	  {"source": "Bahorel", "target": "Prouvaire", "value": 2},
    	  {"source": "Bahorel", "target": "Marius", "value": 1},
    	  {"source": "Bossuet", "target": "Marius", "value": 5},
    	  {"source": "Bossuet", "target": "Courfeyrac", "value": 12},
    	  {"source": "Bossuet", "target": "Gavroche", "value": 5},
    	  {"source": "Bossuet", "target": "Bahorel", "value": 4},
    	  {"source": "Bossuet", "target": "Enjolras", "value": 10},
    	  {"source": "Bossuet", "target": "Feuilly", "value": 6},
    	  {"source": "Bossuet", "target": "Prouvaire", "value": 2},
    	  {"source": "Bossuet", "target": "Combeferre", "value": 9},
    	  {"source": "Bossuet", "target": "Mabeuf", "value": 1},
    	  {"source": "Bossuet", "target": "Valjean", "value": 1},
    	  {"source": "Joly", "target": "Bahorel", "value": 5},
    	  {"source": "Joly", "target": "Bossuet", "value": 7},
    	  {"source": "Joly", "target": "Gavroche", "value": 3},
    	  {"source": "Joly", "target": "Courfeyrac", "value": 5},
    	  {"source": "Joly", "target": "Enjolras", "value": 5},
    	  {"source": "Joly", "target": "Feuilly", "value": 5},
    	  {"source": "Joly", "target": "Prouvaire", "value": 2},
    	  {"source": "Joly", "target": "Combeferre", "value": 5},
    	  {"source": "Joly", "target": "Mabeuf", "value": 1},
    	  {"source": "Joly", "target": "Marius", "value": 2},
    	  {"source": "Grantaire", "target": "Bossuet", "value": 3},
    	  {"source": "Grantaire", "target": "Enjolras", "value": 3},
    	  {"source": "Grantaire", "target": "Combeferre", "value": 1},
    	  {"source": "Grantaire", "target": "Courfeyrac", "value": 2},
    	  {"source": "Grantaire", "target": "Joly", "value": 2},
    	  {"source": "Grantaire", "target": "Gavroche", "value": 1},
    	  {"source": "Grantaire", "target": "Bahorel", "value": 1},
    	  {"source": "Grantaire", "target": "Feuilly", "value": 1},
    	  {"source": "Grantaire", "target": "Prouvaire", "value": 1},
    	  {"source": "MotherPlutarch", "target": "Mabeuf", "value": 3},
    	  {"source": "Gueulemer", "target": "Thenardier", "value": 5},
    	  {"source": "Gueulemer", "target": "Valjean", "value": 1},
    	  {"source": "Gueulemer", "target": "Mme.Thenardier", "value": 1},
    	  {"source": "Gueulemer", "target": "Javert", "value": 1},
    	  {"source": "Gueulemer", "target": "Gavroche", "value": 1},
    	  {"source": "Gueulemer", "target": "Eponine", "value": 1},
    	  {"source": "Babet", "target": "Thenardier", "value": 6},
    	  {"source": "Babet", "target": "Gueulemer", "value": 6},
    	  {"source": "Babet", "target": "Valjean", "value": 1},
    	  {"source": "Babet", "target": "Mme.Thenardier", "value": 1},
    	  {"source": "Babet", "target": "Javert", "value": 2},
    	  {"source": "Babet", "target": "Gavroche", "value": 1},
    	  {"source": "Babet", "target": "Eponine", "value": 1},
    	  {"source": "Claquesous", "target": "Thenardier", "value": 4},
    	  {"source": "Claquesous", "target": "Babet", "value": 4},
    	  {"source": "Claquesous", "target": "Gueulemer", "value": 4},
    	  {"source": "Claquesous", "target": "Valjean", "value": 1},
    	  {"source": "Claquesous", "target": "Mme.Thenardier", "value": 1},
    	  {"source": "Claquesous", "target": "Javert", "value": 1},
    	  {"source": "Claquesous", "target": "Eponine", "value": 1},
    	  {"source": "Claquesous", "target": "Enjolras", "value": 1},
    	  {"source": "Montparnasse", "target": "Javert", "value": 1},
    	  {"source": "Montparnasse", "target": "Babet", "value": 2},
    	  {"source": "Montparnasse", "target": "Gueulemer", "value": 2},
    	  {"source": "Montparnasse", "target": "Claquesous", "value": 2},
    	  {"source": "Montparnasse", "target": "Valjean", "value": 1},
    	  {"source": "Montparnasse", "target": "Gavroche", "value": 1},
    	  {"source": "Montparnasse", "target": "Eponine", "value": 1},
    	  {"source": "Montparnasse", "target": "Thenardier", "value": 1},
    	  {"source": "Toussaint", "target": "Cosette", "value": 2},
    	  {"source": "Toussaint", "target": "Javert", "value": 1},
    	  {"source": "Toussaint", "target": "Valjean", "value": 1},
    	  {"source": "Child1", "target": "Gavroche", "value": 2},
    	  {"source": "Child2", "target": "Gavroche", "value": 2},
    	  {"source": "Child2", "target": "Child1", "value": 3},
    	  {"source": "Brujon", "target": "Babet", "value": 3},
    	  {"source": "Brujon", "target": "Gueulemer", "value": 3},
    	  {"source": "Brujon", "target": "Thenardier", "value": 3},
    	  {"source": "Brujon", "target": "Gavroche", "value": 1},
    	  {"source": "Brujon", "target": "Eponine", "value": 1},
    	  {"source": "Brujon", "target": "Claquesous", "value": 1},
    	  {"source": "Brujon", "target": "Montparnasse", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Bossuet", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Joly", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Grantaire", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Bahorel", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Courfeyrac", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Gavroche", "value": 1},
    	  {"source": "Mme.Hucheloup", "target": "Enjolras", "value": 1}
    	]
      };

    /* src/pages/index.svelte generated by Svelte v3.23.2 */
    const file$A = "src/pages/index.svelte";

    // (707:2) <ContentArea>
    function create_default_slot_5$1(ctx) {
    	let div;
    	let graph;
    	let current;
    	graph = new NetworkGraphCanvas({ props: { graph: data }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(graph.$$.fragment);
    			attr_dev(div, "class", "chart svelte-1k9bkep");
    			add_location(div, file$A, 707, 4, 15102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(graph, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(graph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(707:2) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (726:4) <Area>
    function create_default_slot_4$1(ctx) {
    	let p;
    	let t1;
    	let blockquote0;
    	let t2;
    	let blockquote1;
    	let t3;
    	let blockquote2;
    	let current;

    	blockquote0 = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "The path isn't a straight line, its a spiral. You continually come back to things you thought you understood and see deeper truths.",
    				author: "Barry H. Gillespie"
    			},
    			$$inline: true
    		});

    	blockquote1 = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "La distancia entre Dios y tú es tan corta que no cabe un camino.",
    				author: "Wei Wu Wei (Terence Gray)"
    			},
    			$$inline: true
    		});

    	blockquote2 = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "Nada sé de caminos; pero conozco la maquinaria del universo. Esto es todo. La aprehendí con mi alma, la alcancé por la simple fuerza de la intuición.",
    				author: "E. A. Poe, Eureka"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Separate and Join Together (or dissolve and coagulate in Latin), is a medieval #alchemy quote, which is to say that nothing new can be built if not before we make space, breaking the old.";
    			t1 = space();
    			create_component(blockquote0.$$.fragment);
    			t2 = space();
    			create_component(blockquote1.$$.fragment);
    			t3 = space();
    			create_component(blockquote2.$$.fragment);
    			attr_dev(p, "class", "svelte-1k9bkep");
    			add_location(p, file$A, 726, 6, 15581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(blockquote0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(blockquote1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(blockquote2, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote0.$$.fragment, local);
    			transition_in(blockquote1.$$.fragment, local);
    			transition_in(blockquote2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote0.$$.fragment, local);
    			transition_out(blockquote1.$$.fragment, local);
    			transition_out(blockquote2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			destroy_component(blockquote0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(blockquote1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(blockquote2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(726:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (735:4) <Banner variante={1}>
    function create_default_slot_3$1(ctx) {
    	let icontres;
    	let t;
    	let blockquote;
    	let current;
    	icontres = new IconTres({ $$inline: true });

    	blockquote = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "En el universo hay cosas que son conocidas y hay cosas que son desconocidas y entre ellas hay puertas...",
    				author: "William Blake"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icontres.$$.fragment);
    			t = space();
    			create_component(blockquote.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icontres, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(blockquote, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icontres.$$.fragment, local);
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icontres.$$.fragment, local);
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icontres, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(735:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (741:4) <Banner>
    function create_default_slot_2$2(ctx) {
    	let blockquote;
    	let t;
    	let iconespiral;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				quote: "Todo tiende a ser lo que viene siendo.",
    				author: "TODH"
    			},
    			$$inline: true
    		});

    	iconespiral = new IconEspiral({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blockquote.$$.fragment);
    			t = space();
    			create_component(iconespiral.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blockquote, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(iconespiral, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote.$$.fragment, local);
    			transition_in(iconespiral.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote.$$.fragment, local);
    			transition_out(iconespiral.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blockquote, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(iconespiral, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(741:4) <Banner>",
    		ctx
    	});

    	return block;
    }

    // (740:2) <ContentArea>
    function create_default_slot_1$3(ctx) {
    	let banner;
    	let current;

    	banner = new Banner({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(banner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(banner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const banner_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				banner_changes.$$scope = { dirty, ctx };
    			}

    			banner.$set(banner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(banner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(banner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(banner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(740:2) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (706:0) <Content>
    function create_default_slot$5(ctx) {
    	let contentarea0;
    	let t0;
    	let mainfeatures;
    	let t1;
    	let area;
    	let t2;
    	let banner;
    	let t3;
    	let contentarea1;
    	let current;

    	contentarea0 = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	mainfeatures = new MainFeatures({ $$inline: true });

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	contentarea1 = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea0.$$.fragment);
    			t0 = space();
    			create_component(mainfeatures.$$.fragment);
    			t1 = space();
    			create_component(area.$$.fragment);
    			t2 = space();
    			create_component(banner.$$.fragment);
    			t3 = space();
    			create_component(contentarea1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(mainfeatures, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(banner, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(contentarea1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				contentarea0_changes.$$scope = { dirty, ctx };
    			}

    			contentarea0.$set(contentarea0_changes);
    			const area_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    			const banner_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				banner_changes.$$scope = { dirty, ctx };
    			}

    			banner.$set(banner_changes);
    			const contentarea1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				contentarea1_changes.$$scope = { dirty, ctx };
    			}

    			contentarea1.$set(contentarea1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentarea0.$$.fragment, local);
    			transition_in(mainfeatures.$$.fragment, local);
    			transition_in(area.$$.fragment, local);
    			transition_in(banner.$$.fragment, local);
    			transition_in(contentarea1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentarea0.$$.fragment, local);
    			transition_out(mainfeatures.$$.fragment, local);
    			transition_out(area.$$.fragment, local);
    			transition_out(banner.$$.fragment, local);
    			transition_out(contentarea1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentarea0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(mainfeatures, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(banner, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(contentarea1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(706:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let t0;
    	let pagetitle;
    	let t1;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "TODH",
    				pageSubTitle: "Arte, Código y cosmovisión primigenia"
    			},
    			$$inline: true
    		});

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(pagetitle.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    			document.title = "TODH";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(pagetitle, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(pagetitle, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	metatags.title = "T-O-D-H";
    	metatags["twitter:card"] = "Visión holística y artefactos en torno a la Creación";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Pages> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Pages", $$slots, []);

    	$$self.$capture_state = () => ({
    		fade,
    		PageTitle,
    		Content,
    		ContentArea,
    		Area,
    		Banner,
    		BlockQuote,
    		IconTres,
    		MainFeatures,
    		CoverIntroCarousel,
    		IconEspiral,
    		metatags,
    		GraphSvelteSVG: NetworkGraphSvelteSVG,
    		Graph: NetworkGraphCanvas,
    		data
    	});

    	return [];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src/pages/products/[slug].svelte generated by Svelte v3.23.2 */
    const file$B = "src/pages/products/[slug].svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (739:8) {#if (product.slug === slug)}
    function create_if_block$7(ctx) {
    	let article;
    	let figure;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let figcaption;
    	let strong;
    	let t1_value = /*product*/ ctx[3].title + "";
    	let t1;
    	let t2;
    	let em;
    	let t3_value = /*product*/ ctx[3].description + "";
    	let t3;
    	let t4;
    	let aside;
    	let h3;
    	let raw0_value = /*product*/ ctx[3].content.h1 + "";
    	let t5;
    	let p;
    	let raw1_value = /*product*/ ctx[3].content.p + "";

    	const block = {
    		c: function create() {
    			article = element("article");
    			figure = element("figure");
    			img = element("img");
    			t0 = space();
    			figcaption = element("figcaption");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = space();
    			em = element("em");
    			t3 = text(t3_value);
    			t4 = space();
    			aside = element("aside");
    			h3 = element("h3");
    			t5 = space();
    			p = element("p");
    			if (img.src !== (img_src_value = "/" + /*product*/ ctx[3].imagen)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[3].title);
    			attr_dev(img, "class", "svelte-zhqqz8");
    			add_location(img, file$B, 741, 16, 15558);
    			attr_dev(strong, "class", "svelte-zhqqz8");
    			add_location(strong, file$B, 743, 20, 15686);
    			attr_dev(em, "class", "svelte-zhqqz8");
    			add_location(em, file$B, 744, 20, 15740);
    			attr_dev(figcaption, "class", "ProductImgCaption svelte-zhqqz8");
    			add_location(figcaption, file$B, 742, 16, 15627);
    			attr_dev(figure, "class", "ProductImgContainer svelte-zhqqz8");
    			add_location(figure, file$B, 740, 12, 15505);
    			attr_dev(article, "class", "ProductArticle svelte-zhqqz8");
    			add_location(article, file$B, 739, 8, 15460);
    			attr_dev(h3, "class", "svelte-zhqqz8");
    			add_location(h3, file$B, 749, 12, 15893);
    			attr_dev(p, "class", "svelte-zhqqz8");
    			add_location(p, file$B, 750, 12, 15941);
    			attr_dev(aside, "class", "ProductContent svelte-zhqqz8");
    			add_location(aside, file$B, 748, 8, 15850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, figure);
    			append_dev(figure, img);
    			append_dev(figure, t0);
    			append_dev(figure, figcaption);
    			append_dev(figcaption, strong);
    			append_dev(strong, t1);
    			append_dev(figcaption, t2);
    			append_dev(figcaption, em);
    			append_dev(em, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, aside, anchor);
    			append_dev(aside, h3);
    			h3.innerHTML = raw0_value;
    			append_dev(aside, t5);
    			append_dev(aside, p);
    			p.innerHTML = raw1_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*productos*/ 2 && img.src !== (img_src_value = "/" + /*product*/ ctx[3].imagen)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*productos*/ 2 && img_alt_value !== (img_alt_value = /*product*/ ctx[3].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*productos*/ 2 && t1_value !== (t1_value = /*product*/ ctx[3].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*productos*/ 2 && t3_value !== (t3_value = /*product*/ ctx[3].description + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*productos*/ 2 && raw0_value !== (raw0_value = /*product*/ ctx[3].content.h1 + "")) h3.innerHTML = raw0_value;			if (dirty & /*productos*/ 2 && raw1_value !== (raw1_value = /*product*/ ctx[3].content.p + "")) p.innerHTML = raw1_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(aside);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(739:8) {#if (product.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (738:8) {#each productos as product}
    function create_each_block_1$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*product*/ ctx[3].slug === /*slug*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*product*/ ctx[3].slug === /*slug*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(738:8) {#each productos as product}",
    		ctx
    	});

    	return block;
    }

    // (756:12) {#each productos as product}
    function create_each_block$8(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t = space();
    			if (img.src !== (img_src_value = "/" + /*product*/ ctx[3].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-zhqqz8");
    			add_location(img, file$B, 757, 12, 16189);
    			attr_dev(a, "href", a_href_value = /*product*/ ctx[3].slug);
    			attr_dev(a, "class", "svelte-zhqqz8");
    			toggle_class(a, "selected", /*$isActive*/ ctx[2](/*product*/ ctx[3].thumb));
    			add_location(a, file$B, 756, 12, 16107);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*productos*/ 2 && img.src !== (img_src_value = "/" + /*product*/ ctx[3].thumb)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*productos*/ 2 && a_href_value !== (a_href_value = /*product*/ ctx[3].slug)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, productos*/ 6) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[2](/*product*/ ctx[3].thumb));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(756:12) {#each productos as product}",
    		ctx
    	});

    	return block;
    }

    // (736:0) <Content>
    function create_default_slot$6(ctx) {
    	let div;
    	let t;
    	let nav;
    	let each_value_1 = /*productos*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	let each_value = /*productos*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(nav, "class", "ProductNav svelte-zhqqz8");
    			add_location(nav, file$B, 754, 8, 16029);
    			attr_dev(div, "class", "Product svelte-zhqqz8");
    			add_location(div, file$B, 736, 4, 15355);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, nav);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*productos, slug*/ 3) {
    				each_value_1 = /*productos*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*productos, $isActive*/ 6) {
    				each_value = /*productos*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(736:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(content.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope, productos, $isActive, slug*/ 263) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let $isActive;
    	validate_store(isActive, "isActive");
    	component_subscribe($$self, isActive, $$value => $$invalidate(2, $isActive = $$value));
    	let { slug } = $$props;
    	let productos = [];

    	onMount(async () => {
    		const res = await fetch("/data/products.json");
    		$$invalidate(1, productos = [...await res.json()]);
    	});

    	const writable_props = ["slug"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<U5Bslugu5D> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("U5Bslugu5D", $$slots, []);

    	$$self.$set = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    	};

    	$$self.$capture_state = () => ({
    		url,
    		isActive,
    		onMount,
    		Content,
    		ContentArea,
    		slug,
    		productos,
    		$isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    		if ("productos" in $$props) $$invalidate(1, productos = $$props.productos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [slug, productos, $isActive];
    }

    class U5Bslugu5D$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { slug: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "U5Bslugu5D",
    			options,
    			id: create_fragment$C.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*slug*/ ctx[0] === undefined && !("slug" in props)) {
    			console.warn("<U5Bslugu5D> was created without expected prop 'slug'");
    		}
    	}

    	get slug() {
    		throw new Error("<U5Bslugu5D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slug(value) {
    		throw new Error("<U5Bslugu5D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/products/index.svelte generated by Svelte v3.23.2 */
    const file$C = "src/pages/products/index.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (708:6) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(708:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (697:6) {#each productos as producto}
    function create_each_block$9(ctx) {
    	let div;
    	let a;
    	let card;
    	let a_href_value;
    	let t;
    	let current;

    	card = new Card({
    			props: {
    				title: /*producto*/ ctx[2].title,
    				description: /*producto*/ ctx[2].description,
    				image: /*producto*/ ctx[2].imagen,
    				variante: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			create_component(card.$$.fragment);
    			t = space();
    			attr_dev(a, "href", a_href_value = "/products/" + /*$url*/ ctx[1](/*producto*/ ctx[2].slug));
    			attr_dev(a, "class", "svelte-57yy9z");
    			add_location(a, file$C, 698, 8, 14557);
    			attr_dev(div, "class", "svelte-57yy9z");
    			add_location(div, file$C, 697, 6, 14543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			mount_component(card, a, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*productos*/ 1) card_changes.title = /*producto*/ ctx[2].title;
    			if (dirty & /*productos*/ 1) card_changes.description = /*producto*/ ctx[2].description;
    			if (dirty & /*productos*/ 1) card_changes.image = /*producto*/ ctx[2].imagen;

    			if (dirty & /*$$scope*/ 32) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);

    			if (!current || dirty & /*$url, productos*/ 3 && a_href_value !== (a_href_value = "/products/" + /*$url*/ ctx[1](/*producto*/ ctx[2].slug))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(697:6) {#each productos as producto}",
    		ctx
    	});

    	return block;
    }

    // (696:4) <Cards>
    function create_default_slot_2$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*productos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$2(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else) {
    				each_1_else.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url, productos*/ 3) {
    				each_value = /*productos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$2(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(696:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (713:2) <Banner variante={0}>
    function create_default_slot_1$4(ctx) {
    	let iconespiral;
    	let t;
    	let blockquote;
    	let current;
    	iconespiral = new IconEspiral({ $$inline: true });

    	blockquote = new BlockQuote({
    			props: {
    				variante: 0,
    				quote: "El Universo existe solo con ondas de movimiento... No hay nada más que vibración",
    				author: "Walter Russell"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconespiral.$$.fragment);
    			t = space();
    			create_component(blockquote.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconespiral, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(blockquote, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconespiral.$$.fragment, local);
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconespiral.$$.fragment, local);
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconespiral, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(713:2) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (695:0) <Content>
    function create_default_slot$7(ctx) {
    	let cards;
    	let t;
    	let banner;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cards.$$.fragment);
    			t = space();
    			create_component(banner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cards, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(banner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cards_changes = {};

    			if (dirty & /*$$scope, productos, $url*/ 35) {
    				cards_changes.$$scope = { dirty, ctx };
    			}

    			cards.$set(cards_changes);
    			const banner_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner_changes.$$scope = { dirty, ctx };
    			}

    			banner.$set(banner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cards.$$.fragment, local);
    			transition_in(banner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cards.$$.fragment, local);
    			transition_out(banner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cards, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(banner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(695:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let t0;
    	let pagetitle;
    	let t1;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "Coagulando la vibración",
    				pageSubTitle: "Sergio Forés"
    			},
    			$$inline: true
    		});

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(pagetitle.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    			document.title = "TODH - Artwork";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(pagetitle, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope, productos, $url*/ 35) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(pagetitle, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let $url;
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(1, $url = $$value));
    	let productos = [];

    	onMount(async () => {
    		const res = await fetch("/data/products.json");
    		$$invalidate(0, productos = [...await res.json()]);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Products> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Products", $$slots, []);

    	$$self.$capture_state = () => ({
    		onMount,
    		url,
    		isActive,
    		Loading,
    		PageTitle,
    		Content,
    		ContentArea,
    		Cards,
    		Card,
    		Banner,
    		BlockQuote,
    		IconEspiral,
    		productos,
    		$url
    	});

    	$$self.$inject_state = $$props => {
    		if ("productos" in $$props) $$invalidate(0, productos = $$props.productos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [productos, $url];
    }

    class Products extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* node_modules/svelte-swipe/src/Swipe.svelte generated by Svelte v3.23.2 */
    const file$D = "node_modules/svelte-swipe/src/Swipe.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    // (268:3) {#if showIndicators}
    function create_if_block$8(ctx) {
    	let div;
    	let each_value = /*indicators*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "swipe-indicator swipe-indicator-inside svelte-hja3vj");
    			add_location(div, file$D, 268, 5, 6444);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*activeIndicator, changeItem, indicators*/ 70) {
    				each_value = /*indicators*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(268:3) {#if showIndicators}",
    		ctx
    	});

    	return block;
    }

    // (270:8) {#each indicators as x, i }
    function create_each_block$a(ctx) {
    	let span;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[19](/*i*/ ctx[40], ...args);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");

    			attr_dev(span, "class", span_class_value = "dot " + (/*activeIndicator*/ ctx[1] == /*i*/ ctx[40]
    			? "is-active"
    			: "") + " svelte-hja3vj");

    			add_location(span, file$D, 270, 10, 6545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*activeIndicator*/ 2 && span_class_value !== (span_class_value = "dot " + (/*activeIndicator*/ ctx[1] == /*i*/ ctx[40]
    			? "is-active"
    			: "") + " svelte-hja3vj")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(270:8) {#each indicators as x, i }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let div4;
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div3;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	let if_block = /*showIndicators*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div3 = element("div");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "swipeable-slot-wrapper svelte-hja3vj");
    			add_location(div0, file$D, 261, 6, 6209);
    			attr_dev(div1, "class", "swipeable-items svelte-hja3vj");
    			add_location(div1, file$D, 260, 4, 6172);
    			attr_dev(div2, "class", "swipe-item-wrapper svelte-hja3vj");
    			add_location(div2, file$D, 259, 2, 6109);
    			attr_dev(div3, "class", "swipe-handler svelte-hja3vj");
    			add_location(div3, file$D, 266, 2, 6303);
    			attr_dev(div4, "class", "swipe-panel svelte-hja3vj");
    			add_location(div4, file$D, 258, 0, 6080);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div2_binding*/ ctx[17](div2);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			/*div3_binding*/ ctx[18](div3);
    			append_dev(div4, t1);
    			if (if_block) if_block.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "touchstart", /*moveStart*/ ctx[5], false, false, false),
    					listen_dev(div3, "mousedown", /*moveStart*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			if (/*showIndicators*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (default_slot) default_slot.d(detaching);
    			/*div2_binding*/ ctx[17](null);
    			/*div3_binding*/ ctx[18](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let { transitionDuration = 200 } = $$props;
    	let { showIndicators = false } = $$props;
    	let { autoplay = false } = $$props;
    	let { delay = 1000 } = $$props;
    	let { defaultIndex = 0 } = $$props;
    	let { active_item = 0 } = $$props; //readonly
    	let activeIndicator = 0;
    	let indicators;
    	let items = 0;
    	let availableWidth = 0;
    	let topClearence = 0;
    	let elems;
    	let diff = 0;
    	let swipeWrapper;
    	let swipeHandler;
    	let min = 0;

    	let touchingTpl = `
    -webkit-transition-duration: 0s;
    transition-duration: 0s;
    -webkit-transform: translate3d(-{{val}}px, 0, 0);
    -ms-transform: translate3d(-{{val}}px, 0, 0);`;

    	let non_touchingTpl = `
    -webkit-transition-duration: ${transitionDuration}ms;
    transition-duration: ${transitionDuration}ms;
    -webkit-transform: translate3d(-{{val}}px, 0, 0);
    -ms-transform: translate3d(-{{val}}px, 0, 0);`;

    	let touching = false;
    	let posX = 0;
    	let dir = 0;
    	let x;
    	let played = defaultIndex || 0;
    	let run_interval = false;

    	function update() {
    		$$invalidate(4, swipeHandler.style.top = topClearence + "px", swipeHandler);
    		availableWidth = swipeWrapper.querySelector(".swipeable-items").offsetWidth;

    		for (let i = 0; i < items; i++) {
    			elems[i].style.transform = "translate3d(" + availableWidth * i + "px, 0, 0)";
    		}

    		diff = 0;

    		if (defaultIndex) {
    			changeItem(defaultIndex);
    		}
    	}

    	function init() {
    		elems = swipeWrapper.querySelectorAll(".swipeable-item");
    		$$invalidate(20, items = elems.length);
    		update();
    	}

    	onMount(() => {
    		init();

    		if (typeof window !== "undefined") {
    			window.addEventListener("resize", update);
    		}
    	});

    	onDestroy(() => {
    		if (typeof window !== "undefined") {
    			window.removeEventListener("resize", update);
    		}
    	});

    	function moveHandler(e) {
    		if (touching) {
    			e.stopImmediatePropagation();
    			e.stopPropagation();
    			let max = availableWidth;
    			let _x = e.touches ? e.touches[0].pageX : e.pageX;
    			let _diff = x - _x + posX;
    			let dir = _x > x ? 0 : 1;

    			if (!dir) {
    				_diff = posX - (_x - x);
    			}

    			if (_diff <= max * (items - 1) && _diff >= min) {
    				for (let i = 0; i < items; i++) {
    					let template = i < 0 ? "{{val}}" : "-{{val}}";
    					let _value = max * i - _diff;
    					elems[i].style.cssText = touchingTpl.replace(template, _value).replace(template, _value);
    				}

    				diff = _diff;
    			}
    		}
    	}

    	function endHandler(e) {
    		e && e.stopImmediatePropagation();
    		e && e.stopPropagation();
    		e && e.preventDefault();
    		let max = availableWidth;
    		touching = false;
    		x = null;
    		let swipe_threshold = 0.85;
    		let d_max = diff / max;
    		let _target = Math.round(d_max);

    		if (Math.abs(_target - d_max) < swipe_threshold) {
    			diff = _target * max;
    		} else {
    			diff = (dir ? _target - 1 : _target + 1) * max;
    		}

    		posX = diff;
    		$$invalidate(1, activeIndicator = diff / max);

    		for (let i = 0; i < items; i++) {
    			let template = i < 0 ? "{{val}}" : "-{{val}}";
    			let _value = max * i - posX;
    			elems[i].style.cssText = non_touchingTpl.replace(template, _value).replace(template, _value);
    		}

    		$$invalidate(7, active_item = activeIndicator);

    		if (typeof window !== "undefined") {
    			window.removeEventListener("mousemove", moveHandler);
    			window.removeEventListener("mouseup", endHandler);
    			window.removeEventListener("touchmove", moveHandler);
    			window.removeEventListener("touchend", endHandler);
    		}
    	}

    	function moveStart(e) {
    		e.stopImmediatePropagation();
    		e.stopPropagation();
    		e.preventDefault();
    		touching = true;
    		x = e.touches ? e.touches[0].pageX : e.pageX;

    		if (typeof window !== "undefined") {
    			window.addEventListener("mousemove", moveHandler);
    			window.addEventListener("mouseup", endHandler);
    			window.addEventListener("touchmove", moveHandler);
    			window.addEventListener("touchend", endHandler);
    		}
    	}

    	function changeItem(item) {
    		let max = availableWidth;
    		diff = max * item;
    		$$invalidate(1, activeIndicator = item);
    		endHandler();
    	}

    	function changeView() {
    		changeItem(played);
    		played = played < items - 1 ? ++played : 0;
    	}

    	function goTo(step) {
    		let item = Math.max(0, Math.min(step, indicators.length - 1));
    		changeItem(item);
    	}

    	function prevItem() {
    		let step = activeIndicator - 1;
    		goTo(step);
    	}

    	function nextItem() {
    		let step = activeIndicator + 1;
    		goTo(step);
    	}

    	const writable_props = [
    		"transitionDuration",
    		"showIndicators",
    		"autoplay",
    		"delay",
    		"defaultIndex",
    		"active_item"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Swipe> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Swipe", $$slots, ['default']);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			swipeWrapper = $$value;
    			$$invalidate(3, swipeWrapper);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			swipeHandler = $$value;
    			$$invalidate(4, swipeHandler);
    		});
    	}

    	const click_handler = i => {
    		changeItem(i);
    	};

    	$$self.$set = $$props => {
    		if ("transitionDuration" in $$props) $$invalidate(8, transitionDuration = $$props.transitionDuration);
    		if ("showIndicators" in $$props) $$invalidate(0, showIndicators = $$props.showIndicators);
    		if ("autoplay" in $$props) $$invalidate(9, autoplay = $$props.autoplay);
    		if ("delay" in $$props) $$invalidate(10, delay = $$props.delay);
    		if ("defaultIndex" in $$props) $$invalidate(11, defaultIndex = $$props.defaultIndex);
    		if ("active_item" in $$props) $$invalidate(7, active_item = $$props.active_item);
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		transitionDuration,
    		showIndicators,
    		autoplay,
    		delay,
    		defaultIndex,
    		active_item,
    		activeIndicator,
    		indicators,
    		items,
    		availableWidth,
    		topClearence,
    		elems,
    		diff,
    		swipeWrapper,
    		swipeHandler,
    		min,
    		touchingTpl,
    		non_touchingTpl,
    		touching,
    		posX,
    		dir,
    		x,
    		played,
    		run_interval,
    		update,
    		init,
    		moveHandler,
    		endHandler,
    		moveStart,
    		changeItem,
    		changeView,
    		goTo,
    		prevItem,
    		nextItem
    	});

    	$$self.$inject_state = $$props => {
    		if ("transitionDuration" in $$props) $$invalidate(8, transitionDuration = $$props.transitionDuration);
    		if ("showIndicators" in $$props) $$invalidate(0, showIndicators = $$props.showIndicators);
    		if ("autoplay" in $$props) $$invalidate(9, autoplay = $$props.autoplay);
    		if ("delay" in $$props) $$invalidate(10, delay = $$props.delay);
    		if ("defaultIndex" in $$props) $$invalidate(11, defaultIndex = $$props.defaultIndex);
    		if ("active_item" in $$props) $$invalidate(7, active_item = $$props.active_item);
    		if ("activeIndicator" in $$props) $$invalidate(1, activeIndicator = $$props.activeIndicator);
    		if ("indicators" in $$props) $$invalidate(2, indicators = $$props.indicators);
    		if ("items" in $$props) $$invalidate(20, items = $$props.items);
    		if ("availableWidth" in $$props) availableWidth = $$props.availableWidth;
    		if ("topClearence" in $$props) topClearence = $$props.topClearence;
    		if ("elems" in $$props) elems = $$props.elems;
    		if ("diff" in $$props) diff = $$props.diff;
    		if ("swipeWrapper" in $$props) $$invalidate(3, swipeWrapper = $$props.swipeWrapper);
    		if ("swipeHandler" in $$props) $$invalidate(4, swipeHandler = $$props.swipeHandler);
    		if ("min" in $$props) min = $$props.min;
    		if ("touchingTpl" in $$props) touchingTpl = $$props.touchingTpl;
    		if ("non_touchingTpl" in $$props) non_touchingTpl = $$props.non_touchingTpl;
    		if ("touching" in $$props) touching = $$props.touching;
    		if ("posX" in $$props) posX = $$props.posX;
    		if ("dir" in $$props) dir = $$props.dir;
    		if ("x" in $$props) x = $$props.x;
    		if ("played" in $$props) played = $$props.played;
    		if ("run_interval" in $$props) $$invalidate(27, run_interval = $$props.run_interval);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*items*/ 1048576) {
    			 $$invalidate(2, indicators = Array(items));
    		}

    		if ($$self.$$.dirty[0] & /*autoplay, run_interval, delay*/ 134219264) {
    			 {
    				if (autoplay && !run_interval) {
    					$$invalidate(27, run_interval = setInterval(changeView, delay));
    				}

    				if (!autoplay && run_interval) {
    					clearInterval(run_interval);
    					$$invalidate(27, run_interval = false);
    				}
    			}
    		}
    	};

    	return [
    		showIndicators,
    		activeIndicator,
    		indicators,
    		swipeWrapper,
    		swipeHandler,
    		moveStart,
    		changeItem,
    		active_item,
    		transitionDuration,
    		autoplay,
    		delay,
    		defaultIndex,
    		goTo,
    		prevItem,
    		nextItem,
    		$$scope,
    		$$slots,
    		div2_binding,
    		div3_binding,
    		click_handler
    	];
    }

    class Swipe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$E,
    			create_fragment$E,
    			safe_not_equal,
    			{
    				transitionDuration: 8,
    				showIndicators: 0,
    				autoplay: 9,
    				delay: 10,
    				defaultIndex: 11,
    				active_item: 7,
    				goTo: 12,
    				prevItem: 13,
    				nextItem: 14
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swipe",
    			options,
    			id: create_fragment$E.name
    		});
    	}

    	get transitionDuration() {
    		throw new Error("<Swipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionDuration(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showIndicators() {
    		throw new Error("<Swipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showIndicators(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplay() {
    		throw new Error("<Swipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplay(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<Swipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultIndex() {
    		throw new Error("<Swipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultIndex(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active_item() {
    		throw new Error("<Swipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active_item(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goTo() {
    		return this.$$.ctx[12];
    	}

    	set goTo(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prevItem() {
    		return this.$$.ctx[13];
    	}

    	set prevItem(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextItem() {
    		return this.$$.ctx[14];
    	}

    	set nextItem(value) {
    		throw new Error("<Swipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-swipe/src/SwipeItem.svelte generated by Svelte v3.23.2 */

    const file$E = "node_modules/svelte-swipe/src/SwipeItem.svelte";

    function create_fragment$F(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "swipeable-item " + /*classes*/ ctx[0] + " svelte-1ks2opm");
    			add_location(div, file$E, 15, 0, 224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*classes*/ 1 && div_class_value !== (div_class_value = "swipeable-item " + /*classes*/ ctx[0] + " svelte-1ks2opm")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let { classes = "" } = $$props;
    	const writable_props = ["classes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SwipeItem> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SwipeItem", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("classes" in $$props) $$invalidate(0, classes = $$props.classes);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classes });

    	$$self.$inject_state = $$props => {
    		if ("classes" in $$props) $$invalidate(0, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [classes, $$scope, $$slots];
    }

    class SwipeItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, { classes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SwipeItem",
    			options,
    			id: create_fragment$F.name
    		});
    	}

    	get classes() {
    		throw new Error("<SwipeItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<SwipeItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ToggleMenu.svelte generated by Svelte v3.23.2 */

    const file$F = "src/components/ToggleMenu.svelte";

    // (9:8) {:else}
    function create_else_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("+");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(9:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#if showControls}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("-");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(7:8) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if showControls}
    function create_if_block$9(ctx) {
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Menu item 1";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Menu item 2";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Menu item 3";
    			add_location(li0, file$F, 15, 12, 303);
    			add_location(li1, file$F, 16, 12, 336);
    			add_location(li2, file$F, 17, 12, 369);
    			add_location(ul, file$F, 14, 8, 286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(14:4) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
    	let div;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*showControls*/ ctx[0]) return create_if_block_1$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*showControls*/ ctx[0] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(button, file$F, 5, 4, 124);
    			add_location(div, file$F, 4, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			if_block0.m(button, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleControls*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (/*showControls*/ ctx[0]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let showControls = false;
    	const toggleControls = () => $$invalidate(0, showControls = !showControls);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ToggleMenu> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ToggleMenu", $$slots, []);
    	$$self.$capture_state = () => ({ showControls, toggleControls });

    	$$self.$inject_state = $$props => {
    		if ("showControls" in $$props) $$invalidate(0, showControls = $$props.showControls);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showControls, toggleControls];
    }

    class ToggleMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleMenu",
    			options,
    			id: create_fragment$G.name
    		});
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.23.2 */

    const file$G = "src/components/Button.svelte";

    function create_fragment$H(ctx) {
    	let button;
    	let t;
    	let button_class_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*modificador*/ ctx[2][/*variante*/ ctx[1]]) + " svelte-1qm01pb"));
    			add_location(button, file$G, 679, 0, 13801);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*variante*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*modificador*/ ctx[2][/*variante*/ ctx[1]]) + " svelte-1qm01pb"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let { text = "Name" } = $$props;
    	let { variante = 0 } = $$props;
    	let modificador = ["Default", "Inverse"];
    	const writable_props = ["text", "variante"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, []);

    	$$self.$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("variante" in $$props) $$invalidate(1, variante = $$props.variante);
    	};

    	$$self.$capture_state = () => ({ text, variante, modificador });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("variante" in $$props) $$invalidate(1, variante = $$props.variante);
    		if ("modificador" in $$props) $$invalidate(2, modificador = $$props.modificador);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, variante, modificador];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, { text: 0, variante: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$H.name
    		});
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variante() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variante(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Tag.svelte generated by Svelte v3.23.2 */

    const file$H = "src/components/Tag.svelte";

    // (682:0) {:else}
    function create_else_block$4(ctx) {
    	let small;
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(/*tag*/ ctx[0]);
    			attr_dev(small, "class", "tag  tag--default svelte-2smtez");
    			add_location(small, file$H, 682, 4, 13873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tag*/ 1) set_data_dev(t, /*tag*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(682:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (678:0) {#if isCode === true}
    function create_if_block$a(ctx) {
    	let code;
    	let t;

    	const block = {
    		c: function create() {
    			code = element("code");
    			t = text(/*tag*/ ctx[0]);
    			attr_dev(code, "class", "tag  tag--code svelte-2smtez");
    			add_location(code, file$H, 678, 4, 13805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code, anchor);
    			append_dev(code, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tag*/ 1) set_data_dev(t, /*tag*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(678:0) {#if isCode === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$I(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isCode*/ ctx[1] === true) return create_if_block$a;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let { tag } = $$props;
    	let { isCode = false } = $$props;
    	const writable_props = ["tag", "isCode"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tag> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tag", $$slots, []);

    	$$self.$set = $$props => {
    		if ("tag" in $$props) $$invalidate(0, tag = $$props.tag);
    		if ("isCode" in $$props) $$invalidate(1, isCode = $$props.isCode);
    	};

    	$$self.$capture_state = () => ({ tag, isCode });

    	$$self.$inject_state = $$props => {
    		if ("tag" in $$props) $$invalidate(0, tag = $$props.tag);
    		if ("isCode" in $$props) $$invalidate(1, isCode = $$props.isCode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tag, isCode];
    }

    class Tag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, { tag: 0, isCode: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tag",
    			options,
    			id: create_fragment$I.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tag*/ ctx[0] === undefined && !("tag" in props)) {
    			console.warn("<Tag> was created without expected prop 'tag'");
    		}
    	}

    	get tag() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<Tag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCode() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCode(value) {
    		throw new Error("<Tag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Tabs.svelte generated by Svelte v3.23.2 */
    const file$I = "src/components/Tabs.svelte";

    function create_fragment$J(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tabs svelte-d5ofw2");
    			add_location(div, file$I, 714, 0, 14640);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function instance$J($$self, $$props, $$invalidate) {
    	const tabs = [];
    	const panels = [];
    	const selectedTab = writable(null);
    	const selectedPanel = writable(null);

    	setContext(TABS, {
    		registerTab: tab => {
    			tabs.push(tab);
    			selectedTab.update(current => current || tab);

    			onDestroy(() => {
    				const i = tabs.indexOf(tab);
    				tabs.splice(i, 1);

    				selectedTab.update(current => current === tab
    				? tabs[i] || tabs[tabs.length - 1]
    				: current);
    			});
    		},
    		registerPanel: panel => {
    			panels.push(panel);
    			selectedPanel.update(current => current || panel);

    			onDestroy(() => {
    				const i = panels.indexOf(panel);
    				panels.splice(i, 1);

    				selectedPanel.update(current => current === panel
    				? panels[i] || panels[panels.length - 1]
    				: current);
    			});
    		},
    		selectTab: tab => {
    			const i = tabs.indexOf(tab);
    			selectedTab.set(tab);
    			selectedPanel.set(panels[i]);
    		},
    		selectedTab,
    		selectedPanel
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tabs", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TABS,
    		setContext,
    		onDestroy,
    		writable,
    		tabs,
    		panels,
    		selectedTab,
    		selectedPanel
    	});

    	return [$$scope, $$slots];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    /* src/components/TabList.svelte generated by Svelte v3.23.2 */

    const file$J = "src/components/TabList.svelte";

    function create_fragment$K(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-list svelte-1cv2xos");
    			add_location(div, file$J, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TabList> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TabList", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class TabList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    /* src/components/TabPanel.svelte generated by Svelte v3.23.2 */

    // (11:0) {#if $selectedPanel === panel}
    function create_if_block$b(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(11:0) {#if $selectedPanel === panel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$L(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$selectedPanel*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
    	let $selectedPanel;
    	const panel = {};
    	const { registerPanel, selectedPanel } = getContext(TABS);
    	validate_store(selectedPanel, "selectedPanel");
    	component_subscribe($$self, selectedPanel, value => $$invalidate(0, $selectedPanel = value));
    	registerPanel(panel);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TabPanel> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TabPanel", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		panel,
    		registerPanel,
    		selectedPanel,
    		$selectedPanel
    	});

    	return [$selectedPanel, panel, selectedPanel, $$scope, $$slots];
    }

    class TabPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* src/components/Tab.svelte generated by Svelte v3.23.2 */
    const file$K = "src/components/Tab.svelte";

    function create_fragment$M(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-16srl2o");
    			toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			add_location(button, file$K, 676, 0, 13755);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (dirty & /*$selectedTab, tab*/ 3) {
    				toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let $selectedTab;
    	const tab = {};
    	const { registerTab, selectTab, selectedTab } = getContext(TABS);
    	validate_store(selectedTab, "selectedTab");
    	component_subscribe($$self, selectedTab, value => $$invalidate(0, $selectedTab = value));
    	registerTab(tab);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tab", $$slots, ['default']);
    	const click_handler = () => selectTab(tab);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		tab,
    		registerTab,
    		selectTab,
    		selectedTab,
    		$selectedTab
    	});

    	return [$selectedTab, tab, selectTab, selectedTab, $$scope, $$slots, click_handler];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$M.name
    		});
    	}
    }

    let codeBlocks = readable([
        {
            code_javascript: `let multiplicar = function(x) { 
            return x * x * x;
        }
        
        map(multiplicar, [0, 1, 2, 5, 10]);
        `,
            code_json: `{
            "id": 3,
            "slug": "el-proceso-de-la-incursion",
            "title": "El proceso de la incursión",
            "subtitle": "Otro acercamiento a lo que es TODH",
            "imagen": "img/grafico-7.svg",
            "thumb": "img/th-grafico-7.svg",
            "excerpt": "Lo que hacemos, sentimos, decimos y pensamos es la misma cosa.",
            "content": {
                "h1": "Todo es lo mismo",
                "img1": "img/grafico-8.svg",
                "img2": "img/grafico-5.svg",
        }`,
            code_markup: `<head>...</head>
        <body>
            <header>
                <nav></nav>
            </header>
            <main>
...
            </main>
            <aside>...</aside>
            <footer>...</footer>
        </body>`,
            code_scss: `// Preprocesado de CSS con Sass
        $size-scales: (
          -2: $h-1,
          -1: $h0,
          0: $h1, // 1rem
          1: $h2, // 1.618rem
        );
        @function font-scale($level) {
          @return map-get($size-scales, $level);
        }`,
            code_default: `let message = "Cosmos";
        .helloCosmos {
            background-color: black;
        }
        <p class="helloCosmos">
            Hello { message }!
        </p>`
        },
        {
            code_javascript: "codigo js",
            code_json: "codigo json"
        }
      ]);

    /* src/pages/styleguide.svelte generated by Svelte v3.23.2 */
    const file$L = "src/pages/styleguide.svelte";

    // (721:8) <Area title="TODH en el prototipado Frontend">
    function create_default_slot_45(ctx) {
    	let p0;
    	let strong;
    	let t1;
    	let tag0;
    	let t2;
    	let tag1;
    	let t3;
    	let tag2;
    	let t4;
    	let tag3;
    	let t5;
    	let t6;
    	let p1;
    	let t7;
    	let em;
    	let t9;
    	let t10;
    	let codeblock0;
    	let t11;
    	let p2;
    	let tag4;
    	let t12;
    	let t13;
    	let p3;
    	let t15;
    	let codeblock1;
    	let t16;
    	let p4;
    	let t17;
    	let tag5;
    	let t18;
    	let t19;
    	let p5;
    	let t21;
    	let codeblock2;
    	let t22;
    	let p6;
    	let t23;
    	let tag6;
    	let t24;
    	let tag7;
    	let t25;
    	let t26;
    	let codeblock3;
    	let t27;
    	let p7;
    	let t29;
    	let p8;
    	let t30;
    	let tag8;
    	let t31;
    	let current;

    	tag0 = new Tag({
    			props: { tag: "Javascript", isCode: true },
    			$$inline: true
    		});

    	tag1 = new Tag({
    			props: { tag: "CSS", isCode: true },
    			$$inline: true
    		});

    	tag2 = new Tag({
    			props: { isCode: true, tag: "Html" },
    			$$inline: true
    		});

    	tag3 = new Tag({
    			props: { tag: "Json", isCode: true },
    			$$inline: true
    		});

    	codeblock0 = new CodeBlock({
    			props: {
    				language: "javascript",
    				code: /*$codeBlocks*/ ctx[0][0].code_javascript,
    				header: "Fuego"
    			},
    			$$inline: true
    		});

    	tag4 = new Tag({
    			props: { tag: "Javascript", isCode: true },
    			$$inline: true
    		});

    	codeblock1 = new CodeBlock({
    			props: {
    				language: "css",
    				code: /*$codeBlocks*/ ctx[0][0].code_scss,
    				header: "Agua"
    			},
    			$$inline: true
    		});

    	tag5 = new Tag({
    			props: { tag: "CSS", isCode: true },
    			$$inline: true
    		});

    	codeblock2 = new CodeBlock({
    			props: {
    				language: "html",
    				code: /*$codeBlocks*/ ctx[0][0].code_markup,
    				header: "Tierra"
    			},
    			$$inline: true
    		});

    	tag6 = new Tag({
    			props: { isCode: true, tag: "Html" },
    			$$inline: true
    		});

    	tag7 = new Tag({
    			props: { isCode: true, tag: "Html" },
    			$$inline: true
    		});

    	codeblock3 = new CodeBlock({
    			props: {
    				language: "json",
    				code: /*$codeBlocks*/ ctx[0][0].code_json,
    				header: "Aire"
    			},
    			$$inline: true
    		});

    	tag8 = new Tag({
    			props: { tag: "Json", isCode: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			strong = element("strong");
    			strong.textContent = "Veamos un prototipo Frontend en alta definición (este mismo sitio es un ejemplo), y veámoslo desde\n                sus 4 dimensiones básicas:";
    			t1 = space();
    			create_component(tag0.$$.fragment);
    			t2 = text(" (motor),\n            ");
    			create_component(tag1.$$.fragment);
    			t3 = text(" (apariencia),\n            ");
    			create_component(tag2.$$.fragment);
    			t4 = text(" (estructura) y\n            ");
    			create_component(tag3.$$.fragment);
    			t5 = text(" (contenidos).");
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Como venimos viendo en TODH cada una de estas dimensiones tiene una función, unas cualidades, una energía...\n            que unidas constituyen un \"todo\" que es ");
    			em = element("em");
    			em.textContent = "más que la suma de sus partes";
    			t9 = text(". Trataré de que veamos cómo\n            hasta cuando desarrollamos productos digitales seguimos unas pautas, un ordenamiento y unas directrices que\n            son en realidad ¡universales!.");
    			t10 = space();
    			create_component(codeblock0.$$.fragment);
    			t11 = space();
    			p2 = element("p");
    			create_component(tag4.$$.fragment);
    			t12 = text(" es el que decide cómo se van a comportar todos. Dirige el cotarro.\n            Decide y determina cuáles serán las funciones o acciones que se van a llevar a cabo. En un sitio web se\n            cumple su voluntad sí o sí.");
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "No es fácil de aprender pero su poder no tiene límites. Es el fuego, es el pensamiento, la voluntad, el motor\n            que mueve las cosas y el que las procesa. Su arquetipo es Marte, el guerrero y el rey con potestad para\n            imbiscuirse en los asuntos de todos los demás.";
    			t15 = space();
    			create_component(codeblock1.$$.fragment);
    			t16 = space();
    			p4 = element("p");
    			t17 = text("La hoja de estilos se encarga del aspecto visual, el tono, la consistencia, la armonía, el ritmo, las proporciones, la empatía con el usuario, lo cognitivo, la interfaz grafica, el sabor. El\n            ");
    			create_component(tag5.$$.fragment);
    			t18 = text(" dota de identidad a los distintos elementos de la App.");
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "No por casualidad su elemento es el agua y el número dos, porque media entre lo de dentro y lo de afuera, entre el observador y lo observado.";
    			t21 = space();
    			create_component(codeblock2.$$.fragment);
    			t22 = space();
    			p6 = element("p");
    			t23 = text("El\n            ");
    			create_component(tag6.$$.fragment);
    			t24 = text(", o lenguaje de marcado, nos dará la base sobre la que se edifica todo. Es la estructura de nuestro sitio. Es el elemento que da cuerpo, que baja, cristaliza y posibilita las ideas.\n            Es el sentido de realidad tan necesario. Al\n            ");
    			create_component(tag7.$$.fragment);
    			t25 = text(" le interesa la practicidad, la accesibilidad. Es el lienzo donde todo ocurre y se manifiesta. Es el organizador, el soporte de las cosas.");
    			t26 = space();
    			create_component(codeblock3.$$.fragment);
    			t27 = space();
    			p7 = element("p");
    			p7.textContent = "Y llegamos al contenido, al mensaje, el vínculo con el otro. Es el reino del lenguaje y la conexión. En la\n            mitología romana era representado por Mercurio y en la griega era Hermes.";
    			t29 = space();
    			p8 = element("p");
    			t30 = text("Uno de los formatos que más se usa es\n            ");
    			create_component(tag8.$$.fragment);
    			t31 = text(", un estándar para el intercambio de información. Innumerables webs se\n            conectan a servicios API Rest que consumen datos. Tiene que ver con el arquetipo del mensajero \"alado\".");
    			attr_dev(strong, "class", "svelte-15o0rvz");
    			add_location(strong, file$L, 721, 11, 15398);
    			attr_dev(p0, "class", "svelte-15o0rvz");
    			add_location(p0, file$L, 721, 8, 15395);
    			attr_dev(em, "class", "svelte-15o0rvz");
    			add_location(em, file$L, 728, 52, 15971);
    			attr_dev(p1, "class", "svelte-15o0rvz");
    			add_location(p1, file$L, 727, 8, 15807);
    			attr_dev(p2, "class", "svelte-15o0rvz");
    			add_location(p2, file$L, 733, 8, 16311);
    			attr_dev(p3, "class", "svelte-15o0rvz");
    			add_location(p3, file$L, 737, 8, 16601);
    			attr_dev(p4, "class", "svelte-15o0rvz");
    			add_location(p4, file$L, 742, 8, 16985);
    			attr_dev(p5, "class", "svelte-15o0rvz");
    			add_location(p5, file$L, 744, 8, 17290);
    			attr_dev(p6, "class", "svelte-15o0rvz");
    			add_location(p6, file$L, 747, 8, 17536);
    			attr_dev(p7, "class", "svelte-15o0rvz");
    			add_location(p7, file$L, 753, 8, 18106);
    			attr_dev(p8, "class", "svelte-15o0rvz");
    			add_location(p8, file$L, 756, 8, 18316);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, strong);
    			append_dev(p0, t1);
    			mount_component(tag0, p0, null);
    			append_dev(p0, t2);
    			mount_component(tag1, p0, null);
    			append_dev(p0, t3);
    			mount_component(tag2, p0, null);
    			append_dev(p0, t4);
    			mount_component(tag3, p0, null);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t7);
    			append_dev(p1, em);
    			append_dev(p1, t9);
    			insert_dev(target, t10, anchor);
    			mount_component(codeblock0, target, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p2, anchor);
    			mount_component(tag4, p2, null);
    			append_dev(p2, t12);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(codeblock1, target, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t17);
    			mount_component(tag5, p4, null);
    			append_dev(p4, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t21, anchor);
    			mount_component(codeblock2, target, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t23);
    			mount_component(tag6, p6, null);
    			append_dev(p6, t24);
    			mount_component(tag7, p6, null);
    			append_dev(p6, t25);
    			insert_dev(target, t26, anchor);
    			mount_component(codeblock3, target, anchor);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, p7, anchor);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p8, anchor);
    			append_dev(p8, t30);
    			mount_component(tag8, p8, null);
    			append_dev(p8, t31);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const codeblock0_changes = {};
    			if (dirty & /*$codeBlocks*/ 1) codeblock0_changes.code = /*$codeBlocks*/ ctx[0][0].code_javascript;
    			codeblock0.$set(codeblock0_changes);
    			const codeblock1_changes = {};
    			if (dirty & /*$codeBlocks*/ 1) codeblock1_changes.code = /*$codeBlocks*/ ctx[0][0].code_scss;
    			codeblock1.$set(codeblock1_changes);
    			const codeblock2_changes = {};
    			if (dirty & /*$codeBlocks*/ 1) codeblock2_changes.code = /*$codeBlocks*/ ctx[0][0].code_markup;
    			codeblock2.$set(codeblock2_changes);
    			const codeblock3_changes = {};
    			if (dirty & /*$codeBlocks*/ 1) codeblock3_changes.code = /*$codeBlocks*/ ctx[0][0].code_json;
    			codeblock3.$set(codeblock3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tag0.$$.fragment, local);
    			transition_in(tag1.$$.fragment, local);
    			transition_in(tag2.$$.fragment, local);
    			transition_in(tag3.$$.fragment, local);
    			transition_in(codeblock0.$$.fragment, local);
    			transition_in(tag4.$$.fragment, local);
    			transition_in(codeblock1.$$.fragment, local);
    			transition_in(tag5.$$.fragment, local);
    			transition_in(codeblock2.$$.fragment, local);
    			transition_in(tag6.$$.fragment, local);
    			transition_in(tag7.$$.fragment, local);
    			transition_in(codeblock3.$$.fragment, local);
    			transition_in(tag8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tag0.$$.fragment, local);
    			transition_out(tag1.$$.fragment, local);
    			transition_out(tag2.$$.fragment, local);
    			transition_out(tag3.$$.fragment, local);
    			transition_out(codeblock0.$$.fragment, local);
    			transition_out(tag4.$$.fragment, local);
    			transition_out(codeblock1.$$.fragment, local);
    			transition_out(tag5.$$.fragment, local);
    			transition_out(codeblock2.$$.fragment, local);
    			transition_out(tag6.$$.fragment, local);
    			transition_out(tag7.$$.fragment, local);
    			transition_out(codeblock3.$$.fragment, local);
    			transition_out(tag8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			destroy_component(tag0);
    			destroy_component(tag1);
    			destroy_component(tag2);
    			destroy_component(tag3);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t10);
    			destroy_component(codeblock0, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p2);
    			destroy_component(tag4);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t15);
    			destroy_component(codeblock1, detaching);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p4);
    			destroy_component(tag5);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t21);
    			destroy_component(codeblock2, detaching);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(p6);
    			destroy_component(tag6);
    			destroy_component(tag7);
    			if (detaching) detach_dev(t26);
    			destroy_component(codeblock3, detaching);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p8);
    			destroy_component(tag8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_45.name,
    		type: "slot",
    		source: "(721:8) <Area title=\\\"TODH en el prototipado Frontend\\\">",
    		ctx
    	});

    	return block;
    }

    // (768:8) <List type="numbered">
    function create_default_slot_44(ctx) {
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			li0.textContent = "Una mente o principio conceptual. Un propósito.";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Una piel sensible que lo contiene y le proporciona identidad";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Un vínculo y conexión con el mundo externo";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "Un cuerpo o forma concreta que le de realidad y soporte";
    			attr_dev(li0, "class", "text_color_uno svelte-15o0rvz");
    			add_location(li0, file$L, 768, 12, 18829);
    			attr_dev(li1, "class", "text_color_dos svelte-15o0rvz");
    			add_location(li1, file$L, 769, 12, 18921);
    			attr_dev(li2, "class", "text_color_tres svelte-15o0rvz");
    			add_location(li2, file$L, 770, 12, 19026);
    			attr_dev(li3, "class", "text_color_cuatro svelte-15o0rvz");
    			add_location(li3, file$L, 771, 12, 19114);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, li2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, li3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(li3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_44.name,
    		type: "slot",
    		source: "(768:8) <List type=\\\"numbered\\\">",
    		ctx
    	});

    	return block;
    }

    // (801:8) <List type>
    function create_default_slot_43(ctx) {
    	let li0;
    	let t1;
    	let li1;
    	let t2;
    	let acronym;
    	let t4;
    	let t5;
    	let li2;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			li0.textContent = "Generadores de webs estáticas, JAMStack, SPA's que pueden consumir Servicios API Rest.";
    			t1 = space();
    			li1 = element("li");
    			t2 = text("Adiós al Shadow ");
    			acronym = element("acronym");
    			acronym.textContent = "DOM";
    			t4 = text(" y otras bondades de Svelte.");
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Living design Systems y Styleguides";
    			attr_dev(li0, "class", "svelte-15o0rvz");
    			add_location(li0, file$L, 801, 12, 21455);
    			attr_dev(acronym, "title", "Document Object Model");
    			attr_dev(acronym, "class", "svelte-15o0rvz");
    			add_location(acronym, file$L, 802, 32, 21583);
    			attr_dev(li1, "class", "svelte-15o0rvz");
    			add_location(li1, file$L, 802, 12, 21563);
    			attr_dev(li2, "class", "svelte-15o0rvz");
    			add_location(li2, file$L, 803, 12, 21681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, t2);
    			append_dev(li1, acronym);
    			append_dev(li1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, li2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(li2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_43.name,
    		type: "slot",
    		source: "(801:8) <List type>",
    		ctx
    	});

    	return block;
    }

    // (813:8) <List type>
    function create_default_slot_42(ctx) {
    	let li0;
    	let tag0;
    	let t0;
    	let em;
    	let strong;
    	let t2;
    	let acronym;
    	let t4;
    	let a;
    	let t6;
    	let li1;
    	let tag1;
    	let t7;
    	let t8;
    	let li2;
    	let tag2;
    	let t9;
    	let t10;
    	let li3;
    	let tag3;
    	let t11;
    	let current;

    	tag0 = new Tag({
    			props: { tag: "Sveltejs" },
    			$$inline: true
    		});

    	tag1 = new Tag({
    			props: { tag: "Routify" },
    			$$inline: true
    		});

    	tag2 = new Tag({ props: { tag: "Sass" }, $$inline: true });
    	tag3 = new Tag({ props: { tag: "Git" }, $$inline: true });

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			create_component(tag0.$$.fragment);
    			t0 = text(" Realiza toda la gestión de tareas automáticamente y te devuelve un\n                ");
    			em = element("em");
    			strong = element("strong");
    			strong.textContent = "build";
    			t2 = text(" de un sitio estático que es una ");
    			acronym = element("acronym");
    			acronym.textContent = "SPA";
    			t4 = text(". En mi opinión representa el inicio de un nuevo\n                paradigma en el desarrollo web. 🌈😱 ");
    			a = element("a");
    			a.textContent = "svelte.dev";
    			t6 = space();
    			li1 = element("li");
    			create_component(tag1.$$.fragment);
    			t7 = text(" Genera enrutamiento para Single Page Applications, meta tags, etc.");
    			t8 = space();
    			li2 = element("li");
    			create_component(tag2.$$.fragment);
    			t9 = text("Preprocesado del CSS");
    			t10 = space();
    			li3 = element("li");
    			create_component(tag3.$$.fragment);
    			t11 = text(" Control de versiones y Deployments (también Now, Netlify)");
    			attr_dev(strong, "class", "svelte-15o0rvz");
    			add_location(strong, file$L, 815, 20, 22284);
    			attr_dev(em, "class", "svelte-15o0rvz");
    			add_location(em, file$L, 815, 16, 22280);
    			attr_dev(acronym, "title", "Single Page Application");
    			attr_dev(acronym, "class", "svelte-15o0rvz");
    			add_location(acronym, file$L, 815, 80, 22344);
    			attr_dev(a, "href", "https://svelte.dev/");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-15o0rvz");
    			add_location(a, file$L, 817, 53, 22520);
    			attr_dev(li0, "class", "svelte-15o0rvz");
    			add_location(li0, file$L, 813, 12, 22153);
    			attr_dev(li1, "class", "svelte-15o0rvz");
    			add_location(li1, file$L, 819, 12, 22611);
    			attr_dev(li2, "class", "svelte-15o0rvz");
    			add_location(li2, file$L, 821, 12, 22738);
    			attr_dev(li3, "class", "svelte-15o0rvz");
    			add_location(li3, file$L, 823, 12, 22816);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			mount_component(tag0, li0, null);
    			append_dev(li0, t0);
    			append_dev(li0, em);
    			append_dev(em, strong);
    			append_dev(li0, t2);
    			append_dev(li0, acronym);
    			append_dev(li0, t4);
    			append_dev(li0, a);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, li1, anchor);
    			mount_component(tag1, li1, null);
    			append_dev(li1, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, li2, anchor);
    			mount_component(tag2, li2, null);
    			append_dev(li2, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, li3, anchor);
    			mount_component(tag3, li3, null);
    			append_dev(li3, t11);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tag0.$$.fragment, local);
    			transition_in(tag1.$$.fragment, local);
    			transition_in(tag2.$$.fragment, local);
    			transition_in(tag3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tag0.$$.fragment, local);
    			transition_out(tag1.$$.fragment, local);
    			transition_out(tag2.$$.fragment, local);
    			transition_out(tag3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			destroy_component(tag0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(li1);
    			destroy_component(tag1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(li2);
    			destroy_component(tag2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(li3);
    			destroy_component(tag3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_42.name,
    		type: "slot",
    		source: "(813:8) <List type>",
    		ctx
    	});

    	return block;
    }

    // (765:8) <Area>
    function create_default_slot_41(ctx) {
    	let p0;
    	let strong0;
    	let t1;
    	let list0;
    	let t2;
    	let p1;
    	let t4;
    	let p2;
    	let t6;
    	let p3;
    	let t8;
    	let p4;
    	let t9;
    	let em;
    	let t11;
    	let t12;
    	let p5;
    	let t14;
    	let p6;
    	let t16;
    	let list1;
    	let t17;
    	let p7;
    	let t19;
    	let p8;
    	let strong1;
    	let t21;
    	let list2;
    	let t22;
    	let p9;
    	let t24;
    	let codeblock;
    	let current;

    	list0 = new List({
    			props: {
    				type: "numbered",
    				$$slots: { default: [create_default_slot_44] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	list1 = new List({
    			props: {
    				type: true,
    				$$slots: { default: [create_default_slot_43] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	list2 = new List({
    			props: {
    				type: true,
    				$$slots: { default: [create_default_slot_42] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	codeblock = new CodeBlock({
    			props: {
    				language: "javascript",
    				code: /*$codeBlocks*/ ctx[0][0].code_default,
    				header: "Component.svelte"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Cualquier ser, cualquier 'algo' requiere de estas 4 dimensiones:";
    			t1 = space();
    			create_component(list0.$$.fragment);
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Cuatro dimensiones que 'van juntas' y determinan la Unidad. Y eso es lo único que hay, la Unidad, el Uno y\n            sus dvisiones o partes. Y no es algo me me haya inventado yo, lo decía Pitágoras cinco siglos antes de\n            Cristo.";
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = "Y aquí señores está toda la miga del asunto, entendida la naturaleza cuaternaria de un prototipo podemos ya\n            pasar a una fase en la que vemos actuar todo esto en equilibrio y también cómo se anida en sistemas hacia\n            arriba, en lo macro, y hacia adentro, en lo micro.";
    			t6 = space();
    			p3 = element("p");
    			p3.textContent = "¿Cómo lo hacemos? Hay miles de maneras distintas pero yo os voy a hablar de la que yo uso ahora mismo y la\n            que mejor me funciona a mi.";
    			t8 = space();
    			p4 = element("p");
    			t9 = text("El mundo Front ha experimentado una gran evolución y transformación desde la época de los 90 del siglo XX.\n            Sus inicios fueron rudimentarios comparados con cómo está ahora el tema y las webs se caracterizaban por ser\n            construidas 'a mano' por un tipo que sabía de html, css, javascript, el antigüo ");
    			em = element("em");
    			em.textContent = "Webmaster";
    			t11 = text(". Desde\n            ahí una escalada exponencial creciente de herramientas, perfiles, metodologías fue dotando al Front de más\n            capacidad, especialización, rapidez, etc pero también de mucha más complejidad. Gestores de tareas fueron\n            apareciendo para facilitar el trabajo de concatenar javascript, preprocesar css, hacer los builds, etc,\n            aparecen gestores de dependencias como NPM, Bower, etc. Y fueron apareciendo librerías o frameworks como\n            React, Angular, Vue... que aportan toda una serie de buenas cosas como la componentización, etc...");
    			t12 = space();
    			p5 = element("p");
    			p5.textContent = "El ecosistema de herramientas, métodologías o formas de trabajar fue creciendo y hablar de ello es\n            francamente para mí inabarcable... Pero en esta inmensa torre de Babel del panorama front actual que ni\n            puedo ni quiero abordar, hay una serie de propuestas, métodos y herramientas que recuperan ese espíritu\n            artesanal de los 90 sin renunciar a muchos de los logros que se han conseguido por el camino.";
    			t14 = space();
    			p6 = element("p");
    			p6.textContent = "Personalmente simpatizo y me encuentro a gusto con éste Stack";
    			t16 = space();
    			create_component(list1.$$.fragment);
    			t17 = space();
    			p7 = element("p");
    			p7.textContent = "Cuando le coges el gusto a prototipar directamente en el navegador y al uso de los inspectores de navegador se\n            te hace raro volver a Sketch App o Axure y es que nada es comparable a la certeza de saber cómo se va a\n            comportar tu diseño en un navegador al 100%.";
    			t19 = space();
    			p8 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Mi entorno local ideal para prototipado web:";
    			t21 = space();
    			create_component(list2.$$.fragment);
    			t22 = space();
    			p9 = element("p");
    			p9.textContent = "Diseñar, maquetar y hasta publicar prototipos de máxima definición vuelve a ser relativamente fácil y simple\n            y ¡absolutamente divertido!";
    			t24 = space();
    			create_component(codeblock.$$.fragment);
    			attr_dev(strong0, "class", "svelte-15o0rvz");
    			add_location(strong0, file$L, 765, 11, 18699);
    			attr_dev(p0, "class", "svelte-15o0rvz");
    			add_location(p0, file$L, 765, 8, 18696);
    			attr_dev(p1, "class", "svelte-15o0rvz");
    			add_location(p1, file$L, 774, 8, 19230);
    			attr_dev(p2, "class", "svelte-15o0rvz");
    			add_location(p2, file$L, 778, 8, 19488);
    			attr_dev(p3, "class", "svelte-15o0rvz");
    			add_location(p3, file$L, 782, 8, 19793);
    			attr_dev(em, "class", "svelte-15o0rvz");
    			add_location(em, file$L, 787, 92, 20279);
    			attr_dev(p4, "class", "svelte-15o0rvz");
    			add_location(p4, file$L, 785, 8, 19956);
    			attr_dev(p5, "class", "svelte-15o0rvz");
    			add_location(p5, file$L, 793, 8, 20899);
    			attr_dev(p6, "class", "svelte-15o0rvz");
    			add_location(p6, file$L, 798, 8, 21352);
    			attr_dev(p7, "class", "svelte-15o0rvz");
    			add_location(p7, file$L, 806, 8, 21751);
    			attr_dev(strong1, "class", "svelte-15o0rvz");
    			add_location(strong1, file$L, 810, 11, 22054);
    			attr_dev(p8, "class", "svelte-15o0rvz");
    			add_location(p8, file$L, 810, 8, 22051);
    			attr_dev(p9, "class", "svelte-15o0rvz");
    			add_location(p9, file$L, 827, 8, 22943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, strong0);
    			insert_dev(target, t1, anchor);
    			mount_component(list0, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t9);
    			append_dev(p4, em);
    			append_dev(p4, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(list1, target, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p7, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p8, anchor);
    			append_dev(p8, strong1);
    			insert_dev(target, t21, anchor);
    			mount_component(list2, target, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, p9, anchor);
    			insert_dev(target, t24, anchor);
    			mount_component(codeblock, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const list0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				list0_changes.$$scope = { dirty, ctx };
    			}

    			list0.$set(list0_changes);
    			const list1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				list1_changes.$$scope = { dirty, ctx };
    			}

    			list1.$set(list1_changes);
    			const list2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				list2_changes.$$scope = { dirty, ctx };
    			}

    			list2.$set(list2_changes);
    			const codeblock_changes = {};
    			if (dirty & /*$codeBlocks*/ 1) codeblock_changes.code = /*$codeBlocks*/ ctx[0][0].code_default;
    			codeblock.$set(codeblock_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list0.$$.fragment, local);
    			transition_in(list1.$$.fragment, local);
    			transition_in(list2.$$.fragment, local);
    			transition_in(codeblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list0.$$.fragment, local);
    			transition_out(list1.$$.fragment, local);
    			transition_out(list2.$$.fragment, local);
    			transition_out(codeblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			destroy_component(list0, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t16);
    			destroy_component(list1, detaching);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t21);
    			destroy_component(list2, detaching);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t24);
    			destroy_component(codeblock, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_41.name,
    		type: "slot",
    		source: "(765:8) <Area>",
    		ctx
    	});

    	return block;
    }

    // (835:8) <Area title="Componentización">
    function create_default_slot_40(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Sistemas vivientes de diseño, Svelte, atomización, fractalidad, micro/macro, hermetismo, fragmentación y\n            defragmentación, la división de la Unidad.";
    			attr_dev(p, "class", "svelte-15o0rvz");
    			add_location(p, file$L, 835, 8, 23273);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_40.name,
    		type: "slot",
    		source: "(835:8) <Area title=\\\"Componentización\\\">",
    		ctx
    	});

    	return block;
    }

    // (840:8) <Area title="Icons and graphics">
    function create_default_slot_39(ctx) {
    	let div0;
    	let iconespiral0;
    	let t0;
    	let t1;
    	let div1;
    	let iconespiral1;
    	let t2;
    	let t3;
    	let div2;
    	let iconespiral2;
    	let t4;
    	let current;
    	iconespiral0 = new IconEspiral({ $$inline: true });
    	iconespiral1 = new IconEspiral({ props: { size: "300px" }, $$inline: true });
    	iconespiral2 = new IconEspiral({ props: { size: "24px" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(iconespiral0.$$.fragment);
    			t0 = text("\n            Full size");
    			t1 = space();
    			div1 = element("div");
    			create_component(iconespiral1.$$.fragment);
    			t2 = text("\n            Fixed custom size");
    			t3 = space();
    			div2 = element("div");
    			create_component(iconespiral2.$$.fragment);
    			t4 = text("\n            Icon size");
    			attr_dev(div0, "class", "svelte-15o0rvz");
    			add_location(div0, file$L, 840, 8, 23507);
    			attr_dev(div1, "class", "svelte-15o0rvz");
    			add_location(div1, file$L, 844, 8, 23586);
    			attr_dev(div2, "class", "svelte-15o0rvz");
    			add_location(div2, file$L, 848, 8, 23686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(iconespiral0, div0, null);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(iconespiral1, div1, null);
    			append_dev(div1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(iconespiral2, div2, null);
    			append_dev(div2, t4);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconespiral0.$$.fragment, local);
    			transition_in(iconespiral1.$$.fragment, local);
    			transition_in(iconespiral2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconespiral0.$$.fragment, local);
    			transition_out(iconespiral1.$$.fragment, local);
    			transition_out(iconespiral2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(iconespiral0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(iconespiral1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			destroy_component(iconespiral2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_39.name,
    		type: "slot",
    		source: "(840:8) <Area title=\\\"Icons and graphics\\\">",
    		ctx
    	});

    	return block;
    }

    // (856:8) <Figure caption="The caption">
    function create_default_slot_38(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Alt text");
    			attr_dev(img, "class", "svelte-15o0rvz");
    			add_location(img, file$L, 856, 12, 23867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_38.name,
    		type: "slot",
    		source: "(856:8) <Figure caption=\\\"The caption\\\">",
    		ctx
    	});

    	return block;
    }

    // (855:8) <Area title="Figure">
    function create_default_slot_37(ctx) {
    	let figure;
    	let current;

    	figure = new Figure({
    			props: {
    				caption: "The caption",
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(figure.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(figure, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const figure_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				figure_changes.$$scope = { dirty, ctx };
    			}

    			figure.$set(figure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(figure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(figure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(figure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(855:8) <Area title=\\\"Figure\\\">",
    		ctx
    	});

    	return block;
    }

    // (861:8) <Area title="Toggle Menu">
    function create_default_slot_36(ctx) {
    	let togglemenu;
    	let current;
    	togglemenu = new ToggleMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(togglemenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(togglemenu, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(togglemenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(togglemenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(togglemenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(861:8) <Area title=\\\"Toggle Menu\\\">",
    		ctx
    	});

    	return block;
    }

    // (865:8) <Area title="Buttons">
    function create_default_slot_35(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: { variante: 0, text: "Button" },
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				variante: 1,
    				text: "Variante 1 de Button"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(865:8) <Area title=\\\"Buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (870:8) <Area title="Brand">
    function create_default_slot_34(ctx) {
    	let sitebrand;
    	let current;
    	sitebrand = new SiteBrand({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sitebrand.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sitebrand, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sitebrand.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sitebrand.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sitebrand, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(870:8) <Area title=\\\"Brand\\\">",
    		ctx
    	});

    	return block;
    }

    // (874:8) <Area title="Colors">
    function create_default_slot_33(ctx) {
    	let div20;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let div12;
    	let t12;
    	let div13;
    	let t13;
    	let div14;
    	let t14;
    	let div15;
    	let t15;
    	let div16;
    	let t16;
    	let div17;
    	let t17;
    	let div18;
    	let t18;
    	let div19;

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			t13 = space();
    			div14 = element("div");
    			t14 = space();
    			div15 = element("div");
    			t15 = space();
    			div16 = element("div");
    			t16 = space();
    			div17 = element("div");
    			t17 = space();
    			div18 = element("div");
    			t18 = space();
    			div19 = element("div");
    			attr_dev(div0, "class", "svelte-15o0rvz");
    			add_location(div0, file$L, 875, 12, 24310);
    			attr_dev(div1, "class", "svelte-15o0rvz");
    			add_location(div1, file$L, 876, 12, 24334);
    			attr_dev(div2, "class", "svelte-15o0rvz");
    			add_location(div2, file$L, 877, 12, 24358);
    			attr_dev(div3, "class", "svelte-15o0rvz");
    			add_location(div3, file$L, 878, 12, 24382);
    			attr_dev(div4, "class", "svelte-15o0rvz");
    			add_location(div4, file$L, 879, 12, 24406);
    			attr_dev(div5, "class", "svelte-15o0rvz");
    			add_location(div5, file$L, 880, 12, 24430);
    			attr_dev(div6, "class", "svelte-15o0rvz");
    			add_location(div6, file$L, 881, 12, 24454);
    			attr_dev(div7, "class", "svelte-15o0rvz");
    			add_location(div7, file$L, 882, 12, 24478);
    			attr_dev(div8, "class", "svelte-15o0rvz");
    			add_location(div8, file$L, 883, 12, 24502);
    			attr_dev(div9, "class", "svelte-15o0rvz");
    			add_location(div9, file$L, 884, 12, 24526);
    			attr_dev(div10, "class", "svelte-15o0rvz");
    			add_location(div10, file$L, 885, 12, 24550);
    			attr_dev(div11, "class", "svelte-15o0rvz");
    			add_location(div11, file$L, 886, 12, 24574);
    			attr_dev(div12, "class", "svelte-15o0rvz");
    			add_location(div12, file$L, 887, 12, 24598);
    			attr_dev(div13, "class", "svelte-15o0rvz");
    			add_location(div13, file$L, 888, 12, 24622);
    			attr_dev(div14, "class", "svelte-15o0rvz");
    			add_location(div14, file$L, 889, 12, 24646);
    			attr_dev(div15, "class", "svelte-15o0rvz");
    			add_location(div15, file$L, 890, 12, 24670);
    			attr_dev(div16, "class", "svelte-15o0rvz");
    			add_location(div16, file$L, 891, 12, 24694);
    			attr_dev(div17, "class", "svelte-15o0rvz");
    			add_location(div17, file$L, 892, 12, 24718);
    			attr_dev(div18, "class", "svelte-15o0rvz");
    			add_location(div18, file$L, 893, 12, 24742);
    			attr_dev(div19, "class", "svelte-15o0rvz");
    			add_location(div19, file$L, 894, 12, 24766);
    			attr_dev(div20, "class", "Colors svelte-15o0rvz");
    			add_location(div20, file$L, 874, 8, 24277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div0);
    			append_dev(div20, t0);
    			append_dev(div20, div1);
    			append_dev(div20, t1);
    			append_dev(div20, div2);
    			append_dev(div20, t2);
    			append_dev(div20, div3);
    			append_dev(div20, t3);
    			append_dev(div20, div4);
    			append_dev(div20, t4);
    			append_dev(div20, div5);
    			append_dev(div20, t5);
    			append_dev(div20, div6);
    			append_dev(div20, t6);
    			append_dev(div20, div7);
    			append_dev(div20, t7);
    			append_dev(div20, div8);
    			append_dev(div20, t8);
    			append_dev(div20, div9);
    			append_dev(div20, t9);
    			append_dev(div20, div10);
    			append_dev(div20, t10);
    			append_dev(div20, div11);
    			append_dev(div20, t11);
    			append_dev(div20, div12);
    			append_dev(div20, t12);
    			append_dev(div20, div13);
    			append_dev(div20, t13);
    			append_dev(div20, div14);
    			append_dev(div20, t14);
    			append_dev(div20, div15);
    			append_dev(div20, t15);
    			append_dev(div20, div16);
    			append_dev(div20, t16);
    			append_dev(div20, div17);
    			append_dev(div20, t17);
    			append_dev(div20, div18);
    			append_dev(div20, t18);
    			append_dev(div20, div19);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(874:8) <Area title=\\\"Colors\\\">",
    		ctx
    	});

    	return block;
    }

    // (899:8) <Area title="Grid Layout">
    function create_default_slot_32(ctx) {
    	let div11;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div8;
    	let div7;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let article0;
    	let t5;
    	let article1;
    	let t6;
    	let article2;
    	let t7;
    	let div6;
    	let t8;
    	let div9;
    	let t9;
    	let div10;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			article0 = element("article");
    			t5 = space();
    			article1 = element("article");
    			t6 = space();
    			article2 = element("article");
    			t7 = space();
    			div6 = element("div");
    			t8 = space();
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			attr_dev(div0, "class", "StyleGuide Main__brand svelte-15o0rvz");
    			add_location(div0, file$L, 900, 12, 24895);
    			attr_dev(div1, "class", "StyleGuide  Main__nav svelte-15o0rvz");
    			add_location(div1, file$L, 901, 12, 24950);
    			attr_dev(div2, "class", "StyleGuide  Main__header svelte-15o0rvz");
    			add_location(div2, file$L, 902, 12, 25004);
    			attr_dev(div3, "class", "StyleGuide  Content__header svelte-15o0rvz");
    			add_location(div3, file$L, 905, 20, 25171);
    			attr_dev(div4, "class", "StyleGuide  Content__nav svelte-15o0rvz");
    			add_location(div4, file$L, 906, 20, 25239);
    			attr_dev(article0, "class", "StyleGuide  Area svelte-15o0rvz");
    			add_location(article0, file$L, 908, 24, 25368);
    			attr_dev(article1, "class", "StyleGuide  Area svelte-15o0rvz");
    			add_location(article1, file$L, 909, 24, 25437);
    			attr_dev(article2, "class", "StyleGuide  Area svelte-15o0rvz");
    			add_location(article2, file$L, 910, 24, 25506);
    			attr_dev(div5, "class", "StyleGuide  Content__area svelte-15o0rvz");
    			add_location(div5, file$L, 907, 20, 25304);
    			attr_dev(div6, "class", "StyleGuide  Content__footer svelte-15o0rvz");
    			add_location(div6, file$L, 912, 20, 25598);
    			attr_dev(div7, "class", "StyleGuide  Content svelte-15o0rvz");
    			add_location(div7, file$L, 904, 16, 25117);
    			attr_dev(div8, "class", "StyleGuide  Main__content svelte-15o0rvz");
    			add_location(div8, file$L, 903, 12, 25061);
    			attr_dev(div9, "class", "StyleGuide  Main__footer svelte-15o0rvz");
    			add_location(div9, file$L, 915, 12, 25700);
    			attr_dev(div10, "class", "StyleGuide  Main__totop svelte-15o0rvz");
    			add_location(div10, file$L, 916, 12, 25757);
    			attr_dev(div11, "class", "StyleGuide Main svelte-15o0rvz");
    			add_location(div11, file$L, 899, 8, 24853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div0);
    			append_dev(div11, t0);
    			append_dev(div11, div1);
    			append_dev(div11, t1);
    			append_dev(div11, div2);
    			append_dev(div11, t2);
    			append_dev(div11, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div7, t3);
    			append_dev(div7, div4);
    			append_dev(div7, t4);
    			append_dev(div7, div5);
    			append_dev(div5, article0);
    			append_dev(div5, t5);
    			append_dev(div5, article1);
    			append_dev(div5, t6);
    			append_dev(div5, article2);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div11, t8);
    			append_dev(div11, div9);
    			append_dev(div11, t9);
    			append_dev(div11, div10);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(899:8) <Area title=\\\"Grid Layout\\\">",
    		ctx
    	});

    	return block;
    }

    // (921:8) <Area title="Full Simple Card">
    function create_default_slot_31(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: "Title",
    				description: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    				variante: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(921:8) <Area title=\\\"Full Simple Card\\\">",
    		ctx
    	});

    	return block;
    }

    // (927:12) <Card title="Title"                 description="El ojo que ves no es ojo porque tú lo veas; es ojo porque te ve. (Antonio Machado)"                 variante={1}>
    function create_default_slot_30(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: { variante: 1, text: "Button" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(927:12) <Card title=\\\"Title\\\"                 description=\\\"El ojo que ves no es ojo porque tú lo veas; es ojo porque te ve. (Antonio Machado)\\\"                 variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (940:16) <span slot="hasSvg">
    function create_hasSvg_slot(ctx) {
    	let span;
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			attr_dev(circle0, "cx", "15135.5");
    			attr_dev(circle0, "cy", "3089.34");
    			attr_dev(circle0, "r", "1097.64");
    			attr_dev(circle0, "fill", "none");
    			attr_dev(circle0, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle0, "transform", "matrix(.03822 0 0 .03822 -452.1 -33.668)");
    			attr_dev(circle0, "class", "svelte-15o0rvz");
    			add_location(circle0, file$L, 942, 24, 27020);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.668)");
    			attr_dev(circle1, "class", "svelte-15o0rvz");
    			add_location(circle1, file$L, 944, 24, 27221);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.03822 0 0 .03822 -493.61 -33.668)");
    			attr_dev(circle2, "class", "svelte-15o0rvz");
    			add_location(circle2, file$L, 946, 24, 27420);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "fill", "none");
    			attr_dev(circle3, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle3, "stroke-width", "13.08");
    			attr_dev(circle3, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle3, "class", "svelte-15o0rvz");
    			add_location(circle3, file$L, 948, 24, 27622);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-15o0rvz");
    			add_location(svg, file$L, 940, 20, 26823);
    			attr_dev(span, "slot", "hasSvg");
    			attr_dev(span, "class", "svelte-15o0rvz");
    			add_location(span, file$L, 939, 16, 26782);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    			append_dev(svg, circle3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_hasSvg_slot.name,
    		type: "slot",
    		source: "(940:16) <span slot=\\\"hasSvg\\\">",
    		ctx
    	});

    	return block;
    }

    // (926:8) <Cards>
    function create_default_slot_28(ctx) {
    	let card0;
    	let t0;
    	let card1;
    	let t1;
    	let card2;
    	let t2;
    	let card3;
    	let t3;
    	let card4;
    	let current;

    	card0 = new Card({
    			props: {
    				title: "Title",
    				description: "El ojo que ves no es ojo porque tú lo veas; es ojo porque te ve. (Antonio Machado)",
    				variante: 1,
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				title: "Variante 3",
    				description: "La auténtica felicidad consiste en la contemplación de la belleza y el orden del cosmos. _Aristóteles",
    				image: "img/img1.jpg"
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				title: "With inlne svg instead image",
    				description: "Todo símbolo tiene un poder resonante, éste depende de su forma, contenido e intención. (Adrià García)",
    				variante: 4,
    				hasImage: false,
    				hasInlineSvg: true,
    				$$slots: { hasSvg: [create_hasSvg_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				title: "Éste card no lleva imagen",
    				hasImage: false,
    				description: "Para componer el mundo ha sido precisa la totalidad de cada uno de los cuatro elementos. Porque con todo el fuego, con toda el agua, con todo el aire, con toda la tierra, le ha formado el Supremo Ordenador. __Platón, Timeo",
    				variante: 3
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				title: "Éste tampoco...",
    				hasImage: false,
    				description: "Ama tu ritmo y ritma tus acciones bajo su ley, así como tus versos; eres un universo de universos y tu alma una fuente de canciones. Rubén Darío",
    				variante: 0
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card0.$$.fragment);
    			t0 = space();
    			create_component(card1.$$.fragment);
    			t1 = space();
    			create_component(card2.$$.fragment);
    			t2 = space();
    			create_component(card3.$$.fragment);
    			t3 = space();
    			create_component(card4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(card1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(card2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(card3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(card4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			transition_in(card4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			transition_out(card4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(card1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(card2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(card3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(card4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(926:8) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (925:8) <Area title="Group Cards">
    function create_default_slot_27(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cards.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cards, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cards_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				cards_changes.$$scope = { dirty, ctx };
    			}

    			cards.$set(cards_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(925:8) <Area title=\\\"Group Cards\\\">",
    		ctx
    	});

    	return block;
    }

    // (965:8) <Area title="Images">
    function create_default_slot_26(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-15o0rvz");
    			add_location(img, file$L, 965, 8, 28587);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(965:8) <Area title=\\\"Images\\\">",
    		ctx
    	});

    	return block;
    }

    // (719:4) <ContentArea>
    function create_default_slot_25(ctx) {
    	let area0;
    	let t0;
    	let todh;
    	let t1;
    	let area1;
    	let t2;
    	let area2;
    	let t3;
    	let area3;
    	let t4;
    	let area4;
    	let t5;
    	let area5;
    	let t6;
    	let area6;
    	let t7;
    	let area7;
    	let t8;
    	let area8;
    	let t9;
    	let area9;
    	let t10;
    	let area10;
    	let t11;
    	let area11;
    	let t12;
    	let area12;
    	let current;

    	area0 = new Area({
    			props: {
    				title: "TODH en el prototipado Frontend",
    				$$slots: { default: [create_default_slot_45] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	todh = new TODH({
    			props: {
    				uno: "JS",
    				dos: "CSS",
    				tres: "Html",
    				cuatro: "JSON"
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_41] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area2 = new Area({
    			props: {
    				title: "Componentización",
    				$$slots: { default: [create_default_slot_40] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area3 = new Area({
    			props: {
    				title: "Icons and graphics",
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area4 = new Area({
    			props: {
    				title: "Figure",
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area5 = new Area({
    			props: {
    				title: "Toggle Menu",
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area6 = new Area({
    			props: {
    				title: "Buttons",
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area7 = new Area({
    			props: {
    				title: "Brand",
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area8 = new Area({
    			props: {
    				title: "Colors",
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area9 = new Area({
    			props: {
    				title: "Grid Layout",
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area10 = new Area({
    			props: {
    				title: "Full Simple Card",
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area11 = new Area({
    			props: {
    				title: "Group Cards",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area12 = new Area({
    			props: {
    				title: "Images",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t0 = space();
    			create_component(todh.$$.fragment);
    			t1 = space();
    			create_component(area1.$$.fragment);
    			t2 = space();
    			create_component(area2.$$.fragment);
    			t3 = space();
    			create_component(area3.$$.fragment);
    			t4 = space();
    			create_component(area4.$$.fragment);
    			t5 = space();
    			create_component(area5.$$.fragment);
    			t6 = space();
    			create_component(area6.$$.fragment);
    			t7 = space();
    			create_component(area7.$$.fragment);
    			t8 = space();
    			create_component(area8.$$.fragment);
    			t9 = space();
    			create_component(area9.$$.fragment);
    			t10 = space();
    			create_component(area10.$$.fragment);
    			t11 = space();
    			create_component(area11.$$.fragment);
    			t12 = space();
    			create_component(area12.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(todh, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(area2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(area3, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(area4, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(area5, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(area6, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(area7, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(area8, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(area9, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(area10, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(area11, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(area12, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty & /*$$scope, $codeBlocks*/ 65) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty & /*$$scope, $codeBlocks*/ 65) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    			const area2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area2_changes.$$scope = { dirty, ctx };
    			}

    			area2.$set(area2_changes);
    			const area3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area3_changes.$$scope = { dirty, ctx };
    			}

    			area3.$set(area3_changes);
    			const area4_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area4_changes.$$scope = { dirty, ctx };
    			}

    			area4.$set(area4_changes);
    			const area5_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area5_changes.$$scope = { dirty, ctx };
    			}

    			area5.$set(area5_changes);
    			const area6_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area6_changes.$$scope = { dirty, ctx };
    			}

    			area6.$set(area6_changes);
    			const area7_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area7_changes.$$scope = { dirty, ctx };
    			}

    			area7.$set(area7_changes);
    			const area8_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area8_changes.$$scope = { dirty, ctx };
    			}

    			area8.$set(area8_changes);
    			const area9_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area9_changes.$$scope = { dirty, ctx };
    			}

    			area9.$set(area9_changes);
    			const area10_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area10_changes.$$scope = { dirty, ctx };
    			}

    			area10.$set(area10_changes);
    			const area11_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area11_changes.$$scope = { dirty, ctx };
    			}

    			area11.$set(area11_changes);
    			const area12_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area12_changes.$$scope = { dirty, ctx };
    			}

    			area12.$set(area12_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(todh.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			transition_in(area2.$$.fragment, local);
    			transition_in(area3.$$.fragment, local);
    			transition_in(area4.$$.fragment, local);
    			transition_in(area5.$$.fragment, local);
    			transition_in(area6.$$.fragment, local);
    			transition_in(area7.$$.fragment, local);
    			transition_in(area8.$$.fragment, local);
    			transition_in(area9.$$.fragment, local);
    			transition_in(area10.$$.fragment, local);
    			transition_in(area11.$$.fragment, local);
    			transition_in(area12.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(todh.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			transition_out(area2.$$.fragment, local);
    			transition_out(area3.$$.fragment, local);
    			transition_out(area4.$$.fragment, local);
    			transition_out(area5.$$.fragment, local);
    			transition_out(area6.$$.fragment, local);
    			transition_out(area7.$$.fragment, local);
    			transition_out(area8.$$.fragment, local);
    			transition_out(area9.$$.fragment, local);
    			transition_out(area10.$$.fragment, local);
    			transition_out(area11.$$.fragment, local);
    			transition_out(area12.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(todh, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(area2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(area3, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(area4, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(area5, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(area6, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(area7, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(area8, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(area9, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(area10, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(area11, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(area12, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(719:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (969:8) <Banner variante={0}>
    function create_default_slot_24(ctx) {
    	let blockquote0;
    	let t;
    	let blockquote1;
    	let current;

    	blockquote0 = new BlockQuote({
    			props: {
    				variante: 1,
    				quote: "Es bueno repetir incluso dos veces lo que es necesario.",
    				author: "Empedocles"
    			},
    			$$inline: true
    		});

    	blockquote1 = new BlockQuote({
    			props: {
    				variante: 0,
    				quote: "Son cuatro los principios materiales de la realidad y se hallan en constante movimiento... todo es mezcla y modificación de lo mezclado.",
    				author: "Empedocles"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(blockquote0.$$.fragment);
    			t = space();
    			create_component(blockquote1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blockquote0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(blockquote1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote0.$$.fragment, local);
    			transition_in(blockquote1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote0.$$.fragment, local);
    			transition_out(blockquote1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blockquote0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(969:8) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (977:8) <Banner variante={1}>
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Banner with simple text inside");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(977:8) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (981:8) <Banner variante={2}>
    function create_default_slot_22(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Banner with simple text inside");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(981:8) <Banner variante={2}>",
    		ctx
    	});

    	return block;
    }

    // (988:16) <Tab>
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab 1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(988:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (989:16) <Tab>
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab 2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(989:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (990:16) <Tab>
    function create_default_slot_19(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab 3");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(990:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (991:16) <Tab>
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab 4");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(991:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (987:12) <TabList>
    function create_default_slot_17(ctx) {
    	let tab0;
    	let t0;
    	let tab1;
    	let t1;
    	let tab2;
    	let t2;
    	let tab3;
    	let current;

    	tab0 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab2 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab3 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t0 = space();
    			create_component(tab1.$$.fragment);
    			t1 = space();
    			create_component(tab2.$$.fragment);
    			t2 = space();
    			create_component(tab3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tab1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tab2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tab3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    			const tab2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tab2_changes.$$scope = { dirty, ctx };
    			}

    			tab2.$set(tab2_changes);
    			const tab3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tab3_changes.$$scope = { dirty, ctx };
    			}

    			tab3.$set(tab3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(tab2.$$.fragment, local);
    			transition_in(tab3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(tab2.$$.fragment, local);
    			transition_out(tab3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tab1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tab2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tab3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(987:12) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (994:12) <TabPanel>
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab panel 1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(994:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (998:12) <TabPanel>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab panel 2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(998:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (1002:12) <TabPanel>
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab panel 3");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(1002:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (1006:12) <TabPanel>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tab panel 4");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(1006:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (986:8) <Tabs>
    function create_default_slot_12(ctx) {
    	let tablist;
    	let t0;
    	let tabpanel0;
    	let t1;
    	let tabpanel1;
    	let t2;
    	let tabpanel2;
    	let t3;
    	let tabpanel3;
    	let current;

    	tablist = new TabList({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel0 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel1 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel2 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel3 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablist.$$.fragment);
    			t0 = space();
    			create_component(tabpanel0.$$.fragment);
    			t1 = space();
    			create_component(tabpanel1.$$.fragment);
    			t2 = space();
    			create_component(tabpanel2.$$.fragment);
    			t3 = space();
    			create_component(tabpanel3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablist, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tabpanel0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tabpanel1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tabpanel2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(tabpanel3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablist_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tablist_changes.$$scope = { dirty, ctx };
    			}

    			tablist.$set(tablist_changes);
    			const tabpanel0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tabpanel0_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel0.$set(tabpanel0_changes);
    			const tabpanel1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tabpanel1_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel1.$set(tabpanel1_changes);
    			const tabpanel2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tabpanel2_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel2.$set(tabpanel2_changes);
    			const tabpanel3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tabpanel3_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel3.$set(tabpanel3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablist.$$.fragment, local);
    			transition_in(tabpanel0.$$.fragment, local);
    			transition_in(tabpanel1.$$.fragment, local);
    			transition_in(tabpanel2.$$.fragment, local);
    			transition_in(tabpanel3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablist.$$.fragment, local);
    			transition_out(tabpanel0.$$.fragment, local);
    			transition_out(tabpanel1.$$.fragment, local);
    			transition_out(tabpanel2.$$.fragment, local);
    			transition_out(tabpanel3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablist, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tabpanel0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tabpanel1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tabpanel2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(tabpanel3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(986:8) <Tabs>",
    		ctx
    	});

    	return block;
    }

    // (985:8) <Area title="Tabs">
    function create_default_slot_11(ctx) {
    	let tabs;
    	let current;

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tabs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabs, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(985:8) <Area title=\\\"Tabs\\\">",
    		ctx
    	});

    	return block;
    }

    // (1012:8) <Area title="Component Header">
    function create_default_slot_10(ctx) {
    	let pagetitle;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "Page title",
    				pageSubTitle: "Page Subtitle"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagetitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagetitle, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagetitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(1012:8) <Area title=\\\"Component Header\\\">",
    		ctx
    	});

    	return block;
    }

    // (1036:16) <SwipeItem>
    function create_default_slot_9$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-15o0rvz");
    			add_location(img, file$L, 1036, 20, 30686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(1036:16) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (1039:16) <SwipeItem>
    function create_default_slot_8$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img4.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-15o0rvz");
    			add_location(img, file$L, 1039, 20, 30795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(1039:16) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (1042:16) <SwipeItem>
    function create_default_slot_7$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img2.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-15o0rvz");
    			add_location(img, file$L, 1042, 20, 30904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(1042:16) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (1045:16) <SwipeItem>
    function create_default_slot_6$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img3.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-15o0rvz");
    			add_location(img, file$L, 1045, 20, 31013);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(1045:16) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (1035:12) <Swipe {showIndicators} {autoplay} {delay} {transitionDuration} {defaultIndex}>
    function create_default_slot_5$2(ctx) {
    	let swipeitem0;
    	let t0;
    	let swipeitem1;
    	let t1;
    	let swipeitem2;
    	let t2;
    	let swipeitem3;
    	let current;

    	swipeitem0 = new SwipeItem({
    			props: {
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swipeitem1 = new SwipeItem({
    			props: {
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swipeitem2 = new SwipeItem({
    			props: {
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swipeitem3 = new SwipeItem({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swipeitem0.$$.fragment);
    			t0 = space();
    			create_component(swipeitem1.$$.fragment);
    			t1 = space();
    			create_component(swipeitem2.$$.fragment);
    			t2 = space();
    			create_component(swipeitem3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swipeitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(swipeitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(swipeitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(swipeitem3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swipeitem0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				swipeitem0_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem0.$set(swipeitem0_changes);
    			const swipeitem1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				swipeitem1_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem1.$set(swipeitem1_changes);
    			const swipeitem2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				swipeitem2_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem2.$set(swipeitem2_changes);
    			const swipeitem3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				swipeitem3_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem3.$set(swipeitem3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swipeitem0.$$.fragment, local);
    			transition_in(swipeitem1.$$.fragment, local);
    			transition_in(swipeitem2.$$.fragment, local);
    			transition_in(swipeitem3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swipeitem0.$$.fragment, local);
    			transition_out(swipeitem1.$$.fragment, local);
    			transition_out(swipeitem2.$$.fragment, local);
    			transition_out(swipeitem3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swipeitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(swipeitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(swipeitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(swipeitem3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(1035:12) <Swipe {showIndicators} {autoplay} {delay} {transitionDuration} {defaultIndex}>",
    		ctx
    	});

    	return block;
    }

    // (984:4) <ContentArea>
    function create_default_slot_4$2(ctx) {
    	let area0;
    	let t0;
    	let area1;
    	let t1;
    	let div;
    	let swipe;
    	let current;

    	area0 = new Area({
    			props: {
    				title: "Tabs",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				title: "Component Header",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swipe = new Swipe({
    			props: {
    				showIndicators: /*showIndicators*/ ctx[3],
    				autoplay: /*autoplay*/ ctx[1],
    				delay: /*delay*/ ctx[2],
    				transitionDuration: /*transitionDuration*/ ctx[4],
    				defaultIndex: /*defaultIndex*/ ctx[5],
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area0.$$.fragment);
    			t0 = space();
    			create_component(area1.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(swipe.$$.fragment);
    			attr_dev(div, "class", "swipe-holder svelte-15o0rvz");
    			add_location(div, file$L, 1033, 8, 30519);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(area1, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(swipe, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    			const swipe_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				swipe_changes.$$scope = { dirty, ctx };
    			}

    			swipe.$set(swipe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			transition_in(swipe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			transition_out(swipe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(area1, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(swipe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(984:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (1051:8) <Banner variante={0}>
    function create_default_slot_3$2(ctx) {
    	let iconespiral;
    	let t;
    	let blockquote;
    	let current;
    	iconespiral = new IconEspiral({ $$inline: true });

    	blockquote = new BlockQuote({
    			props: {
    				variante: 1,
    				quote: "En el universo hay cosas que son conocidas y hay cosas que son desconocidas y entre ellas hay puertas...",
    				author: "William Blake"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconespiral.$$.fragment);
    			t = space();
    			create_component(blockquote.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconespiral, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(blockquote, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconespiral.$$.fragment, local);
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconespiral.$$.fragment, local);
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconespiral, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(1051:8) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (1057:8) <Banner variante={1}>
    function create_default_slot_2$4(ctx) {
    	let blockquote;
    	let t;
    	let iconespiral;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "The universe exists solely of waves of motion... There exists nothing other than vibration",
    				author: "Walter Russell"
    			},
    			$$inline: true
    		});

    	iconespiral = new IconEspiral({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blockquote.$$.fragment);
    			t = space();
    			create_component(iconespiral.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blockquote, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(iconespiral, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockquote.$$.fragment, local);
    			transition_in(iconespiral.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockquote.$$.fragment, local);
    			transition_out(iconespiral.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blockquote, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(iconespiral, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(1057:8) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (1063:8) <Banner variante={2}>
    function create_default_slot_1$5(ctx) {
    	let iconespiral;
    	let t;
    	let blockquote;
    	let current;
    	iconespiral = new IconEspiral({ $$inline: true });

    	blockquote = new BlockQuote({
    			props: {
    				variante: 0,
    				quote: "Para conocer los secretos del Universo piensa en términos de energía, frecuencia y vibración.",
    				author: "Nikola Tesla"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconespiral.$$.fragment);
    			t = space();
    			create_component(blockquote.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconespiral, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(blockquote, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconespiral.$$.fragment, local);
    			transition_in(blockquote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconespiral.$$.fragment, local);
    			transition_out(blockquote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconespiral, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(1063:8) <Banner variante={2}>",
    		ctx
    	});

    	return block;
    }

    // (718:0) <Content>
    function create_default_slot$8(ctx) {
    	let contentarea0;
    	let t0;
    	let banner0;
    	let t1;
    	let banner1;
    	let t2;
    	let banner2;
    	let t3;
    	let contentarea1;
    	let t4;
    	let banner3;
    	let t5;
    	let banner4;
    	let t6;
    	let banner5;
    	let current;

    	contentarea0 = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner0 = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner1 = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner2 = new Banner({
    			props: {
    				variante: 2,
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	contentarea1 = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner3 = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner4 = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner5 = new Banner({
    			props: {
    				variante: 2,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea0.$$.fragment);
    			t0 = space();
    			create_component(banner0.$$.fragment);
    			t1 = space();
    			create_component(banner1.$$.fragment);
    			t2 = space();
    			create_component(banner2.$$.fragment);
    			t3 = space();
    			create_component(contentarea1.$$.fragment);
    			t4 = space();
    			create_component(banner3.$$.fragment);
    			t5 = space();
    			create_component(banner4.$$.fragment);
    			t6 = space();
    			create_component(banner5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(banner0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(banner1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(banner2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(contentarea1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(banner3, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(banner4, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(banner5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea0_changes = {};

    			if (dirty & /*$$scope, $codeBlocks*/ 65) {
    				contentarea0_changes.$$scope = { dirty, ctx };
    			}

    			contentarea0.$set(contentarea0_changes);
    			const banner0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				banner0_changes.$$scope = { dirty, ctx };
    			}

    			banner0.$set(banner0_changes);
    			const banner1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				banner1_changes.$$scope = { dirty, ctx };
    			}

    			banner1.$set(banner1_changes);
    			const banner2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				banner2_changes.$$scope = { dirty, ctx };
    			}

    			banner2.$set(banner2_changes);
    			const contentarea1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				contentarea1_changes.$$scope = { dirty, ctx };
    			}

    			contentarea1.$set(contentarea1_changes);
    			const banner3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				banner3_changes.$$scope = { dirty, ctx };
    			}

    			banner3.$set(banner3_changes);
    			const banner4_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				banner4_changes.$$scope = { dirty, ctx };
    			}

    			banner4.$set(banner4_changes);
    			const banner5_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				banner5_changes.$$scope = { dirty, ctx };
    			}

    			banner5.$set(banner5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentarea0.$$.fragment, local);
    			transition_in(banner0.$$.fragment, local);
    			transition_in(banner1.$$.fragment, local);
    			transition_in(banner2.$$.fragment, local);
    			transition_in(contentarea1.$$.fragment, local);
    			transition_in(banner3.$$.fragment, local);
    			transition_in(banner4.$$.fragment, local);
    			transition_in(banner5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentarea0.$$.fragment, local);
    			transition_out(banner0.$$.fragment, local);
    			transition_out(banner1.$$.fragment, local);
    			transition_out(banner2.$$.fragment, local);
    			transition_out(contentarea1.$$.fragment, local);
    			transition_out(banner3.$$.fragment, local);
    			transition_out(banner4.$$.fragment, local);
    			transition_out(banner5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentarea0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(banner0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(banner1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(banner2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(contentarea1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(banner3, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(banner4, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(banner5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(718:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let pagetitle;
    	let t0;
    	let t1;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "Hello cosmos!",
    				pageSubTitle: "Living metadesign system 🧘🏻‍♂️"
    			},
    			$$inline: true
    		});

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagetitle.$$.fragment);
    			t0 = space();
    			t1 = space();
    			create_component(content.$$.fragment);
    			document.title = "TODH";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagetitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope, $codeBlocks*/ 65) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagetitle.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagetitle.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagetitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let $codeBlocks;
    	validate_store(codeBlocks, "codeBlocks");
    	component_subscribe($$self, codeBlocks, $$value => $$invalidate(0, $codeBlocks = $$value));
    	let autoplay = false;
    	let delay = 2000; //ms
    	let showIndicators = false;
    	let transitionDuration = 1000; // ms
    	let defaultIndex = 3; // start from 0
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Styleguide> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Styleguide", $$slots, []);

    	$$self.$capture_state = () => ({
    		Swipe,
    		SwipeItem,
    		PageTitle,
    		Content,
    		ContentArea,
    		Area,
    		Banner,
    		Nav,
    		Loading,
    		CodeBlock,
    		TODH,
    		ToggleMenu,
    		BlockQuote,
    		Button,
    		Cards,
    		Card,
    		SiteBrand,
    		List,
    		Tag,
    		Figure,
    		IconEspiral,
    		IconCuatro,
    		Tabs,
    		TabList,
    		TabPanel,
    		Tab,
    		autoplay,
    		delay,
    		showIndicators,
    		transitionDuration,
    		defaultIndex,
    		codeBlocks,
    		$codeBlocks
    	});

    	$$self.$inject_state = $$props => {
    		if ("autoplay" in $$props) $$invalidate(1, autoplay = $$props.autoplay);
    		if ("delay" in $$props) $$invalidate(2, delay = $$props.delay);
    		if ("showIndicators" in $$props) $$invalidate(3, showIndicators = $$props.showIndicators);
    		if ("transitionDuration" in $$props) $$invalidate(4, transitionDuration = $$props.transitionDuration);
    		if ("defaultIndex" in $$props) $$invalidate(5, defaultIndex = $$props.defaultIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$codeBlocks, autoplay, delay, showIndicators, transitionDuration, defaultIndex];
    }

    class Styleguide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Styleguide",
    			options,
    			id: create_fragment$N.name
    		});
    	}
    }

    //tree
    const _tree = {
      "name": "root",
      "filepath": "/",
      "root": true,
      "ownMeta": {},
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "_fallback.svelte",
          "filepath": "/_fallback.svelte",
          "name": "_fallback",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/_fallback.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": true,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/_fallback",
          "id": "__fallback",
          "component": () => Fallback
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "_layout.svelte",
          "filepath": "/_layout.svelte",
          "name": "_layout",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/_layout.svelte",
          "isLayout": true,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/",
          "id": "__layout",
          "component": () => Layout
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "about.svelte",
          "filepath": "/about.svelte",
          "name": "about",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/about.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/about",
          "id": "_about",
          "component": () => About
        },
        {
          "isFile": false,
          "isDir": true,
          "file": "blog",
          "filepath": "/blog",
          "name": "blog",
          "ext": "",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/blog",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "file": "[slug].svelte",
              "filepath": "/blog/[slug].svelte",
              "name": "[slug]",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/blog/[slug].svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/blog/:slug",
              "id": "_blog__slug",
              "component": () => U5Bslugu5D
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "index.svelte",
              "filepath": "/blog/index.svelte",
              "name": "index",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/blog/index.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/blog/index",
              "id": "_blog_index",
              "component": () => Blog
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/blog"
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "index.svelte",
          "filepath": "/index.svelte",
          "name": "index",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/index.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": true,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/index",
          "id": "_index",
          "component": () => Pages
        },
        {
          "isFile": false,
          "isDir": true,
          "file": "products",
          "filepath": "/products",
          "name": "products",
          "ext": "",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/products",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "file": "[slug].svelte",
              "filepath": "/products/[slug].svelte",
              "name": "[slug]",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/products/[slug].svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/products/:slug",
              "id": "_products__slug",
              "component": () => U5Bslugu5D$1
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "index.svelte",
              "filepath": "/products/index.svelte",
              "name": "index",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/products/index.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/products/index",
              "id": "_products_index",
              "component": () => Products
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/products"
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "styleguide.svelte",
          "filepath": "/styleguide.svelte",
          "name": "styleguide",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/todh/Dropbox/TODH/todh-dev/todh/src/pages/styleguide.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/styleguide",
          "id": "_styleguide",
          "component": () => Styleguide
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "meta": {
        "preload": false,
        "precache-order": false,
        "precache-proximity": true,
        "recursive": true
      },
      "path": "/"
    };


    const {tree, routes: routes$1} = buildClientTree(_tree);

    /* src/App.svelte generated by Svelte v3.23.2 */

    function create_fragment$O(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes: routes$1 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Router, routes: routes$1 });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$O.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    	// props: {
    	// 	name: 'world'
    	// }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
