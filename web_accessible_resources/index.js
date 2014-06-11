(function () {
    var notificationChecked = JSON.parse(localStorage['akaCannon'] || '{}');
    (function () {
        Object.keys(notificationChecked).forEach(function (key) {
            var val = notificationChecked[key];
            if ('boolean' === typeof val) {
                notificationChecked[key] = {
                    'disabled' : val,
                    'notifyText' : []
                }
            }
        });
    })();

    overwriteNotification();

    window.addEventListener('hashchange', function () {
        setTimeout(function () {
            initCheckbox();
            initTextarea();
        }, 100);
    });

    var interval = setInterval(function () {
        var _loader = document.querySelector('#_loader');
        if (!_loader || _loader.style.display !== 'none') {
            return;
        }
        addCheckbox();
        clearInterval(interval);
    }, 1000);

    function addCheckbox () {
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        if (!_roomTitleText) {
            return;
        }

        var span = document.createElement('span');
        var input = document.createElement('input');
        var textarea = document.createElement('textarea');
        var text = document.createTextNode('Notify');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', 'enableNotification');
        textarea.setAttribute('id', 'notificationText');
        textarea.setAttribute('placeholder', 'Notification texts("\\n" separete)');
        textarea.setAttribute('style', 'vertical-align: top;');
        textarea.addEventListener('focus', function () {
            this.style.height = '400px';
        });
        textarea.addEventListener('blur', function () {
            this.style.height = '';
        });
        span.setAttribute('style', 'margin: 0 10px; font-size: 0.9em;');
        span.appendChild(text);
        span.appendChild(input);
        span.appendChild(textarea);
        var HeaderBtn = document.querySelector('.chatRoomHeaderBtn');
        HeaderBtn.insertBefore(span, HeaderBtn.firstElementChild);

        initCheckbox();
        initTextarea();
        input.addEventListener('change', changeCheckbox);
        textarea.addEventListener('change', changeTextarea);
        return true;
    }

    function initCheckbox () {
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        var input = document.querySelector('#enableNotification');
        if (!input || !_roomTitleText) {
            return;
        }
        var text = _roomTitleText.textContent;
        var notificationText = document.getElementById('notificationText');

        notificationChecked[text] = notificationChecked[text] || {};
        input.checked = !notificationChecked[text]['disabled'];
        notificationText.disabled = notificationChecked[text]['disabled'];
    }

    function initTextarea () {
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        if (!_roomTitleText) {
            return;
        }
        var text = _roomTitleText.textContent;
        var notificationText = document.getElementById('notificationText');

        notificationChecked[text] = notificationChecked[text] || {};
        notificationText.value = notificationChecked[text]['notifyText'] || '';
    }

    function changeCheckbox (e) {
        e.preventDefault();
        e.stopPropagation();
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        var text = _roomTitleText.textContent;
        var notificationText = document.getElementById('notificationText');

        notificationChecked[text] = notificationChecked[text] || {};
        notificationChecked[text]['disabled'] = !this.checked;
        notificationText.disabled = !this.checked;
        localStorage['akaCannon'] = JSON.stringify(notificationChecked);
    }

    function changeTextarea (e) {
        e.preventDefault();
        e.stopPropagation();
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        var text = _roomTitleText.textContent;
        notificationChecked[text] = notificationChecked[text] || {};
        notificationChecked[text]['notifyText'] = this.value;
        localStorage['akaCannon'] = JSON.stringify(notificationChecked);
    }

    function overwriteNotification () {
        var createNotification = window.NotificationAPI.createNotification;
        var emptyResponse = {
            'show' : function () {}
        };
        window.NotificationAPI.createNotification = function (icon, title, message) {
            if (!notificationChecked[title]) {
                return reateNotification.apply(window.NotificationAPI, arguments);
            }
            if (notificationChecked[title]['disabled']) {
                return emptyResponse;
            }
            if (!notificationChecked[title]['notifyText']) {
                return createNotification.apply(window.NotificationAPI, arguments);
            }
            if (notificationChecked[title]['notifyText'].some(function (ignore) {
                return ~title.indexOf(ignore);
            })) {
                return emptyResponse;
            }
            return createNotification.apply(window.NotificationAPI, arguments);
        };
    }
})();
