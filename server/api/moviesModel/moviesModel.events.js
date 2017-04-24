/**
 * MoviesModel model events
 */

'use strict';

import {EventEmitter} from 'events';
import MoviesModel from './moviesModel.model';
var MoviesModelEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MoviesModelEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  MoviesModel.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MoviesModelEvents.emit(event + ':' + doc._id, doc);
    MoviesModelEvents.emit(event, doc);
  }
}

export default MoviesModelEvents;
