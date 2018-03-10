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
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var path = this.popup.querySelector('.door-third__path');

    path.addEventListener('pointerdown', function (e) {
        path.releasePointerCapture(e.pointerId);
        var op = getOffsetProps(e);

        if (op.x < 40 && op.y < 75) {
            this.popup.classList.add('door-third__path_started');
        }
    }.bind(this));

    path.addEventListener('pointerout', function (e) {
        var op = getOffsetProps(e);
        if (this.popup.classList.contains('door-third__path_started') && op.x < 30 && op.y > 160 && op.y < 200) {
            this.unlock();
        } else {
            this.popup.classList.remove('door-third__path_started');
        }
    }.bind(this));
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    this.bars = [
        this.popup.querySelector('.door-second__bar_0'),
        this.popup.querySelector('.door-second__bar_1'),
    ];


    function onBarPoinerDown(e) {
        var bar = e.target;
        var op = getOffsetProps(e);
        if (!bar.classList.contains('door-second__bar_started') && op.y < 20) {
            bar.classList.add('door-second__bar_started');
        }
    }

    function onBarPoinerMove(e) {
        var bar = e.target;
        var op = getOffsetProps(e);
        if (bar.classList.contains('door-second__bar_started')) {
            bar.querySelector('.door-second__progress').style.height = op.y + 'px';
        }
        if (op.y > 180) {
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
        var op = getOffsetProps(e);

        if (op.y < 180) {
            bar.querySelector('.door-second__progress').style.height = '0px';
        }
        checkCondition.call(this, e);
    }

    var _onBarPointerLost = onBarPointerLost.bind(this);

    this.bars.forEach(function (bar) {
        bar.addEventListener('pointerdown', onBarPoinerDown);
        bar.addEventListener('pointermove', onBarPoinerMove);
        bar.addEventListener('pointerup', _onBarPointerLost);
        bar.addEventListener('pointerleave', _onBarPointerLost);
    });

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
