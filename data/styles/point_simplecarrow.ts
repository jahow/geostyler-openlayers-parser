import { Style } from 'geostyler-style';

const pointSimpleCarrow: Style = {
  name: 'OL Style',
  rules: [
    {
      name: 'OL Style Rule 0',
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'shape://carrow',
        color: '#FF0000',
        radius: 6,
        rotate: 0
      }]
    }
  ]
};

export default pointSimpleCarrow;
