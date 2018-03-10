
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
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/25984542
 * @param {Array} array
 * @return {Array}
 */
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 *
 * @param {Node} a
 * @param {Node} b
 */
function swapDOMNodes(a, b) {
    var parent = a.parentNode;
    var temp = document.createElement('div');
    parent.insertBefore(temp, a);
    parent.replaceChild(a, b);
    parent.replaceChild(b, temp);
}

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
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var path = this.popup.querySelector('.door-first__path');

    path.addEventListener('pointerdown', function (e) {
        path.releasePointerCapture(e.pointerId);
        var op = getOffsetProps(e);

        if (op.x < 40 && op.y < 75) {
            this.popup.classList.add('door-first__path_started');
        }
    }.bind(this));

    path.addEventListener('pointerout', function (e) {
        var op = getOffsetProps(e);
        if (this.popup.classList.contains('door-first__path_started') && op.x < 30 && op.y > 160 && op.y < 200) {
            this.unlock();
        } else {
            this.popup.classList.remove('door-first__path_started');
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
        if (e.target.classList.contains('door-second__progress')) {
            e.target.style.height = '0px';
            return;
        }

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

    this.puzzle = this.popup.querySelector('.door-third__puzzle');
    this.cellStart = null;

    var rows = 3;
    var cols = 3;
    var cellSideLen = 80;
    var fragment = document.createDocumentFragment();

    var cellStart;
    var elements = [];

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var el = document.createElement('div');
            el.classList.add('door-third__cell');
            el.setAttribute('data-position', r * rows + c);
            el.style.backgroundPositionX = (-1 * c * cellSideLen) + 'px';
            el.style.backgroundPositionY = (-1 * r * cellSideLen) + 'px';
            elements.push(el);
        }
    }

    shuffle(elements).forEach(function (element) {
        fragment.appendChild(element);
    });


    function checkCondition() {
        var cells = this.puzzle.querySelectorAll('.door-third__cell');
        var prevPos = parseInt(cells[0].dataset.position, 10);
        var curPos;
        for (var i = 1; i < cells.length; i++) {
            curPos = parseInt(cells[i].dataset.position, 10);
            if (curPos < prevPos) {
                return;
            }
            prevPos = curPos;
        }
        setTimeout(function () {
            this.unlock();
        }.bind(this), 100);
    }

    function onPointerDown(e) {
        e.target.releasePointerCapture(e.pointerId);
        this.cellStart = e.target;
    }
    function onPointerUp(e) {
        swapDOMNodes(this.cellStart, e.target);
        checkCondition.apply(this);
    }

    this.puzzle.addEventListener('pointerdown', onPointerDown.bind(this));
    this.puzzle.addEventListener('pointerup', onPointerUp.bind(this));
    this.puzzle.appendChild(fragment);

    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function () {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
