(function () {
    const createStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
      #pretor-content {
        position: relative;
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



    const initializeWidget = (isPopup = true) => {
        const container = document.getElementById('pretor-demo1');

        if (!container) {
            console.error('Container with id "pretor-content" not found.');
            return;
        }

        createStyles();


            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';

            container.appendChild(iframe);

            loadReactAppInIframe(iframe);
    };

    const currentScript = document.currentScript;
    const isPopup = currentScript?.getAttribute('is-popup') === 'true';

    initializeWidget(isPopup);
})();
