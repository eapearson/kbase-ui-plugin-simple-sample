/* DOC: requirejs define
 * Note that this is an anonymous define. The module name for this panel is 
 * provided in require-config.js, which associates a string key with this module file.
 * The only dependency required to implement a panel is a promises library,
 * in this case Q (cit. here).
 * It is very commong to have jquery and kb.html also included, as they
 * assist greatly in building html and manipulating the DOM, and kb.runtime
 * since it is the primary interface to the user interface runtime.
 * In addition, any widgets will need to be included here as well.
 * (Well, some usage patterns may load widgets in a different way, but this
 *  sample panel represents a moderately straightforward implementation.)
 *  
 *  Formatting: I find that listing each module name on a separate line 
 *  enhances readability.
 * 
 */
define([
    'bluebird',
    'kb_common/html',
    'kb_common/bootstrapUtils',
    './lib/utils'
], function (
    Promise, 
    html, 
    BS,
    Utils
) {
    /* DOC: strict mode
        * We always set strict mode with the following magic javascript
        * incantation.
        */
    'use strict';

    /*
    * DOC: html helper module
    * The html helper module is quite useful for building 
    * html in a functional style. It has a generic tag function
    * builder, as well as methods to build more complex html
    * structures.
    */
    var t = html.tag,
        h2 = t('h1'),
        p = t('p'),
        div = t('div');

    function factory(config) {
        /* DOC: widget variables and factory pattern
            * In the factory pattery for object creation, we can just
            * declare variables within the factory function, and they 
            * are naturally available to all functions defined within.
            * 
            * In this case we need to store references to the original 
            * DOM node passed during attachment (mount), the DOM node
            * created by the Panel for its own use (container),
            * and an array of subwidgets (children).
            */
        var hostNode, container,
            runtime = config.runtime;

        /* DOC helper functions
            * Although not part of the Panel Interface, a common pattern is
            * to have a sert of helper functions. This assists in meeting 
            * the coding standard of short, understandable, single-purposed
            * functions.
            * A very common helper funcion is a renderer. A panel may have 
            * more then one render function, e.g. to represent different
            * states. In this case, the render function simply builds a
            * layout upon which it will attache widgets.
            * 
            */
        function layout() {
            /* DOC: return some structure
                * The render function returns enough structure to represent
                * what needs to be rendered. This is not hard-coded at all, 
                * and is just a convention within this panel. It has turned
                * out, however, to be a useful pattern.
                */
            return div({
                class: 'plugin_simple-sample_panel container-fluid'
            }, [
                div({
                    class: 'row'
                }, [
                    div({class: 'col-sm-6'}, [
                        h2('Sample Simple Plugin'),
                        p([
                            'This is a very simple sample plugin. It consists of just a single panel, with ',
                            'some helper functions in lib/utils.js.'
                        ]),
                        p([
                            'From this starting point one may build a more complex plugin.'
                        ]),
                        p([
                            'For instance, it is easy to hook in jquery widgets by instantiating them in either the ',
                            'attach or start methods. Knockout components can likewise be integrated simply by creating the ',
                            'appropriate markup.'
                        ]),
                        p([
                            'In the old days, as can be seen in the dashboard plugin, the plugin is composed of ',
                            'kbase-ui style widgets which are defined and then composed through the kb_widget module. ',
                            'This method was especially useful for migrating jquery-style widgets into kbase-ui, as can be ',
                            'seen in the dataview landing page plugin.',
                            'It was also useful for composing factory-style widgets based on the nunjucks (jinja clone) templating ',
                            'library, since the widgets are simply modules which can be composed of submodules, etc.'
                        ]),
                        p([
                            'A more recent approach is to compose a plugin out of knockout components, as can be seen in ',
                            'the auth2, RESKE search, and JGI search plugins.'
                        ]),
                        p([
                            'Hopefully there will be sample plugins demonstrating each of these techniques in a simplified and ',
                            'documented form.'
                        ])
                    ]),
                    div({class: 'col-sm-6'}, [
                        BS.buildPanel({
                            title: 'Sample Panel',
                            body: div([
                                p('This is a simple panel in a simple widget'),
                                p([
                                    'It does\'t do much other than demonstrate the relatively easy creation of ',
                                    'a bootstrap panel within a ui panel.'
                                ]),
                                p(Utils.something())
                            ])
                        })
                    ])
                ])
            ]);
        }

        /* DOC: init event
        * Since a panel implements the widget interface, it starts 
        * with an init event handler. The init event gives the panel
        * a chance to set up whetever it needs, and to fail early if
        * the proper conditions are not met.
        * In this case, we really just need to initialize the sub-widgets.
        * 
        */
        function init(config) {
            return null;
        }

        /* DOC: attach event
        * This attach() function implements the attach lifecycle event
        * in the Panel Widget lifecycle interface.
        * It is invoked at  point at which the parent environment has
        * obtained a concerete DOM node at which to attach this Panel,
        * and is ready to allow the Panel to attach itself to it.
        * The Panel should not do anything with the provided node
        * other than attach its own container node. This is because 
        * in some environments, it may be that the provided node is
        * long lived. A panel should not, for example, attach DOM listeners
        * to it.
        * 
        */
        function attach(node) {
            /* DOC: creating our attachment point
            *  Here we save the provided node in the mount variable,
            *  and attach our own container node to it. This pattern
            *  allows us to attach event listeners as we wish to 
            *  our own container, so that we have more control
            *  over it. E.g. we can destroy and recreate it if we
            *  want another set of event listeners and don't want
            *  to bother with managing them all individually.
            */
            hostNode = node;
            container = hostNode.appendChild(document.createElement('div'));

            /* DOC: implement widget manager attach lifecycle event
                * Okay, here we run all of the widgets through the 
                * 
                */
            return null;
        }
        function start(params) {
            /* DOC: dom access
            * In this case we are keeping things simple by using 
            * the plain DOM API. We could also use jquery 
            * here if we wish to.
            */
            container.innerHTML = layout();

            /* DOC: runtime interface
            * Since a panel title is also, logically, the title of
            * the "page" we use the runtimes event bus to emit the
            * 'title' event to the application. The application 
            * takes care of modifying the window panel to accomodate
            * it.
            */
            runtime.send('ui', 'setTitle', 'Simple Sample Plugin Title');
        }
        function run(params) {
            
        }
        function stop() {
            
        }
        function detach() {
            if (hostNode && container) {
                hostNode.removeChild(container);
            }
        }
        function destroy() {
            
        }

        /* Returning the widget
        The widget is returned as a simple JS object. In this case we have also hardened the object
        by usinng Object.freeze, which ensures that properties may not be added or modified.
        */
        return Object.freeze({
            init: init,
            attach: attach,
            start: start,
            run: run,
            stop: stop,
            detach: detach,
            destroy: destroy
        });
    }

    return {
        make: factory
    };
});