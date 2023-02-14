declare let global: any;

export const globalObject: Window & {
    dataLayer: object[];
    ryInject: object;
    environment_ssr?: boolean;
    environment_browser?: boolean;
    environment: {test: boolean};
    jasmine?: typeof jest;
} = global;
