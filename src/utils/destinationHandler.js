import axios from 'axios';
import vm from 'vm';
import destinations from '../const/destinations.js';

// Function to decide which destinations to route to based on the strategy and possible destinations
export function decideDestinations(strategy, possibleDestinations) {
  let destinationsToRoute = [];

  // Extract the names of all defined destinations
  const definedDestinationNames = new Set(destinations.map(destination => destination.name));

  // Filter possible destinations and find invalid destinations
  const filteredDestinations = [];
  const invalidDestinations = new Set();

  possibleDestinations.forEach(destinationObj => {
    const filteredDestinationObj = {};
    for (let destinationName in destinationObj) {
      if (definedDestinationNames.has(destinationName)) {
        filteredDestinationObj[destinationName] = destinationObj[destinationName];
      } else {
        invalidDestinations.add(destinationName);
      }
    }
    filteredDestinations.push(filteredDestinationObj);
  });

  // Log invalid destinations
  if (invalidDestinations.size > 0) {
    invalidDestinations.forEach(destination => {
      console.error(`UnknownDestinationError (${destination})`);
    });
  }

  if (typeof strategy === 'string') {
    if (strategy === 'ALL') {
      destinationsToRoute = destinations.filter(destination => {
        return filteredDestinations.every(possibleDestination => {
          return possibleDestination[destination.name] === true || possibleDestination.hasOwnProperty(destination.name) === false;
        })
      });
    } else if (strategy === 'ANY') {
      destinationsToRoute = destinations.filter(destination => {
        return filteredDestinations.some(possibleDestination => {
          return possibleDestination[destination.name] === true;
        });
      });
    } else {
      // If there is data, add it to the chunks array
      let strategyFunction;
      try {
        const script = new vm.Script(strategy);
        const sandbox = {};
        const context = new vm.createContext(sandbox);
        strategyFunction = script.runInContext(context);
      } catch (error) {
        console.error('Failed to parse strategy function:', error);
      }

      if (typeof strategyFunction === 'function') {
        destinationsToRoute = destinations.filter(strategyFunction);
      }
    }
  }

  return destinationsToRoute;
}

// Function to send the payload to a destination
export function sendPayload(destination, payload) {
  if (destination.transport.startsWith('http')) {
    if (destination.transport === 'http.post') {
      try {
        axios.post(destination.url, payload);
      } catch (error) {
        console.error('Failed to send payload to destination:', destination.name, error);
      }
    } else if (destination.transport === 'http.get') {
      try {
        axios.get(destination.url, {params: {payload}});
      } catch (error) {
        console.error('Failed to send payload to destination:', destination.name, error);
      }
    } else if (destination.transport === 'http.put') {
      try {
        axios.put(destination.url, payload);
      } catch (error) {
        console.error('Failed to send payload to destination:', destination.name, error);
      }
    }
  } else if (destination.transport === 'console.log') {
    console.log(payload);
  } else if (destination.transport === 'console.warn') {
    console.warn(payload);
  }
}
