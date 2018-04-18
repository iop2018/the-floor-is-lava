import querystring from 'query-string';
import MyClientEngine from '../client/MyClientEngine';
import MyGameEngine from '../common/MyGameEngine';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.0,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);



window.addEventListener('load', function(e) {
    console.log('CEP: DOMContentLoaded');
    // create a client engine and a game engine
    const gameEngine = new MyGameEngine(options);
    const clientEngine = new MyClientEngine(gameEngine, options);
    console.log('CEP: gae start');
    clientEngine.start();
});
