import { createApp, h } from './vue.esm-browser.js';

import App from './components/App.js';

const app = createApp({
  render: () => h(App),
});
app.mount('#app');
