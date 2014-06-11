(function () {
    var notificationChecked = JSON.parse(localStorage['akaCannon'] || '{}');

    overwriteNotification();

    window.addEventListener('hashchange', function () {
        setTimeout(initCheckbox, 100);
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
        var text = document.createTextNode('Notify');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', 'enableNotification');
        span.setAttribute('style', 'margin: 0 10px; font-size: 0.9em;');
        span.appendChild(text);
        span.appendChild(input);
        var HeaderBtn = document.querySelector('.chatRoomHeaderBtn');
        HeaderBtn.insertBefore(span, HeaderBtn.firstElementChild);

        initCheckbox();
        input.addEventListener('change', changeCheckbox);
        return true;
    }

    function initCheckbox () {
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        var input = document.querySelector('#enableNotification');
        if (!input || !_roomTitleText) {
            return;
        }
        input.checked = !notificationChecked[_roomTitleText.textContent];
    }

    function changeCheckbox (e) {
        e.preventDefault();
        e.stopPropagation();
        var _roomTitleText = document.querySelector('#_roomTitle ._roomTitleText');
        notificationChecked[_roomTitleText.textContent] = !this.checked;
        if (!notificationChecked[_roomTitleText.textContent]) {
            delete notificationChecked[_roomTitleText.textContent];
        }
        localStorage['akaCannon'] = JSON.stringify(notificationChecked);
    }

    function overwriteNotification () {
        var createNotification = window.NotificationAPI.createNotification;
        window.NotificationAPI.createNotification = function (icon, title, message) {
            if (notificationChecked[title]) {
                return {
                    'show' : function () {}
                };
            }
            return createNotification.apply(window.NotificationAPI, arguments);
        };
    }
})();
