interface IDisposable {
    dispose();
}

interface IEventSource
    extends IDisposable {

    on(event: string, handler: (eventArgs, sender) => void, context?: any): number;

    once(event: string, handler: (eventArgs, sender) => void, context?: any): number;

    off(event: string, subscriptionId?: number);
}

interface IHttpUtils {
    ajax(uri: string, method: string, data?: any, contentType?: string, headers?: any): Promise;

    get(uri: string, headers?: any): Promise;

    post(uri: string, data: any, contentType?: string, headers?: any): Promise;
}

interface IServiceLocator {
    register(regostrations: any);

    register(serviceName: string, resolveRule: Array);

    registerInstance(serviceName: string, service: any);

    resolve(serviceName: string): Promise<any>;
}