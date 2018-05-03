import EventSource from './../utils/EventSource.js';
import * as html from './../utils/html.js';

import GameLoop from '../GameLoop.js';

'use strict';

const textLines = [
    'Test game',
    'Disciples battle engine demo'
];

const textPhases = {
    beforeFadeIn: 0,
    fadingIn: 1,
    fullDisplay: 2,
    fadeOut: 3,
    afterFadeOut: 4
};

const
    blankTime = 300,
    fadeInTime = 300,
    fadeOutTime = 300,
    textReadTime = 1000;

export default class LogoScreen extends EventSource {
    constructor(canvas) {
        super();

        this._loop = new GameLoop(this.update.bind(this), this.render.bind(this), this._hideInternal.bind(this));

        /** @type {HTMLCanvasElement} */
        this._canvas = canvas;
        this._canvas.style.backgroundColor = '#000';
        this._drawContext = null;

        this._clickHandler = this.handleClick.bind(this);
        this._canvas.addEventListener('click', this._clickHandler);

        /** @public */
        this.ready = Promise.resolve();

        this._state = {
            currentSlideIndex: -1,
            phase: -1,
            transparency: 0,
            diff: 0
        };
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
        this._drawContext.textAlign = 'center';
        this._drawContext.font = '24px Courier New';

        this._state.currentSlideIndex = 0;
        this._state.phase = textPhases.beforeFadeIn;

        this._loop.start();
    }

    hide() {
        if (this._loop.isRunning)
            this._loop.stop();
        else
            this._hideInternal();
    }

    handleClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.hide();
    }

    update(delta) {
        const state = this._state;

        state.diff += delta;
        switch (state.phase) {
            case textPhases.beforeFadeIn: // 0
                if (state.diff <= blankTime) {
                    state.transparency = 0;
                    break;
                }
                else {
                    state.diff -= blankTime;
                    state.phase++;
                }
            case textPhases.fadingIn: // 1
                if (state.diff <= fadeInTime) {
                    state.transparency = state.diff / fadeInTime;
                    break;
                }
                else {
                    state.diff -= fadeInTime;
                    state.phase++;
                }
            case textPhases.fullDisplay: // 2
                if (state.diff <= textReadTime) {
                    state.transparency = 1;
                    break;
                }
                else {
                    state.diff -= textReadTime;
                    state.phase++;
                }
            case textPhases.fadeOut: // 3
                if (state.diff <= fadeOutTime) {
                    state.transparency = 1 - state.diff / fadeOutTime;
                    break;
                }
                else {
                    state.diff -= fadeOutTime;
                    state.phase++;
                }
                break;
            case textPhases.afterFadeOut: // 4
                if (state.diff <= blankTime) {
                    state.transparency = 0;
                    break;
                }
                else {
                    state.phase = 0;
                    state.diff = 0;
                    state.currentSlideIndex++;
                }
        }

        // return true if we have slides to show
        return state.currentSlideIndex < textLines.length;
    }

    render() {
        const ctx = this._drawContext;
        ctx.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

        const text = textLines[this._state.currentSlideIndex];
        const t = Math.round(this._state.transparency * 255);
        ctx.fillStyle = 'rgb(' + t + ',' + t + ',' + t + ')';

        ctx.fillText(text, this._canvas.clientWidth / 2, this._canvas.clientHeight / 2);

        return true;
    }

    _hideInternal() {
        this._drawContext = null;
        this._canvas.removeEventListener('click', this._clickHandler);

        this.dispatchEvent(LogoScreen.evnClose);
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