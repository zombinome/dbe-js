import EventSource from './../utils/EventSource.js';
import * as html from './../utils/html.js';

'use strict';

const textLines = [
    'Test game',
    'Disciples battle engine demo'
];

const
    blankTime = 300,
    fadeInTime = 300,
    fadeOutTime = 300,
    textReadTime = 2400;

export default class LogoScreen extends EventSource {
    constructor(canvas) {
        super();

        /** @type {HTMLCanvasElement} */
        this._canvas = canvas;
        this._drawContext = null;
        this._clickHandler = this.handleClick.bind(this);

        this.bgColor = '#000';
        this.textColor = '#fff';

        this._canvas.addEventListener('click', this._clickHandler);

        /** @public */
        this.ready = Promise.resolve();

        this._currentSlideIndex = -1;
        this._phase = -1;
        this._phaseStart = null;
        this._animationCallback = this.animate.bind(this);
        this._animationRequestId = null;
    }

    /**
     * @public
     */
    getState() {
        return null;
    }

    /**
     * @param state new screen state
     * @public
     */
    setState(state) {
    }

    /** @public */
    dispose() {
        this.hide();
        super.dispose();
    }

    show() {
        this._drawContext = this._canvas.getContext('2d');

        this._currentSlideIndex = 0;
        this._phase = 0;

        this._animationRequestId = window.requestAnimationFrame(this._animationCallback);
    }

    hide() {
        if (this._animationRequestId) {
            window.cancelAnimationFrame(this._animationRequestId);
        }

        this._drawContext = null;
        this._canvas.removeEventListener('click', this._clickHandler);
    }

    handleClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.dispatchEvent(LogoScreen.evnClose);
        this.hide();
    }

    animate(timeStamp) {
        if (!this._phaseStart) {
            this._phaseStart = timeStamp;
        }

        var diff = timeStamp - this._phaseStart;
        var value = 0;
        switch (this._phase) {
            case 0:
                if (diff <= blankTime) {
                    value = 0;
                    break;
                }
                else {
                    diff -= blankTime;
                    this._phaseStart += blankTime;
                    this._phase++;
                }
            case 1:
                if (diff <= fadeInTime) {
                    value = diff / fadeInTime;
                    break;
                }
                else {
                    diff -= fadeInTime;
                    this._phaseStart += fadeInTime;
                    this._phase++;
                }
            case 2:
                if (diff <= textReadTime) {
                    value = 1;
                    break;
                }
                else {
                    diff -= textReadTime;
                    this._phaseStart += textReadTime;
                    this._phase++;
                }
            case 3:
                if (diff <= fadeOutTime) {
                    value = 1 - diff / fadeOutTime;
                    break;
                }
                else {
                    diff -= fadeOutTime;
                    this._phaseStart += fadeOutTime;
                    this._phase++;
                }
                break;
            case 4:
                if (diff <= blankTime) {
                    value = 0;
                    break;
                }
                else {
                    this._phase = 0;
                    this._timeStamp = null;
                    this._currentSlideIndex++;
                }
        }

        if (this._currentSlideIndex >= textLines.length) {
            this.handleClick();
            return;
        }

        this._drawContext.globalAlpha = 1;
        this._drawContext.fillStyle = this.bgColor;
        this._drawContext.fillRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

        const text = textLines[this._currentSlideIndex];
        this._drawContext.globalAlpha = value;
        this._drawContext.fillStyle = this.textColor;
        this._drawContext.textAlign = 'center';
        this._drawContext.font = '24px Courier New';
        this._drawContext.fillText(text, this._canvas.clientWidth / 2, this._canvas.clientHeight / 2);

        this._animationRequestId = window.requestAnimationFrame(this._animationCallback);
    }
}

LogoScreen.evnClose = 'close';

/*
    Концепция экранов:
    Вся игра представляет собой переход между экранами.
    Каждый экран реализует собой определенную законченную часть игры.
    Активными могут быть несколько экранов одновременно.
    Существует стек экранов, который определяет порядок их отрисовки.
    Каждый игровой экран реализует контракт IGameScreen.
    Каждый игровой экран может при закрытии вернуть свое текущее состояние, которое будет сохранено и использовано для
    повторной инициализации экрана. Если ничего не вернулось, будет использовано состояние по-умолчанию.

    Передача состояния в другой экран?
    Глобальное состояние?
    Обновление глобального состояния?
    Оповещения об изменении состояний?

    visible/hidden, active/inactive, hasState/hasNoState
    У экрана есть внутреннее состояние
    Экран как сущность инициализируется в конструкторе, куда передаются все необходимые сервисы.


    Сразу после создания:
    hasNoState, inactive, hidden.

    Затем вызывается setState(), который выполняет первоначальную инициализацию внутреннего состояния.
    После инициализации состояния:
    hasState, inactive, hidden.

    hasState/hasNoState - флаг, устанавливаемый самим экраном
    остальные флаги сообщаются экрану игрой
*/

/*
    Анимация:
    - Изменение параметров отображения графического элемента с течением времени

    Фаза анимации
    - Изменение одного или нескольких параметров графического элемента с течением времени по одной и той же
    закономерности

        1. Анимация начинается в определенный момент времени (animationStart) и длится определенный момент времени
        2. Анимация может состоять из нескольких фаз. Каждая фаза имеет свою дительность.
        3. Одна и та же анимация может воспроизводиться с разной скоростью (нужен параметр speed = 1.0, по-умолчанию).
        4.
 */