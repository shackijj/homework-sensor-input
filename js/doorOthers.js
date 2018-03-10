// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function (b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function (b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @param {event}
 * @return {{x: number, y: number}}
 */
function getOffsetProps(e) {
    var rect;
    if (!e.offsetX) {
        rect = e.target.getBoundingClientRect();
    }
    return {
        x: e.offsetX || e.clientX - rect.x,
        y: e.offsetY || e.clientY - rect.y,
    };
}

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    this.bars = [
        this.popup.querySelector('.door-second__bar_0'),
        this.popup.querySelector('.door-second__bar_1'),
    ];

    this.progress = this.popup.querySelector('.door-second__progress');

    function onBarPoinerDown(e) {
        var bar = e.target;
        var offsetProps = getOffsetProps(e);
        if (!bar.classList.contains('door-second__bar_started') && offsetProps.y < 20) {
            bar.classList.add('door-second__bar_started');
        }
    }

    function onBarPoinerMove(e) {
        var bar = e.target;
        var offsetProps = getOffsetProps(e);
        if (bar.classList.contains('door-second__bar_started')) {
            bar.querySelector('.door-second__progress').style.height = offsetProps.y + 'px';
        }
        if (offsetProps.y > 180) {
            bar.classList.add('door-second__bar_finished');
        }
    }

    function checkCondition(e) {
        var isOpened = true;
        this.bars.forEach(function (bar) {
            if (!bar.classList.contains('door-second__bar_finished')) {
                isOpened = false;
            }
        });
        if (isOpened) {
            if (this.isLocked) {
                this.unlock();
            }
        } else {
            this.bars.forEach(function (bar) {
                bar.classList.remove('door-second__bar_finished');
                bar.querySelector('.door-second__progress').style.height = '0px';
            });
        }
    }

    function onBarPointerLost(e) {
        var bar = e.target;
        var offsetProps = getOffsetProps(e);

        if (offsetProps.y < 180) {
            bar.querySelector('.door-second__progress').style.height = '0px';
        }
        checkCondition.call(this, e);
    }

    var _onBarPointerLost = onBarPointerLost.bind(this);

    this.bars.forEach(function (bar) {
        bar.addEventListener('pointerdown', onBarPoinerDown.bind(this));
        bar.addEventListener('pointermove', onBarPoinerMove.bind(this));
        bar.addEventListener('pointerup', _onBarPointerLost);
        bar.addEventListener('pointerleave', _onBarPointerLost);
    });

}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия третей двери здесь ====
    // Для примера дверь откроется просто по клику на неё
    this.popup.addEventListener('click', function () {
        this.unlock();
    }.bind(this));
    // ==== END Напишите свой код для открытия третей двери здесь ====
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия сундука здесь ====
    // Для примера сундук откроется просто по клику на него
    this.popup.addEventListener('click', function () {
        this.unlock();
    }.bind(this));
    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function () {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
