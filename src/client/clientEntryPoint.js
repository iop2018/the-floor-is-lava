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

        // common options
        syncsBufferLength: 6,

        // interpolate strategy exclusive options
        clientStepHold: 6,
        reflect: false,

        // extrapolate strategy exclusive options
        maxReEnactSteps: 60,   // maximum number of steps to re-enact
        RTTEstimate: 2,        // estimate the RTT as two steps (for updateRate=6, that's 200ms)
        extrapolate: 2,        // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
        localObjBending: 0.0,  // amount of bending towards position of sync object
        remoteObjBending: 0.8, // amount of bending towards position of sync object
        bendingIncrements: 6,  // the bending should be applied increments (how many steps for entire bend)
    }
};
let options = Object.assign(defaults, qsOptions);

window.addEventListener('load', function(e) {
    console.log('CEP: DOMContentLoaded');
    // create a client engine and a game engine
    const gameEngine = new MyGameEngine(options);
    const clientEngine = new MyClientEngine(gameEngine, options);
    console.log('CEP: gae start');
    return clientEngine.start();
});
