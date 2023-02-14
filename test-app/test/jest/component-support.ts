/**
 * Uses jest.mock to wrap the `Component` annotation to replace `templateUrl` and `styleUrls` at runtime.
 * Uses node.js require to resolve the paths. Ensure to configure transformers for all the extensions you use
 * in components. E.g. html, css, scss, less ...
 *
 * See `file-transformer.js` as an example.
 */
function getContentsRelativeFromOrigin(filename: string | undefined, depth: number) {
    let path = '.';

    if (!filename?.startsWith('/')) {
        const stack = new Error().stack!.split('\n');
        const stack3 = stack[depth].split('(');
        path = stack3.pop()?.replace?.(/(:\d+)*\).*$/, '') ?? '.';
    }

    return () => {
        // @ts-ignore
        const {dirname, resolve} = require('path');
        const file = path ? resolve(dirname(path), filename) : filename;

        // @ts-ignore
        return require(file);
    };
}

jest.mock('@angular/core', () => {
    const originalModule = jest.requireActual('@angular/core');
    const mocked = new WeakMap<object, object>();
    type ComponentType = {templateUrl?: string; styleUrls?: string[]; styles?: string[]; template?: string};
    const Component = Object.assign(function (definition: ComponentType, ...rest: unknown[]) {
        let mockedDefinition: ComponentType | undefined = mocked.get(definition);

        if (!mockedDefinition) {
            mockedDefinition = {...definition};

            if (mockedDefinition.templateUrl) {
                Object.defineProperty(mockedDefinition, 'template', {
                    get: getContentsRelativeFromOrigin(mockedDefinition.templateUrl, 3),
                });
                delete mockedDefinition.templateUrl;
            }

            if (mockedDefinition.styleUrls) {
                const styles = mockedDefinition.styleUrls.map((url) => getContentsRelativeFromOrigin(url, 5));
                Object.defineProperty(mockedDefinition, 'styles', {
                    get: () => styles.map((fn) => fn()),
                });
                delete mockedDefinition.styleUrls;
            }

            mocked.set(definition, mockedDefinition);
        }

        return originalModule.Component(mockedDefinition, ...rest);
    }, originalModule.Component);

    return {
        ...originalModule,
        Component,
    };
});

export const enableJestAngularComponentSupport = () => {};
