class Feedback {

    constructor(object = null) {

        /**
         *
         * @type {string}
         */
        this.type = '';

        /**
         *
         * @type {string}
         */
        this.url = '';

        /**
         *
         * @type {Array}
         */
        this.items = [];

        /**
         *
         * @private
         */
        this._click = this._onClick.bind(this);

        /**
         *
         * @private
         */
        this._response = this._onResponse.bind(this);

        /**
         *
         * @private
         */
        this._request = this._onRequest.bind(this);

        /**
         *
         * @type {Object}
         * @private
         */
        this._option = {};

        /**
         *
         * @type {string}
         * @private
         */
        this._classname = object === null ? '.feedback' : object;

        /**
         *
         * @type {string}
         * @private
         */
        this._itemname = '.feedback-action';

        /**
         *
         * @type {Element}
         * @private
         */
        this._main = document.querySelector(this._classname);
    }

    /**=====================
     *  Public Method
     =====================*/
    option(option = {}) {
        this._option = option;

        if (this._option.type !== undefined) {
            this.type = this._option.type;
        }

        if (this._option.items !== undefined) {
            this.items = this._option.items;
        }

        if (this._option.url !== undefined) {
            this.url = this._option.url;
        }
    }

    click(func) {
        this._click = func;
    }

    request(func) {
        this._request = func;
    }

    response(func) {
        this._response = func;
    }

    show() {
        this._builder();
        this._list_items = this._main.querySelectorAll(this._itemname);
        this._bindEvent();
    }
    /**=====================
     *  Private Method
     =====================*/
    _onClick(event){
        this._request({
            value: event.currentTarget.getAttribute('data-value')
        });
    }

    _onRequest(data) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const request = new Request(
            this.url,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
        );

        fetch(request).then(this._response).catch(this._onError);
    }

    _onResponse(response) {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Ops! Houve um erro em nosso servidor.');
        }
    }

    _onError(error) {
        console.error(error);
    }

    _builder() {
        this._main.innerHTML = '';

        let html = '<ul class="feedback-list">';

        for (let i in this.items) {
            html += '<li class="feedback-item"><a href="#" class="feedback-action" data-value="'+ this.items[i].value +'">';
            switch (this.type) {
                case 'fontawesome':
                    html += '<i class="feedback-icon far fa-2x '+ this.items[i].name +'"></i>';
                break;
                default:
                    html += '<span>'+ this.items[i].name +'</span>';
                break;
            }

            html += '</a></li>';
        }

        html.concat('</ul>');

        this._main.insertAdjacentHTML( 'beforeend', html );
    }

    _bindEvent() {

        // Event Click
        for (let i in this._list_items) {
            let item = this._list_items[i];

            if (typeof(item) === 'object') {
                item.addEventListener('click', this._click);
            }
        }

    }

}