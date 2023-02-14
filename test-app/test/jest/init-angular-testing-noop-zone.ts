import {globalObject} from './global-object';

declare const global: Window & {environment: {test?: boolean}; environment_ssr?: boolean; environment_browser?: boolean};

function initAngularTestEnvironmentNoopZone() {
    const noop = () => {};
    const identity = (value: unknown) => value;
    const Zone = {
        __symbol__: identity,
        assertZonePatched: noop,
        current: {
            fork: () => Zone.current,
            get: identity,
            run: (fn: () => {}, self: unknown, args: []) => fn.apply(self, args),
        },
        fakeAsyncTest: {
            resetFakeAsyncZone: noop,
        },
    };

    // global.Zone has to exist as the testing modules access some functions directly instead of using the TestEnvironment dependency injection
    Object.assign(global, {Zone});

    // @ts-ignore
    require('core-js/proposals/reflect-metadata');
    // @ts-ignore
    const {NgZone, ɵNoopNgZone} = require('@angular/core');
    // @ts-ignore
    const {BrowserDynamicTestingModule, platformBrowserDynamicTesting} = require('@angular/platform-browser-dynamic/testing');
    // @ts-ignore
    const {getTestBed} = require('@angular/core/testing');

    getTestBed().initTestEnvironment(
        BrowserDynamicTestingModule,
        platformBrowserDynamicTesting([{provide: NgZone, useValue: new ɵNoopNgZone()}]),
    );
}

export function initGlobalVariables(): void {
    globalObject.environment_ssr = undefined;
    globalObject.environment_browser = true;
    globalObject.environment = {
        test: true,
    };

    globalObject.ryInject = {} as any;

    Object.defineProperty(global, 'dataLayer', {value: []});
}

export function initAngularTestingNoopZone() {
    initAngularTestEnvironmentNoopZone();
    initGlobalVariables();
}
