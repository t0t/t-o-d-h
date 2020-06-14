
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

    /* src/components/SiteBrand.svelte generated by Svelte v3.23.2 */
    const file$1 = "src/components/SiteBrand.svelte";

    function create_fragment$2(ctx) {
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
    			attr_dev(title, "class", "svelte-1n9sxpk");
    			add_location(title, file$1, 630, 12, 13860);
    			attr_dev(circle0, "cx", "15135.5");
    			attr_dev(circle0, "cy", "3089.34");
    			attr_dev(circle0, "r", "1097.64");
    			attr_dev(circle0, "fill", "none");
    			attr_dev(circle0, "stroke", "#111111");
    			attr_dev(circle0, "stroke-width", "43.84");
    			attr_dev(circle0, "stroke-dasharray", "43.84,131.52,0,0");
    			attr_dev(circle0, "transform", "matrix(.10706 0 0 .12986 54821.7 1042.87)");
    			attr_dev(circle0, "class", "svelte-1n9sxpk");
    			add_location(circle0, file$1, 633, 20, 14066);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "stroke", "#111111");
    			attr_dev(circle1, "stroke-width", "26.3");
    			attr_dev(circle1, "transform", "matrix(.10706 0 0 .12986 54939.2 1042.87)");
    			attr_dev(circle1, "class", "svelte-1n9sxpk");
    			add_location(circle1, file$1, 636, 20, 14327);
    			attr_dev(path0, "d", "M19961 30959.1v2495.3");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "class", "svelte-1n9sxpk");
    			add_location(path0, file$1, 639, 24, 14613);
    			attr_dev(path1, "d", "M19941.7 30959.1v64.7h38.6v-64.7h-38.6zm0 582.2v64.7h38.6v-64.7h-38.6zm0 582.3v64.7h38.6v-64.7h-38.6zm0 582.3v64.7h38.6v-64.7h-38.6zm0 582.3v64.7h38.6v-64.7h-38.6z");
    			attr_dev(path1, "class", "svelte-1n9sxpk");
    			add_location(path1, file$1, 640, 24, 14689);
    			attr_dev(g0, "transform", "matrix(0 .19668 -.0967 0 59616.9 -2481.81)");
    			attr_dev(g0, "class", "svelte-1n9sxpk");
    			add_location(g0, file$1, 638, 20, 14530);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "transform", "matrix(.0057 0 0 .00692 56473.4 1422.7)");
    			attr_dev(circle2, "class", "svelte-1n9sxpk");
    			add_location(circle2, file$1, 644, 20, 14969);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "transform", "matrix(.0057 0 0 .00692 56355.8 1422.7)");
    			attr_dev(circle3, "class", "svelte-1n9sxpk");
    			add_location(circle3, file$1, 646, 20, 15118);
    			attr_dev(circle4, "cx", "15135.5");
    			attr_dev(circle4, "cy", "3089.34");
    			attr_dev(circle4, "r", "1097.64");
    			attr_dev(circle4, "transform", "matrix(.0057 0 0 .00692 56415.1 1299.4)");
    			attr_dev(circle4, "class", "svelte-1n9sxpk");
    			add_location(circle4, file$1, 648, 20, 15267);
    			attr_dev(circle5, "cx", "15135.5");
    			attr_dev(circle5, "cy", "3089.34");
    			attr_dev(circle5, "r", "1097.64");
    			attr_dev(circle5, "transform", "matrix(.0057 0 0 .00692 56414.8 1545.34)");
    			attr_dev(circle5, "class", "svelte-1n9sxpk");
    			add_location(circle5, file$1, 650, 20, 15416);
    			attr_dev(g1, "transform", "matrix(.15985 0 0 .13168 -9003.181 -171.008)");
    			attr_dev(g1, "class", "svelte-1n9sxpk");
    			add_location(g1, file$1, 632, 16, 13985);
    			attr_dev(g2, "fill-rule", "evenodd");
    			attr_dev(g2, "stroke-linejoin", "round");
    			attr_dev(g2, "stroke-linecap", "round");
    			attr_dev(g2, "class", "svelte-1n9sxpk");
    			add_location(g2, file$1, 631, 12, 13898);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 57 39");
    			attr_dev(svg, "class", "svelte-1n9sxpk");
    			add_location(svg, file$1, 629, 8, 13787);
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[0](/*home*/ ctx[1]));
    			attr_dev(a, "class", "SiteBrand svelte-1n9sxpk");
    			attr_dev(a, "alt", "Brand Logo");
    			add_location(a, file$1, 628, 4, 13720);
    			attr_dev(div, "class", "svelte-1n9sxpk");
    			add_location(div, file$1, 627, 0, 13710);
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SiteBrand",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Nav.svelte generated by Svelte v3.23.2 */
    const file$2 = "src/Nav.svelte";

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

    // (694:4) {#each _linksLeft as [path, name]}
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
    			attr_dev(a, "class", "svelte-8h3eh5");
    			toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			add_location(a, file$2, 695, 6, 14965);
    			attr_dev(li, "class", "svelte-8h3eh5");
    			add_location(li, file$2, 694, 4, 14954);
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
    		source: "(694:4) {#each _linksLeft as [path, name]}",
    		ctx
    	});

    	return block;
    }

    // (706:4) {#each _linksRight as [path, name]}
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
    			attr_dev(a, "class", "svelte-8h3eh5");
    			toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			add_location(a, file$2, 707, 6, 15211);
    			attr_dev(li, "class", "svelte-8h3eh5");
    			add_location(li, file$2, 706, 4, 15200);
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
    		source: "(706:4) {#each _linksRight as [path, name]}",
    		ctx
    	});

    	return block;
    }

    // (714:0) {#if y > 340}
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
    			attr_dev(button, "class", "toggle-button svelte-8h3eh5");
    			add_location(button, file$2, 715, 2, 15354);
    			attr_dev(div, "class", "fixed svelte-8h3eh5");
    			add_location(div, file$2, 714, 0, 15332);
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
    		source: "(714:0) {#if y > 340}",
    		ctx
    	});

    	return block;
    }

    // (719:6) {:else}
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
    		source: "(719:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (717:4) {#if showControls}
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
    		source: "(717:4) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    // (724:2) {#if showControls}
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

    			attr_dev(a, "class", "backlink svelte-8h3eh5");
    			attr_dev(a, "href", a_href_value = /*$url*/ ctx[2](/*home*/ ctx[4]));
    			add_location(a, file$2, 725, 6, 15546);
    			attr_dev(ul, "class", "MainNav svelte-8h3eh5");
    			add_location(ul, file$2, 724, 4, 15519);
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
    		source: "(724:2) {#if showControls}",
    		ctx
    	});

    	return block;
    }

    // (727:6) {#each _links as [path, name]}
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
    			attr_dev(a, "class", "svelte-8h3eh5");
    			toggle_class(a, "selected", /*$isActive*/ ctx[3](/*path*/ ctx[10]));
    			add_location(a, file$2, 728, 8, 15665);
    			attr_dev(li, "class", "svelte-8h3eh5");
    			add_location(li, file$2, 727, 6, 15652);
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
    		source: "(727:6) {#each _links as [path, name]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
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
    			attr_dev(ul0, "class", "NavBar__left svelte-8h3eh5");
    			add_location(ul0, file$2, 692, 2, 14885);
    			attr_dev(div, "class", "NavBar__center svelte-8h3eh5");
    			add_location(div, file$2, 700, 2, 15069);
    			attr_dev(ul1, "class", "NavBar__right svelte-8h3eh5");
    			add_location(ul1, file$2, 704, 2, 15129);
    			attr_dev(nav, "class", "NavBar svelte-8h3eh5");
    			add_location(nav, file$2, 691, 0, 14862);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $url;
    	let $isActive;
    	validate_store(url, "url");
    	component_subscribe($$self, url, $$value => $$invalidate(2, $url = $$value));
    	validate_store(isActive, "isActive");
    	component_subscribe($$self, isActive, $$value => $$invalidate(3, $isActive = $$value));
    	let y;
    	let home = "/";

    	const _links = [
    		["/about", "TODH"],
    		["/products", "Artifacts"],
    		["/blog", "Blog"],
    		["/styleguide", "Styleguide"]
    	];

    	const _linksLeft = [["/about", "TODH"], ["/products", "Artifacts"]];
    	const _linksRight = [["/styleguide", "Styleguide"], ["/blog", "Blog"]];
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/AudioPlayer.svelte generated by Svelte v3.23.2 */

    const file$3 = "src/components/AudioPlayer.svelte";

    function create_fragment$4(ctx) {
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
    			attr_dev(audio_1, "class", "svelte-54gpyo");
    			add_location(audio_1, file$3, 631, 2, 13609);
    			attr_dev(small, "class", "svelte-54gpyo");
    			add_location(small, file$3, 632, 2, 13687);
    			attr_dev(div, "class", "svelte-54gpyo");
    			toggle_class(div, "playing", !/*paused*/ ctx[5]);
    			add_location(div, file$3, 630, 0, 13577);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let current;

    function instance$4($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			src: 0,
    			title: 1,
    			composer: 2,
    			performer: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioPlayer",
    			options,
    			id: create_fragment$4.name
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
    			t2 = text("\n      es artista plástico y diseñador. Le encanta prototipar en el navegador usando Sass, CSS-Grid, SvelteJS, etc, pero también plasmar ideas en cuadros 3D y re(li)garlo TODO desde una visión/percepción holística que denomina TODH.");
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
    			attr_dev(img, "class", "BioAvatar svelte-1buslzm");
    			add_location(img, file$4, 663, 4, 14577);
    			attr_dev(div0, "class", "Avatar svelte-1buslzm");
    			add_location(div0, file$4, 662, 2, 14552);
    			attr_dev(strong, "class", "svelte-1buslzm");
    			add_location(strong, file$4, 668, 6, 14695);
    			attr_dev(p, "class", "svelte-1buslzm");
    			add_location(p, file$4, 667, 4, 14685);
    			attr_dev(div1, "class", "Bio svelte-1buslzm");
    			add_location(div1, file$4, 666, 2, 14663);
    			attr_dev(title0, "class", "svelte-1buslzm");
    			add_location(title0, file$4, 677, 10, 15170);
    			attr_dev(circle, "fill", "#111111");
    			attr_dev(circle, "cx", "12.145");
    			attr_dev(circle, "cy", "3.892");
    			attr_dev(circle, "r", "0.96");
    			attr_dev(circle, "class", "svelte-1buslzm");
    			add_location(circle, file$4, 678, 10, 15210);
    			attr_dev(path0, "d", "M8,12c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S10.206,12,8,12z\n                M8,6C6.897,6,6,6.897,6,8\n                s0.897,2,2,2s2-0.897,2-2S9.103,6,8,6z");
    			attr_dev(path0, "class", "svelte-1buslzm");
    			add_location(path0, file$4, 679, 10, 15278);
    			attr_dev(path1, "d", "M12,16H4c-2.056,0-4-1.944-4-4V4c0-2.056,1.944-4,4-4h8c2.056,0,4,1.944,4,4v8C16,14.056,14.056,16,12,16z\n                M4,2C3.065,2,2,3.065,2,4v8c0,0.953,1.047,2,2,2h8c0.935,0,2-1.065,2-2V4c0-0.935-1.065-2-2-2H4z");
    			attr_dev(path1, "class", "svelte-1buslzm");
    			add_location(path1, file$4, 682, 10, 15463);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 16 16");
    			attr_dev(svg0, "class", "svelte-1buslzm");
    			add_location(svg0, file$4, 676, 8, 15099);
    			attr_dev(a0, "href", "https://www.instagram.com/t.o.d.h/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener");
    			attr_dev(a0, "class", "svelte-1buslzm");
    			add_location(a0, file$4, 675, 6, 15014);
    			attr_dev(title1, "class", "svelte-1buslzm");
    			add_location(title1, file$4, 688, 10, 15883);
    			attr_dev(path2, "d", "M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16h14.7c0.4,0,0.7-0.3,0.7-0.7V0.7\n                C16,0.3,15.7,0,15.3,0z M4.7,13.6H2.4V6h2.4V13.6z\n                M3.6,5C2.8,5,2.2,4.3,2.2,3.6c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4\n                C4.9,4.3,4.3,5,3.6,5z\n                M13.6,13.6h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6h2.3v1h0c0.3-0.6,1.1-1.2,2.2-1.2\n                c2.4,0,2.8,1.6,2.8,3.6V13.6z");
    			attr_dev(path2, "class", "svelte-1buslzm");
    			add_location(path2, file$4, 689, 10, 15922);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 16 16");
    			attr_dev(svg1, "class", "svelte-1buslzm");
    			add_location(svg1, file$4, 687, 8, 15812);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/sergiofores/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener");
    			attr_dev(a1, "class", "svelte-1buslzm");
    			add_location(a1, file$4, 686, 6, 15721);
    			attr_dev(title2, "class", "svelte-1buslzm");
    			add_location(title2, file$4, 699, 10, 16550);
    			attr_dev(path3, "d", "M15,0H1A1,1,0,0,0,0,1V15a1,1,0,0,0,1,1H15a1,1,0,0,0,1-1V1A1,1,0,0,0,15,0ZM13.292,3.791l-.858.823a.251.251,0,0,0-.1.241V10.9a.251.251,0,0,0,.1.241l.838.823v.181H9.057v-.181l.868-.843c.085-.085.085-.11.085-.241V5.993L7.6,12.124H7.271l-2.81-6.13V10.1a.567.567,0,0,0,.156.472l1.129,1.37v.181h-3.2v-.181l1.129-1.37a.547.547,0,0,0,.146-.472V5.351A.416.416,0,0,0,3.683,5l-1-1.209V3.61H5.8L8.2,8.893,10.322,3.61h2.971Z");
    			attr_dev(path3, "class", "svelte-1buslzm");
    			add_location(path3, file$4, 700, 10, 16587);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 16 16");
    			attr_dev(svg2, "class", "svelte-1buslzm");
    			add_location(svg2, file$4, 698, 8, 16479);
    			attr_dev(a2, "href", "https://medium.com/@todh");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener");
    			attr_dev(a2, "class", "svelte-1buslzm");
    			add_location(a2, file$4, 697, 6, 16404);
    			attr_dev(title3, "class", "svelte-1buslzm");
    			add_location(title3, file$4, 706, 10, 17207);
    			attr_dev(path4, "d", "M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1\n                C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7\n                c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3\n                c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z");
    			attr_dev(path4, "class", "svelte-1buslzm");
    			add_location(path4, file$4, 707, 10, 17245);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 16 16");
    			attr_dev(svg3, "class", "svelte-1buslzm");
    			add_location(svg3, file$4, 705, 8, 17136);
    			attr_dev(a3, "href", "https://twitter.com/t0tinspire");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener");
    			attr_dev(a3, "class", "svelte-1buslzm");
    			add_location(a3, file$4, 704, 6, 17055);
    			attr_dev(title4, "class", "svelte-1buslzm");
    			add_location(title4, file$4, 716, 10, 17953);
    			attr_dev(path5, "fill-rule", "evenodd");
    			attr_dev(path5, "clip-rule", "evenodd");
    			attr_dev(path5, "d", "M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6\n                C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5\n                c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1\n                c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8\n                c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2\n                c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z");
    			attr_dev(path5, "class", "svelte-1buslzm");
    			add_location(path5, file$4, 717, 10, 17990);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 16 16");
    			attr_dev(svg4, "class", "svelte-1buslzm");
    			add_location(svg4, file$4, 715, 8, 17882);
    			attr_dev(a4, "href", "https://github.com/t0t");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener");
    			attr_dev(a4, "class", "svelte-1buslzm");
    			add_location(a4, file$4, 714, 6, 17809);
    			attr_dev(title5, "class", "svelte-1buslzm");
    			add_location(title5, file$4, 727, 10, 18891);
    			attr_dev(path6, "d", "M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3\n                c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z");
    			attr_dev(path6, "class", "svelte-1buslzm");
    			add_location(path6, file$4, 728, 10, 18930);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "viewBox", "0 0 16 16");
    			attr_dev(svg5, "class", "svelte-1buslzm");
    			add_location(svg5, file$4, 726, 8, 18820);
    			attr_dev(a5, "href", "https://www.facebook.com/TODH-2139705836275088");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noopener");
    			attr_dev(a5, "class", "svelte-1buslzm");
    			add_location(a5, file$4, 725, 6, 18723);
    			attr_dev(title6, "class", "svelte-1buslzm");
    			add_location(title6, file$4, 735, 10, 19344);
    			attr_dev(rect, "x", "5");
    			attr_dev(rect, "width", "6");
    			attr_dev(rect, "height", "4.5");
    			attr_dev(rect, "class", "svelte-1buslzm");
    			add_location(rect, file$4, 736, 10, 19381);
    			attr_dev(polygon, "points", "11 7 16 7 16 16 0 16 0 7 5 7 5 11.5 11 11.5 11 7");
    			attr_dev(polygon, "class", "svelte-1buslzm");
    			add_location(polygon, file$4, 737, 10, 19429);
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "viewBox", "0 0 16 16");
    			attr_dev(svg6, "class", "svelte-1buslzm");
    			add_location(svg6, file$4, 734, 8, 19273);
    			attr_dev(a6, "href", "https://unsplash.com/@todh");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener");
    			attr_dev(a6, "class", "svelte-1buslzm");
    			add_location(a6, file$4, 733, 6, 19196);
    			attr_dev(li, "class", "svelte-1buslzm");
    			add_location(li, file$4, 674, 4, 15003);
    			attr_dev(ul, "class", "Links svelte-1buslzm");
    			add_location(ul, file$4, 673, 2, 14980);
    			attr_dev(div2, "class", "Player svelte-1buslzm");
    			add_location(div2, file$4, 743, 2, 19546);
    			attr_dev(footer, "class", "Main__footer svelte-1buslzm");
    			add_location(footer, file$4, 660, 0, 14519);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SiteFooter",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/pages/_layout.svelte generated by Svelte v3.23.2 */

    const file$5 = "src/pages/_layout.svelte";

    function create_fragment$6(ctx) {
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
    			attr_dev(link0, "class", "svelte-uz80cl");
    			add_location(link0, file$5, 10, 4, 599);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,700;1,400&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "class", "svelte-uz80cl");
    			add_location(link1, file$5, 11, 4, 719);
    			attr_dev(nav1, "class", "Main__nav svelte-uz80cl");
    			add_location(nav1, file$5, 614, 4, 13963);
    			attr_dev(main, "class", "Main svelte-uz80cl");
    			add_location(main, file$5, 613, 0, 13939);
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/PageTitle.svelte generated by Svelte v3.23.2 */

    const file$6 = "src/components/PageTitle.svelte";

    function create_fragment$7(ctx) {
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
    			attr_dev(h1, "class", "svelte-fm7ket");
    			add_location(h1, file$6, 605, 6, 13222);
    			attr_dev(h2, "class", "svelte-fm7ket");
    			add_location(h2, file$6, 606, 6, 13249);
    			attr_dev(hgroup, "class", "text-center svelte-fm7ket");
    			add_location(hgroup, file$6, 604, 4, 13187);
    			attr_dev(header, "class", "Main__header svelte-fm7ket");
    			add_location(header, file$6, 603, 0, 13153);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { pageTitle: 0, pageSubTitle: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageTitle",
    			options,
    			id: create_fragment$7.name
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

    const file$7 = "src/components/BlockQuote.svelte";

    function create_fragment$8(ctx) {
    	let blockquote;
    	let strong;
    	let t0;
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let small;
    	let t4;
    	let blockquote_class_value;

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			strong = element("strong");
    			t0 = text("\"");
    			t1 = text(/*quote*/ ctx[0]);
    			t2 = text("\"");
    			br = element("br");
    			t3 = space();
    			small = element("small");
    			t4 = text(/*author*/ ctx[1]);
    			attr_dev(strong, "class", "svelte-wpno1s");
    			add_location(strong, file$7, 623, 4, 13474);
    			attr_dev(br, "class", "svelte-wpno1s");
    			add_location(br, file$7, 623, 30, 13500);
    			attr_dev(small, "class", "svelte-wpno1s");
    			add_location(small, file$7, 624, 4, 13509);
    			attr_dev(blockquote, "class", blockquote_class_value = "Quote QuoteLine " + /*modificador*/ ctx[3][/*variante*/ ctx[2]] + " svelte-wpno1s");
    			add_location(blockquote, file$7, 622, 0, 13409);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);
    			append_dev(blockquote, strong);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(blockquote, br);
    			append_dev(blockquote, t3);
    			append_dev(blockquote, small);
    			append_dev(small, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*quote*/ 1) set_data_dev(t1, /*quote*/ ctx[0]);
    			if (dirty & /*author*/ 2) set_data_dev(t4, /*author*/ ctx[1]);

    			if (dirty & /*modificador, variante*/ 12 && blockquote_class_value !== (blockquote_class_value = "Quote QuoteLine " + /*modificador*/ ctx[3][/*variante*/ ctx[2]] + " svelte-wpno1s")) {
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			quote: 0,
    			author: 1,
    			variante: 2,
    			modificador: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockQuote",
    			options,
    			id: create_fragment$8.name
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

    const file$8 = "src/components/Content.svelte";

    function create_fragment$9(ctx) {
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
    			attr_dev(div0, "class", "Content svelte-1xevxjr");
    			add_location(div0, file$8, 599, 4, 13112);
    			attr_dev(div1, "class", "Main__content svelte-1xevxjr");
    			add_location(div1, file$8, 598, 0, 13080);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/ContentArea.svelte generated by Svelte v3.23.2 */

    const file$9 = "src/components/ContentArea.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Content__area svelte-e8isug");
    			add_location(div, file$9, 598, 0, 13084);
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentArea",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/Area.svelte generated by Svelte v3.23.2 */

    const file$a = "src/components/Area.svelte";

    // (628:4) {#if title}
    function create_if_block$3(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h3, "class", "svelte-1kee5s5");
    			add_location(h3, file$a, 628, 8, 13582);
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
    		source: "(628:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
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
    			attr_dev(article, "class", "Area svelte-1kee5s5");
    			add_location(article, file$a, 626, 0, 13535);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Area",
    			options,
    			id: create_fragment$b.name
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

    const file$b = "src/components/Banner.svelte";
    const get_image_slot_changes = dirty => ({});
    const get_image_slot_context = ctx => ({});

    function create_fragment$c(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	const image_slot_template = /*$$slots*/ ctx[3].image;
    	const image_slot = create_slot(image_slot_template, ctx, /*$$scope*/ ctx[2], get_image_slot_context);
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (image_slot) image_slot.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "Banner " + /*modificador*/ ctx[1][/*variante*/ ctx[0]] + " svelte-wvmsrf");
    			add_location(div, file$b, 616, 0, 13402);
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

    			if (default_slot) {
    				default_slot.m(div, null);
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

    			if (!current || dirty & /*modificador, variante*/ 3 && div_class_value !== (div_class_value = "Banner " + /*modificador*/ ctx[1][/*variante*/ ctx[0]] + " svelte-wvmsrf")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (image_slot) image_slot.d(detaching);
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { variante: 0, modificador: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Banner",
    			options,
    			id: create_fragment$c.name
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
    const file$c = "src/components/List.svelte";

    function create_fragment$d(ctx) {
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
    			add_location(ul, file$c, 11, 0, 168);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$d.name
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

    const file$d = "src/components/Cards.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Cards svelte-179ob84");
    			add_location(div, file$d, 612, 0, 13455);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cards",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.23.2 */

    const file$e = "src/components/Card.svelte";
    const get_hasSvg_slot_changes = dirty => ({});
    const get_hasSvg_slot_context = ctx => ({});

    // (658:4) {#if hasImage}
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "class", "svelte-66a2qo");
    			add_location(img, file$e, 658, 8, 14243);
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
    		source: "(658:4) {#if hasImage}",
    		ctx
    	});

    	return block;
    }

    // (661:4) {#if hasInlineSvg}
    function create_if_block$4(ctx) {
    	let current;
    	const hasSvg_slot_template = /*$$slots*/ ctx[11].hasSvg;
    	const hasSvg_slot = create_slot(hasSvg_slot_template, ctx, /*$$scope*/ ctx[10], get_hasSvg_slot_context);
    	const hasSvg_slot_or_fallback = hasSvg_slot || fallback_block(ctx);

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
    				if (hasSvg_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(hasSvg_slot, hasSvg_slot_template, ctx, /*$$scope*/ ctx[10], dirty, get_hasSvg_slot_changes, get_hasSvg_slot_context);
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
    		source: "(661:4) {#if hasInlineSvg}",
    		ctx
    	});

    	return block;
    }

    // (662:28) Put here inline-svg
    function fallback_block(ctx) {
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
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(662:28) Put here inline-svg",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div1;
    	let a;
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
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
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
    			attr_dev(h4, "class", "CardTitle svelte-66a2qo");
    			add_location(h4, file$e, 664, 8, 14408);
    			attr_dev(p, "class", "CardContent svelte-66a2qo");
    			add_location(p, file$e, 665, 8, 14451);
    			attr_dev(div0, "class", "CardMain svelte-66a2qo");
    			add_location(div0, file$e, 663, 4, 14377);
    			attr_dev(a, "href", /*href*/ ctx[7]);
    			attr_dev(a, "class", "svelte-66a2qo");
    			add_location(a, file$e, 656, 0, 14200);
    			attr_dev(div1, "class", div1_class_value = "Card  " + /*modificador*/ ctx[8][/*variante*/ ctx[6]] + " svelte-66a2qo");
    			add_location(div1, file$e, 653, 0, 14153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			if (if_block0) if_block0.m(a, null);
    			append_dev(a, t0);
    			if (if_block1) if_block1.m(a, null);
    			append_dev(a, t1);
    			append_dev(a, div0);
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
    					if_block0.m(a, t0);
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
    					if_block1.m(a, t1);
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
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*href*/ 128) {
    				attr_dev(a, "href", /*href*/ ctx[7]);
    			}

    			if (!current || dirty & /*variante*/ 64 && div1_class_value !== (div1_class_value = "Card  " + /*modificador*/ ctx[8][/*variante*/ ctx[6]] + " svelte-66a2qo")) {
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { title = "Default title" } = $$props;
    	let { description = "Default content" } = $$props;
    	const caption = "Default caption";
    	const alt = "Default alt";
    	let { image = "img/img0.jpg" } = $$props;
    	let { hasImage = true } = $$props;
    	let { hasInlineSvg = false } = $$props;
    	let { variante = 2 } = $$props;
    	let { href } = $$props;
    	let modificador = ["Default", "Inverse", "White", "Line", "Transparent"];

    	const writable_props = [
    		"title",
    		"description",
    		"image",
    		"hasImage",
    		"hasInlineSvg",
    		"variante",
    		"href"
    	];

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
    		if ("href" in $$props) $$invalidate(7, href = $$props.href);
    		if ("$$scope" in $$props) $$invalidate(10, $$scope = $$props.$$scope);
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
    		href,
    		modificador
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("image" in $$props) $$invalidate(3, image = $$props.image);
    		if ("hasImage" in $$props) $$invalidate(4, hasImage = $$props.hasImage);
    		if ("hasInlineSvg" in $$props) $$invalidate(5, hasInlineSvg = $$props.hasInlineSvg);
    		if ("variante" in $$props) $$invalidate(6, variante = $$props.variante);
    		if ("href" in $$props) $$invalidate(7, href = $$props.href);
    		if ("modificador" in $$props) $$invalidate(8, modificador = $$props.modificador);
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
    		href,
    		modificador,
    		caption,
    		$$scope,
    		$$slots
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			title: 0,
    			description: 1,
    			caption: 9,
    			alt: 2,
    			image: 3,
    			hasImage: 4,
    			hasInlineSvg: 5,
    			variante: 6,
    			href: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*href*/ ctx[7] === undefined && !("href" in props)) {
    			console.warn("<Card> was created without expected prop 'href'");
    		}
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
    		return this.$$.ctx[9];
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

    	get href() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Figure.svelte generated by Svelte v3.23.2 */

    const file$f = "src/components/Figure.svelte";

    function create_fragment$g(ctx) {
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
    			attr_dev(figcaption, "class", "svelte-16w5s8d");
    			add_location(figcaption, file$f, 610, 4, 13326);
    			attr_dev(figure, "class", "svelte-16w5s8d");
    			add_location(figure, file$f, 608, 0, 13301);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { caption: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Figure",
    			options,
    			id: create_fragment$g.name
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

    const file$g = "src/components/icons/IconCero.svelte";

    function create_fragment$h(ctx) {
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
    			attr_dev(circle, "class", "svelte-rblkvi");
    			add_location(circle, file$g, 599, 4, 13188);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 168 168");
    			attr_dev(svg, "class", "svelte-rblkvi");
    			add_location(svg, file$g, 598, 0, 13081);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCero",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/components/icons/IconUno.svelte generated by Svelte v3.23.2 */

    const file$h = "src/components/icons/IconUno.svelte";

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
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle, "transform", "matrix(.07646 0 0 .07646 -1073.328 -152.287)");
    			attr_dev(circle, "class", "svelte-1wfd735");
    			add_location(circle, file$h, 599, 4, 13187);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 168 168");
    			attr_dev(svg, "class", "svelte-1wfd735");
    			add_location(svg, file$h, 598, 0, 13080);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconUno> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconUno", $$slots, []);
    	return [];
    }

    class IconUno extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUno",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/icons/IconDos.svelte generated by Svelte v3.23.2 */

    const file$i = "src/components/icons/IconDos.svelte";

    function create_fragment$j(ctx) {
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
    			attr_dev(circle0, "class", "svelte-11ygt3");
    			add_location(circle0, file$i, 600, 4, 13237);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.67)");
    			attr_dev(circle1, "class", "svelte-11ygt3");
    			add_location(circle1, file$i, 601, 4, 13342);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle2, "class", "svelte-11ygt3");
    			add_location(circle2, file$i, 602, 4, 13445);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-11ygt3");
    			add_location(svg, file$i, 598, 0, 13080);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconDos> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconDos", $$slots, []);
    	return [];
    }

    class IconDos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconDos",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/icons/IconTres.svelte generated by Svelte v3.23.2 */

    const file$j = "src/components/icons/IconTres.svelte";

    function create_fragment$k(ctx) {
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
    			attr_dev(circle0, "class", "svelte-qp3cb7");
    			add_location(circle0, file$j, 600, 2, 13234);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.668)");
    			attr_dev(circle1, "class", "svelte-qp3cb7");
    			add_location(circle1, file$j, 602, 2, 13389);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.03822 0 0 .03822 -493.61 -33.668)");
    			attr_dev(circle2, "class", "svelte-qp3cb7");
    			add_location(circle2, file$j, 604, 2, 13542);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "fill", "none");
    			attr_dev(circle3, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle3, "stroke-width", "13.08");
    			attr_dev(circle3, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle3, "class", "svelte-qp3cb7");
    			add_location(circle3, file$j, 606, 2, 13698);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-qp3cb7");
    			add_location(svg, file$j, 598, 0, 13081);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconTres> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconTres", $$slots, []);
    	return [];
    }

    class IconTres extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconTres",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/components/icons/IconCuatro.svelte generated by Svelte v3.23.2 */

    const file$k = "src/components/icons/IconCuatro.svelte";

    function create_fragment$l(ctx) {
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
    			attr_dev(circle0, "class", "svelte-1st0biv");
    			add_location(circle0, file$k, 599, 4, 13190);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "transform", "matrix(.0191 0 0 .0191 -141.88 25.37)");
    			attr_dev(circle1, "class", "svelte-1st0biv");
    			add_location(circle1, file$k, 600, 4, 13292);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "transform", "matrix(.0191 0 0 .0191 -267.75 25.37)");
    			attr_dev(circle2, "class", "svelte-1st0biv");
    			add_location(circle2, file$k, 601, 4, 13395);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "transform", "matrix(.0191 0 0 .0191 -183.76 25.37)");
    			attr_dev(circle3, "class", "svelte-1st0biv");
    			add_location(circle3, file$k, 602, 4, 13498);
    			attr_dev(circle4, "cx", "15135.5");
    			attr_dev(circle4, "cy", "3089.34");
    			attr_dev(circle4, "r", "1097.64");
    			attr_dev(circle4, "fill", "none");
    			attr_dev(circle4, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle4, "transform", "matrix(.03822 0 0 .03822 -493.93 -33.67)");
    			attr_dev(circle4, "class", "svelte-1st0biv");
    			add_location(circle4, file$k, 603, 4, 13601);
    			attr_dev(circle5, "cx", "15135.5");
    			attr_dev(circle5, "cy", "3089.34");
    			attr_dev(circle5, "r", "1097.64");
    			attr_dev(circle5, "fill", "none");
    			attr_dev(circle5, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle5, "transform", "matrix(.03822 0 0 .03822 -452.1 -33.67)");
    			attr_dev(circle5, "class", "svelte-1st0biv");
    			add_location(circle5, file$k, 604, 4, 13754);
    			attr_dev(circle6, "cx", "15135.5");
    			attr_dev(circle6, "cy", "3089.34");
    			attr_dev(circle6, "r", "1097.64");
    			attr_dev(circle6, "fill", "none");
    			attr_dev(circle6, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle6, "transform", "matrix(.03822 0 0 .03822 -536 -33.67)");
    			attr_dev(circle6, "class", "svelte-1st0biv");
    			add_location(circle6, file$k, 606, 4, 13914);
    			attr_dev(circle7, "cx", "15135.5");
    			attr_dev(circle7, "cy", "3089.34");
    			attr_dev(circle7, "r", "1097.64");
    			attr_dev(circle7, "fill", "none");
    			attr_dev(circle7, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle7, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle7, "class", "svelte-1st0biv");
    			add_location(circle7, file$k, 608, 4, 14072);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-1st0biv");
    			add_location(svg, file$k, 598, 0, 13083);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IconCuatro> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("IconCuatro", $$slots, []);
    	return [];
    }

    class IconCuatro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconCuatro",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/icons/IconEspiral.svelte generated by Svelte v3.23.2 */

    const file$l = "src/components/icons/IconEspiral.svelte";

    function create_fragment$m(ctx) {
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
    			attr_dev(path0, "class", "svelte-dpq9ne");
    			add_location(path0, file$l, 610, 4, 13440);
    			attr_dev(path1, "d", "M136.483 135.962c-9.786-3.27-20.483-1.824-28.77 3.88-8.317 5.694-13.197 14.975-13.172 24.92M94.541 164.762c.027 6.18 3.097 12.017 8.23 15.753 5.141 3.706 11.77 4.84 17.805 3.056M120.576 183.57c3.745-1.084 6.664-3.874 7.868-7.48 1.205-3.607.54-7.56-1.79-10.71M94.096 9.677l288.649 208.564M382.745 218.24l-356.049-6.836M26.696 211.404l67.4-201.727M94.096 9.677l68.61 204.32M162.706 213.998L94.54 164.762M136.483 135.962l-15.907 47.609M126.654 165.38l-32.113-.618M114.388 165.152l6.188 18.419M126.654 165.38l-9.908 6.801M118.182 167.884l-1.436 4.297M136.483 135.962L26.696 211.404M120.544 169.58l-6.156-4.428M114.388 165.152c-.88 1.17-1.1 2.666-.661 4.067a4.828 4.828 0 003.02 2.962");
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "stroke", "#fff");
    			attr_dev(path1, "stroke-width", ".9705592000000001");
    			attr_dev(path1, "class", "svelte-dpq9ne");
    			add_location(path1, file$l, 612, 4, 13639);
    			attr_dev(path2, "d", "M126.654 165.38c-1.421-1.904-3.71-3.087-6.137-3.13-2.425-.044-4.706 1.042-6.13 2.902M120.544 169.58a1.74 1.74 0 00-.752-1.402c-.48-.335-1.066-.46-1.61-.294M118.182 167.884c-.314.104-.606.355-.711.668a1.14 1.14 0 00.156.994");
    			attr_dev(path2, "fill", "none");
    			attr_dev(path2, "stroke", "#fff");
    			attr_dev(path2, "stroke-width", ".9705592000000001");
    			attr_dev(path2, "class", "svelte-dpq9ne");
    			add_location(path2, file$l, 615, 4, 14411);
    			attr_dev(path3, "d", "M116.746 172.181c.878.293 1.861.168 2.594-.355.764-.51 1.214-1.336 1.204-2.247M382.745 218.24c-.183-68.324-34.122-133.18-91.218-174.43C234.409 2.519 161.002-10.153 94.096 9.678M94.096 9.677C52.73 21.935 20.356 52.78 7.016 92.706c-13.329 39.894-6.009 84.037 19.68 118.698M26.696 211.404c15.859 21.406 41.186 34.4 68.102 34.921 26.884.51 52.135-11.519 67.908-32.327");
    			attr_dev(path3, "fill", "none");
    			attr_dev(path3, "stroke", "#fff");
    			attr_dev(path3, "stroke-width", ".9705592000000001");
    			attr_dev(path3, "class", "svelte-dpq9ne");
    			add_location(path3, file$l, 618, 4, 14726);
    			attr_dev(path4, "d", "M162.706 213.998c9.734-12.855 12.401-29.605 7.236-45.032-5.197-15.438-17.621-27.712-33.459-33.004");
    			attr_dev(path4, "fill", "none");
    			attr_dev(path4, "stroke", "#fff");
    			attr_dev(path4, "stroke-width", ".9705592000000001");
    			attr_dev(path4, "class", "svelte-dpq9ne");
    			add_location(path4, file$l, 621, 4, 15182);
    			attr_dev(svg, "viewBox", "0 0 384 247");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			set_style(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "class", "svelte-dpq9ne");
    			toggle_class(svg, "active", /*active*/ ctx[1]);
    			add_location(svg, file$l, 608, 0, 13222);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconEspiral",
    			options,
    			id: create_fragment$m.name
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

    const file$m = "src/components/icons/IconTetractys.svelte";

    function create_fragment$n(ctx) {
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
    			attr_dev(path, "class", "svelte-1pspg1");
    			add_location(path, file$m, 609, 2, 13406);
    			attr_dev(circle0, "cx", "168.317");
    			attr_dev(circle0, "cy", "18.147");
    			attr_dev(circle0, "r", "6.044");
    			attr_dev(circle0, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle0, "class", "svelte-1pspg1");
    			add_location(circle0, file$m, 614, 2, 13789);
    			attr_dev(circle1, "cx", "214.102");
    			attr_dev(circle1, "cy", "98.498");
    			attr_dev(circle1, "r", "6.045");
    			attr_dev(circle1, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle1, "class", "svelte-1pspg1");
    			add_location(circle1, file$m, 615, 2, 13887);
    			attr_dev(circle2, "cx", "259.858");
    			attr_dev(circle2, "cy", "178.241");
    			attr_dev(circle2, "r", "6.045");
    			attr_dev(circle2, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle2, "class", "svelte-1pspg1");
    			add_location(circle2, file$m, 616, 2, 13985);
    			attr_dev(circle3, "cx", "305.727");
    			attr_dev(circle3, "cy", "257.757");
    			attr_dev(circle3, "r", "6.045");
    			attr_dev(circle3, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle3, "class", "svelte-1pspg1");
    			add_location(circle3, file$m, 617, 2, 14084);
    			attr_dev(circle4, "cx", "214.102");
    			attr_dev(circle4, "cy", "257.757");
    			attr_dev(circle4, "r", "6.045");
    			attr_dev(circle4, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle4, "class", "svelte-1pspg1");
    			add_location(circle4, file$m, 618, 2, 14183);
    			attr_dev(circle5, "cx", "123.237");
    			attr_dev(circle5, "cy", "257.757");
    			attr_dev(circle5, "r", "6.044");
    			attr_dev(circle5, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle5, "class", "svelte-1pspg1");
    			add_location(circle5, file$m, 619, 2, 14282);
    			attr_dev(circle6, "cx", "30.816");
    			attr_dev(circle6, "cy", "257.757");
    			attr_dev(circle6, "r", "6.045");
    			attr_dev(circle6, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle6, "class", "svelte-1pspg1");
    			add_location(circle6, file$m, 620, 2, 14381);
    			attr_dev(circle7, "cx", "76.892");
    			attr_dev(circle7, "cy", "178.241");
    			attr_dev(circle7, "r", "6.045");
    			attr_dev(circle7, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle7, "class", "svelte-1pspg1");
    			add_location(circle7, file$m, 621, 2, 14479);
    			attr_dev(circle8, "cx", "168.317");
    			attr_dev(circle8, "cy", "178.241");
    			attr_dev(circle8, "r", "6.045");
    			attr_dev(circle8, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle8, "class", "svelte-1pspg1");
    			add_location(circle8, file$m, 622, 2, 14577);
    			attr_dev(circle9, "cx", "123.237");
    			attr_dev(circle9, "cy", "98.498");
    			attr_dev(circle9, "r", "6.044");
    			attr_dev(circle9, "transform", "matrix(.67024 0 0 .67024 -16.6 -8.11)");
    			attr_dev(circle9, "class", "svelte-1pspg1");
    			add_location(circle9, file$m, 623, 2, 14676);
    			set_style(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 193 169");
    			attr_dev(svg, "class", "svelte-1pspg1");
    			toggle_class(svg, "active", /*active*/ ctx[1]);
    			add_location(svg, file$m, 607, 0, 13216);
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconTetractys",
    			options,
    			id: create_fragment$n.name
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

    const file$n = "src/components/Loading.svelte";

    function create_fragment$o(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			attr_dev(div, "class", "svelte-sbi7hj");
    			add_location(div, file$n, 7, 0, 109);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props) {
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src/components/Libros.svelte generated by Svelte v3.23.2 */
    const file$o = "src/components/Libros.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (18:4) {:else}
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
    		source: "(18:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#each libros as item}
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
    			add_location(a, file$o, 16, 12, 328);
    			add_location(li, file$o, 16, 8, 324);
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
    		source: "(16:4) {#each libros as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
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

    			add_location(ul, file$o, 14, 0, 284);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { libros: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Libros",
    			options,
    			id: create_fragment$p.name
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
    const file$p = "src/components/Conceptos.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (22:4) {:else}
    function create_else_block$2(ctx) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(22:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each conceptos as concepto}
    function create_each_block$3(ctx) {
    	let li;
    	let p;
    	let strong;
    	let t0_value = /*concepto*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*concepto*/ ctx[1].text + "";
    	let t2;
    	let a;
    	let small;
    	let t3_value = /*concepto*/ ctx[1].link + "";
    	let t3;
    	let a_href_value;
    	let a_target_value;
    	let t4;

    	const block = {
    		c: function create() {
    			li = element("li");
    			p = element("p");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = space();
    			a = element("a");
    			small = element("small");
    			t3 = text(t3_value);
    			t4 = space();
    			add_location(strong, file$p, 18, 9, 402);
    			html_tag = new HtmlTag(t2);
    			add_location(small, file$p, 19, 59, 517);
    			attr_dev(a, "href", a_href_value = /*concepto*/ ctx[1].href);
    			attr_dev(a, "target", a_target_value = /*concepto*/ ctx[1].target);
    			add_location(a, file$p, 19, 6, 464);
    			add_location(p, file$p, 18, 6, 399);
    			add_location(li, file$p, 17, 4, 388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, p);
    			append_dev(p, strong);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			html_tag.m(raw_value, p);
    			append_dev(p, t2);
    			append_dev(p, a);
    			append_dev(a, small);
    			append_dev(small, t3);
    			append_dev(li, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*conceptos*/ 1 && t0_value !== (t0_value = /*concepto*/ ctx[1].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*conceptos*/ 1 && raw_value !== (raw_value = /*concepto*/ ctx[1].text + "")) html_tag.p(raw_value);
    			if (dirty & /*conceptos*/ 1 && t3_value !== (t3_value = /*concepto*/ ctx[1].link + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*conceptos*/ 1 && a_href_value !== (a_href_value = /*concepto*/ ctx[1].href)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*conceptos*/ 1 && a_target_value !== (a_target_value = /*concepto*/ ctx[1].target)) {
    				attr_dev(a, "target", a_target_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(17:4) {#each conceptos as concepto}",
    		ctx
    	});

    	return block;
    }

    // (16:0) <List>
    function create_default_slot$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*conceptos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

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
    		},
    		p: function update(ctx, dirty) {
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
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    					each_1_else = create_else_block$2(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(16:0) <List>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let list;
    	let current;

    	list = new List({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const list_changes = {};

    			if (dirty & /*$$scope, conceptos*/ 17) {
    				list_changes.$$scope = { dirty, ctx };
    			}

    			list.$set(list_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
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

    	$$self.$capture_state = () => ({ Loading, List, onMount, conceptos });

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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { conceptos: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conceptos",
    			options,
    			id: create_fragment$q.name
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
    const file$q = "src/pages/about.svelte";

    // (708:6) <Card title="0" variante={4} description={cualidades.cero[count]} image="img/grafico-cero.svg">
    function create_default_slot_15(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-1c85pf");
    			add_location(button, file$q, 708, 8, 15709);
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
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(708:6) <Card title=\\\"0\\\" variante={4} description={cualidades.cero[count]} image=\\\"img/grafico-cero.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (714:6) <Card title="1" variante={1} description={cualidades.uno[count]} image="img/grafico-uno.svg">
    function create_default_slot_14(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-1c85pf");
    			add_location(button, file$q, 714, 8, 15892);
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
    		source: "(714:6) <Card title=\\\"1\\\" variante={1} description={cualidades.uno[count]} image=\\\"img/grafico-uno.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (720:6) <Card title="2" variante={2} description={cualidades.dos[count]} image="img/dos.svg">
    function create_default_slot_13(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-1c85pf");
    			add_location(button, file$q, 720, 8, 16067);
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
    		source: "(720:6) <Card title=\\\"2\\\" variante={2} description={cualidades.dos[count]} image=\\\"img/dos.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (726:6) <Card title="3" variante={3} description={cualidades.tres[count]} image="img/tres.svg">
    function create_default_slot_12(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-1c85pf");
    			add_location(button, file$q, 726, 8, 16244);
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
    		source: "(726:6) <Card title=\\\"3\\\" variante={3} description={cualidades.tres[count]} image=\\\"img/tres.svg\\\">",
    		ctx
    	});

    	return block;
    }

    // (732:6) <Card title="4" description={cualidades.cuatro[count]} image="img/cuatro.svg" variante={0}>
    function create_default_slot_11(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "+";
    			attr_dev(button, "class", "svelte-1c85pf");
    			add_location(button, file$q, 732, 8, 16425);
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
    		source: "(732:6) <Card title=\\\"4\\\" description={cualidades.cuatro[count]} image=\\\"img/cuatro.svg\\\" variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (707:4) <Cards>
    function create_default_slot_10(ctx) {
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
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				title: "1",
    				variante: 1,
    				description: /*cualidades*/ ctx[1].uno[/*count*/ ctx[0]],
    				image: "img/grafico-uno.svg",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				title: "2",
    				variante: 2,
    				description: /*cualidades*/ ctx[1].dos[/*count*/ ctx[0]],
    				image: "img/dos.svg",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				title: "3",
    				variante: 3,
    				description: /*cualidades*/ ctx[1].tres[/*count*/ ctx[0]],
    				image: "img/tres.svg",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				title: "4",
    				description: /*cualidades*/ ctx[1].cuatro[/*count*/ ctx[0]],
    				image: "img/cuatro.svg",
    				variante: 0,
    				$$slots: { default: [create_default_slot_11] },
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
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(707:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (706:4) <Area>
    function create_default_slot_9(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
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

    			if (dirty & /*$$scope, count*/ 17) {
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
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(706:4) <Area>",
    		ctx
    	});

    	return block;
    }

    // (741:6) <figure slot="image">
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
    			attr_dev(figure, "class", "svelte-1c85pf");
    			add_location(figure, file$q, 740, 6, 16544);
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
    		source: "(741:6) <figure slot=\\\"image\\\">",
    		ctx
    	});

    	return block;
    }

    // (740:4) <Banner>
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
    		source: "(740:4) <Banner>",
    		ctx
    	});

    	return block;
    }

    // (750:6) <Figure caption="0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1">
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
    		source: "(750:6) <Figure caption=\\\"0 + 1 + 2 + 3 + 4 = 10 = 1 + 0 = 1\\\">",
    		ctx
    	});

    	return block;
    }

    // (748:4) <Area title="Tetractys">
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
    			attr_dev(div, "class", "center svelte-1c85pf");
    			add_location(div, file$q, 748, 4, 16811);
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
    		source: "(748:4) <Area title=\\\"Tetractys\\\">",
    		ctx
    	});

    	return block;
    }

    // (756:4) <Area title="Una lógica de la observación">
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
    			attr_dev(strong, "class", "svelte-1c85pf");
    			add_location(strong, file$q, 764, 6, 17658);
    			attr_dev(p0, "class", "svelte-1c85pf");
    			add_location(p0, file$q, 756, 4, 17010);
    			attr_dev(p1, "class", "svelte-1c85pf");
    			add_location(p1, file$q, 773, 4, 18279);
    			attr_dev(p2, "class", "svelte-1c85pf");
    			add_location(p2, file$q, 779, 4, 18593);
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
    		source: "(756:4) <Area title=\\\"Una lógica de la observación\\\">",
    		ctx
    	});

    	return block;
    }

    // (789:4) <Area title="Términos clave">
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
    		source: "(789:4) <Area title=\\\"Términos clave\\\">",
    		ctx
    	});

    	return block;
    }

    // (793:4) <Area title="Libros">
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
    		source: "(793:4) <Area title=\\\"Libros\\\">",
    		ctx
    	});

    	return block;
    }

    // (797:4) <Banner variante={1}>
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
    			attr_dev(img, "class", "svelte-1c85pf");
    			add_location(img, file$q, 797, 6, 19233);
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
    		source: "(797:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (704:2) <ContentArea>
    function create_default_slot_1(ctx) {
    	let area0;
    	let t0;
    	let banner0;
    	let t1;
    	let area1;
    	let t2;
    	let area2;
    	let t3;
    	let area3;
    	let t4;
    	let area4;
    	let t5;
    	let banner1;
    	let current;

    	area0 = new Area({
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

    	area1 = new Area({
    			props: {
    				title: "Tetractys",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area2 = new Area({
    			props: {
    				title: "Una lógica de la observación",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area3 = new Area({
    			props: {
    				title: "Términos clave",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area4 = new Area({
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
    			create_component(area0.$$.fragment);
    			t0 = space();
    			create_component(banner0.$$.fragment);
    			t1 = space();
    			create_component(area1.$$.fragment);
    			t2 = space();
    			create_component(area2.$$.fragment);
    			t3 = space();
    			create_component(area3.$$.fragment);
    			t4 = space();
    			create_component(area4.$$.fragment);
    			t5 = space();
    			create_component(banner1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(banner0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(area1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(area2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(area3, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(area4, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(banner1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area0_changes = {};

    			if (dirty & /*$$scope, count*/ 17) {
    				area0_changes.$$scope = { dirty, ctx };
    			}

    			area0.$set(area0_changes);
    			const banner0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				banner0_changes.$$scope = { dirty, ctx };
    			}

    			banner0.$set(banner0_changes);
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
    			const area4_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				area4_changes.$$scope = { dirty, ctx };
    			}

    			area4.$set(area4_changes);
    			const banner1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				banner1_changes.$$scope = { dirty, ctx };
    			}

    			banner1.$set(banner1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area0.$$.fragment, local);
    			transition_in(banner0.$$.fragment, local);
    			transition_in(area1.$$.fragment, local);
    			transition_in(area2.$$.fragment, local);
    			transition_in(area3.$$.fragment, local);
    			transition_in(area4.$$.fragment, local);
    			transition_in(banner1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area0.$$.fragment, local);
    			transition_out(banner0.$$.fragment, local);
    			transition_out(area1.$$.fragment, local);
    			transition_out(area2.$$.fragment, local);
    			transition_out(area3.$$.fragment, local);
    			transition_out(area4.$$.fragment, local);
    			transition_out(banner1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(banner0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(area1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(area2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(area3, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(area4, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(banner1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(704:2) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (703:0) <Content>
    function create_default_slot$2(ctx) {
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(703:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src/pages/blog/[slug].svelte generated by Svelte v3.23.2 */
    const file$r = "src/pages/blog/[slug].svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (653:8) {#if (post.slug === slug)}
    function create_if_block$5(ctx) {
    	let article;
    	let h1;
    	let t0_value = /*post*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let h30;
    	let raw0_value = /*post*/ ctx[2].subtitle + "";
    	let t2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let img0_alt_value;
    	let t3;
    	let div1;
    	let h31;
    	let raw1_value = /*post*/ ctx[2].content.h1 + "";
    	let t4;
    	let p0;
    	let raw2_value = /*post*/ ctx[2].content.p + "";
    	let t5;
    	let blockquote;
    	let raw3_value = /*post*/ ctx[2].content.blockquote + "";
    	let t6;
    	let p1;
    	let raw4_value = /*post*/ ctx[2].content.p2 + "";
    	let t7;
    	let p2;
    	let raw5_value = /*post*/ ctx[2].content.p3 + "";
    	let t8;
    	let p3;
    	let raw6_value = /*post*/ ctx[2].content.p4 + "";
    	let t9;
    	let p4;
    	let raw7_value = /*post*/ ctx[2].content.p5 + "";
    	let t10;
    	let p5;
    	let raw8_value = /*post*/ ctx[2].content.p6 + "";
    	let t11;
    	let img1;
    	let img1_src_value;
    	let t12;
    	let p6;
    	let raw9_value = /*post*/ ctx[2].content.p7 + "";
    	let t13;
    	let p7;
    	let raw10_value = /*post*/ ctx[2].content.p8 + "";
    	let t14;
    	let p8;
    	let raw11_value = /*post*/ ctx[2].content.p9 + "";
    	let t15;
    	let p9;
    	let raw12_value = /*post*/ ctx[2].content.p10 + "";
    	let t16;
    	let img2;
    	let img2_src_value;
    	let t17;
    	let p10;
    	let raw13_value = /*post*/ ctx[2].content.p11 + "";
    	let t18;
    	let p11;
    	let raw14_value = /*post*/ ctx[2].content.p12 + "";
    	let t19;
    	let p12;
    	let raw15_value = /*post*/ ctx[2].content.p13 + "";
    	let t20;

    	const block = {
    		c: function create() {
    			article = element("article");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h30 = element("h3");
    			t2 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			t4 = space();
    			p0 = element("p");
    			t5 = space();
    			blockquote = element("blockquote");
    			t6 = space();
    			p1 = element("p");
    			t7 = space();
    			p2 = element("p");
    			t8 = space();
    			p3 = element("p");
    			t9 = space();
    			p4 = element("p");
    			t10 = space();
    			p5 = element("p");
    			t11 = space();
    			img1 = element("img");
    			t12 = space();
    			p6 = element("p");
    			t13 = space();
    			p7 = element("p");
    			t14 = space();
    			p8 = element("p");
    			t15 = space();
    			p9 = element("p");
    			t16 = space();
    			img2 = element("img");
    			t17 = space();
    			p10 = element("p");
    			t18 = space();
    			p11 = element("p");
    			t19 = space();
    			p12 = element("p");
    			t20 = space();
    			attr_dev(h1, "class", "PostHeader svelte-jw080c");
    			add_location(h1, file$r, 654, 16, 14462);
    			attr_dev(h30, "class", "svelte-jw080c");
    			add_location(h30, file$r, 657, 16, 14557);
    			if (img0.src !== (img0_src_value = "/" + /*post*/ ctx[2].imagen)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", img0_alt_value = /*post*/ ctx[2].title);
    			attr_dev(img0, "class", "svelte-jw080c");
    			add_location(img0, file$r, 661, 20, 14693);
    			attr_dev(div0, "class", "PostImgContainer svelte-jw080c");
    			add_location(div0, file$r, 660, 16, 14642);
    			attr_dev(h31, "class", "svelte-jw080c");
    			add_location(h31, file$r, 664, 20, 14825);
    			attr_dev(p0, "class", "svelte-jw080c");
    			add_location(p0, file$r, 665, 20, 14878);
    			attr_dev(blockquote, "class", "svelte-jw080c");
    			add_location(blockquote, file$r, 666, 20, 14928);
    			attr_dev(p1, "class", "svelte-jw080c");
    			add_location(p1, file$r, 667, 20, 15005);
    			attr_dev(p2, "class", "svelte-jw080c");
    			add_location(p2, file$r, 668, 20, 15056);
    			attr_dev(p3, "class", "svelte-jw080c");
    			add_location(p3, file$r, 669, 20, 15107);
    			attr_dev(p4, "class", "svelte-jw080c");
    			add_location(p4, file$r, 670, 20, 15158);
    			attr_dev(p5, "class", "svelte-jw080c");
    			add_location(p5, file$r, 671, 20, 15209);
    			if (img1.src !== (img1_src_value = "/" + /*post*/ ctx[2].content.img1)) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Imagen");
    			attr_dev(img1, "class", "svelte-jw080c");
    			add_location(img1, file$r, 672, 20, 15260);
    			attr_dev(p6, "class", "svelte-jw080c");
    			add_location(p6, file$r, 673, 20, 15326);
    			attr_dev(p7, "class", "svelte-jw080c");
    			add_location(p7, file$r, 674, 20, 15377);
    			attr_dev(p8, "class", "svelte-jw080c");
    			add_location(p8, file$r, 675, 20, 15428);
    			attr_dev(p9, "class", "svelte-jw080c");
    			add_location(p9, file$r, 676, 20, 15479);
    			if (img2.src !== (img2_src_value = "/" + /*post*/ ctx[2].content.img2)) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Imagen");
    			attr_dev(img2, "class", "svelte-jw080c");
    			add_location(img2, file$r, 677, 20, 15531);
    			attr_dev(p10, "class", "svelte-jw080c");
    			add_location(p10, file$r, 678, 20, 15597);
    			attr_dev(p11, "class", "svelte-jw080c");
    			add_location(p11, file$r, 679, 20, 15649);
    			attr_dev(p12, "class", "svelte-jw080c");
    			add_location(p12, file$r, 680, 20, 15701);
    			attr_dev(div1, "class", "PostContent svelte-jw080c");
    			add_location(div1, file$r, 663, 16, 14779);
    			attr_dev(article, "class", "PostArticle svelte-jw080c");
    			add_location(article, file$r, 653, 12, 14416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h1);
    			append_dev(h1, t0);
    			append_dev(article, t1);
    			append_dev(article, h30);
    			h30.innerHTML = raw0_value;
    			append_dev(article, t2);
    			append_dev(article, div0);
    			append_dev(div0, img0);
    			append_dev(article, t3);
    			append_dev(article, div1);
    			append_dev(div1, h31);
    			h31.innerHTML = raw1_value;
    			append_dev(div1, t4);
    			append_dev(div1, p0);
    			p0.innerHTML = raw2_value;
    			append_dev(div1, t5);
    			append_dev(div1, blockquote);
    			blockquote.innerHTML = raw3_value;
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			p1.innerHTML = raw4_value;
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			p2.innerHTML = raw5_value;
    			append_dev(div1, t8);
    			append_dev(div1, p3);
    			p3.innerHTML = raw6_value;
    			append_dev(div1, t9);
    			append_dev(div1, p4);
    			p4.innerHTML = raw7_value;
    			append_dev(div1, t10);
    			append_dev(div1, p5);
    			p5.innerHTML = raw8_value;
    			append_dev(div1, t11);
    			append_dev(div1, img1);
    			append_dev(div1, t12);
    			append_dev(div1, p6);
    			p6.innerHTML = raw9_value;
    			append_dev(div1, t13);
    			append_dev(div1, p7);
    			p7.innerHTML = raw10_value;
    			append_dev(div1, t14);
    			append_dev(div1, p8);
    			p8.innerHTML = raw11_value;
    			append_dev(div1, t15);
    			append_dev(div1, p9);
    			p9.innerHTML = raw12_value;
    			append_dev(div1, t16);
    			append_dev(div1, img2);
    			append_dev(div1, t17);
    			append_dev(div1, p10);
    			p10.innerHTML = raw13_value;
    			append_dev(div1, t18);
    			append_dev(div1, p11);
    			p11.innerHTML = raw14_value;
    			append_dev(div1, t19);
    			append_dev(div1, p12);
    			p12.innerHTML = raw15_value;
    			append_dev(article, t20);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*elpost*/ 2 && t0_value !== (t0_value = /*post*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*elpost*/ 2 && raw0_value !== (raw0_value = /*post*/ ctx[2].subtitle + "")) h30.innerHTML = raw0_value;
    			if (dirty & /*elpost*/ 2 && img0.src !== (img0_src_value = "/" + /*post*/ ctx[2].imagen)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*elpost*/ 2 && img0_alt_value !== (img0_alt_value = /*post*/ ctx[2].title)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (dirty & /*elpost*/ 2 && raw1_value !== (raw1_value = /*post*/ ctx[2].content.h1 + "")) h31.innerHTML = raw1_value;			if (dirty & /*elpost*/ 2 && raw2_value !== (raw2_value = /*post*/ ctx[2].content.p + "")) p0.innerHTML = raw2_value;			if (dirty & /*elpost*/ 2 && raw3_value !== (raw3_value = /*post*/ ctx[2].content.blockquote + "")) blockquote.innerHTML = raw3_value;			if (dirty & /*elpost*/ 2 && raw4_value !== (raw4_value = /*post*/ ctx[2].content.p2 + "")) p1.innerHTML = raw4_value;			if (dirty & /*elpost*/ 2 && raw5_value !== (raw5_value = /*post*/ ctx[2].content.p3 + "")) p2.innerHTML = raw5_value;			if (dirty & /*elpost*/ 2 && raw6_value !== (raw6_value = /*post*/ ctx[2].content.p4 + "")) p3.innerHTML = raw6_value;			if (dirty & /*elpost*/ 2 && raw7_value !== (raw7_value = /*post*/ ctx[2].content.p5 + "")) p4.innerHTML = raw7_value;			if (dirty & /*elpost*/ 2 && raw8_value !== (raw8_value = /*post*/ ctx[2].content.p6 + "")) p5.innerHTML = raw8_value;
    			if (dirty & /*elpost*/ 2 && img1.src !== (img1_src_value = "/" + /*post*/ ctx[2].content.img1)) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*elpost*/ 2 && raw9_value !== (raw9_value = /*post*/ ctx[2].content.p7 + "")) p6.innerHTML = raw9_value;			if (dirty & /*elpost*/ 2 && raw10_value !== (raw10_value = /*post*/ ctx[2].content.p8 + "")) p7.innerHTML = raw10_value;			if (dirty & /*elpost*/ 2 && raw11_value !== (raw11_value = /*post*/ ctx[2].content.p9 + "")) p8.innerHTML = raw11_value;			if (dirty & /*elpost*/ 2 && raw12_value !== (raw12_value = /*post*/ ctx[2].content.p10 + "")) p9.innerHTML = raw12_value;
    			if (dirty & /*elpost*/ 2 && img2.src !== (img2_src_value = "/" + /*post*/ ctx[2].content.img2)) {
    				attr_dev(img2, "src", img2_src_value);
    			}

    			if (dirty & /*elpost*/ 2 && raw13_value !== (raw13_value = /*post*/ ctx[2].content.p11 + "")) p10.innerHTML = raw13_value;			if (dirty & /*elpost*/ 2 && raw14_value !== (raw14_value = /*post*/ ctx[2].content.p12 + "")) p11.innerHTML = raw14_value;			if (dirty & /*elpost*/ 2 && raw15_value !== (raw15_value = /*post*/ ctx[2].content.p13 + "")) p12.innerHTML = raw15_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(653:8) {#if (post.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (652:8) {#each elpost as post}
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
    		source: "(652:8) {#each elpost as post}",
    		ctx
    	});

    	return block;
    }

    // (650:8) <Area>
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

    			attr_dev(div, "class", "Post svelte-jw080c");
    			add_location(div, file$r, 650, 8, 14319);
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
    		source: "(650:8) <Area>",
    		ctx
    	});

    	return block;
    }

    // (649:4) <ContentArea>
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

    			if (dirty & /*$$scope, elpost, slug*/ 35) {
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
    		source: "(649:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (648:0) <Content>
    function create_default_slot$3(ctx) {
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

    			if (dirty & /*$$scope, elpost, slug*/ 35) {
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
    		source: "(648:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
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

    			if (dirty & /*$$scope, elpost, slug*/ 35) {
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
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
    		Content,
    		ContentArea,
    		Area,
    		url,
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
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { slug: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "U5Bslugu5D",
    			options,
    			id: create_fragment$s.name
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
    const file$s = "src/pages/blog/index.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (634:8) <Card          title={post.title}         description={post.excerpt}         image={post.imagen}         variante={4}>
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
    			attr_dev(a, "href", a_href_value = "/blog/" + /*$url*/ ctx[1](/*post*/ ctx[2].slug));
    			attr_dev(a, "class", "svelte-e9ea0w");
    			add_location(a, file$s, 638, 10, 14067);
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
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(634:8) <Card          title={post.title}         description={post.excerpt}         image={post.imagen}         variante={4}>",
    		ctx
    	});

    	return block;
    }

    // (633:6) {#each posts as post}
    function create_each_block$5(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: /*post*/ ctx[2].title,
    				description: /*post*/ ctx[2].excerpt,
    				image: /*post*/ ctx[2].imagen,
    				variante: 4,
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
    		source: "(633:6) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    // (632:4) <Cards>
    function create_default_slot_3$1(ctx) {
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
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(632:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (631:2) <Area>
    function create_default_slot_2$2(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(631:2) <Area>",
    		ctx
    	});

    	return block;
    }

    // (629:0) <ContentArea>
    function create_default_slot_1$2(ctx) {
    	let area;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
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

    			if (dirty & /*$$scope, posts, $url*/ 35) {
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(629:0) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (628:0) <Content>
    function create_default_slot$4(ctx) {
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(628:0) <Content>",
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src/components/MainFeatures.svelte generated by Svelte v3.23.2 */
    const file$t = "src/components/MainFeatures.svelte";

    function create_fragment$u(ctx) {
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
    			attr_dev(h40, "class", "svelte-1q3g18o");
    			add_location(h40, file$t, 653, 12, 14643);
    			attr_dev(p0, "class", "svelte-1q3g18o");
    			add_location(p0, file$t, 654, 12, 14669);
    			attr_dev(small0, "class", "svelte-1q3g18o");
    			add_location(small0, file$t, 655, 12, 14745);
    			attr_dev(a0, "href", "/styleguide");
    			attr_dev(a0, "class", "svelte-1q3g18o");
    			add_location(a0, file$t, 652, 8, 14608);
    			attr_dev(div0, "class", "svelte-1q3g18o");
    			add_location(div0, file$t, 651, 4, 14594);
    			attr_dev(h41, "class", "svelte-1q3g18o");
    			add_location(h41, file$t, 660, 12, 14850);
    			attr_dev(p1, "class", "svelte-1q3g18o");
    			add_location(p1, file$t, 661, 12, 14892);
    			attr_dev(small1, "class", "svelte-1q3g18o");
    			add_location(small1, file$t, 662, 12, 14968);
    			attr_dev(a1, "href", "/styleguide");
    			attr_dev(a1, "class", "svelte-1q3g18o");
    			add_location(a1, file$t, 659, 8, 14815);
    			attr_dev(div1, "class", "svelte-1q3g18o");
    			add_location(div1, file$t, 658, 4, 14801);
    			attr_dev(h42, "class", "svelte-1q3g18o");
    			add_location(h42, file$t, 667, 12, 15073);
    			attr_dev(p2, "class", "svelte-1q3g18o");
    			add_location(p2, file$t, 668, 12, 15115);
    			attr_dev(small2, "class", "svelte-1q3g18o");
    			add_location(small2, file$t, 669, 12, 15191);
    			attr_dev(a2, "href", "/styleguide");
    			attr_dev(a2, "class", "svelte-1q3g18o");
    			add_location(a2, file$t, 666, 8, 15038);
    			attr_dev(div2, "class", "svelte-1q3g18o");
    			add_location(div2, file$t, 665, 4, 15024);
    			attr_dev(div3, "class", "MainFeatures svelte-1q3g18o");
    			add_location(div3, file$t, 648, 0, 14524);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainFeatures",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src/pages/index.svelte generated by Svelte v3.23.2 */

    // (679:6) <Banner variante={1}>
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
    		source: "(679:6) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (684:8) <Banner>
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
    		source: "(684:8) <Banner>",
    		ctx
    	});

    	return block;
    }

    // (646:4) <ContentArea>
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

    			if (dirty & /*$$scope*/ 1) {
    				banner0_changes.$$scope = { dirty, ctx };
    			}

    			banner0.$set(banner0_changes);
    			const banner1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		source: "(646:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (645:2) <Content>
    function create_default_slot$5(ctx) {
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

    			if (dirty & /*$$scope*/ 1) {
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
    		source: "(645:2) <Content>",
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
    				pageTitle: "TODH",
    				pageSubTitle: "Visión holística y artefactos en torno a la Creación 👋"
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

    			if (dirty & /*$$scope*/ 1) {
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
    		MainFeatures
    	});

    	return [];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src/pages/products/[slug].svelte generated by Svelte v3.23.2 */
    const file$u = "src/pages/products/[slug].svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (682:16) {#if (product.slug === slug)}
    function create_if_block$6(ctx) {
    	let article;
    	let figure;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let figcaption;
    	let strong;
    	let t1_value = /*product*/ ctx[5].title + "";
    	let t1;
    	let t2;
    	let em;
    	let t3_value = /*product*/ ctx[5].description + "";
    	let t3;
    	let t4;
    	let main;
    	let h3;
    	let raw0_value = /*product*/ ctx[5].content.h1 + "";
    	let t5;
    	let p;
    	let raw1_value = /*product*/ ctx[5].content.p + "";

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
    			if (img.src !== (img_src_value = "/" + /*product*/ ctx[5].imagen)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[5].title);
    			attr_dev(img, "class", "svelte-d7ho83");
    			add_location(img, file$u, 684, 24, 15079);
    			attr_dev(strong, "class", "svelte-d7ho83");
    			add_location(strong, file$u, 686, 28, 15223);
    			attr_dev(em, "class", "svelte-d7ho83");
    			add_location(em, file$u, 687, 28, 15285);
    			attr_dev(figcaption, "class", "ProductImgCaption svelte-d7ho83");
    			add_location(figcaption, file$u, 685, 24, 15156);
    			attr_dev(figure, "class", "ProductImgContainer svelte-d7ho83");
    			add_location(figure, file$u, 683, 20, 15018);
    			attr_dev(article, "class", "ProductArticle svelte-d7ho83");
    			add_location(article, file$u, 682, 16, 14965);
    			attr_dev(h3, "class", "svelte-d7ho83");
    			add_location(h3, file$u, 692, 20, 15477);
    			attr_dev(p, "class", "svelte-d7ho83");
    			add_location(p, file$u, 693, 20, 15533);
    			attr_dev(main, "class", "ProductContent svelte-d7ho83");
    			add_location(main, file$u, 691, 16, 15427);
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
    			if (dirty & /*productos*/ 2 && img.src !== (img_src_value = "/" + /*product*/ ctx[5].imagen)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*productos*/ 2 && img_alt_value !== (img_alt_value = /*product*/ ctx[5].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*productos*/ 2 && t1_value !== (t1_value = /*product*/ ctx[5].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*productos*/ 2 && t3_value !== (t3_value = /*product*/ ctx[5].description + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*productos*/ 2 && raw0_value !== (raw0_value = /*product*/ ctx[5].content.h1 + "")) h3.innerHTML = raw0_value;			if (dirty & /*productos*/ 2 && raw1_value !== (raw1_value = /*product*/ ctx[5].content.p + "")) p.innerHTML = raw1_value;		},
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
    		source: "(682:16) {#if (product.slug === slug)}",
    		ctx
    	});

    	return block;
    }

    // (681:12) {#each productos as product}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*product*/ ctx[5].slug === /*slug*/ ctx[0] && create_if_block$6(ctx);

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
    			if (/*product*/ ctx[5].slug === /*slug*/ ctx[0]) {
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
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(681:12) {#each productos as product}",
    		ctx
    	});

    	return block;
    }

    // (699:20) {#each productos as product}
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
    			if (img.src !== (img_src_value = "/" + /*product*/ ctx[5].thumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-d7ho83");
    			add_location(img, file$u, 700, 20, 15836);
    			attr_dev(a, "href", a_href_value = /*product*/ ctx[5].slug);
    			attr_dev(a, "class", "svelte-d7ho83");
    			toggle_class(a, "selected", /*$isActive*/ ctx[2](/*product*/ ctx[5].thumb));
    			add_location(a, file$u, 699, 20, 15746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*productos*/ 2 && img.src !== (img_src_value = "/" + /*product*/ ctx[5].thumb)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*productos*/ 2 && a_href_value !== (a_href_value = /*product*/ ctx[5].slug)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$isActive, productos*/ 6) {
    				toggle_class(a, "selected", /*$isActive*/ ctx[2](/*product*/ ctx[5].thumb));
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
    		source: "(699:20) {#each productos as product}",
    		ctx
    	});

    	return block;
    }

    // (679:8) <Area>
    function create_default_slot_2$4(ctx) {
    	let div;
    	let t;
    	let nav;
    	let each_value_1 = /*productos*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
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

    			attr_dev(nav, "class", "ProductNav svelte-d7ho83");
    			add_location(nav, file$u, 697, 16, 15652);
    			attr_dev(div, "class", "Product svelte-d7ho83");
    			add_location(div, file$u, 679, 8, 14840);
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
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
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
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(679:8) <Area>",
    		ctx
    	});

    	return block;
    }

    // (678:4) <ContentArea>
    function create_default_slot_1$4(ctx) {
    	let area;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_2$4] },
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

    			if (dirty & /*$$scope, productos, $isActive, slug*/ 1031) {
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(678:4) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (677:0) <Content>
    function create_default_slot$6(ctx) {
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

    			if (dirty & /*$$scope, productos, $isActive, slug*/ 1031) {
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
    		source: "(677:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
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

    			if (dirty & /*$$scope, productos, $isActive, slug*/ 1031) {
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $isActive;
    	validate_store(isActive, "isActive");
    	component_subscribe($$self, isActive, $$value => $$invalidate(2, $isActive = $$value));
    	let { slug } = $$props;
    	let productos = [];

    	onMount(async () => {
    		const res = await fetch("/data/products.json");
    		$$invalidate(1, productos = [...await res.json()]);
    	});

    	let cur = 0;

    	function changeSlide(slide) {
    		cur = slide;
    	}

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
    		Area,
    		slug,
    		productos,
    		cur,
    		changeSlide,
    		$isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    		if ("productos" in $$props) $$invalidate(1, productos = $$props.productos);
    		if ("cur" in $$props) cur = $$props.cur;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [slug, productos, $isActive];
    }

    class U5Bslugu5D$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { slug: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "U5Bslugu5D",
    			options,
    			id: create_fragment$w.name
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
    const file$v = "src/pages/products/index.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (637:6) <Card        title={producto.title}        description={producto.description}        image={producto.imagen}       variante={3}>
    function create_default_slot_5$1(ctx) {
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
    			attr_dev(a, "class", "svelte-e9ea0w");
    			add_location(a, file$v, 641, 8, 14313);
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
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(637:6) <Card        title={producto.title}        description={producto.description}        image={producto.imagen}       variante={3}>",
    		ctx
    	});

    	return block;
    }

    // (636:6) {#each productos as producto}
    function create_each_block$7(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: /*producto*/ ctx[2].title,
    				description: /*producto*/ ctx[2].description,
    				image: /*producto*/ ctx[2].imagen,
    				variante: 3,
    				$$slots: { default: [create_default_slot_5$1] },
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
    		source: "(636:6) {#each productos as producto}",
    		ctx
    	});

    	return block;
    }

    // (635:4) <Cards>
    function create_default_slot_4$2(ctx) {
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
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(635:4) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (634:2) <Area>
    function create_default_slot_3$3(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				$$slots: { default: [create_default_slot_4$2] },
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

    			if (dirty & /*$$scope, productos, $url*/ 35) {
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
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(634:2) <Area>",
    		ctx
    	});

    	return block;
    }

    // (648:2) <Banner variante={0}>
    function create_default_slot_2$5(ctx) {
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
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(648:2) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (632:2) <ContentArea>
    function create_default_slot_1$5(ctx) {
    	let area;
    	let t;
    	let banner;
    	let current;

    	area = new Area({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area.$$.fragment);
    			t = space();
    			create_component(banner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(banner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_changes = {};

    			if (dirty & /*$$scope, productos, $url*/ 35) {
    				area_changes.$$scope = { dirty, ctx };
    			}

    			area.$set(area_changes);
    			const banner_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				banner_changes.$$scope = { dirty, ctx };
    			}

    			banner.$set(banner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area.$$.fragment, local);
    			transition_in(banner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area.$$.fragment, local);
    			transition_out(banner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(banner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(632:2) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (631:0) <Content>
    function create_default_slot$7(ctx) {
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(631:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
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
    		Area,
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
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* node_modules/svelte-swipe/src/Swipe.svelte generated by Svelte v3.23.2 */
    const file$w = "node_modules/svelte-swipe/src/Swipe.svelte";

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
    			add_location(div, file$w, 268, 5, 6444);
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

    			add_location(span, file$w, 270, 10, 6545);
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

    function create_fragment$y(ctx) {
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
    			add_location(div0, file$w, 261, 6, 6209);
    			attr_dev(div1, "class", "swipeable-items svelte-hja3vj");
    			add_location(div1, file$w, 260, 4, 6172);
    			attr_dev(div2, "class", "swipe-item-wrapper svelte-hja3vj");
    			add_location(div2, file$w, 259, 2, 6109);
    			attr_dev(div3, "class", "swipe-handler svelte-hja3vj");
    			add_location(div3, file$w, 266, 2, 6303);
    			attr_dev(div4, "class", "swipe-panel svelte-hja3vj");
    			add_location(div4, file$w, 258, 0, 6080);
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
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
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
    			instance$y,
    			create_fragment$y,
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
    			id: create_fragment$y.name
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

    const file$x = "node_modules/svelte-swipe/src/SwipeItem.svelte";

    function create_fragment$z(ctx) {
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
    			add_location(div, file$x, 15, 0, 224);
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
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { classes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SwipeItem",
    			options,
    			id: create_fragment$z.name
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

    const file$y = "src/components/ToggleMenu.svelte";

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
    			add_location(li0, file$y, 15, 12, 303);
    			add_location(li1, file$y, 16, 12, 336);
    			add_location(li2, file$y, 17, 12, 369);
    			add_location(ul, file$y, 14, 8, 286);
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

    function create_fragment$A(ctx) {
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
    	let if_block1 = /*showControls*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(button, file$y, 5, 4, 124);
    			add_location(div, file$y, 4, 0, 114);
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
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleMenu",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.23.2 */

    const file$z = "src/components/Button.svelte";

    function create_fragment$B(ctx) {
    	let button;
    	let t;
    	let button_class_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*modificador*/ ctx[2][/*variante*/ ctx[1]]) + " svelte-1c60kbg"));
    			add_location(button, file$z, 614, 0, 13357);
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

    			if (dirty & /*variante*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*modificador*/ ctx[2][/*variante*/ ctx[1]]) + " svelte-1c60kbg"))) {
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
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { text: 0, variante: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$B.name
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
    const file$A = "src/components/Tabs.svelte";

    function create_fragment$C(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tabs svelte-1bcg5up");
    			add_location(div, file$A, 649, 0, 14196);
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
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function instance$C($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src/components/TabList.svelte generated by Svelte v3.23.2 */

    const file$B = "src/components/TabList.svelte";

    function create_fragment$D(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-list svelte-wurv1q");
    			add_location(div, file$B, 0, 0, 0);
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

    function instance$D($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$D.name
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

    function create_fragment$E(ctx) {
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
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src/components/Tab.svelte generated by Svelte v3.23.2 */
    const file$C = "src/components/Tab.svelte";

    function create_fragment$F(ctx) {
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
    			attr_dev(button, "class", "svelte-18454dj");
    			toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			add_location(button, file$C, 611, 0, 13311);
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
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    /* src/pages/styleguide.svelte generated by Svelte v3.23.2 */
    const file$D = "src/pages/styleguide.svelte";

    // (646:4) <Area title="Typography">
    function create_default_slot_40(ctx) {
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
    	let p;
    	let t10;
    	let em;
    	let t12;
    	let strong;
    	let t14;
    	let a;
    	let t16;
    	let small;
    	let t18;
    	let blockquote0;
    	let t19;
    	let blockquote1;
    	let t20;
    	let blockquote2;
    	let current;

    	blockquote0 = new BlockQuote({
    			props: {
    				variante: 0,
    				quote: "This is a blockquote",
    				author: "Author"
    			},
    			$$inline: true
    		});

    	blockquote1 = new BlockQuote({
    			props: {
    				variante: 1,
    				quote: "This is a blockquote",
    				author: "Author"
    			},
    			$$inline: true
    		});

    	blockquote2 = new BlockQuote({
    			props: {
    				variante: 2,
    				quote: "This is a blockquote",
    				author: "Author"
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
    			p = element("p");
    			t10 = text("Lorem ipsum dolor sit amet ");
    			em = element("em");
    			em.textContent = "consectetur";
    			t12 = text(" adipisicing elit. Est ullam ");
    			strong = element("strong");
    			strong.textContent = "tempora";
    			t14 = text(" accusamus porro doloremque. Mollitia praesentium neque aut! Quibusdam id in ");
    			a = element("a");
    			a.textContent = "repellendus";
    			t16 = text(" sint? Quam iste dignissimos amet nisi, eveniet ullam. ");
    			small = element("small");
    			small.textContent = "Small text";
    			t18 = space();
    			create_component(blockquote0.$$.fragment);
    			t19 = space();
    			create_component(blockquote1.$$.fragment);
    			t20 = space();
    			create_component(blockquote2.$$.fragment);
    			attr_dev(h1, "class", "svelte-1tjwbrs");
    			add_location(h1, file$D, 646, 8, 14678);
    			attr_dev(h2, "class", "svelte-1tjwbrs");
    			add_location(h2, file$D, 647, 8, 14709);
    			attr_dev(h3, "class", "svelte-1tjwbrs");
    			add_location(h3, file$D, 648, 8, 14738);
    			attr_dev(h4, "class", "svelte-1tjwbrs");
    			add_location(h4, file$D, 649, 8, 14765);
    			attr_dev(h5, "class", "svelte-1tjwbrs");
    			add_location(h5, file$D, 650, 8, 14792);
    			attr_dev(em, "class", "svelte-1tjwbrs");
    			add_location(em, file$D, 651, 38, 14849);
    			attr_dev(strong, "class", "svelte-1tjwbrs");
    			add_location(strong, file$D, 651, 87, 14898);
    			attr_dev(a, "href", "./about");
    			attr_dev(a, "class", "svelte-1tjwbrs");
    			add_location(a, file$D, 651, 188, 14999);
    			attr_dev(small, "class", "svelte-1tjwbrs");
    			add_location(small, file$D, 651, 276, 15087);
    			attr_dev(p, "class", "svelte-1tjwbrs");
    			add_location(p, file$D, 651, 8, 14819);
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
    			insert_dev(target, p, anchor);
    			append_dev(p, t10);
    			append_dev(p, em);
    			append_dev(p, t12);
    			append_dev(p, strong);
    			append_dev(p, t14);
    			append_dev(p, a);
    			append_dev(p, t16);
    			append_dev(p, small);
    			insert_dev(target, t18, anchor);
    			mount_component(blockquote0, target, anchor);
    			insert_dev(target, t19, anchor);
    			mount_component(blockquote1, target, anchor);
    			insert_dev(target, t20, anchor);
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
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t18);
    			destroy_component(blockquote0, detaching);
    			if (detaching) detach_dev(t19);
    			destroy_component(blockquote1, detaching);
    			if (detaching) detach_dev(t20);
    			destroy_component(blockquote2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_40.name,
    		type: "slot",
    		source: "(646:4) <Area title=\\\"Typography\\\">",
    		ctx
    	});

    	return block;
    }

    // (661:4) <Area title="Icons and graphics">
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
    			attr_dev(div0, "class", "svelte-1tjwbrs");
    			add_location(div0, file$D, 661, 8, 15434);
    			attr_dev(div1, "class", "svelte-1tjwbrs");
    			add_location(div1, file$D, 665, 8, 15513);
    			attr_dev(div2, "class", "svelte-1tjwbrs");
    			add_location(div2, file$D, 669, 8, 15613);
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
    		source: "(661:4) <Area title=\\\"Icons and graphics\\\">",
    		ctx
    	});

    	return block;
    }

    // (677:8) <Figure caption="The caption">
    function create_default_slot_38(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Alt text");
    			attr_dev(img, "class", "svelte-1tjwbrs");
    			add_location(img, file$D, 677, 12, 15786);
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
    		source: "(677:8) <Figure caption=\\\"The caption\\\">",
    		ctx
    	});

    	return block;
    }

    // (676:4) <Area title="Figure">
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
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(676:4) <Area title=\\\"Figure\\\">",
    		ctx
    	});

    	return block;
    }

    // (682:4) <Area title="Toggle Menu">
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
    		source: "(682:4) <Area title=\\\"Toggle Menu\\\">",
    		ctx
    	});

    	return block;
    }

    // (686:4) <Area title="Buttons">
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
    		source: "(686:4) <Area title=\\\"Buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (691:4) <Area title="Brand">
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
    		source: "(691:4) <Area title=\\\"Brand\\\">",
    		ctx
    	});

    	return block;
    }

    // (695:4) <Area title="Colors">
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
    			attr_dev(div0, "class", "svelte-1tjwbrs");
    			add_location(div0, file$D, 696, 12, 16197);
    			attr_dev(div1, "class", "svelte-1tjwbrs");
    			add_location(div1, file$D, 697, 12, 16221);
    			attr_dev(div2, "class", "svelte-1tjwbrs");
    			add_location(div2, file$D, 698, 12, 16245);
    			attr_dev(div3, "class", "svelte-1tjwbrs");
    			add_location(div3, file$D, 699, 12, 16269);
    			attr_dev(div4, "class", "svelte-1tjwbrs");
    			add_location(div4, file$D, 700, 12, 16293);
    			attr_dev(div5, "class", "svelte-1tjwbrs");
    			add_location(div5, file$D, 701, 12, 16317);
    			attr_dev(div6, "class", "svelte-1tjwbrs");
    			add_location(div6, file$D, 702, 12, 16341);
    			attr_dev(div7, "class", "svelte-1tjwbrs");
    			add_location(div7, file$D, 703, 12, 16365);
    			attr_dev(div8, "class", "svelte-1tjwbrs");
    			add_location(div8, file$D, 704, 12, 16389);
    			attr_dev(div9, "class", "svelte-1tjwbrs");
    			add_location(div9, file$D, 705, 12, 16413);
    			attr_dev(div10, "class", "svelte-1tjwbrs");
    			add_location(div10, file$D, 706, 12, 16437);
    			attr_dev(div11, "class", "svelte-1tjwbrs");
    			add_location(div11, file$D, 707, 12, 16461);
    			attr_dev(div12, "class", "svelte-1tjwbrs");
    			add_location(div12, file$D, 708, 12, 16485);
    			attr_dev(div13, "class", "svelte-1tjwbrs");
    			add_location(div13, file$D, 709, 12, 16509);
    			attr_dev(div14, "class", "svelte-1tjwbrs");
    			add_location(div14, file$D, 710, 12, 16533);
    			attr_dev(div15, "class", "svelte-1tjwbrs");
    			add_location(div15, file$D, 711, 12, 16557);
    			attr_dev(div16, "class", "svelte-1tjwbrs");
    			add_location(div16, file$D, 712, 12, 16581);
    			attr_dev(div17, "class", "svelte-1tjwbrs");
    			add_location(div17, file$D, 713, 12, 16605);
    			attr_dev(div18, "class", "svelte-1tjwbrs");
    			add_location(div18, file$D, 714, 12, 16629);
    			attr_dev(div19, "class", "svelte-1tjwbrs");
    			add_location(div19, file$D, 715, 12, 16653);
    			attr_dev(div20, "class", "Colors svelte-1tjwbrs");
    			add_location(div20, file$D, 695, 8, 16164);
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
    		source: "(695:4) <Area title=\\\"Colors\\\">",
    		ctx
    	});

    	return block;
    }

    // (720:4) <Area title="Grid Layout">
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
    			attr_dev(div0, "class", "StyleGuide Main__brand svelte-1tjwbrs");
    			add_location(div0, file$D, 721, 12, 16774);
    			attr_dev(div1, "class", "StyleGuide  Main__nav svelte-1tjwbrs");
    			add_location(div1, file$D, 722, 12, 16829);
    			attr_dev(div2, "class", "StyleGuide  Main__header svelte-1tjwbrs");
    			add_location(div2, file$D, 723, 12, 16883);
    			attr_dev(div3, "class", "StyleGuide  Content__header svelte-1tjwbrs");
    			add_location(div3, file$D, 726, 20, 17050);
    			attr_dev(div4, "class", "StyleGuide  Content__nav svelte-1tjwbrs");
    			add_location(div4, file$D, 727, 20, 17118);
    			attr_dev(article0, "class", "StyleGuide  Area svelte-1tjwbrs");
    			add_location(article0, file$D, 729, 24, 17247);
    			attr_dev(article1, "class", "StyleGuide  Area svelte-1tjwbrs");
    			add_location(article1, file$D, 730, 24, 17316);
    			attr_dev(article2, "class", "StyleGuide  Area svelte-1tjwbrs");
    			add_location(article2, file$D, 731, 24, 17385);
    			attr_dev(div5, "class", "StyleGuide  Content__area svelte-1tjwbrs");
    			add_location(div5, file$D, 728, 20, 17183);
    			attr_dev(div6, "class", "StyleGuide  Content__footer svelte-1tjwbrs");
    			add_location(div6, file$D, 733, 20, 17477);
    			attr_dev(div7, "class", "StyleGuide  Content svelte-1tjwbrs");
    			add_location(div7, file$D, 725, 16, 16996);
    			attr_dev(div8, "class", "StyleGuide  Main__content svelte-1tjwbrs");
    			add_location(div8, file$D, 724, 12, 16940);
    			attr_dev(div9, "class", "StyleGuide  Main__footer svelte-1tjwbrs");
    			add_location(div9, file$D, 736, 12, 17579);
    			attr_dev(div10, "class", "StyleGuide  Main__totop svelte-1tjwbrs");
    			add_location(div10, file$D, 737, 12, 17636);
    			attr_dev(div11, "class", "StyleGuide Main svelte-1tjwbrs");
    			add_location(div11, file$D, 720, 8, 16732);
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
    		source: "(720:4) <Area title=\\\"Grid Layout\\\">",
    		ctx
    	});

    	return block;
    }

    // (742:4) <Area title="Full Simple Card">
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
    		source: "(742:4) <Area title=\\\"Full Simple Card\\\">",
    		ctx
    	});

    	return block;
    }

    // (751:12) <Card              title="Title" description="Lorem ipsum dolor sit amet consectetur adipisicing."             variante={1}             >
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
    		source: "(751:12) <Card              title=\\\"Title\\\" description=\\\"Lorem ipsum dolor sit amet consectetur adipisicing.\\\"             variante={1}             >",
    		ctx
    	});

    	return block;
    }

    // (769:16) <span slot="hasSvg">
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
    			attr_dev(circle0, "class", "svelte-1tjwbrs");
    			add_location(circle0, file$D, 771, 16, 18939);
    			attr_dev(circle1, "cx", "15135.5");
    			attr_dev(circle1, "cy", "3089.34");
    			attr_dev(circle1, "r", "1097.64");
    			attr_dev(circle1, "fill", "none");
    			attr_dev(circle1, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle1, "transform", "matrix(.03822 0 0 .03822 -536 -33.668)");
    			attr_dev(circle1, "class", "svelte-1tjwbrs");
    			add_location(circle1, file$D, 773, 16, 19120);
    			attr_dev(circle2, "cx", "15135.5");
    			attr_dev(circle2, "cy", "3089.34");
    			attr_dev(circle2, "r", "1097.64");
    			attr_dev(circle2, "fill", "none");
    			attr_dev(circle2, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle2, "transform", "matrix(.03822 0 0 .03822 -493.61 -33.668)");
    			attr_dev(circle2, "class", "svelte-1tjwbrs");
    			add_location(circle2, file$D, 775, 24, 19307);
    			attr_dev(circle3, "cx", "15135.5");
    			attr_dev(circle3, "cy", "3089.34");
    			attr_dev(circle3, "r", "1097.64");
    			attr_dev(circle3, "fill", "none");
    			attr_dev(circle3, "vector-effect", "non-scaling-stroke");
    			attr_dev(circle3, "stroke-width", "13.08");
    			attr_dev(circle3, "transform", "matrix(.07644 0 0 .07644 -1072.51 -151.74)");
    			attr_dev(circle3, "class", "svelte-1tjwbrs");
    			add_location(circle3, file$D, 777, 24, 19509);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-miterlimit", "2");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "viewBox", "0 0 169 169");
    			attr_dev(svg, "class", "svelte-1tjwbrs");
    			add_location(svg, file$D, 769, 16, 18758);
    			attr_dev(span, "slot", "hasSvg");
    			attr_dev(span, "class", "svelte-1tjwbrs");
    			add_location(span, file$D, 768, 16, 18721);
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
    		source: "(769:16) <span slot=\\\"hasSvg\\\">",
    		ctx
    	});

    	return block;
    }

    // (750:8) <Cards>
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
    				description: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    				variante: 1,
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				title: "Variante 3",
    				description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, perspiciatis dicta molestiae facilis minima.",
    				image: "img/img1.jpg"
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				title: "With inlne svg instead image",
    				description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, perspiciatis dicta molestiae facilis minima.",
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
    				description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, distinctio libero quasi non voluptatibus nisi aut adipisci hic reprehenderit ipsum",
    				variante: 3
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				title: "Éste tampoco...",
    				hasImage: false,
    				description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, distinctio libero quasi non voluptatibus nisi aut adipisci hic reprehenderit ipsum?",
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
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(750:8) <Cards>",
    		ctx
    	});

    	return block;
    }

    // (749:4) <Area title="Group Cards">
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
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(749:4) <Area title=\\\"Group Cards\\\">",
    		ctx
    	});

    	return block;
    }

    // (796:4) <Area title="Images">
    function create_default_slot_26(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1tjwbrs");
    			add_location(img, file$D, 796, 8, 20401);
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
    		source: "(796:4) <Area title=\\\"Images\\\">",
    		ctx
    	});

    	return block;
    }

    // (800:4) <Banner variante={0}>
    function create_default_slot_25(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Banner (inverted variant) with simple text inside");
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
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(800:4) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (804:4) <Banner variante={1}>
    function create_default_slot_24(ctx) {
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
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(804:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (808:4) <Banner variante={2}>
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
    		source: "(808:4) <Banner variante={2}>",
    		ctx
    	});

    	return block;
    }

    // (815:16) <Tab>
    function create_default_slot_22(ctx) {
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
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(815:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (816:16) <Tab>
    function create_default_slot_21(ctx) {
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
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(816:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (817:16) <Tab>
    function create_default_slot_20(ctx) {
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
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(817:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (818:16) <Tab>
    function create_default_slot_19(ctx) {
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
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(818:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (814:12) <TabList>
    function create_default_slot_18(ctx) {
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
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab2 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab3 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_19] },
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
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(814:12) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (821:12) <TabPanel>
    function create_default_slot_17(ctx) {
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
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(821:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (825:12) <TabPanel>
    function create_default_slot_16(ctx) {
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
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(825:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (829:12) <TabPanel>
    function create_default_slot_15$1(ctx) {
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
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(829:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (833:12) <TabPanel>
    function create_default_slot_14$1(ctx) {
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
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(833:12) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (813:8) <Tabs>
    function create_default_slot_13$1(ctx) {
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
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel0 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel1 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel2 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_15$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel3 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_14$1] },
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
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(813:8) <Tabs>",
    		ctx
    	});

    	return block;
    }

    // (812:4) <Area title="Tabs">
    function create_default_slot_12$1(ctx) {
    	let tabs;
    	let current;

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot_13$1] },
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
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(812:4) <Area title=\\\"Tabs\\\">",
    		ctx
    	});

    	return block;
    }

    // (839:4) <Area title="Component Header">
    function create_default_slot_11$1(ctx) {
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
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(839:4) <Area title=\\\"Component Header\\\">",
    		ctx
    	});

    	return block;
    }

    // (863:10) <SwipeItem>
    function create_default_slot_9$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img0.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1tjwbrs");
    			add_location(img, file$D, 863, 12, 22054);
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
    		source: "(863:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (866:10) <SwipeItem>
    function create_default_slot_8$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img4.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1tjwbrs");
    			add_location(img, file$D, 866, 12, 22143);
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
    		source: "(866:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (869:10) <SwipeItem>
    function create_default_slot_7$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img2.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1tjwbrs");
    			add_location(img, file$D, 869, 12, 22232);
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
    		source: "(869:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (872:10) <SwipeItem>
    function create_default_slot_6$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "img/img3.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1tjwbrs");
    			add_location(img, file$D, 872, 12, 22321);
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
    		source: "(872:10) <SwipeItem>",
    		ctx
    	});

    	return block;
    }

    // (862:8) <Swipe {showIndicators} {autoplay} {delay} {transitionDuration} {defaultIndex}>
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
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(862:8) <Swipe {showIndicators} {autoplay} {delay} {transitionDuration} {defaultIndex}>",
    		ctx
    	});

    	return block;
    }

    // (878:4) <Banner variante={0}>
    function create_default_slot_4$3(ctx) {
    	let blockquote;
    	let t;
    	let iconespiral;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				variante: 1,
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
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(878:4) <Banner variante={0}>",
    		ctx
    	});

    	return block;
    }

    // (882:4) <Banner variante={1}>
    function create_default_slot_3$4(ctx) {
    	let blockquote;
    	let t;
    	let iconespiral;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				variante: 2,
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
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(882:4) <Banner variante={1}>",
    		ctx
    	});

    	return block;
    }

    // (886:4) <Banner variante={2}>
    function create_default_slot_2$6(ctx) {
    	let blockquote;
    	let t;
    	let iconespiral;
    	let current;

    	blockquote = new BlockQuote({
    			props: {
    				variante: 0,
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
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(886:4) <Banner variante={2}>",
    		ctx
    	});

    	return block;
    }

    // (644:0) <ContentArea>
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
    	let area13;
    	let t16;
    	let div;
    	let swipe;
    	let t17;
    	let banner3;
    	let t18;
    	let banner4;
    	let t19;
    	let banner5;
    	let current;

    	area0 = new Area({
    			props: {
    				title: "Typography",
    				$$slots: { default: [create_default_slot_40] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area1 = new Area({
    			props: {
    				title: "Icons and graphics",
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area2 = new Area({
    			props: {
    				title: "Figure",
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area3 = new Area({
    			props: {
    				title: "Toggle Menu",
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area4 = new Area({
    			props: {
    				title: "Buttons",
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area5 = new Area({
    			props: {
    				title: "Brand",
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area6 = new Area({
    			props: {
    				title: "Colors",
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area7 = new Area({
    			props: {
    				title: "Grid Layout",
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area8 = new Area({
    			props: {
    				title: "Full Simple Card",
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area9 = new Area({
    			props: {
    				title: "Group Cards",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area10 = new Area({
    			props: {
    				title: "Images",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner0 = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner1 = new Banner({
    			props: {
    				variante: 1,
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner2 = new Banner({
    			props: {
    				variante: 2,
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area11 = new Area({
    			props: {
    				title: "Tabs",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area12 = new Area({
    			props: {
    				title: "Component Header",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	area13 = new Area({
    			props: { title: "Fetching Json data from service" },
    			$$inline: true
    		});

    	swipe = new Swipe({
    			props: {
    				showIndicators: /*showIndicators*/ ctx[2],
    				autoplay: /*autoplay*/ ctx[0],
    				delay: /*delay*/ ctx[1],
    				transitionDuration: /*transitionDuration*/ ctx[3],
    				defaultIndex: /*defaultIndex*/ ctx[4],
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	banner3 = new Banner({
    			props: {
    				variante: 0,
    				$$slots: { default: [create_default_slot_4$3] },
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
    				$$slots: { default: [create_default_slot_2$6] },
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
    			create_component(area13.$$.fragment);
    			t16 = space();
    			div = element("div");
    			create_component(swipe.$$.fragment);
    			t17 = space();
    			create_component(banner3.$$.fragment);
    			t18 = space();
    			create_component(banner4.$$.fragment);
    			t19 = space();
    			create_component(banner5.$$.fragment);
    			attr_dev(div, "class", "swipe-holder svelte-1tjwbrs");
    			add_location(div, file$D, 860, 4, 21905);
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
    			mount_component(area13, target, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(swipe, div, null);
    			insert_dev(target, t17, anchor);
    			mount_component(banner3, target, anchor);
    			insert_dev(target, t18, anchor);
    			mount_component(banner4, target, anchor);
    			insert_dev(target, t19, anchor);
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
    			const area13_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				area13_changes.$$scope = { dirty, ctx };
    			}

    			area13.$set(area13_changes);
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
    			transition_in(area13.$$.fragment, local);
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
    			transition_out(area13.$$.fragment, local);
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
    			destroy_component(area13, detaching);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div);
    			destroy_component(swipe);
    			if (detaching) detach_dev(t17);
    			destroy_component(banner3, detaching);
    			if (detaching) detach_dev(t18);
    			destroy_component(banner4, detaching);
    			if (detaching) detach_dev(t19);
    			destroy_component(banner5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(644:0) <ContentArea>",
    		ctx
    	});

    	return block;
    }

    // (643:0) <Content>
    function create_default_slot$8(ctx) {
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
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(643:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
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
    				$$slots: { default: [create_default_slot$8] },
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
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Styleguide",
    			options,
    			id: create_fragment$G.name
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

    function create_fragment$H(ctx) {
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
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$H.name
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
