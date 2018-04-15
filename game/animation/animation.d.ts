interface IAnimatable {
    speed: number;

    begin(animationStart: Date): Promise;

    update(timeStamp: Date);

    isComplete: boolean;
}