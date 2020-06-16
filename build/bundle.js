
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
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    	let title;
    	let t;
    	let g2;
    	let g1;
    	let circle0;
    	let circle1;
    	let g0;
    	let path0;
    	let path1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("Brand Logo");
    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			attr_dev(title, "class", "svelte-12ies21");
    			add_location(title, file$2, 660, 12, 14384);
    			attr_dev(circle0, "cx", "15135.5");
    			attr_dev(circle0, "cy", "3089.34");
    			attr_dev(circle0, "r", "1097.64");
    			attr_dev(circle0, "fill", "none");
    			attr_dev(circle0, "stroke", "#111111");
    			attr_dev(circle0, "stroke-width", "43.84");
    			attr_dev(circle0, "stroke-dasharray", "43.84,131.52,0,0");
    			attr_dev(circle0, "transform", "matrix(.10706 0 0 .12986 54821.7 1042.87)");
    			attr_dev(circle0, "class", "svelte-12ies21");
    			add_location(circle0, file$2, 663, 20, 14590);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "stroke", "#111111");
    			attr_dev(circle1, "stroke-width", "26.3");
    			attr_dev(circle1, "transform", "matrix(.10706 0 0 .12986 54939.2 1042.87)");
    			attr_dev(circle1, "class", "svelte-12ies21");
    			add_location(circle1, file$2, 666, 20, 14851);
    			attr_dev(path0, "d", "M19961 30959.1v2495.3");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "class", "svelte-12ies21");
    			add_location(path0, file$2, 669, 24, 15137);
    			attr_dev(path1, "d", "M19941.7 30959.1v64.7h38.6v-64.7h-38.6zm0 582.2v64.7h38.6v-64.7h-38.6zm0 582.3v64.7h38.6v-64.7h-38.6zm0 582.3v64.7h38.6v-64.7h-38.6zm0 582.3v64.7h38.6v-64.7h-38.6z");
    			attr_dev(path1, "class", "svelte-12ies21");
    			add_location(path1, file$2, 670, 24, 15213);
    			attr_dev(g0, "transform", "matrix(0 .19668 -.0967 0 59616.9 -2481.81)");
    			attr_dev(g0, "class", "svelte-12ies21");
    			add_location(g0, file$2, 668, 20, 15054);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "transform", "matrix(.0057 0 0 .00692 56473.4 1422.7)");
    			attr_dev(circle2, "class", "svelte-12ies21");
    			add_location(circle2, file$2, 674, 20, 15493);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "transform", "matrix(.0057 0 0 .00692 56355.8 1422.7)");
    			attr_dev(circle3, "class", "svelte-12ies21");
    			add_location(circle3, file$2, 676, 20, 15642);
    			attr_dev(circle4, "cx", "15135.5");
    			attr_dev(circle4, "cy", "3089.34");
    			attr_dev(circle4, "r", "1097.64");
    			attr_dev(circle4, "transform", "matrix(.0057 0 0 .00692 56415.1 1299.4)");
    			attr_dev(circle4, "class", "svelte-12ies21");
    			add_location(circle4, file$2, 678, 20, 15791);
    			attr_dev(circle5, "cx", "15135.5");
    			attr_dev(circle5, "cy", "3089.34");
    			attr_dev(circle5, "r", "1097.64");
    			attr_dev(circle5, "transform", "matrix(.0057 0 0 .00692 56414.8 1545.34)");
    			attr_dev(circle5, "class", "svelte-12ies21");
    			add_location(circle5, file$2, 680, 20, 15940);
    			attr_dev(g1, "transform", "matrix(.15985 0 0 .13168 -9003.181 -171.008)");
    			attr_dev(g1, "class", "svelte-12ies21");
    			add_location(g1, file$2, 662, 16, 14509);
    			attr_dev(g2, "fill-rule", "evenodd");
    			attr_dev(g2, "stroke-linejoin", "round");
    			attr_dev(g2, "stroke-linecap", "round");
    			attr_dev(g2, "class", "svelte-12ies21");
    			add_location(g2, file$2, 661, 12, 14422);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 57 39");
    			attr_dev(svg, "class", "svelte-12ies21");
    			add_location(svg, file$2, 659, 8, 14311);
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0](/*home*/ ctx[1]));
    			attr_dev(a, "class", "SiteBrand svelte-12ies21");
    			attr_dev(a, "alt", "Brand Logo");
    			add_location(a, file$2, 658, 4, 14244);
    			attr_dev(div, "class", "svelte-12ies21");
    			add_location(div, file$2, 657, 0, 14234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, g2);
    			append_dev(g2, g1);
    			append_dev(g1, circle0);
    			append_dev(g1, circle1);
    			append_dev(g1, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(g1, circle2);
    			append_dev(g1, circle3);
    			append_dev(g1, circle4);
    			append_dev(g1, circle5);
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
    	child_ctx[10] = list[i][0];
    	child_ctx[11] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i][0];
    	child_ctx[11] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i][0];
    	child_ctx[11] = list[i][1];
    	return child_ctx;
    }

    // (724:4) {#each _linksLeft as [path, name]}
    function create_each_block_2(ctx) {
    	let li;
    	let a;
    	let t0_value = /*name*/ ctx[11] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[2](/*path*/ ctx[10]));
    			attr_dev(a, "class", "svelte-a0ptod");
    			toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			add_location(a, file$3, 725, 6, 15483);
    			attr_dev(li, "class", "svelte-a0ptod");
    			add_location(li, file$3, 724, 4, 15472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 4 && a_href_value !== (a_href_value = /*$url*/ ctx[2](/*path*/ ctx[10]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, _linksLeft*/ 72) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(724:4) {#each _linksLeft as [path, name]}",
    		ctx
    	});

    	return block;
    }

    // (736:4) {#each _linksRight as [path, name]}
    function create_each_block_1$1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*name*/ ctx[11] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[2](/*path*/ ctx[10]));
    			attr_dev(a, "class", "svelte-a0ptod");
    			toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			add_location(a, file$3, 737, 6, 15729);
    			attr_dev(li, "class", "svelte-a0ptod");
    			add_location(li, file$3, 736, 4, 15718);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 4 && a_href_value !== (a_href_value = /*$url*/ ctx[2](/*path*/ ctx[10]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, _linksRight*/ 136) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
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
    		source: "(736:4) {#each _linksRight as [path, name]}",
    		ctx
    	});

    	return block;
    }

    // (744:0) {#if y > 340}
    function create_if_block$2(ctx) {
    	let div;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*showControls*/ ctx[1]) return create_if_block_2$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*showControls*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(button, "class", "toggle-button svelte-a0ptod");
    			add_location(button, file$3, 745, 2, 15872);
    			attr_dev(div, "class", "fixed svelte-a0ptod");
    			add_location(div, file$3, 744, 0, 15850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			if_block0.m(button, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleControls*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (/*showControls*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(744:0) {#if y > 340}",
    		ctx
    	});

    	return block;
    }

    // (749:6) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Menu");
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(749:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (747:4) {#if showControls}
    function create_if_block_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("X");
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(747:4) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    // (754:2) {#if showControls}
    function create_if_block_1$1(ctx) {
    	let ul;
    	let a;
    	let t0;
    	let a_href_value;
    	let t1;
    	let each_value = /*_links*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			a = element("a");
    			t0 = text("⇐ BACK TO HOME");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(a, "class", "backlink svelte-a0ptod");
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[2](/*home*/ ctx[4]));
    			add_location(a, file$3, 755, 6, 16064);
    			attr_dev(ul, "class", "MainNav svelte-a0ptod");
    			add_location(ul, file$3, 754, 4, 16037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, a);
    			append_dev(a, t0);
    			append_dev(ul, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 4 && a_href_value !== (a_href_value = /*$url*/ ctx[2](/*home*/ ctx[4]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$url, _links, $isActive*/ 44) {
    				each_value = /*_links*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(754:2) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    // (757:6) {#each _links as [path, name]}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*name*/ ctx[11] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[2](/*path*/ ctx[10]));
    			attr_dev(a, "class", "svelte-a0ptod");
    			toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			add_location(a, file$3, 758, 8, 16183);
    			attr_dev(li, "class", "svelte-a0ptod");
    			add_location(li, file$3, 757, 6, 16170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url*/ 4 && a_href_value !== (a_href_value = /*$url*/ ctx[2](/*path*/ ctx[10]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, _links*/ 40) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
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
    		source: "(757:6) {#each _links as [path, name]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let nav;
    	let ul0;
    	let t0;
    	let div;
    	let sitebrand;
    	let t1;
    	let ul1;
    	let t2;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[9]);
    	let each_value_2 = /*_linksLeft*/ ctx[6];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	sitebrand = new SiteBrand({ $$inline: true });
    	let each_value_1 = /*_linksRight*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*y*/ ctx[0] > 340 && create_if_block$2(ctx);

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

    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(ul0, "class", "NavBar__left svelte-a0ptod");
    			add_location(ul0, file$3, 722, 2, 15403);
    			attr_dev(div, "class", "NavBar__center svelte-a0ptod");
    			add_location(div, file$3, 730, 2, 15587);
    			attr_dev(ul1, "class", "NavBar__right svelte-a0ptod");
    			add_location(ul1, file$3, 734, 2, 15647);
    			attr_dev(nav, "class", "NavBar svelte-a0ptod");
    			add_location(nav, file$3, 721, 0, 15380);
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

    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "scroll", () => {
    					scrolling = true;
    					clearTimeout(scrolling_timeout);
    					scrolling_timeout = setTimeout(clear_scrolling, 100);
    					/*onwindowscroll*/ ctx[9]();
    				});

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 1 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*y*/ ctx[0]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if (dirty & /*$url, _linksLeft, $isActive*/ 76) {
    				each_value_2 = /*_linksLeft*/ ctx[6];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*$url, _linksRight, $isActive*/ 140) {
    				each_value_1 = /*_linksRight*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*y*/ ctx[0] > 340) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
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
    	component_subscribe($$self, url, $$value => $$invalidate(2, $url = $$value));
    	validate_store(isActive, "isActive");
    	component_subscribe($$self, isActive, $$value => $$invalidate(3, $isActive = $$value));
    	let y;
    	let home = "/";

    	const _links = [
    		["./about", "TODH"],
    		["./products", "Artifacts"],
    		["./blog", "Blog"],
    		["./styleguide", "LAB"]
    	];

    	const _linksLeft = [["./about", "TODH"], ["./products", "Artifacts"]];
    	const _linksRight = [["./styleguide", "LAB"], ["./blog", "Blog"]];
    	let showControls = false;
    	const toggleControls = () => $$invalidate(1, showControls = !showControls);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Nav", $$slots, []);

    	function onwindowscroll() {
    		$$invalidate(0, y = window.pageYOffset);
    	}

    	$$self.$capture_state = () => ({
    		url,
    		isActive,
    		SiteBrand,
    		y,
    		home,
    		_links,
    		_linksLeft,
    		_linksRight,
    		showControls,
    		toggleControls,
    		$url,
    		$isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("home" in $$props) $$invalidate(4, home = $$props.home);
    		if ("showControls" in $$props) $$invalidate(1, showControls = $$props.showControls);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		y,
    		showControls,
    		$url,
    		$isActive,
    		home,
    		_links,
    		_linksLeft,
    		_linksRight,
    		toggleControls,
    		onwindowscroll
    	];
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

    /* src/components/AudioPlayer.svelte generated by Svelte v3.23.2 */

    const file$4 = "src/components/AudioPlayer.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let audio_1;
    	let audio_1_src_value;
    	let audio_1_is_paused = true;
    	let t0;
    	let small;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			audio_1 = element("audio");
    			t0 = space();
    			small = element("small");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			t3 = text(/*composer*/ ctx[2]);
    			t4 = text(" / performed by ");
    			t5 = text(/*performer*/ ctx[3]);
    			audio_1.controls = true;
    			if (audio_1.src !== (audio_1_src_value = /*src*/ ctx[0])) attr_dev(audio_1, "src", audio_1_src_value);
    			attr_dev(audio_1, "class", "svelte-170zqmp");
    			add_location(audio_1, file$4, 661, 2, 14133);
    			attr_dev(small, "class", "svelte-170zqmp");
    			add_location(small, file$4, 662, 2, 14211);
    			attr_dev(div, "class", "svelte-170zqmp");
    			toggle_class(div, "playing", !/*paused*/ ctx[5]);
    			add_location(div, file$4, 660, 0, 14101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, audio_1);
    			/*audio_1_binding*/ ctx[7](audio_1);
    			append_dev(div, t0);
    			append_dev(div, small);
    			append_dev(small, t1);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(small, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(audio_1, "play", /*audio_1_play_pause_handler*/ ctx[8]),
    					listen_dev(audio_1, "pause", /*audio_1_play_pause_handler*/ ctx[8]),
    					listen_dev(audio_1, "play", /*stopOthers*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && audio_1.src !== (audio_1_src_value = /*src*/ ctx[0])) {
    				attr_dev(audio_1, "src", audio_1_src_value);
    			}

    			if (dirty & /*paused*/ 32 && audio_1_is_paused !== (audio_1_is_paused = /*paused*/ ctx[5])) {
    				audio_1[audio_1_is_paused ? "pause" : "play"]();
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
    			if (dirty & /*composer*/ 4) set_data_dev(t3, /*composer*/ ctx[2]);
    			if (dirty & /*performer*/ 8) set_data_dev(t5, /*performer*/ ctx[3]);

    			if (dirty & /*paused*/ 32) {
    				toggle_class(div, "playing", !/*paused*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*audio_1_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
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

    let current;

    function instance$5($$self, $$props, $$invalidate) {
    	let { src } = $$props;
    	let { title } = $$props;
    	let { composer } = $$props;
    	let { performer } = $$props;
    	let audio;
    	let paused = true;

    	function stopOthers() {
    		if (current && current !== audio) current.pause();
    		current = audio;
    	}

    	const writable_props = ["src", "title", "composer", "performer"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AudioPlayer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AudioPlayer", $$slots, []);

    	function audio_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			audio = $$value;
    			$$invalidate(4, audio);
    		});
    	}

    	function audio_1_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(5, paused);
    	}

    	$$self.$set = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("composer" in $$props) $$invalidate(2, composer = $$props.composer);
    		if ("performer" in $$props) $$invalidate(3, performer = $$props.performer);
    	};

    	$$self.$capture_state = () => ({
    		current,
    		src,
    		title,
    		composer,
    		performer,
    		audio,
    		paused,
    		stopOthers
    	});

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("composer" in $$props) $$invalidate(2, composer = $$props.composer);
    		if ("performer" in $$props) $$invalidate(3, performer = $$props.performer);
    		if ("audio" in $$props) $$invalidate(4, audio = $$props.audio);
    		if ("paused" in $$props) $$invalidate(5, paused = $$props.paused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		src,
    		title,
    		composer,
    		performer,
    		audio,
    		paused,
    		stopOthers,
    		audio_1_binding,
    		audio_1_play_pause_handler
    	];
    }

    class AudioPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			src: 0,
    			title: 1,
    			composer: 2,
    			performer: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioPlayer",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !("src" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'src'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'title'");
    		}

    		if (/*composer*/ ctx[2] === undefined && !("composer" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'composer'");
    		}

    		if (/*performer*/ ctx[3] === undefined && !("performer" in props)) {
    			console.warn("<AudioPlayer> was created without expected prop 'performer'");
    		}
    	}

    	get src() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get composer() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set composer(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get performer() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set performer(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SiteFooter.svelte generated by Svelte v3.23.2 */
    const file$5 = "src/components/SiteFooter.svelte";

    function create_fragment$6(ctx) {
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
    	let audioplayer;
    	let current;

    	audioplayer = new AudioPlayer({
    			props: {
    				src: "https://sveltejs.github.io/assets/music/mozart.mp3",
    				title: "Requiem in D minor, K. 626 - III. Sequence - Lacrymosa",
    				composer: "Wolfgang Amadeus Mozart",
    				performer: "Markus Staab"
    			},
    			$$inline: true
    		});

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
    			create_component(audioplayer.$$.fragment);
    			if (img.src !== (img_src_value = "/img/avatar.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sergio Forés avatar");
    			attr_dev(img, "class", "BioAvatar svelte-1pcsbcz");
    			add_location(img, file$5, 700, 4, 15253);
    			attr_dev(div0, "class", "Avatar svelte-1pcsbcz");
    			add_location(div0, file$5, 699, 2, 15228);
    			attr_dev(strong, "class", "svelte-1pcsbcz");
    			add_location(strong, file$5, 705, 6, 15371);
    			attr_dev(p, "class", "svelte-1pcsbcz");
    			add_location(p, file$5, 704, 4, 15361);
    			attr_dev(div1, "class", "Bio svelte-1pcsbcz");
    			add_location(div1, file$5, 703, 2, 15339);
    			attr_dev(title0, "class", "svelte-1pcsbcz");
    			add_location(title0, file$5, 715, 10, 15850);
    			attr_dev(circle, "fill", "#111111");
    			attr_dev(circle, "cx", "12.145");
    			attr_dev(circle, "cy", "3.892");
    			attr_dev(circle, "r", "0.96");
    			attr_dev(circle, "class", "svelte-1pcsbcz");
    			add_location(circle, file$5, 716, 10, 15890);
    			attr_dev(path0, "d", "M8,12c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S10.206,12,8,12z\n                M8,6C6.897,6,6,6.897,6,8\n                s0.897,2,2,2s2-0.897,2-2S9.103,6,8,6z");
    			attr_dev(path0, "class", "svelte-1pcsbcz");
    			add_location(path0, file$5, 717, 10, 15958);
    			attr_dev(path1, "d", "M12,16H4c-2.056,0-4-1.944-4-4V4c0-2.056,1.944-4,4-4h8c2.056,0,4,1.944,4,4v8C16,14.056,14.056,16,12,16z\n                M4,2C3.065,2,2,3.065,2,4v8c0,0.953,1.047,2,2,2h8c0.935,0,2-1.065,2-2V4c0-0.935-1.065-2-2-2H4z");
    			attr_dev(path1, "class", "svelte-1pcsbcz");
    			add_location(path1, file$5, 720, 10, 16143);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 16 16");
    			attr_dev(svg0, "class", "svelte-1pcsbcz");
    			add_location(svg0, file$5, 714, 8, 15779);
    			attr_dev(a0, "href", "https://www.instagram.com/t.o.d.h/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener");
    			attr_dev(a0, "class", "svelte-1pcsbcz");
    			add_location(a0, file$5, 713, 6, 15694);
    			attr_dev(title1, "class", "svelte-1pcsbcz");
    			add_location(title1, file$5, 726, 10, 16563);
    			attr_dev(path2, "d", "M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16h14.7c0.4,0,0.7-0.3,0.7-0.7V0.7\n                C16,0.3,15.7,0,15.3,0z M4.7,13.6H2.4V6h2.4V13.6z\n                M3.6,5C2.8,5,2.2,4.3,2.2,3.6c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4\n                C4.9,4.3,4.3,5,3.6,5z\n                M13.6,13.6h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6h2.3v1h0c0.3-0.6,1.1-1.2,2.2-1.2\n                c2.4,0,2.8,1.6,2.8,3.6V13.6z");
    			attr_dev(path2, "class", "svelte-1pcsbcz");
    			add_location(path2, file$5, 727, 10, 16602);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 16 16");
    			attr_dev(svg1, "class", "svelte-1pcsbcz");
    			add_location(svg1, file$5, 725, 8, 16492);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/sergiofores/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener");
    			attr_dev(a1, "class", "svelte-1pcsbcz");
    			add_location(a1, file$5, 724, 6, 16401);
    			attr_dev(title2, "class", "svelte-1pcsbcz");
    			add_location(title2, file$5, 737, 10, 17230);
    			attr_dev(path3, "d", "M15,0H1A1,1,0,0,0,0,1V15a1,1,0,0,0,1,1H15a1,1,0,0,0,1-1V1A1,1,0,0,0,15,0ZM13.292,3.791l-.858.823a.251.251,0,0,0-.1.241V10.9a.251.251,0,0,0,.1.241l.838.823v.181H9.057v-.181l.868-.843c.085-.085.085-.11.085-.241V5.993L7.6,12.124H7.271l-2.81-6.13V10.1a.567.567,0,0,0,.156.472l1.129,1.37v.181h-3.2v-.181l1.129-1.37a.547.547,0,0,0,.146-.472V5.351A.416.416,0,0,0,3.683,5l-1-1.209V3.61H5.8L8.2,8.893,10.322,3.61h2.971Z");
    			attr_dev(path3, "class", "svelte-1pcsbcz");
    			add_location(path3, file$5, 738, 10, 17267);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 16 16");
    			attr_dev(svg2, "class", "svelte-1pcsbcz");
    			add_location(svg2, file$5, 736, 8, 17159);
    			attr_dev(a2, "href", "https://medium.com/@todh");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener");
    			attr_dev(a2, "class", "svelte-1pcsbcz");
    			add_location(a2, file$5, 735, 6, 17084);
    			attr_dev(title3, "class", "svelte-1pcsbcz");
    			add_location(title3, file$5, 744, 10, 17887);
    			attr_dev(path4, "d", "M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1\n                C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7\n                c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3\n                c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z");
    			attr_dev(path4, "class", "svelte-1pcsbcz");
    			add_location(path4, file$5, 745, 10, 17925);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 16 16");
    			attr_dev(svg3, "class", "svelte-1pcsbcz");
    			add_location(svg3, file$5, 743, 8, 17816);
    			attr_dev(a3, "href", "https://twitter.com/t0tinspire");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener");
    			attr_dev(a3, "class", "svelte-1pcsbcz");
    			add_location(a3, file$5, 742, 6, 17735);
    			attr_dev(title4, "class", "svelte-1pcsbcz");
    			add_location(title4, file$5, 754, 10, 18633);
    			attr_dev(path5, "fill-rule", "evenodd");
    			attr_dev(path5, "clip-rule", "evenodd");
    			attr_dev(path5, "d", "M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6\n                C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5\n                c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1\n                c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8\n                c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2\n                c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z");
    			attr_dev(path5, "class", "svelte-1pcsbcz");
    			add_location(path5, file$5, 755, 10, 18670);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 16 16");
    			attr_dev(svg4, "class", "svelte-1pcsbcz");
    			add_location(svg4, file$5, 753, 8, 18562);
    			attr_dev(a4, "href", "https://github.com/t0t");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener");
    			attr_dev(a4, "class", "svelte-1pcsbcz");
    			add_location(a4, file$5, 752, 6, 18489);
    			attr_dev(title5, "class", "svelte-1pcsbcz");
    			add_location(title5, file$5, 765, 10, 19571);
    			attr_dev(path6, "d", "M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3\n                c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z");
    			attr_dev(path6, "class", "svelte-1pcsbcz");
    			add_location(path6, file$5, 766, 10, 19610);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "viewBox", "0 0 16 16");
    			attr_dev(svg5, "class", "svelte-1pcsbcz");
    			add_location(svg5, file$5, 764, 8, 19500);
    			attr_dev(a5, "href", "https://www.facebook.com/TODH-2139705836275088");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noopener");
    			attr_dev(a5, "class", "svelte-1pcsbcz");
    			add_location(a5, file$5, 763, 6, 19403);
    			attr_dev(title6, "class", "svelte-1pcsbcz");
    			add_location(title6, file$5, 773, 10, 20024);
    			attr_dev(rect, "x", "5");
    			attr_dev(rect, "width", "6");
    			attr_dev(rect, "height", "4.5");
    			attr_dev(rect, "class", "svelte-1pcsbcz");
    			add_location(rect, file$5, 774, 10, 20061);
    			attr_dev(polygon, "points", "11 7 16 7 16 16 0 16 0 7 5 7 5 11.5 11 11.5 11 7");
    			attr_dev(polygon, "class", "svelte-1pcsbcz");
    			add_location(polygon, file$5, 775, 10, 20109);
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "viewBox", "0 0 16 16");
    			attr_dev(svg6, "class", "svelte-1pcsbcz");
    			add_location(svg6, file$5, 772, 8, 19953);
    			attr_dev(a6, "href", "https://unsplash.com/@todh");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener");
    			attr_dev(a6, "class", "svelte-1pcsbcz");
    			add_location(a6, file$5, 771, 6, 19876);
    			attr_dev(li, "class", "svelte-1pcsbcz");
    			add_location(li, file$5, 712, 4, 15683);
    			attr_dev(ul, "class", "Links svelte-1pcsbcz");
    			add_location(ul, file$5, 711, 2, 15660);
    			attr_dev(div2, "class", "Player svelte-1pcsbcz");
    			add_location(div2, file$5, 781, 2, 20226);
    			attr_dev(footer, "class", "Main__footer svelte-1pcsbcz");
    			add_location(footer, file$5, 697, 0, 15195);
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
    			mount_component(audioplayer, div2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(audioplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(audioplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(audioplayer);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SiteFooter> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SiteFooter", $$slots, []);
    	$$self.$capture_state = () => ({ AudioPlayer });
    	return [];
    }

    class SiteFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SiteFooter",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/pages/_layout.svelte generated by Svelte v3.23.2 */

    const file$6 = "src/pages/_layout.svelte";

    function create_fragment$7(ctx) {
    	let link0;
    	let link1;
    	let t0;
    	let main;
    	let nav1;
    	let nav0;
    	let t1;
    	let t2;
    	let sitefooter;
    	let current;
    	nav0 = new Nav({ $$inline: true });
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	sitefooter = new SiteFooter({ $$inline: true });

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t0 = space();
    			main = element("main");
    			nav1 = element("nav");
    			create_component(nav0.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			create_component(sitefooter.$$.fragment);
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "class", "svelte-od24v0");
    			add_location(link0, file$6, 10, 4, 599);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,400&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "class", "svelte-od24v0");
    			add_location(link1, file$6, 11, 4, 719);
    			attr_dev(nav1, "class", "Main__nav svelte-od24v0");
    			add_location(nav1, file$6, 644, 4, 14493);
    			attr_dev(main, "class", "Main svelte-od24v0");
    			add_location(main, file$6, 643, 0, 14469);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, nav1);
    			mount_component(nav0, nav1, null);
    			append_dev(main, t1);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			append_dev(main, t2);
    			mount_component(sitefooter, main, null);
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
    			transition_in(nav0.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(sitefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav0.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(sitefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(nav0);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Layout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Nav, SiteFooter });
    	return [$$scope, $$slots];
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
    			attr_dev(h1, "class", "svelte-zkhrbg");
    			add_location(h1, file$7, 635, 6, 13746);
    			attr_dev(h2, "class", "svelte-zkhrbg");
    			add_location(h2, file$7, 636, 6, 13773);
    			attr_dev(hgroup, "class", "text-center svelte-zkhrbg");
    			add_location(hgroup, file$7, 634, 4, 13711);
    			attr_dev(header, "class", "Main__header svelte-zkhrbg");
    			add_location(header, file$7, 633, 0, 13677);
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

    /* src/components/BlockQuote.svelte generated by Svelte v3.23.2 */

    const file$8 = "src/components/BlockQuote.svelte";

    function create_fragment$9(ctx) {
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
    			attr_dev(small, "class", "svelte-1v5ayj2");
    			add_location(small, file$8, 641, 4, 13868);
    			attr_dev(blockquote, "class", blockquote_class_value = "Quote QuoteLine " + /*modificador*/ ctx[3][/*variante*/ ctx[2]] + " svelte-1v5ayj2");
    			add_location(blockquote, file$8, 639, 0, 13791);
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

    			if (dirty & /*modificador, variante*/ 12 && blockquote_class_value !== (blockquote_class_value = "Quote QuoteLine " + /*modificador*/ ctx[3][/*variante*/ ctx[2]] + " svelte-1v5ayj2")) {
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			quote: 0,
    			author: 1,
    			variante: 2,
    			modificador: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockQuote",
    			options,
    			id: create_fragment$9.name
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

    const file$9 = "src/components/Content.svelte";

    function create_fragment$a(ctx) {
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
    			attr_dev(div0, "class", "Content svelte-1dj4792");
    			add_location(div0, file$9, 629, 4, 13636);
    			attr_dev(div1, "class", "Main__content svelte-1dj4792");
    			add_location(div1, file$9, 628, 0, 13604);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/ContentArea.svelte generated by Svelte v3.23.2 */

    const file$a = "src/components/ContentArea.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Content__area svelte-1oy0ns9");
    			add_location(div, file$a, 628, 0, 13608);
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentArea",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/Area.svelte generated by Svelte v3.23.2 */

    const file$b = "src/components/Area.svelte";

    // (659:4) {#if title}
    function create_if_block$3(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-1tegyhl");
    			add_location(h3, file$b, 659, 8, 14236);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(659:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let article;
    	let t;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$3(ctx);
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			article = element("article");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(article, "class", "Area svelte-1tegyhl");
    			add_location(article, file$b, 657, 0, 14189);
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
    					if_block = create_if_block$3(ctx);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Area",
    			options,
    			id: create_fragment$c.name
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

    const file$c = "src/components/Banner.svelte";
    const get_image_slot_changes = dirty => ({});
    const get_image_slot_context = ctx => ({});

    // (649:10) xx
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
    		source: "(649:10) xx",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
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
    			attr_dev(div, "class", div_class_value = "Banner " + /*modificador*/ ctx[1][/*variante*/ ctx[0]] + " svelte-1rgo7r6");
    			add_location(div, file$c, 646, 0, 13926);
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

    			if (!current || dirty & /*modificador, variante*/ 3 && div_class_value !== (div_class_value = "Banner " + /*modificador*/ ctx[1][/*variante*/ ctx[0]] + " svelte-1rgo7r6")) {
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { variante: 0, modificador: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Banner",
    			options,
    			id: create_fragment$d.name
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

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/components/List.svelte generated by Svelte v3.23.2 */
    const file$d = "src/components/List.svelte";

    function create_fragment$e(ctx) {
    	let ul;
    	let ul_transition;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", "List svelte-1swc1rp");
    			add_location(ul, file$d, 11, 0, 168);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!ul_transition) ul_transition = create_bidirectional_transition(ul, fade, {}, true);
    				ul_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!ul_transition) ul_transition = create_bidirectional_transition(ul, fade, {}, false);
    			ul_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && ul_transition) ul_transition.end();
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
    	const items = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("List", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ items, fade });
    	return [items, $$scope, $$slots];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get items() {
    		return this.$$.ctx[0];
    	}

    	set items(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Cards.svelte generated by Svelte v3.23.2 */

    const file$e = "src/components/Cards.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Cards svelte-13f9i4q");
    			add_location(div, file$e, 645, 0, 14046);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cards",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.23.2 */

    const file$f = "src/components/Card.svelte";
    const get_hasSvg_slot_changes = dirty => ({});
    const get_hasSvg_slot_context = ctx => ({});

    // (686:4) {#if hasImage}
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "class", "svelte-1yc9dsx");
    			add_location(img, file$f, 686, 8, 14730);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(686:4) {#if hasImage}",
    		ctx
    	});

    	return block;
    }

    // (689:4) {#if hasInlineSvg}
    function create_if_block$4(ctx) {
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(689:4) {#if hasInlineSvg}",
    		ctx
    	});

    	return block;
    }

    // (690:28) Put here inline-svg
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
    		source: "(690:28) Put here inline-svg",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let h4;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let t5;
    	let div1_class_value;
    	let current;
    	let if_block0 = /*hasImage*/ ctx[4] && create_if_block_1$2(ctx);
    	let if_block1 = /*hasInlineSvg*/ ctx[5] && create_if_block$4(ctx);
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
    			p = element("p");
    			t4 = text(/*description*/ ctx[1]);
    			t5 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(h4, "class", "CardTitle svelte-1yc9dsx");
    			add_location(h4, file$f, 692, 8, 14895);
    			attr_dev(p, "class", "CardContent svelte-1yc9dsx");
    			add_location(p, file$f, 693, 8, 14938);
    			attr_dev(div0, "class", "CardMain svelte-1yc9dsx");
    			add_location(div0, file$f, 691, 4, 14864);
    			attr_dev(div1, "class", div1_class_value = "Card  " + /*modificador*/ ctx[7][/*variante*/ ctx[6]] + " svelte-1yc9dsx");
    			add_location(div1, file$f, 682, 0, 14656);
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
    			append_dev(div0, p);
    			append_dev(p, t4);
    			append_dev(div0, t5);

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
    					if_block0 = create_if_block_1$2(ctx);
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
    					if_block1 = create_if_block$4(ctx);
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
    			if (!current || dirty & /*description*/ 2) set_data_dev(t4, /*description*/ ctx[1]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 512) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*variante*/ 64 && div1_class_value !== (div1_class_value = "Card  " + /*modificador*/ ctx[7][/*variante*/ ctx[6]] + " svelte-1yc9dsx")) {
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

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
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
    			id: create_fragment$g.name
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

    const file$g = "src/components/Figure.svelte";

    function create_fragment$h(ctx) {
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
    			attr_dev(figcaption, "class", "svelte-sao5es");
    			add_location(figcaption, file$g, 640, 4, 13850);
    			attr_dev(figure, "class", "svelte-sao5es");
    			add_location(figure, file$g, 638, 0, 13825);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { caption: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Figure",
    			options,
    			id: create_fragment$h.name
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

    const file$h = "src/components/icons/IconCero.svelte";

    function create_fragment$i(ctx) {
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
    			attr_dev(circle, "class", "svelte-8s63hz");
    			add_location(circle, file$h, 629, 4, 13712);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 168 168");
    			attr_dev(svg, "class", "svelte-8s63hz");
    			add_location(svg, file$h, 628, 0, 13605);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCero",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/icons/IconUno.svelte generated by Svelte v3.23.2 */

    const file$i = "src/components/icons/IconUno.svelte";

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
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle, "transform", "matrix(.07646 0 0 .07646 -1073.328 -152.287)");
    			attr_dev(circle, "class", "svelte-mzqmgg");
    			add_location(circle, file$i, 629, 4, 13711);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 168 168");
    			attr_dev(svg, "class", "svelte-mzqmgg");
    			add_location(svg, file$i, 628, 0, 13604);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconUno> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconUno", $$slots, []);
    	return [];
    }

    class IconUno extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUno",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/icons/IconDos.svelte generated by Svelte v3.23.2 */

    const file$j = "src/components/icons/IconDos.svelte";

    function create_fragment$k(ctx) {
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
    			attr_dev(circle0, "class", "svelte-1pjqi7q");
    			add_location(circle0, file$j, 630, 4, 13761);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.67)");
    			attr_dev(circle1, "class", "svelte-1pjqi7q");
    			add_location(circle1, file$j, 631, 4, 13866);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle2, "class", "svelte-1pjqi7q");
    			add_location(circle2, file$j, 632, 4, 13969);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-1pjqi7q");
    			add_location(svg, file$j, 628, 0, 13604);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconDos> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconDos", $$slots, []);
    	return [];
    }

    class IconDos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconDos",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/components/icons/IconTres.svelte generated by Svelte v3.23.2 */

    const file$k = "src/components/icons/IconTres.svelte";

    function create_fragment$l(ctx) {
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
    			attr_dev(circle0, "class", "svelte-kpn3u");
    			add_location(circle0, file$k, 630, 2, 13758);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.668)");
    			attr_dev(circle1, "class", "svelte-kpn3u");
    			add_location(circle1, file$k, 632, 2, 13913);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.03822 0 0 .03822 -493.61 -33.668)");
    			attr_dev(circle2, "class", "svelte-kpn3u");
    			add_location(circle2, file$k, 634, 2, 14066);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "fill", "none");
    			attr_dev(circle3, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle3, "stroke-width", "13.08");
    			attr_dev(circle3, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle3, "class", "svelte-kpn3u");
    			add_location(circle3, file$k, 636, 2, 14222);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-kpn3u");
    			add_location(svg, file$k, 628, 0, 13605);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconTres> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconTres", $$slots, []);
    	return [];
    }

    class IconTres extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconTres",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/icons/IconCuatro.svelte generated by Svelte v3.23.2 */

    const file$l = "src/components/icons/IconCuatro.svelte";

    function create_fragment$m(ctx) {
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
    			attr_dev(circle0, "class", "svelte-pjakmu");
    			add_location(circle0, file$l, 629, 4, 13714);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "transform", "matrix(.0191 0 0 .0191 -141.88 25.37)");
    			attr_dev(circle1, "class", "svelte-pjakmu");
    			add_location(circle1, file$l, 630, 4, 13816);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "transform", "matrix(.0191 0 0 .0191 -267.75 25.37)");
    			attr_dev(circle2, "class", "svelte-pjakmu");
    			add_location(circle2, file$l, 631, 4, 13919);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "transform", "matrix(.0191 0 0 .0191 -183.76 25.37)");
    			attr_dev(circle3, "class", "svelte-pjakmu");
    			add_location(circle3, file$l, 632, 4, 14022);
    			attr_dev(circle4, "cx", "15135.5");
    			attr_dev(circle4, "cy", "3089.34");
    			attr_dev(circle4, "r", "1097.64");
    			attr_dev(circle4, "fill", "none");
    			attr_dev(circle4, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle4, "transform", "matrix(.03822 0 0 .03822 -493.93 -33.67)");
    			attr_dev(circle4, "class", "svelte-pjakmu");
    			add_location(circle4, file$l, 633, 4, 14125);
    			attr_dev(circle5, "cx", "15135.5");
    			attr_dev(circle5, "cy", "3089.34");
    			attr_dev(circle5, "r", "1097.64");
    			attr_dev(circle5, "fill", "none");
    			attr_dev(circle5, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle5, "transform", "matrix(.03822 0 0 .03822 -452.1 -33.67)");
    			attr_dev(circle5, "class", "svelte-pjakmu");
    			add_location(circle5, file$l, 634, 4, 14278);
    			attr_dev(circle6, "cx", "15135.5");
    			attr_dev(circle6, "cy", "3089.34");
    			attr_dev(circle6, "r", "1097.64");
    			attr_dev(circle6, "fill", "none");
    			attr_dev(circle6, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle6, "transform", "matrix(.03822 0 0 .03822 -536 -33.67)");
    			attr_dev(circle6, "class", "svelte-pjakmu");
    			add_location(circle6, file$l, 636, 4, 14438);
    			attr_dev(circle7, "cx", "15135.5");
    			attr_dev(circle7, "cy", "3089.34");
    			attr_dev(circle7, "r", "1097.64");
    			attr_dev(circle7, "fill", "none");
    			attr_dev(circle7, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle7, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle7, "class", "svelte-pjakmu");
    			add_location(circle7, file$l, 638, 4, 14596);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-pjakmu");
    			add_location(svg, file$l, 628, 0, 13607);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconCuatro> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconCuatro", $$slots, []);
    	return [];
    }

    class IconCuatro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCuatro",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/components/icons/IconEspiral.svelte generated by Svelte v3.23.2 */

    const file$m = "src/components/icons/IconEspiral.svelte";

    function create_fragment$n(ctx) {
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
    			attr_dev(path0, "class", "svelte-dl5awr");
    			add_location(path0, file$m, 640, 4, 13964);
    			attr_dev(path1, "d", "M136.483 135.962c-9.786-3.27-20.483-1.824-28.77 3.88-8.317 5.694-13.197 14.975-13.172 24.92M94.541 164.762c.027 6.18 3.097 12.017 8.23 15.753 5.141 3.706 11.77 4.84 17.805 3.056M120.576 183.57c3.745-1.084 6.664-3.874 7.868-7.48 1.205-3.607.54-7.56-1.79-10.71M94.096 9.677l288.649 208.564M382.745 218.24l-356.049-6.836M26.696 211.404l67.4-201.727M94.096 9.677l68.61 204.32M162.706 213.998L94.54 164.762M136.483 135.962l-15.907 47.609M126.654 165.38l-32.113-.618M114.388 165.152l6.188 18.419M126.654 165.38l-9.908 6.801M118.182 167.884l-1.436 4.297M136.483 135.962L26.696 211.404M120.544 169.58l-6.156-4.428M114.388 165.152c-.88 1.17-1.1 2.666-.661 4.067a4.828 4.828 0 003.02 2.962");
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "stroke", "#fff");
    			attr_dev(path1, "stroke-width", ".9705592000000001");
    			attr_dev(path1, "class", "svelte-dl5awr");
    			add_location(path1, file$m, 642, 4, 14163);
    			attr_dev(path2, "d", "M126.654 165.38c-1.421-1.904-3.71-3.087-6.137-3.13-2.425-.044-4.706 1.042-6.13 2.902M120.544 169.58a1.74 1.74 0 00-.752-1.402c-.48-.335-1.066-.46-1.61-.294M118.182 167.884c-.314.104-.606.355-.711.668a1.14 1.14 0 00.156.994");
    			attr_dev(path2, "fill", "none");
    			attr_dev(path2, "stroke", "#fff");
    			attr_dev(path2, "stroke-width", ".9705592000000001");
    			attr_dev(path2, "class", "svelte-dl5awr");
    			add_location(path2, file$m, 645, 4, 14935);
    			attr_dev(path3, "d", "M116.746 172.181c.878.293 1.861.168 2.594-.355.764-.51 1.214-1.336 1.204-2.247M382.745 218.24c-.183-68.324-34.122-133.18-91.218-174.43C234.409 2.519 161.002-10.153 94.096 9.678M94.096 9.677C52.73 21.935 20.356 52.78 7.016 92.706c-13.329 39.894-6.009 84.037 19.68 118.698M26.696 211.404c15.859 21.406 41.186 34.4 68.102 34.921 26.884.51 52.135-11.519 67.908-32.327");
    			attr_dev(path3, "fill", "none");
    			attr_dev(path3, "stroke", "#fff");
    			attr_dev(path3, "stroke-width", ".9705592000000001");
    			attr_dev(path3, "class", "svelte-dl5awr");
    			add_location(path3, file$m, 648, 4, 15250);
    			attr_dev(path4, "d", "M162.706 213.998c9.734-12.855 12.401-29.605 7.236-45.032-5.197-15.438-17.621-27.712-33.459-33.004");
    			attr_dev(path4, "fill", "none");
    			attr_dev(path4, "stroke", "#fff");
    			attr_dev(path4, "stroke-width", ".9705592000000001");
    			attr_dev(path4, "class", "svelte-dl5awr");
    			add_location(path4, file$m, 651, 4, 15706);
    			attr_dev(svg, "viewBox", "0 0 384 247");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			set_style(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-dl5awr");
    			toggle_class(svg, "active", /*active*/ ctx[1]);
    			add_location(svg, file$m, 638, 0, 13746);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconEspiral",
    			options,
    			id: create_fragment$n.name
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

    const file$n = "src/components/icons/IconTetractys.svelte";

    function create_fragment$o(ctx) {
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
    			attr_dev(path, "class", "svelte-1vk9v28");
    			add_location(path, file$n, 639, 2, 13930);
    			attr_dev(circle0, "cx", "168.317");
    			attr_dev(circle0, "cy", "18.147");
    			attr_dev(circle0, "r", "6.044");
    			attr_dev(circle0, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle0, "class", "svelte-1vk9v28");
    			add_location(circle0, file$n, 644, 2, 14313);
    			attr_dev(circle1, "cx", "214.102");
    			attr_dev(circle1, "cy", "98.498");
    			attr_dev(circle1, "r", "6.045");
    			attr_dev(circle1, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle1, "class", "svelte-1vk9v28");
    			add_location(circle1, file$n, 645, 2, 14411);
    			attr_dev(circle2, "cx", "259.858");
    			attr_dev(circle2, "cy", "178.241");
    			attr_dev(circle2, "r", "6.045");
    			attr_dev(circle2, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle2, "class", "svelte-1vk9v28");
    			add_location(circle2, file$n, 646, 2, 14509);
    			attr_dev(circle3, "cx", "305.727");
    			attr_dev(circle3, "cy", "257.757");
    			attr_dev(circle3, "r", "6.045");
    			attr_dev(circle3, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle3, "class", "svelte-1vk9v28");
    			add_location(circle3, file$n, 647, 2, 14608);
    			attr_dev(circle4, "cx", "214.102");
    			attr_dev(circle4, "cy", "257.757");
    			attr_dev(circle4, "r", "6.045");
    			attr_dev(circle4, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle4, "class", "svelte-1vk9v28");
    			add_location(circle4, file$n, 648, 2, 14707);
    			attr_dev(circle5, "cx", "123.237");
    			attr_dev(circle5, "cy", "257.757");
    			attr_dev(circle5, "r", "6.044");
    			attr_dev(circle5, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle5, "class", "svelte-1vk9v28");
    			add_location(circle5, file$n, 649, 2, 14806);
    			attr_dev(circle6, "cx", "30.816");
    			attr_dev(circle6, "cy", "257.757");
    			attr_dev(circle6, "r", "6.045");
    			attr_dev(circle6, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle6, "class", "svelte-1vk9v28");
    			add_location(circle6, file$n, 650, 2, 14905);
    			attr_dev(circle7, "cx", "76.892");
    			attr_dev(circle7, "cy", "178.241");
    			attr_dev(circle7, "r", "6.045");
    			attr_dev(circle7, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle7, "class", "svelte-1vk9v28");
    			add_location(circle7, file$n, 651, 2, 15003);
    			attr_dev(circle8, "cx", "168.317");
    			attr_dev(circle8, "cy", "178.241");
    			attr_dev(circle8, "r", "6.045");
    			attr_dev(circle8, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle8, "class", "svelte-1vk9v28");
    			add_location(circle8, file$n, 652, 2, 15101);
    			attr_dev(circle9, "cx", "123.237");
    			attr_dev(circle9, "cy", "98.498");
    			attr_dev(circle9, "r", "6.044");
    			attr_dev(circle9, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle9, "class", "svelte-1vk9v28");
    			add_location(circle9, file$n, 653, 2, 15200);
    			set_style(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 193 169");
    			attr_dev(svg, "class", "svelte-1vk9v28");
    			toggle_class(svg, "active", /*active*/ ctx[1]);
    			add_location(svg, file$n, 637, 0, 13740);
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconTetractys",
    			options,
    			id: create_fragment$o.name
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

    const file$o = "src/components/Loading.svelte";

    function create_fragment$p(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			attr_dev(div, "class", "svelte-sbi7hj");
    			add_location(div, file$o, 7, 0, 109);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src/components/Libros.svelte generated by Svelte v3.23.2 */
    const file$p = "src/components/Libros.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (646:4) {:else}
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
    		source: "(646:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (644:4) {#each libros as item}
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
    			attr_dev(a, "class", "svelte-ijkyss");
    			add_location(a, file$p, 644, 12, 13931);
    			attr_dev(li, "class", "svelte-ijkyss");
    			add_location(li, file$p, 644, 8, 13927);
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
    		source: "(644:4) {#each libros as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
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

    			attr_dev(ul, "class", "svelte-ijkyss");
    			add_location(ul, file$p, 642, 0, 13887);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { libros: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Libros",
    			options,
    			id: create_fragment$q.name
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

    const file$q = "src/components/Conceptos.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (645:0) {#each conceptos as concepto}
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
    			attr_dev(dt, "class", "svelte-sy0f23");
    			add_location(dt, file$q, 645, 4, 13991);
    			html_tag = new HtmlTag(t1);
    			attr_dev(a, "href", a_href_value = /*concepto*/ ctx[1].href);
    			attr_dev(a, "target", a_target_value = /*concepto*/ ctx[1].target);
    			attr_dev(a, "class", "svelte-sy0f23");
    			add_location(a, file$q, 648, 8, 14064);
    			attr_dev(dd, "class", "svelte-sy0f23");
    			add_location(dd, file$q, 646, 4, 14021);
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
    		source: "(645:0) {#each conceptos as concepto}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
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

    			attr_dev(dl, "class", "svelte-sy0f23");
    			add_location(dl, file$q, 643, 0, 13952);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { conceptos: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conceptos",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get conceptos() {
    		throw new Error("<Conceptos>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set conceptos(value) {
    		throw new Error("<Conceptos>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/about.svelte generated by Svelte v3.23.2 */
    const file$r = "src/pages/about.svelte";

    // (730:6) <Card title="0" variante={4} description={cualidades.cero[count]} image="img/grafico-cero.svg">
    function create_default_slot_14(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-zyagmi");
    			add_location(button, file$r, 730, 8, 16062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*increment*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(730:6) <Card title=\\\"0\\\" variante={4} description={cualidades.cero[count]} image=\\\"img/grafico-cero.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (736:6) <Card title="1" variante={4} description={cualidades.uno[count]} image="img/grafico-uno.svg">
    function create_default_slot_13(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-zyagmi");
    			add_location(button, file$r, 736, 8, 16245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*increment*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(736:6) <Card title=\\\"1\\\" variante={4} description={cualidades.uno[count]} image=\\\"img/grafico-uno.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (742:6) <Card title="2" variante={4} description={cualidades.dos[count]} image="img/dos.svg">
    function create_default_slot_12(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-zyagmi");
    			add_location(button, file$r, 742, 8, 16420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*increment*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(742:6) <Card title=\\\"2\\\" variante={4} description={cualidades.dos[count]} image=\\\"img/dos.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (748:6) <Card title="3" variante={4} description={cualidades.tres[count]} image="img/tres.svg">
    function create_default_slot_11(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-zyagmi");
    			add_location(button, file$r, 748, 8, 16597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*increment*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(748:6) <Card title=\\\"3\\\" variante={4} description={cualidades.tres[count]} image=\\\"img/tres.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (754:6) <Card title="4" description={cualidades.cuatro[count]} image="img/cuatro.svg" variante={4}>
    function create_default_slot_10(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-zyagmi");
    			add_location(button, file$r, 754, 8, 16778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*increment*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(754:6) <Card title=\\\"4\\\" description={cualidades.cuatro[count]} image=\\\"img/cuatro.svg\\\" variante={4}>",
    		ctx
    	});

    	return block;
    }

    // (729:4) <Cards>
    function create_default_slot_9(ctx) {
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
    				title: "0",
    				variante: 4,
    				description: /*cualidades*/ ctx[1].cero[/*count*/ ctx[0]],
    				image: "img/grafico-cero.svg",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				title: "1",
    				variante: 4,
    				description: /*cualidades*/ ctx[1].uno[/*count*/ ctx[0]],
    				image: "img/grafico-uno.svg",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				title: "2",
    				variante: 4,
    				description: /*cualidades*/ ctx[1].dos[/*count*/ ctx[0]],
    				image: "img/dos.svg",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				title: "3",
    				variante: 4,
    				description: /*cualidades*/ ctx[1].tres[/*count*/ ctx[0]],
    				image: "img/tres.svg",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				title: "4",
    				description: /*cualidades*/ ctx[1].cuatro[/*count*/ ctx[0]],
    				image: "img/cuatro.svg",
    				variante: 4,
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
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
    			if (dirty & /*count*/ 1) card0_changes.description = /*cualidades*/ ctx[1].cero[/*count*/ ctx[0]];

    			if (dirty & /*$$scope*/ 16) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};
    			if (dirty & /*count*/ 1) card1_changes.description = /*cualidades*/ ctx[1].uno[/*count*/ ctx[0]];

    			if (dirty & /*$$scope*/ 16) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};
    			if (dirty & /*count*/ 1) card2_changes.description = /*cualidades*/ ctx[1].dos[/*count*/ ctx[0]];

    			if (dirty & /*$$scope*/ 16) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    			const card3_changes = {};
    			if (dirty & /*count*/ 1) card3_changes.description = /*cualidades*/ ctx[1].tres[/*count*/ ctx[0]];

    			if (dirty & /*$$scope*/ 16) {
    				card3_changes.$$scope = { dirty, ctx };
    			}

    			card3.$set(card3_changes);
    			const card4_changes = {};
    			if (dirty & /*count*/ 1) card4_changes.description = /*cualidades*/ ctx[1].cuatro[/*count*/ ctx[0]];

    			if (dirty & /*$$scope*/ 16) {
    				card4_changes.$$scope = { dirty, ctx };
    			}

    			card4.$set(card4_changes);
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
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(729:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (762:6) <figure slot="image">
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
    			attr_dev(figure, "class", "svelte-zyagmi");
    			add_location(figure, file$r, 761, 6, 16885);
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
    		source: "(762:6) <figure slot=\\\"image\\\">",
    		ctx
    	});

    	return block;
    }

    // (761:4) <Banner>
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
    		source: "(761:4) <Banner>",
    		ctx
    	});

    	return block;
    }

    // (771:6) <Figure caption="0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1">
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
    		source: "(771:6) <Figure caption=\\\"0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1\\\">",
    		ctx
    	});

    	return block;
    }

    // (769:4) <Area title="Tetractys">
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
    			attr_dev(div, "class", "center svelte-zyagmi");
    			add_location(div, file$r, 769, 4, 17152);
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
    		source: "(769:4) <Area title=\\\"Tetractys\\\">",
    		ctx
    	});

    	return block;
    }

    // (777:4) <Area title="Una lógica de la observación">
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
    			attr_dev(strong, "class", "svelte-zyagmi");
    			add_location(strong, file$r, 785, 6, 17999);
    			attr_dev(p0, "class", "svelte-zyagmi");
    			add_location(p0, file$r, 777, 4, 17351);
    			attr_dev(p1, "class", "svelte-zyagmi");
    			add_location(p1, file$r, 794, 4, 18620);
    			attr_dev(p2, "class", "svelte-zyagmi");
    			add_location(p2, file$r, 800, 4, 18934);
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
    		source: "(777:4) <Area title=\\\"Una lógica de la observación\\\">",
    		ctx
    	});

    	return block;
    }

    // (810:4) <Area title="Términos clave">
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
    		source: "(810:4) <Area title=\\\"Términos clave\\\">",
    		ctx
    	});

    	return block;
    }

    // (814:4) <Area title="Libros">
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
    		source: "(814:4) <Area title=\\\"Libros\\\">",
    		ctx
    	});

    	return block;
    }

    // (818:4) <Banner variante={1}>
    function create_default_slot_2(ctx) {
    	let img;
    	let img_src_value;
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
    			img = element("img");
    			t = space();
    			create_component(blockquote.$$.fragment);
    			if (img.src !== (img_src_value = "img/dos.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Alt text");
    			attr_dev(img, "class", "svelte-zyagmi");
    			add_location(img, file$r, 818, 6, 19574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
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
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t);
    			destroy_component(blockquote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(818:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (727:2) <ContentArea>
    function create_default_slot_1(ctx) {
    	let cards;
    	let t0;
    	let banner0;
    	let t1;
    	let area0;
    	let t2;
    	let area1;
    	let t3;
    	let area2;
    	let t4;
    	let area3;
    	let t5;
    	let banner1;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner0 = new Banner({
    			props: {
    				$$slots: {
    					default: [create_default_slot_8],
    					image: [create_image_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

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

    	banner1 = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cards.$$.fragment);
    			t0 = space();
    			create_component(banner0.$$.fragment);
    			t1 = space();
    			create_component(area0.$$.fragment);
    			t2 = space();
    			create_component(area1.$$.fragment);
    			t3 = space();
    			create_component(area2.$$.fragment);
    			t4 = space();
    			create_component(area3.$$.fragment);
    			t5 = space();
    			create_component(banner1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cards, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(banner0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(area1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(area2, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(area3, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(banner1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cards_changes = {};

    			if (dirty & /*$$scope, count*/ 17) {
    				cards_changes.$$scope = { dirty, ctx };
    			}

    			cards.$set(cards_changes);
    			const banner0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				banner0_changes.$$scope = { dirty, ctx };
    			}

    			banner0.$set(banner0_changes);
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
    			const banner1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				banner1_changes.$$scope = { dirty, ctx };
    			}

    			banner1.$set(banner1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cards.$$.fragment, local);
    			transition_in(banner0.$$.fragment, local);
    			transition_in(area0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			transition_in(area2.$$.fragment, local);
    			transition_in(area3.$$.fragment, local);
    			transition_in(banner1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cards.$$.fragment, local);
    			transition_out(banner0.$$.fragment, local);
    			transition_out(area0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			transition_out(area2.$$.fragment, local);
    			transition_out(area3.$$.fragment, local);
    			transition_out(banner1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cards, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(banner0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(area1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(area2, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(area3, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(banner1, detaching);
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

    // (726:0) <Content>
    function create_default_slot$1(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope, count*/ 17) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(726:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
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
    				$$slots: { default: [create_default_slot$1] },
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

    			if (dirty & /*$$scope, count*/ 17) {
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let visible = true;

    	let cualidades = {
    		cero: ["asd", "sdf", "fdh", "dh", "sfdf", "dfhf", "sd", "t54"],
    		uno: ["mónada", "punto", "pensar", "ser", "fuego", "orden", "discernir", "nigredo"],
    		dos: [
    			"díada",
    			"línea",
    			"sentir",
    			"dualidad",
    			"agua",
    			"incubación",
    			"empatizar",
    			"albedo"
    		],
    		tres: [
    			"tríada",
    			"superficie",
    			"decir",
    			"símbolo",
    			"aire",
    			"conexión",
    			"testear",
    			"citrinitas"
    		],
    		cuatro: [
    			"tétrada",
    			"objeto",
    			"hacer",
    			"manifestación",
    			"tierra",
    			"forma",
    			"prototipar",
    			"rubedo"
    		]
    	};

    	let count = 0;

    	let increment = () => {
    		if (count < cualidades.uno.length - 1) {
    			$$invalidate(0, count++, count);
    		} else {
    			$$invalidate(0, count = 0);
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
    		cualidades,
    		count,
    		increment
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) visible = $$props.visible;
    		if ("cualidades" in $$props) $$invalidate(1, cualidades = $$props.cualidades);
    		if ("count" in $$props) $$invalidate(0, count = $$props.count);
    		if ("increment" in $$props) $$invalidate(2, increment = $$props.increment);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [count, cualidades, increment];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src/pages/blog/[slug].svelte generated by Svelte v3.23.2 */
    const file$s = "src/pages/blog/[slug].svelte";

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

    // (696:0) {#if (post.slug === slug)}
    function create_if_block_9(ctx) {
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(696:0) {#if (post.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (695:0) {#each elpost as post}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*post*/ ctx[2].slug === /*slug*/ ctx[0] && create_if_block_9(ctx);

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
    					if_block = create_if_block_9(ctx);
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
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(695:0) {#each elpost as post}",
    		ctx
    	});

    	return block;
    }

    // (706:8) {#if (post.slug === slug)}
    function create_if_block$5(ctx) {
    	let article;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let h3;
    	let raw0_value = /*post*/ ctx[2].content.h1 + "";
    	let t1;
    	let p0;
    	let raw1_value = /*post*/ ctx[2].content.p + "";
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let p1;
    	let raw2_value = /*post*/ ctx[2].content.p7 + "";
    	let t10;
    	let p2;
    	let raw3_value = /*post*/ ctx[2].content.p8 + "";
    	let t11;
    	let p3;
    	let raw4_value = /*post*/ ctx[2].content.p9 + "";
    	let t12;
    	let p4;
    	let raw5_value = /*post*/ ctx[2].content.p10 + "";
    	let t13;
    	let t14;
    	let p5;
    	let raw6_value = /*post*/ ctx[2].content.p11 + "";
    	let t15;
    	let p6;
    	let raw7_value = /*post*/ ctx[2].content.p12 + "";
    	let t16;
    	let p7;
    	let raw8_value = /*post*/ ctx[2].content.p13 + "";
    	let t17;
    	let if_block0 = /*post*/ ctx[2].content.blockquote && create_if_block_8(ctx);
    	let if_block1 = /*post*/ ctx[2].content.p2 && create_if_block_7(ctx);
    	let if_block2 = /*post*/ ctx[2].content.p3 && create_if_block_6(ctx);
    	let if_block3 = /*post*/ ctx[2].content.p4 && create_if_block_5(ctx);
    	let if_block4 = /*post*/ ctx[2].content.p5 && create_if_block_4(ctx);
    	let if_block5 = /*post*/ ctx[2].content.p6 && create_if_block_3$1(ctx);
    	let if_block6 = /*post*/ ctx[2].content.img1 && create_if_block_2$2(ctx);
    	let if_block7 = /*post*/ ctx[2].content.img2 && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			if (if_block3) if_block3.c();
    			t6 = space();
    			if (if_block4) if_block4.c();
    			t7 = space();
    			if (if_block5) if_block5.c();
    			t8 = space();
    			if (if_block6) if_block6.c();
    			t9 = space();
    			p1 = element("p");
    			t10 = space();
    			p2 = element("p");
    			t11 = space();
    			p3 = element("p");
    			t12 = space();
    			p4 = element("p");
    			t13 = space();
    			if (if_block7) if_block7.c();
    			t14 = space();
    			p5 = element("p");
    			t15 = space();
    			p6 = element("p");
    			t16 = space();
    			p7 = element("p");
    			t17 = space();
    			if (img.src !== (img_src_value = "/" + /*post*/ ctx[2].imagen)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*post*/ ctx[2].title);
    			attr_dev(img, "class", "svelte-zh0tut");
    			add_location(img, file$s, 708, 20, 15412);
    			attr_dev(div0, "class", "PostImgContainer svelte-zh0tut");
    			add_location(div0, file$s, 707, 16, 15361);
    			attr_dev(h3, "class", "svelte-zh0tut");
    			add_location(h3, file$s, 711, 20, 15544);
    			attr_dev(p0, "class", "svelte-zh0tut");
    			add_location(p0, file$s, 712, 20, 15597);
    			attr_dev(p1, "class", "svelte-zh0tut");
    			add_location(p1, file$s, 737, 20, 16697);
    			attr_dev(p2, "class", "svelte-zh0tut");
    			add_location(p2, file$s, 738, 20, 16748);
    			attr_dev(p3, "class", "svelte-zh0tut");
    			add_location(p3, file$s, 739, 20, 16799);
    			attr_dev(p4, "class", "svelte-zh0tut");
    			add_location(p4, file$s, 740, 20, 16850);
    			attr_dev(p5, "class", "svelte-zh0tut");
    			add_location(p5, file$s, 744, 20, 17043);
    			attr_dev(p6, "class", "svelte-zh0tut");
    			add_location(p6, file$s, 745, 20, 17095);
    			attr_dev(p7, "class", "svelte-zh0tut");
    			add_location(p7, file$s, 746, 20, 17147);
    			attr_dev(div1, "class", "PostContent svelte-zh0tut");
    			add_location(div1, file$s, 710, 16, 15498);
    			attr_dev(article, "class", "PostArticle svelte-zh0tut");
    			add_location(article, file$s, 706, 12, 15315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, img);
    			append_dev(article, t0);
    			append_dev(article, div1);
    			append_dev(div1, h3);
    			h3.innerHTML = raw0_value;
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			p0.innerHTML = raw1_value;
    			append_dev(div1, t2);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t5);
    			if (if_block3) if_block3.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block4) if_block4.m(div1, null);
    			append_dev(div1, t7);
    			if (if_block5) if_block5.m(div1, null);
    			append_dev(div1, t8);
    			if (if_block6) if_block6.m(div1, null);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			p1.innerHTML = raw2_value;
    			append_dev(div1, t10);
    			append_dev(div1, p2);
    			p2.innerHTML = raw3_value;
    			append_dev(div1, t11);
    			append_dev(div1, p3);
    			p3.innerHTML = raw4_value;
    			append_dev(div1, t12);
    			append_dev(div1, p4);
    			p4.innerHTML = raw5_value;
    			append_dev(div1, t13);
    			if (if_block7) if_block7.m(div1, null);
    			append_dev(div1, t14);
    			append_dev(div1, p5);
    			p5.innerHTML = raw6_value;
    			append_dev(div1, t15);
    			append_dev(div1, p6);
    			p6.innerHTML = raw7_value;
    			append_dev(div1, t16);
    			append_dev(div1, p7);
    			p7.innerHTML = raw8_value;
    			append_dev(article, t17);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && img.src !== (img_src_value = "/" + /*post*/ ctx[2].imagen)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*elpost*/ 2 && img_alt_value !== (img_alt_value = /*post*/ ctx[2].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*elpost*/ 2 && raw0_value !== (raw0_value = /*post*/ ctx[2].content.h1 + "")) h3.innerHTML = raw0_value;			if (dirty & /*elpost*/ 2 && raw1_value !== (raw1_value = /*post*/ ctx[2].content.p + "")) p0.innerHTML = raw1_value;
    			if (/*post*/ ctx[2].content.blockquote) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(div1, t3);
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
    					if_block1.m(div1, t4);
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
    					if_block2.m(div1, t5);
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
    					if_block3.m(div1, t6);
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
    					if_block4.m(div1, t7);
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
    					if_block5.m(div1, t8);
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
    					if_block6.m(div1, t9);
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
    					if_block7 = create_if_block_1$3(ctx);
    					if_block7.c();
    					if_block7.m(div1, t14);
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
    		source: "(706:8) {#if (post.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (714:20) {#if post.content.blockquote}
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
    			attr_dev(strong, "class", "svelte-zh0tut");
    			add_location(strong, file$s, 715, 24, 15734);
    			attr_dev(small, "class", "svelte-zh0tut");
    			add_location(small, file$s, 716, 24, 15807);
    			attr_dev(blockquote, "class", "svelte-zh0tut");
    			add_location(blockquote, file$s, 714, 20, 15697);
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
    		source: "(714:20) {#if post.content.blockquote}",
    		ctx
    	});

    	return block;
    }

    // (720:20) {#if post.content.p2}
    function create_if_block_7(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p2 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-zh0tut");
    			add_location(p, file$s, 720, 24, 15982);
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
    		source: "(720:20) {#if post.content.p2}",
    		ctx
    	});

    	return block;
    }

    // (723:20) {#if post.content.p3}
    function create_if_block_6(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p3 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-zh0tut");
    			add_location(p, file$s, 723, 24, 16106);
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
    		source: "(723:20) {#if post.content.p3}",
    		ctx
    	});

    	return block;
    }

    // (726:20) {#if post.content.p4}
    function create_if_block_5(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p4 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-zh0tut");
    			add_location(p, file$s, 726, 24, 16230);
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
    		source: "(726:20) {#if post.content.p4}",
    		ctx
    	});

    	return block;
    }

    // (729:20) {#if post.content.p5}
    function create_if_block_4(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p5 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-zh0tut");
    			add_location(p, file$s, 729, 24, 16354);
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
    		source: "(729:20) {#if post.content.p5}",
    		ctx
    	});

    	return block;
    }

    // (732:20) {#if post.content.p6}
    function create_if_block_3$1(ctx) {
    	let p;
    	let raw_value = /*post*/ ctx[2].content.p6 + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "svelte-zh0tut");
    			add_location(p, file$s, 732, 24, 16478);
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
    		source: "(732:20) {#if post.content.p6}",
    		ctx
    	});

    	return block;
    }

    // (735:20) {#if post.content.img1}
    function create_if_block_2$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/" + /*post*/ ctx[2].content.img1)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Imagen");
    			attr_dev(img, "class", "svelte-zh0tut");
    			add_location(img, file$s, 735, 24, 16604);
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
    		source: "(735:20) {#if post.content.img1}",
    		ctx
    	});

    	return block;
    }

    // (742:20) {#if post.content.img2}
    function create_if_block_1$3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "/" + /*post*/ ctx[2].content.img2)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Imagen");
    			attr_dev(img, "class", "svelte-zh0tut");
    			add_location(img, file$s, 742, 24, 16950);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(742:20) {#if post.content.img2}",
    		ctx
    	});

    	return block;
    }

    // (705:8) {#each elpost as post}
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
    		source: "(705:8) {#each elpost as post}",
    		ctx
    	});

    	return block;
    }

    // (703:8) <Area>
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

    			attr_dev(div, "class", "Post svelte-zh0tut");
    			add_location(div, file$s, 703, 8, 15218);
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
    		source: "(703:8) <Area>",
    		ctx
    	});

    	return block;
    }

    // (702:4) <ContentArea>
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

    			if (dirty & /*$$scope, elpost, slug*/ 131) {
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
    		source: "(702:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (701:0) <Content>
    function create_default_slot$2(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope, elpost, slug*/ 131) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(701:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let t0;
    	let t1;
    	let content;
    	let current;
    	let each_value_1 = /*elpost*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
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
    				each_value_1 = /*elpost*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const content_changes = {};

    			if (dirty & /*$$scope, elpost, slug*/ 131) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { slug: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "U5Bslugu5D",
    			options,
    			id: create_fragment$t.name
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
    const file$t = "src/pages/blog/index.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (663:8) <Card          title={post.title}         description={post.excerpt}         image={post.imagen}         variante={4}>
    function create_default_slot_3$1(ctx) {
    	let a;
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("Read >");
    			t1 = space();
    			attr_dev(a, "href", a_href_value = "/blog/" + /*$url*/ ctx[1](/*post*/ ctx[2].slug));
    			attr_dev(a, "class", "svelte-129vup");
    			add_location(a, file$t, 667, 10, 14582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url, posts*/ 3 && a_href_value !== (a_href_value = "/blog/" + /*$url*/ ctx[1](/*post*/ ctx[2].slug))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(663:8) <Card          title={post.title}         description={post.excerpt}         image={post.imagen}         variante={4}>",
    		ctx
    	});

    	return block;
    }

    // (662:6) {#each posts as post}
    function create_each_block$5(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: /*post*/ ctx[2].title,
    				description: /*post*/ ctx[2].excerpt,
    				image: /*post*/ ctx[2].imagen,
    				variante: 4,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
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
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*posts*/ 1) card_changes.title = /*post*/ ctx[2].title;
    			if (dirty & /*posts*/ 1) card_changes.description = /*post*/ ctx[2].excerpt;
    			if (dirty & /*posts*/ 1) card_changes.image = /*post*/ ctx[2].imagen;

    			if (dirty & /*$$scope, $url, posts*/ 35) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
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
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(662:6) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    // (661:4) <Cards>
    function create_default_slot_2$2(ctx) {
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
    			if (dirty & /*posts, $url*/ 3) {
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(661:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (659:0) <ContentArea>
    function create_default_slot_1$2(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(659:0) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (658:0) <Content>
    function create_default_slot$3(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope, posts, $url*/ 35) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(658:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
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
    				$$slots: { default: [create_default_slot$3] },
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src/components/MainFeatures.svelte generated by Svelte v3.23.2 */
    const file$u = "src/components/MainFeatures.svelte";

    function create_fragment$v(ctx) {
    	let div3;
    	let div0;
    	let a0;
    	let h40;
    	let t1;
    	let p0;
    	let t3;
    	let small0;
    	let t5;
    	let div1;
    	let a1;
    	let h41;
    	let t7;
    	let p1;
    	let t9;
    	let small1;
    	let t11;
    	let div2;
    	let a2;
    	let h42;
    	let t13;
    	let p2;
    	let t15;
    	let small2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			h40 = element("h4");
    			h40.textContent = "Arte";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    			t3 = space();
    			small0 = element("small");
    			small0.textContent = "Learn more >";
    			t5 = space();
    			div1 = element("div");
    			a1 = element("a");
    			h41 = element("h4");
    			h41.textContent = "Diseño de interfaces";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    			t9 = space();
    			small1 = element("small");
    			small1.textContent = "Learn more >";
    			t11 = space();
    			div2 = element("div");
    			a2 = element("a");
    			h42 = element("h4");
    			h42.textContent = "Pensamento holístico";
    			t13 = space();
    			p2 = element("p");
    			p2.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    			t15 = space();
    			small2 = element("small");
    			small2.textContent = "Learn more >";
    			attr_dev(h40, "class", "svelte-trea1v");
    			add_location(h40, file$u, 683, 12, 15167);
    			attr_dev(p0, "class", "svelte-trea1v");
    			add_location(p0, file$u, 684, 12, 15193);
    			attr_dev(small0, "class", "svelte-trea1v");
    			add_location(small0, file$u, 685, 12, 15269);
    			attr_dev(a0, "href", "/styleguide");
    			attr_dev(a0, "class", "svelte-trea1v");
    			add_location(a0, file$u, 682, 8, 15132);
    			attr_dev(div0, "class", "svelte-trea1v");
    			add_location(div0, file$u, 681, 4, 15118);
    			attr_dev(h41, "class", "svelte-trea1v");
    			add_location(h41, file$u, 690, 12, 15374);
    			attr_dev(p1, "class", "svelte-trea1v");
    			add_location(p1, file$u, 691, 12, 15416);
    			attr_dev(small1, "class", "svelte-trea1v");
    			add_location(small1, file$u, 692, 12, 15492);
    			attr_dev(a1, "href", "/styleguide");
    			attr_dev(a1, "class", "svelte-trea1v");
    			add_location(a1, file$u, 689, 8, 15339);
    			attr_dev(div1, "class", "svelte-trea1v");
    			add_location(div1, file$u, 688, 4, 15325);
    			attr_dev(h42, "class", "svelte-trea1v");
    			add_location(h42, file$u, 697, 12, 15597);
    			attr_dev(p2, "class", "svelte-trea1v");
    			add_location(p2, file$u, 698, 12, 15639);
    			attr_dev(small2, "class", "svelte-trea1v");
    			add_location(small2, file$u, 699, 12, 15715);
    			attr_dev(a2, "href", "/styleguide");
    			attr_dev(a2, "class", "svelte-trea1v");
    			add_location(a2, file$u, 696, 8, 15562);
    			attr_dev(div2, "class", "svelte-trea1v");
    			add_location(div2, file$u, 695, 4, 15548);
    			attr_dev(div3, "class", "MainFeatures svelte-trea1v");
    			add_location(div3, file$u, 678, 0, 15048);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, a0);
    			append_dev(a0, h40);
    			append_dev(a0, t1);
    			append_dev(a0, p0);
    			append_dev(a0, t3);
    			append_dev(a0, small0);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, a1);
    			append_dev(a1, h41);
    			append_dev(a1, t7);
    			append_dev(a1, p1);
    			append_dev(a1, t9);
    			append_dev(a1, small1);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			append_dev(div2, a2);
    			append_dev(a2, h42);
    			append_dev(a2, t13);
    			append_dev(a2, p2);
    			append_dev(a2, t15);
    			append_dev(a2, small2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainFeatures> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("MainFeatures", $$slots, []);
    	$$self.$capture_state = () => ({ IconCuatro });
    	return [];
    }

    class MainFeatures extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainFeatures",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src/pages/index.svelte generated by Svelte v3.23.2 */

    // (712:6) <Banner variante={1}>
    function create_default_slot_3$2(ctx) {
    	let icontres;
    	let t;
    	let blockquote;
    	let current;
    	icontres = new IconTres({ $$inline: true });

    	blockquote = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "This is a Blockquote component into a Banner",
    				author: "Author"
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
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(712:6) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (717:8) <Banner>
    function create_default_slot_2$3(ctx) {
    	let blockquote;
    	let t;
    	let iconespiral;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				quote: "This is a blockquote",
    				author: "Author"
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
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(717:8) <Banner>",
    		ctx
    	});

    	return block;
    }

    // (679:4) <ContentArea>
    function create_default_slot_1$3(ctx) {
    	let mainfeatures;
    	let t0;
    	let banner0;
    	let t1;
    	let banner1;
    	let current;
    	mainfeatures = new MainFeatures({ $$inline: true });

    	banner0 = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner1 = new Banner({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainfeatures.$$.fragment);
    			t0 = space();
    			create_component(banner0.$$.fragment);
    			t1 = space();
    			create_component(banner1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainfeatures, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(banner0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(banner1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const banner0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				banner0_changes.$$scope = { dirty, ctx };
    			}

    			banner0.$set(banner0_changes);
    			const banner1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				banner1_changes.$$scope = { dirty, ctx };
    			}

    			banner1.$set(banner1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainfeatures.$$.fragment, local);
    			transition_in(banner0.$$.fragment, local);
    			transition_in(banner1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainfeatures.$$.fragment, local);
    			transition_out(banner0.$$.fragment, local);
    			transition_out(banner1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainfeatures, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(banner0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(banner1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(679:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (678:2) <Content>
    function create_default_slot$4(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope*/ 2) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(678:2) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let t0;
    	let pagetitle;
    	let t1;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "TODH",
    				pageSubTitle: "Visión holística y artefactos en torno a la Creación 👋"
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
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
    		Cards,
    		Card,
    		IconEspiral,
    		IconTres,
    		MainFeatures,
    		metatags
    	});

    	return [];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* src/pages/products/[slug].svelte generated by Svelte v3.23.2 */
    const file$v = "src/pages/products/[slug].svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (712:16) {#if (product.slug === slug)}
    function create_if_block$6(ctx) {
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
    	let main;
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
    			main = element("main");
    			h3 = element("h3");
    			t5 = space();
    			p = element("p");
    			if (img.src !== (img_src_value = "/" + /*product*/ ctx[3].imagen)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[3].title);
    			attr_dev(img, "class", "svelte-455itl");
    			add_location(img, file$v, 714, 24, 15928);
    			attr_dev(strong, "class", "svelte-455itl");
    			add_location(strong, file$v, 716, 28, 16072);
    			attr_dev(em, "class", "svelte-455itl");
    			add_location(em, file$v, 717, 28, 16134);
    			attr_dev(figcaption, "class", "ProductImgCaption svelte-455itl");
    			add_location(figcaption, file$v, 715, 24, 16005);
    			attr_dev(figure, "class", "ProductImgContainer svelte-455itl");
    			add_location(figure, file$v, 713, 20, 15867);
    			attr_dev(article, "class", "ProductArticle svelte-455itl");
    			add_location(article, file$v, 712, 16, 15814);
    			attr_dev(h3, "class", "svelte-455itl");
    			add_location(h3, file$v, 722, 20, 16326);
    			attr_dev(p, "class", "svelte-455itl");
    			add_location(p, file$v, 723, 20, 16382);
    			attr_dev(main, "class", "ProductContent svelte-455itl");
    			add_location(main, file$v, 721, 16, 16276);
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
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			h3.innerHTML = raw0_value;
    			append_dev(main, t5);
    			append_dev(main, p);
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
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(712:16) {#if (product.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (711:12) {#each productos as product}
    function create_each_block_1$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*product*/ ctx[3].slug === /*slug*/ ctx[0] && create_if_block$6(ctx);

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
    					if_block = create_if_block$6(ctx);
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
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(711:12) {#each productos as product}",
    		ctx
    	});

    	return block;
    }

    // (729:20) {#each productos as product}
    function create_each_block$6(ctx) {
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
    			attr_dev(img, "class", "svelte-455itl");
    			add_location(img, file$v, 730, 20, 16685);
    			attr_dev(a, "href", a_href_value = /*product*/ ctx[3].slug);
    			attr_dev(a, "class", "svelte-455itl");
    			toggle_class(a, "selected", /*$isActive*/ ctx[2](/*product*/ ctx[3].thumb));
    			add_location(a, file$v, 729, 20, 16595);
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(729:20) {#each productos as product}",
    		ctx
    	});

    	return block;
    }

    // (709:4) <ContentArea>
    function create_default_slot_1$4(ctx) {
    	let div;
    	let t;
    	let nav;
    	let each_value_1 = /*productos*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*productos*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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

    			attr_dev(nav, "class", "ProductNav svelte-455itl");
    			add_location(nav, file$v, 727, 16, 16501);
    			attr_dev(div, "class", "Product svelte-455itl");
    			add_location(div, file$v, 709, 8, 15689);
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
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
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
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(709:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (708:0) <Content>
    function create_default_slot$5(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope, productos, $isActive, slug*/ 263) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(708:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { slug: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "U5Bslugu5D",
    			options,
    			id: create_fragment$x.name
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
    const file$w = "src/pages/products/index.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (665:6) <Card        title={producto.title}        description={producto.description}        image={producto.imagen}       variante={3}>
    function create_default_slot_4$1(ctx) {
    	let a;
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("Read >");
    			t1 = space();
    			attr_dev(a, "href", a_href_value = "/products/" + /*$url*/ ctx[1](/*producto*/ ctx[2].slug));
    			attr_dev(a, "class", "svelte-129vup");
    			add_location(a, file$w, 669, 8, 14777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$url, productos*/ 3 && a_href_value !== (a_href_value = "/products/" + /*$url*/ ctx[1](/*producto*/ ctx[2].slug))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(665:6) <Card        title={producto.title}        description={producto.description}        image={producto.imagen}       variante={3}>",
    		ctx
    	});

    	return block;
    }

    // (664:6) {#each productos as producto}
    function create_each_block$7(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: /*producto*/ ctx[2].title,
    				description: /*producto*/ ctx[2].description,
    				image: /*producto*/ ctx[2].imagen,
    				variante: 3,
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
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
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*productos*/ 1) card_changes.title = /*producto*/ ctx[2].title;
    			if (dirty & /*productos*/ 1) card_changes.description = /*producto*/ ctx[2].description;
    			if (dirty & /*productos*/ 1) card_changes.image = /*producto*/ ctx[2].imagen;

    			if (dirty & /*$$scope, $url, productos*/ 35) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
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
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(664:6) {#each productos as producto}",
    		ctx
    	});

    	return block;
    }

    // (663:4) <Cards>
    function create_default_slot_3$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*productos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
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
    			if (dirty & /*productos, $url*/ 3) {
    				each_value = /*productos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(663:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (675:2) <Banner variante={0}>
    function create_default_slot_2$4(ctx) {
    	let iconespiral;
    	let t;
    	let blockquote;
    	let current;
    	iconespiral = new IconEspiral({ $$inline: true });

    	blockquote = new BlockQuote({
    			props: {
    				variante: 0,
    				quote: "This is a blockquote",
    				author: "Author"
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
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(675:2) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (661:2) <ContentArea>
    function create_default_slot_1$5(ctx) {
    	let cards;
    	let t;
    	let banner;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_2$4] },
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
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(661:2) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (660:0) <Content>
    function create_default_slot$6(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope, productos, $url*/ 35) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(660:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
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
    				$$slots: { default: [create_default_slot$6] },
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
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* node_modules/svelte-swipe/src/Swipe.svelte generated by Svelte v3.23.2 */
    const file$x = "node_modules/svelte-swipe/src/Swipe.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    // (268:3) {#if showIndicators}
    function create_if_block$7(ctx) {
    	let div;
    	let each_value = /*indicators*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "swipe-indicator swipe-indicator-inside svelte-hja3vj");
    			add_location(div, file$x, 268, 5, 6444);
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
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(268:3) {#if showIndicators}",
    		ctx
    	});

    	return block;
    }

    // (270:8) {#each indicators as x, i }
    function create_each_block$8(ctx) {
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

    			add_location(span, file$x, 270, 10, 6545);
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
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(270:8) {#each indicators as x, i }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
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
    	let if_block = /*showIndicators*/ ctx[0] && create_if_block$7(ctx);

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
    			add_location(div0, file$x, 261, 6, 6209);
    			attr_dev(div1, "class", "swipeable-items svelte-hja3vj");
    			add_location(div1, file$x, 260, 4, 6172);
    			attr_dev(div2, "class", "swipe-item-wrapper svelte-hja3vj");
    			add_location(div2, file$x, 259, 2, 6109);
    			attr_dev(div3, "class", "swipe-handler svelte-hja3vj");
    			add_location(div3, file$x, 266, 2, 6303);
    			attr_dev(div4, "class", "swipe-panel svelte-hja3vj");
    			add_location(div4, file$x, 258, 0, 6080);
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
    					if_block = create_if_block$7(ctx);
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
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
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
    			instance$z,
    			create_fragment$z,
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
    			id: create_fragment$z.name
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

    const file$y = "node_modules/svelte-swipe/src/SwipeItem.svelte";

    function create_fragment$A(ctx) {
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
    			add_location(div, file$y, 15, 0, 224);
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
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { classes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SwipeItem",
    			options,
    			id: create_fragment$A.name
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

    const file$z = "src/components/ToggleMenu.svelte";

    // (9:8) {:else}
    function create_else_block$2(ctx) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(9:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#if showControls}
    function create_if_block_1$4(ctx) {
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(7:8) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if showControls}
    function create_if_block$8(ctx) {
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
    			add_location(li0, file$z, 15, 12, 303);
    			add_location(li1, file$z, 16, 12, 336);
    			add_location(li2, file$z, 17, 12, 369);
    			add_location(ul, file$z, 14, 8, 286);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(14:4) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let div;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*showControls*/ ctx[0]) return create_if_block_1$4;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*showControls*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(button, file$z, 5, 4, 124);
    			add_location(div, file$z, 4, 0, 114);
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
    					if_block1 = create_if_block$8(ctx);
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
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleMenu",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.23.2 */

    const file$A = "src/components/Button.svelte";

    function create_fragment$C(ctx) {
    	let button;
    	let t;
    	let button_class_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*modificador*/ ctx[2][/*variante*/ ctx[1]]) + " svelte-123ntdx"));
    			add_location(button, file$A, 644, 0, 13881);
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

    			if (dirty & /*variante*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*modificador*/ ctx[2][/*variante*/ ctx[1]]) + " svelte-123ntdx"))) {
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
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { text: 0, variante: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$C.name
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

    /* src/components/Tabs.svelte generated by Svelte v3.23.2 */
    const file$B = "src/components/Tabs.svelte";

    function create_fragment$D(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tabs svelte-jaifg0");
    			add_location(div, file$B, 679, 0, 14720);
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
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function instance$D($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src/components/TabList.svelte generated by Svelte v3.23.2 */

    const file$C = "src/components/TabList.svelte";

    function create_fragment$E(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-list svelte-1sly4ce");
    			add_location(div, file$C, 0, 0, 0);
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
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src/components/TabPanel.svelte generated by Svelte v3.23.2 */

    // (11:0) {#if $selectedPanel === panel}
    function create_if_block$9(ctx) {
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(11:0) {#if $selectedPanel === panel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1] && create_if_block$9(ctx);

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
    					if_block = create_if_block$9(ctx);
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
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    /* src/components/Tab.svelte generated by Svelte v3.23.2 */
    const file$D = "src/components/Tab.svelte";

    function create_fragment$G(ctx) {
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
    			attr_dev(button, "class", "svelte-eassva");
    			toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			add_location(button, file$D, 641, 0, 13835);
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
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$G.name
    		});
    	}
    }

    /* src/pages/styleguide.svelte generated by Svelte v3.23.2 */
    const file$E = "src/pages/styleguide.svelte";

    // (676:4) <Area title="Typography">
    function create_default_slot_39(ctx) {
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let h3;
    	let t5;
    	let h4;
    	let t7;
    	let h5;
    	let t9;
    	let p0;
    	let t11;
    	let blockquote;
    	let t12;
    	let p1;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				variante: 1,
    				quote: "El hombre inteligente no es el que tiene muchas ideas, sino el que sabe sacar provecho de las pocas que tiene.",
    				author: "J. Dotras"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "h1 Main title";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "h2 Subtitle";
    			t3 = space();
    			h3 = element("h3");
    			h3.textContent = "h3 Header";
    			t5 = space();
    			h4 = element("h4");
    			h4.textContent = "h4 Header";
    			t7 = space();
    			h5 = element("h5");
    			h5.textContent = "h5 Header";
    			t9 = space();
    			p0 = element("p");
    			p0.textContent = "La ignorancia de lo que hay de mejor (en el hombre) sirve fatalmente a lo que de peor hay en él. (Hierocles)";
    			t11 = space();
    			create_component(blockquote.$$.fragment);
    			t12 = space();
    			p1 = element("p");
    			p1.textContent = "La ciencia no puede resolver el último misterio de la naturaleza. Y eso se debe a que, en última instancia, nosotros mismos somos una parte del misterio que estamos tratando de resolver. __Max Planck";
    			attr_dev(h1, "class", "svelte-b8nhnd");
    			add_location(h1, file$E, 676, 8, 15202);
    			attr_dev(h2, "class", "svelte-b8nhnd");
    			add_location(h2, file$E, 677, 8, 15233);
    			attr_dev(h3, "class", "svelte-b8nhnd");
    			add_location(h3, file$E, 678, 8, 15262);
    			attr_dev(h4, "class", "svelte-b8nhnd");
    			add_location(h4, file$E, 679, 8, 15289);
    			attr_dev(h5, "class", "svelte-b8nhnd");
    			add_location(h5, file$E, 680, 8, 15316);
    			attr_dev(p0, "class", "svelte-b8nhnd");
    			add_location(p0, file$E, 681, 8, 15343);
    			attr_dev(p1, "class", "svelte-b8nhnd");
    			add_location(p1, file$E, 685, 8, 15651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(blockquote, target, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p1, anchor);
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
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t11);
    			destroy_component(blockquote, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_39.name,
    		type: "slot",
    		source: "(676:4) <Area title=\\\"Typography\\\">",
    		ctx
    	});

    	return block;
    }

    // (690:4) <Area title="Icons and graphics">
    function create_default_slot_38(ctx) {
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
    			attr_dev(div0, "class", "svelte-b8nhnd");
    			add_location(div0, file$E, 690, 8, 15922);
    			attr_dev(div1, "class", "svelte-b8nhnd");
    			add_location(div1, file$E, 694, 8, 16001);
    			attr_dev(div2, "class", "svelte-b8nhnd");
    			add_location(div2, file$E, 698, 8, 16101);
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
    		id: create_default_slot_38.name,
    		type: "slot",
    		source: "(690:4) <Area title=\\\"Icons and graphics\\\">",
    		ctx
    	});

    	return block;
    }

    // (706:8) <Figure caption="The caption">
    function create_default_slot_37(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Alt text");
    			attr_dev(img, "class", "svelte-b8nhnd");
    			add_location(img, file$E, 706, 12, 16274);
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
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(706:8) <Figure caption=\\\"The caption\\\">",
    		ctx
    	});

    	return block;
    }

    // (705:4) <Area title="Figure">
    function create_default_slot_36(ctx) {
    	let figure;
    	let current;

    	figure = new Figure({
    			props: {
    				caption: "The caption",
    				$$slots: { default: [create_default_slot_37] },
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

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(705:4) <Area title=\\\"Figure\\\">",
    		ctx
    	});

    	return block;
    }

    // (711:4) <Area title="Toggle Menu">
    function create_default_slot_35(ctx) {
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
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(711:4) <Area title=\\\"Toggle Menu\\\">",
    		ctx
    	});

    	return block;
    }

    // (715:4) <Area title="Buttons">
    function create_default_slot_34(ctx) {
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
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(715:4) <Area title=\\\"Buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (720:4) <Area title="Brand">
    function create_default_slot_33(ctx) {
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
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(720:4) <Area title=\\\"Brand\\\">",
    		ctx
    	});

    	return block;
    }

    // (724:4) <Area title="Colors">
    function create_default_slot_32(ctx) {
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
    			attr_dev(div0, "class", "svelte-b8nhnd");
    			add_location(div0, file$E, 725, 12, 16685);
    			attr_dev(div1, "class", "svelte-b8nhnd");
    			add_location(div1, file$E, 726, 12, 16709);
    			attr_dev(div2, "class", "svelte-b8nhnd");
    			add_location(div2, file$E, 727, 12, 16733);
    			attr_dev(div3, "class", "svelte-b8nhnd");
    			add_location(div3, file$E, 728, 12, 16757);
    			attr_dev(div4, "class", "svelte-b8nhnd");
    			add_location(div4, file$E, 729, 12, 16781);
    			attr_dev(div5, "class", "svelte-b8nhnd");
    			add_location(div5, file$E, 730, 12, 16805);
    			attr_dev(div6, "class", "svelte-b8nhnd");
    			add_location(div6, file$E, 731, 12, 16829);
    			attr_dev(div7, "class", "svelte-b8nhnd");
    			add_location(div7, file$E, 732, 12, 16853);
    			attr_dev(div8, "class", "svelte-b8nhnd");
    			add_location(div8, file$E, 733, 12, 16877);
    			attr_dev(div9, "class", "svelte-b8nhnd");
    			add_location(div9, file$E, 734, 12, 16901);
    			attr_dev(div10, "class", "svelte-b8nhnd");
    			add_location(div10, file$E, 735, 12, 16925);
    			attr_dev(div11, "class", "svelte-b8nhnd");
    			add_location(div11, file$E, 736, 12, 16949);
    			attr_dev(div12, "class", "svelte-b8nhnd");
    			add_location(div12, file$E, 737, 12, 16973);
    			attr_dev(div13, "class", "svelte-b8nhnd");
    			add_location(div13, file$E, 738, 12, 16997);
    			attr_dev(div14, "class", "svelte-b8nhnd");
    			add_location(div14, file$E, 739, 12, 17021);
    			attr_dev(div15, "class", "svelte-b8nhnd");
    			add_location(div15, file$E, 740, 12, 17045);
    			attr_dev(div16, "class", "svelte-b8nhnd");
    			add_location(div16, file$E, 741, 12, 17069);
    			attr_dev(div17, "class", "svelte-b8nhnd");
    			add_location(div17, file$E, 742, 12, 17093);
    			attr_dev(div18, "class", "svelte-b8nhnd");
    			add_location(div18, file$E, 743, 12, 17117);
    			attr_dev(div19, "class", "svelte-b8nhnd");
    			add_location(div19, file$E, 744, 12, 17141);
    			attr_dev(div20, "class", "Colors svelte-b8nhnd");
    			add_location(div20, file$E, 724, 8, 16652);
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
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(724:4) <Area title=\\\"Colors\\\">",
    		ctx
    	});

    	return block;
    }

    // (749:4) <Area title="Grid Layout">
    function create_default_slot_31(ctx) {
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
    			attr_dev(div0, "class", "StyleGuide Main__brand svelte-b8nhnd");
    			add_location(div0, file$E, 750, 12, 17262);
    			attr_dev(div1, "class", "StyleGuide  Main__nav svelte-b8nhnd");
    			add_location(div1, file$E, 751, 12, 17317);
    			attr_dev(div2, "class", "StyleGuide  Main__header svelte-b8nhnd");
    			add_location(div2, file$E, 752, 12, 17371);
    			attr_dev(div3, "class", "StyleGuide  Content__header svelte-b8nhnd");
    			add_location(div3, file$E, 755, 20, 17538);
    			attr_dev(div4, "class", "StyleGuide  Content__nav svelte-b8nhnd");
    			add_location(div4, file$E, 756, 20, 17606);
    			attr_dev(article0, "class", "StyleGuide  Area svelte-b8nhnd");
    			add_location(article0, file$E, 758, 24, 17735);
    			attr_dev(article1, "class", "StyleGuide  Area svelte-b8nhnd");
    			add_location(article1, file$E, 759, 24, 17804);
    			attr_dev(article2, "class", "StyleGuide  Area svelte-b8nhnd");
    			add_location(article2, file$E, 760, 24, 17873);
    			attr_dev(div5, "class", "StyleGuide  Content__area svelte-b8nhnd");
    			add_location(div5, file$E, 757, 20, 17671);
    			attr_dev(div6, "class", "StyleGuide  Content__footer svelte-b8nhnd");
    			add_location(div6, file$E, 762, 20, 17965);
    			attr_dev(div7, "class", "StyleGuide  Content svelte-b8nhnd");
    			add_location(div7, file$E, 754, 16, 17484);
    			attr_dev(div8, "class", "StyleGuide  Main__content svelte-b8nhnd");
    			add_location(div8, file$E, 753, 12, 17428);
    			attr_dev(div9, "class", "StyleGuide  Main__footer svelte-b8nhnd");
    			add_location(div9, file$E, 765, 12, 18067);
    			attr_dev(div10, "class", "StyleGuide  Main__totop svelte-b8nhnd");
    			add_location(div10, file$E, 766, 12, 18124);
    			attr_dev(div11, "class", "StyleGuide Main svelte-b8nhnd");
    			add_location(div11, file$E, 749, 8, 17220);
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
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(749:4) <Area title=\\\"Grid Layout\\\">",
    		ctx
    	});

    	return block;
    }

    // (771:4) <Area title="Full Simple Card">
    function create_default_slot_30(ctx) {
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
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(771:4) <Area title=\\\"Full Simple Card\\\">",
    		ctx
    	});

    	return block;
    }

    // (780:12) <Card              title="Title" description="El ojo que ves no es ojo porque tú lo veas; es ojo porque te ve. (Antonio Machado)"             variante={1}             >
    function create_default_slot_29(ctx) {
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
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(780:12) <Card              title=\\\"Title\\\" description=\\\"El ojo que ves no es ojo porque tú lo veas; es ojo porque te ve. (Antonio Machado)\\\"             variante={1}             >",
    		ctx
    	});

    	return block;
    }

    // (798:16) <span slot="hasSvg">
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
    			attr_dev(circle0, "class", "svelte-b8nhnd");
    			add_location(circle0, file$E, 800, 16, 19433);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.668)");
    			attr_dev(circle1, "class", "svelte-b8nhnd");
    			add_location(circle1, file$E, 802, 16, 19614);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.03822 0 0 .03822 -493.61 -33.668)");
    			attr_dev(circle2, "class", "svelte-b8nhnd");
    			add_location(circle2, file$E, 804, 24, 19801);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "fill", "none");
    			attr_dev(circle3, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle3, "stroke-width", "13.08");
    			attr_dev(circle3, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle3, "class", "svelte-b8nhnd");
    			add_location(circle3, file$E, 806, 24, 20003);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-b8nhnd");
    			add_location(svg, file$E, 798, 16, 19252);
    			attr_dev(span, "slot", "hasSvg");
    			attr_dev(span, "class", "svelte-b8nhnd");
    			add_location(span, file$E, 797, 16, 19215);
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
    		source: "(798:16) <span slot=\\\"hasSvg\\\">",
    		ctx
    	});

    	return block;
    }

    // (779:8) <Cards>
    function create_default_slot_27(ctx) {
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
    				$$slots: { default: [create_default_slot_29] },
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

    			if (dirty & /*$$scope*/ 32) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(779:8) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (778:4) <Area title="Group Cards">
    function create_default_slot_26(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_27] },
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

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(778:4) <Area title=\\\"Group Cards\\\">",
    		ctx
    	});

    	return block;
    }

    // (825:4) <Area title="Images">
    function create_default_slot_25(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-b8nhnd");
    			add_location(img, file$E, 825, 8, 20968);
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
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(825:4) <Area title=\\\"Images\\\">",
    		ctx
    	});

    	return block;
    }

    // (829:4) <Banner variante={0}>
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
    		source: "(829:4) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (834:4) <Banner variante={1}>
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
    		source: "(834:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (838:4) <Banner variante={2}>
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
    		source: "(838:4) <Banner variante={2}>",
    		ctx
    	});

    	return block;
    }

    // (845:16) <Tab>
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
    		source: "(845:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (846:16) <Tab>
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
    		source: "(846:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (847:16) <Tab>
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
    		source: "(847:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (848:16) <Tab>
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
    		source: "(848:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (844:12) <TabList>
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

    			if (dirty & /*$$scope*/ 32) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    			const tab2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				tab2_changes.$$scope = { dirty, ctx };
    			}

    			tab2.$set(tab2_changes);
    			const tab3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
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
    		source: "(844:12) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (851:12) <TabPanel>
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
    		source: "(851:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (855:12) <TabPanel>
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
    		source: "(855:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (859:12) <TabPanel>
    function create_default_slot_14$1(ctx) {
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
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(859:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (863:12) <TabPanel>
    function create_default_slot_13$1(ctx) {
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
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(863:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (843:8) <Tabs>
    function create_default_slot_12$1(ctx) {
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
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel3 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_13$1] },
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

    			if (dirty & /*$$scope*/ 32) {
    				tablist_changes.$$scope = { dirty, ctx };
    			}

    			tablist.$set(tablist_changes);
    			const tabpanel0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				tabpanel0_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel0.$set(tabpanel0_changes);
    			const tabpanel1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				tabpanel1_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel1.$set(tabpanel1_changes);
    			const tabpanel2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				tabpanel2_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel2.$set(tabpanel2_changes);
    			const tabpanel3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(843:8) <Tabs>",
    		ctx
    	});

    	return block;
    }

    // (842:4) <Area title="Tabs">
    function create_default_slot_11$1(ctx) {
    	let tabs;
    	let current;

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot_12$1] },
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

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(842:4) <Area title=\\\"Tabs\\\">",
    		ctx
    	});

    	return block;
    }

    // (869:4) <Area title="Component Header">
    function create_default_slot_10$1(ctx) {
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
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(869:4) <Area title=\\\"Component Header\\\">",
    		ctx
    	});

    	return block;
    }

    // (893:10) <SwipeItem>
    function create_default_slot_9$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-b8nhnd");
    			add_location(img, file$E, 893, 12, 22902);
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
    		source: "(893:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (896:10) <SwipeItem>
    function create_default_slot_8$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img4.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-b8nhnd");
    			add_location(img, file$E, 896, 12, 22991);
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
    		source: "(896:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (899:10) <SwipeItem>
    function create_default_slot_7$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img2.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-b8nhnd");
    			add_location(img, file$E, 899, 12, 23080);
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
    		source: "(899:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (902:10) <SwipeItem>
    function create_default_slot_6$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img3.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-b8nhnd");
    			add_location(img, file$E, 902, 12, 23169);
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
    		source: "(902:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (892:8) <Swipe {showIndicators} {autoplay} {delay} {transitionDuration} {defaultIndex}>
    function create_default_slot_5$1(ctx) {
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

    			if (dirty & /*$$scope*/ 32) {
    				swipeitem0_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem0.$set(swipeitem0_changes);
    			const swipeitem1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				swipeitem1_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem1.$set(swipeitem1_changes);
    			const swipeitem2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				swipeitem2_changes.$$scope = { dirty, ctx };
    			}

    			swipeitem2.$set(swipeitem2_changes);
    			const swipeitem3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(892:8) <Swipe {showIndicators} {autoplay} {delay} {transitionDuration} {defaultIndex}>",
    		ctx
    	});

    	return block;
    }

    // (908:6) <Banner variante={0}>
    function create_default_slot_4$2(ctx) {
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
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(908:6) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (912:4) <Banner variante={1}>
    function create_default_slot_3$4(ctx) {
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
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(912:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (916:4) <Banner variante={2}>
    function create_default_slot_2$5(ctx) {
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
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(916:4) <Banner variante={2}>",
    		ctx
    	});

    	return block;
    }

    // (674:0) <ContentArea>
    function create_default_slot_1$6(ctx) {
    	let area0;
    	let t0;
    	let area1;
    	let t1;
    	let area2;
    	let t2;
    	let area3;
    	let t3;
    	let area4;
    	let t4;
    	let area5;
    	let t5;
    	let area6;
    	let t6;
    	let area7;
    	let t7;
    	let area8;
    	let t8;
    	let area9;
    	let t9;
    	let area10;
    	let t10;
    	let banner0;
    	let t11;
    	let banner1;
    	let t12;
    	let banner2;
    	let t13;
    	let area11;
    	let t14;
    	let area12;
    	let t15;
    	let div;
    	let swipe;
    	let t16;
    	let banner3;
    	let t17;
    	let banner4;
    	let t18;
    	let banner5;
    	let current;

    	area0 = new Area({
    			props: {
    				title: "Typography",
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				title: "Icons and graphics",
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area2 = new Area({
    			props: {
    				title: "Figure",
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area3 = new Area({
    			props: {
    				title: "Toggle Menu",
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area4 = new Area({
    			props: {
    				title: "Buttons",
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area5 = new Area({
    			props: {
    				title: "Brand",
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area6 = new Area({
    			props: {
    				title: "Colors",
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area7 = new Area({
    			props: {
    				title: "Grid Layout",
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area8 = new Area({
    			props: {
    				title: "Full Simple Card",
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area9 = new Area({
    			props: {
    				title: "Group Cards",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area10 = new Area({
    			props: {
    				title: "Images",
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

    	area11 = new Area({
    			props: {
    				title: "Tabs",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area12 = new Area({
    			props: {
    				title: "Component Header",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swipe = new Swipe({
    			props: {
    				showIndicators: /*showIndicators*/ ctx[2],
    				autoplay: /*autoplay*/ ctx[0],
    				delay: /*delay*/ ctx[1],
    				transitionDuration: /*transitionDuration*/ ctx[3],
    				defaultIndex: /*defaultIndex*/ ctx[4],
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner3 = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner4 = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner5 = new Banner({
    			props: {
    				variante: 2,
    				$$slots: { default: [create_default_slot_2$5] },
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
    			create_component(area4.$$.fragment);
    			t4 = space();
    			create_component(area5.$$.fragment);
    			t5 = space();
    			create_component(area6.$$.fragment);
    			t6 = space();
    			create_component(area7.$$.fragment);
    			t7 = space();
    			create_component(area8.$$.fragment);
    			t8 = space();
    			create_component(area9.$$.fragment);
    			t9 = space();
    			create_component(area10.$$.fragment);
    			t10 = space();
    			create_component(banner0.$$.fragment);
    			t11 = space();
    			create_component(banner1.$$.fragment);
    			t12 = space();
    			create_component(banner2.$$.fragment);
    			t13 = space();
    			create_component(area11.$$.fragment);
    			t14 = space();
    			create_component(area12.$$.fragment);
    			t15 = space();
    			div = element("div");
    			create_component(swipe.$$.fragment);
    			t16 = space();
    			create_component(banner3.$$.fragment);
    			t17 = space();
    			create_component(banner4.$$.fragment);
    			t18 = space();
    			create_component(banner5.$$.fragment);
    			attr_dev(div, "class", "swipe-holder svelte-b8nhnd");
    			add_location(div, file$E, 890, 4, 22753);
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
    			mount_component(area4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(area5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(area6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(area7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(area8, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(area9, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(area10, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(banner0, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(banner1, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(banner2, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(area11, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(area12, target, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(swipe, div, null);
    			insert_dev(target, t16, anchor);
    			mount_component(banner3, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(banner4, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(banner5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const area1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area1_changes.$$scope = { dirty, ctx };
    			}

    			area1.$set(area1_changes);
    			const area2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area2_changes.$$scope = { dirty, ctx };
    			}

    			area2.$set(area2_changes);
    			const area3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area3_changes.$$scope = { dirty, ctx };
    			}

    			area3.$set(area3_changes);
    			const area4_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area4_changes.$$scope = { dirty, ctx };
    			}

    			area4.$set(area4_changes);
    			const area5_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area5_changes.$$scope = { dirty, ctx };
    			}

    			area5.$set(area5_changes);
    			const area6_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area6_changes.$$scope = { dirty, ctx };
    			}

    			area6.$set(area6_changes);
    			const area7_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area7_changes.$$scope = { dirty, ctx };
    			}

    			area7.$set(area7_changes);
    			const area8_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area8_changes.$$scope = { dirty, ctx };
    			}

    			area8.$set(area8_changes);
    			const area9_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area9_changes.$$scope = { dirty, ctx };
    			}

    			area9.$set(area9_changes);
    			const area10_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area10_changes.$$scope = { dirty, ctx };
    			}

    			area10.$set(area10_changes);
    			const banner0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner0_changes.$$scope = { dirty, ctx };
    			}

    			banner0.$set(banner0_changes);
    			const banner1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner1_changes.$$scope = { dirty, ctx };
    			}

    			banner1.$set(banner1_changes);
    			const banner2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner2_changes.$$scope = { dirty, ctx };
    			}

    			banner2.$set(banner2_changes);
    			const area11_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area11_changes.$$scope = { dirty, ctx };
    			}

    			area11.$set(area11_changes);
    			const area12_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area12_changes.$$scope = { dirty, ctx };
    			}

    			area12.$set(area12_changes);
    			const swipe_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				swipe_changes.$$scope = { dirty, ctx };
    			}

    			swipe.$set(swipe_changes);
    			const banner3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner3_changes.$$scope = { dirty, ctx };
    			}

    			banner3.$set(banner3_changes);
    			const banner4_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner4_changes.$$scope = { dirty, ctx };
    			}

    			banner4.$set(banner4_changes);
    			const banner5_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner5_changes.$$scope = { dirty, ctx };
    			}

    			banner5.$set(banner5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
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
    			transition_in(banner0.$$.fragment, local);
    			transition_in(banner1.$$.fragment, local);
    			transition_in(banner2.$$.fragment, local);
    			transition_in(area11.$$.fragment, local);
    			transition_in(area12.$$.fragment, local);
    			transition_in(swipe.$$.fragment, local);
    			transition_in(banner3.$$.fragment, local);
    			transition_in(banner4.$$.fragment, local);
    			transition_in(banner5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
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
    			transition_out(banner0.$$.fragment, local);
    			transition_out(banner1.$$.fragment, local);
    			transition_out(banner2.$$.fragment, local);
    			transition_out(area11.$$.fragment, local);
    			transition_out(area12.$$.fragment, local);
    			transition_out(swipe.$$.fragment, local);
    			transition_out(banner3.$$.fragment, local);
    			transition_out(banner4.$$.fragment, local);
    			transition_out(banner5.$$.fragment, local);
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
    			destroy_component(area4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(area5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(area6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(area7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(area8, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(area9, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(area10, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(banner0, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(banner1, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(banner2, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(area11, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(area12, detaching);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div);
    			destroy_component(swipe);
    			if (detaching) detach_dev(t16);
    			destroy_component(banner3, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(banner4, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(banner5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(674:0) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (673:0) <Content>
    function create_default_slot$7(ctx) {
    	let contentarea;
    	let current;

    	contentarea = new ContentArea({
    			props: {
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentarea_changes = {};

    			if (dirty & /*$$scope*/ 32) {
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
    			destroy_component(contentarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(673:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let pagetitle;
    	let t;
    	let content;
    	let current;

    	pagetitle = new PageTitle({
    			props: {
    				pageTitle: "Design System",
    				pageSubTitle: "Living styleguide 👋"
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
    			create_component(pagetitle.$$.fragment);
    			t = space();
    			create_component(content.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagetitle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope*/ 32) {
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
    			if (detaching) detach_dev(t);
    			destroy_component(content, detaching);
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
    	let autoplay = false;
    	let delay = 2000; //ms
    	let showIndicators = false;
    	let transitionDuration = 1000; //ms
    	let defaultIndex = 3; //start from 0
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
    		ToggleMenu,
    		BlockQuote,
    		Button,
    		Cards,
    		Card,
    		SiteBrand,
    		List,
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
    		defaultIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ("autoplay" in $$props) $$invalidate(0, autoplay = $$props.autoplay);
    		if ("delay" in $$props) $$invalidate(1, delay = $$props.delay);
    		if ("showIndicators" in $$props) $$invalidate(2, showIndicators = $$props.showIndicators);
    		if ("transitionDuration" in $$props) $$invalidate(3, transitionDuration = $$props.transitionDuration);
    		if ("defaultIndex" in $$props) $$invalidate(4, defaultIndex = $$props.defaultIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [autoplay, delay, showIndicators, transitionDuration, defaultIndex];
    }

    class Styleguide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Styleguide",
    			options,
    			id: create_fragment$H.name
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

    function create_fragment$I(ctx) {
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
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$I.name
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
