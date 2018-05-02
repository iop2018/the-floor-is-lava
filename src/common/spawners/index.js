'use strict';

import CollGen from './CollGen';
import PlatformGen from './PlatformGen';

export default (gameEngine) =>
    [PlatformGen, CollGen].map((Spawner) => new Spawner(gameEngine));
