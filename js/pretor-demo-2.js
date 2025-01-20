(function () {
    const createStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
      #pretor-content {
        position: relative;
      }

      .pretor-button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #FF9D4D;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-weight: bold;
      }

      .pretor-button:hover {
        background-color: #ff8523;
      }

      .pretor-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5% 20%;
        z-index: 9999;
        overflow: hidden;
      }

      .pretor-popup iframe {
        width: 90%;
        height: 90%;
        border: none;
        border-radius: 8px;
      }

      .pretor-popup-close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 24px;
        color: #fff;
        cursor: pointer;
        z-index: 10000;
      }
    `;
        document.head.appendChild(style);
    };

    const loadReactAppInIframe = (iframe) => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        iframeDocument.open();
        iframeDocument.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>React App</title>
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>
        `);
        iframeDocument.close();

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = iframeDocument.createElement('script');
                script.src = src;
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                iframeDocument.body.appendChild(script);
            });
        };

        const loadStyle = (href) => {
            const link = iframeDocument.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            iframeDocument.head.appendChild(link);
        };

        loadStyle('https://www.pretor.ai/wp-content/widget-react-app/public_widget/widget.css');
        loadScript('https://www.pretor.ai/wp-content/widget-react-app/public_widget/widget.js')
            .then(() => console.log('React app loaded successfully'))
            .catch((error) => console.error('Error loading React app:', error));
    };

    const createPopup = () => {
        const popup = document.createElement('div');
        popup.className = 'pretor-popup';

        const closeButton = document.createElement('div');
        closeButton.className = 'pretor-popup-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => {
            document.body.removeChild(popup);
            document.body.style.overflow = 'auto';
        };

        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        popup.appendChild(closeButton);
        popup.appendChild(iframe);
        document.body.style.overflow = 'hidden';
        document.body.appendChild(popup);

        loadReactAppInIframe(iframe);
    };

    const initializeWidget = (isPopup = true) => {
        const container = document.getElementById('pretor-demo2');

        if (!container) {
            console.error('Container with id "pretor-content" not found.');
            return;
        }

        createStyles();

        if (isPopup) {
            const button = document.createElement('button');
            button.className = 'pretor-button';
            button.textContent = 'Отримати безкоштовну консультацію';
            button.onclick = createPopup;
            container.appendChild(button);
        } else {
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';

            container.appendChild(iframe);

            loadReactAppInIframe(iframe);
        }
    };

    const currentScript = document.currentScript;
    const isPopup = currentScript?.getAttribute('is-popup') === 'true';

    initializeWidget(isPopup);
})();
