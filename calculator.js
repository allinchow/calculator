var defaults = {
    parent: document.body,
    keysValues: ['AC', 'C', '+/-', '/', 
                    7, 8, 9, '*', 
                    4, 5, 6, '-', 
                    1, 2, 3, '+', 
                    0, '.', '=']
};


(function(){
    function StrangeCalc (options) {

        this._parent = options && options.parent || defaults.parent;
        
        this._render();  

        this._screen = this._parent.getElementsByClassName('sc-screen')[0];  
        this._btnWrap = this._parent.getElementsByClassName('sc-btn-wrap')[0];

        this._btnWrap.onclick = this._click.bind(this);


        this._params = {
            x: null,
            method: null,
            y: null,
            methodActivated: null
        };
    }

    StrangeCalc.prototype._render = function() {

        var wrap = document.createElement('div');
            wrap.className = 'strange-calc';

        var screen = document.createElement('div');
            screen.className = 'sc-screen';
            screen.textContent = '0';

        var btnWrap = document.createElement('div');
            btnWrap.className = 'sc-btn-wrap';

        var keysValues = defaults.keysValues;
        var btns = '';

        for (var i = 0; i < keysValues.length; i++) {
            var btnClass;
            var keyValue = keysValues[i];

            if (typeof keyValue === 'number' || keyValue === '.') {
                btnClass = 'num'
                
                if (keyValue === 0) btnClass += ' sc-btn-wide';
               
            } else {
                btnClass = 'func';
            }
            
            btns += '<button class="sc-'+ btnClass + '">' + keyValue + '</button>  ';
        }

        wrap.appendChild(screen);
        btnWrap.innerHTML = btns;
        wrap.appendChild(btnWrap);

        this._parent.appendChild(wrap);
    };


    StrangeCalc.prototype['='] = function(currScreen, currBtnValue) {
        
        if (!this._params.x || !this._params.method) return;

        this._params.y = currScreen;
        this._screen.textContent = this._params.x = eval(this._params.x + this._params.method + this._params.y);
        // я знаю про eval - что его лучше не использовать, но тут он заменяет сразу 4 метода.
        // Нормально ли так оставить?

        if (currBtnValue !== '=') {
            this._params.method = currBtnValue;
        } else {
            this._params.method = null;
        }
        
        this._params.y = null;

        
    };

    StrangeCalc.prototype._specialMethods = {
        'AC': function() {
            for(var key in this._params) {
                this._params[key] = null;
            }

            this._screen.textContent = '0';
        },
        'C': function(currScreen) {
            if (currScreen.length === 1) return;

            this._screen.textContent = currScreen.slice(0,-1); 
        },
        '+/-': function(currScreen) {
            if (currScreen.charAt(0) === '-') {
                this._screen.textContent = currScreen.slice(1);
            } else {
                this._screen.textContent = '-' + currScreen;
            }
        }
    };

    StrangeCalc.prototype._actionsWithNum = function(currScreen, currBtnValue) {
        if (currScreen.length > 10) return;

        if (currScreen === '0' && currBtnValue !== '.') {
            this._screen.textContent = parseFloat(currBtnValue);
        } else if (this._params.methodActivated) {
            this._screen.textContent = currBtnValue;
            this._params.methodActivated = false;

        } else {
            this._screen.textContent += currBtnValue;
        }

    };

    StrangeCalc.prototype._actionsWithFunc = function(currScreen, currBtnValue) {
        
        if (Object.keys(this._specialMethods).indexOf(currBtnValue) > -1) {

                this._specialMethods[currBtnValue].call(this, currScreen);
                return;
            }

        if (currBtnValue === '=') {
            this['='](currScreen, currBtnValue);
            return;
        }

        if (!this._params.method) {
            this._params.x = currScreen;
            this._params.method = currBtnValue;
            
        } else {
            this['='](currScreen, currBtnValue);
        }

        this._params.methodActivated = true;
    };

    StrangeCalc.prototype._click = function (e) {
        var currBtn = e.target;
        var currBtnValue = currBtn.textContent;
        var currScreen = this._screen.textContent;

        if (currBtn.className.indexOf('num') > -1) { // если нажата цифра или .
            this._actionsWithNum(currScreen, currBtnValue);
        } else {
            this._actionsWithFunc(currScreen, currBtnValue);
        }
    };


    var calc = new StrangeCalc({
        parent: document.querySelector('.calc-wrapper1')
    });

    // var calc2 = new StrangeCalc({
    //     parent: document.querySelector('.calc-wrapper2')
    // });

})();