import { body, validationResult } from 'express-validator';
import { decideDestinations, sendPayload } from '../utils/destinationHandler.js';

const validateDestinations = (value) => {
  if (!Array.isArray(value)) {
    throw new Error('possibleDestinations must be an array');
  }
  for (const destination of value) {
    if (typeof destination !== 'object' || Array.isArray(destination)) {
      throw new Error('possibleDestinations must be an array of objects');
    }
  }
  return true;
};

export const postEvent = [
  body('payload').not().isEmpty().isObject(),
  body('strategy').optional().isString(),
  body('possibleDestinations').custom(validateDestinations),
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { payload, possibleDestinations, strategy } = req.body;
    const strategyToUse = strategy || defaultStrategy;

    // Decide which destinations to route to based on the strategy
    const destinationsToRoute = decideDestinations(strategyToUse, possibleDestinations);

    // Send the payload to each destination
    destinationsToRoute.forEach(destination => {
      sendPayload(destination, payload);
    });

    const executedDestinations = destinationsToRoute.map(destination => destination.name);

    let enteredDestinations = new Set();
    possibleDestinations.forEach(destination => {
      Object.keys(destination).forEach(key => {
        enteredDestinations.add(key);
      });
    });

    const response = {};
    enteredDestinations.forEach(destination => {
      response[destination] = executedDestinations.includes(destination)
    });

    res.send(response);
  }
];