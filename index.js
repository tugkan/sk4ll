import Initializer from '@helpers/initializer';
import Masscan from '@scanners/masscan';

const App = {
    init: () => {
        const { cidrBlocks, ports } = Initializer.init();
        Masscan.exec(cidrBlocks, ports);
        Initializer.initListeners();
    },
};

App.init();

export default App;
