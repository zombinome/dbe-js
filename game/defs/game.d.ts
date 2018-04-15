interface IGameScreen
    extends IDisposable, IEventSource {
    getState(): any;

    setState(newState: any);

    domNode: HTMLElement;
    ready: Promise;
}