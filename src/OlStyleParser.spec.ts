import * as ol from 'openlayers';

import OlStyleParser from './OlStyleParser';

import point_simplepoint from '../data/styles/point_simplepoint';
import line_simpleline from '../data/styles/line_simpleline';
import polygon_transparentpolygon from '../data/styles/polygon_transparentpolygon';
import point_styledlabel from '../data/styles/point_styledlabel';
import { CircleSymbolizer, LineSymbolizer, FillSymbolizer, TextSymbolizer } from 'geostyler-style';

import OlStyleUtil from './Util/OlStyleUtil';

it('SldStyleParser is defined', () => {
  expect(OlStyleParser).toBeDefined();
});

describe('SldStyleParser implements StyleParser', () => {
  let styleParser: OlStyleParser;

  beforeEach(() => {
    styleParser = new OlStyleParser();
  });

  describe('#readStyle', () => {
    it('is defined', () => {
      expect(styleParser.readStyle).toBeDefined();
    });
    it('can read a OpenLayers PointSymbolizer', () => {
      // expect.assertions(2);
      // const sld = fs.readFileSync( './data/slds/point_simplepoint.sld', 'utf8');
      // return styleParser.readStyle(sld)
      //   .then((geoStylerStyle: Style) => {
      //     expect(geoStylerStyle).toBeDefined();
      //     expect(geoStylerStyle).toEqual(point_simplepoint);
      //   });
    });
    it('can read a OpenLayers LineSymbolizer', () => {
      // expect.assertions(2);
      // const sld = fs.readFileSync( './data/slds/line_simpleline.sld', 'utf8');
      // return styleParser.readStyle(sld)
      // .then((geoStylerStyle: Style) => {
      //   expect(geoStylerStyle).toBeDefined();
      //   expect(geoStylerStyle).toEqual(line_simpleline);
      // });
    });
    it('can read a OpenLayers PolygonSymbolizer', () => {
      // expect.assertions(2);
      // const sld = fs.readFileSync( './data/slds/polygon_transparentpolygon.sld', 'utf8');
      // return styleParser.readStyle(sld)
      // .then((geoStylerStyle: Style) => {
      //   expect(geoStylerStyle).toBeDefined();
      //   expect(geoStylerStyle).toEqual(polygon_transparentpolygon);
      //   });
    });
    it('can read a OpenLayers TextSymbolizer', () => {
      // expect.assertions(2);
      // const sld = fs.readFileSync( './data/slds/point_styledlabel.sld', 'utf8');
      // return styleParser.readStyle(sld)
      //   .then((geoStylerStyle: Style) => {
      //     expect(geoStylerStyle).toBeDefined();
      //     expect(geoStylerStyle).toEqual(point_styledlabel);
      //   });
    });
    it('can read a OpenLayers style with a filter', () => {
      // expect.assertions(2);
      // const sld = fs.readFileSync( './data/slds/point_simplepoint_filter.sld', 'utf8');
      // return styleParser.readStyle(sld)
      //   .then((geoStylerStyle: Style) => {
      //     expect(geoStylerStyle).toBeDefined();
      //     expect(geoStylerStyle).toEqual(point_simplepoint_filter);
      //   });
    });

    // describe('#getStyleTypeFromOlStyle', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getStyleTypeFromOlStyle).toBeDefined();
    //   });
    // });

    // describe('#getFilterFromOperatorAndComparison', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getFilterFromOperatorAndComparison).toBeDefined();
    //   });
    // });

    // describe('#getFilterFromRule', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getFilterFromRule).toBeDefined();
    //   });
    // });

    // describe('#getScaleDenominatorFromRule', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getScaleDenominatorFromRule).toBeDefined();
    //   });
    // });

    // describe('#getPointSymbolizerFromSldSymbolizer', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getPointSymbolizerFromSldSymbolizer).toBeDefined();
    //   });
    // });

    describe('#getLineSymbolizerFromOlSymbolizer', () => {
      // it('is defined', () => {
      //   expect(styleParser.getLineSymbolizerFromOlSymbolizer).toBeDefined();
      // });
    });

    describe('#getFillSymbolizerFromOlSymbolizer', () => {
      // it('is defined', () => {
      //   expect(styleParser.getFillSymbolizerFromSldSymbolizer).toBeDefined();
      // });
    });

    describe('#getTextSymbolizerFromOlSymbolizer', () => {
      // it('is defined', () => {
      //   expect(styleParser.getTextSymbolizerFromOlSymbolizer).toBeDefined();
      // });
    });

    // describe('#getSymbolizerFromRule', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getSymbolizerFromRule).toBeDefined();
    //   });
    // });

    // describe('#getRulesFromSldObject', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getRulesFromSldObject).toBeDefined();
    //   });
    // });

    describe('#olObjectToGeoStylerStyle', () => {
      // it('is defined', () => {
      //   expect(styleParser.olObjectToGeoStylerStyle).toBeDefined();
      // });
    });
  });

  describe('#writeStyle', () => {
    it('is defined', () => {
      expect(styleParser.writeStyle).toBeDefined();
    });
    it('can write a OpenLayers PointSymbolizer', () => {
      expect.assertions(4);
      return styleParser.writeStyle(point_simplepoint)
        .then((olStyles: ol.style.Style[]) => {
          expect(olStyles).toBeDefined();

          const expecSymb = point_simplepoint.rules[0].symbolizer as CircleSymbolizer;
          const olImage: ol.style.Circle = olStyles[0].getImage() as ol.style.Circle;

          expect(olImage).toBeDefined();
          expect(olImage.getRadius()).toEqual(expecSymb.radius);
          expect(olImage.getFill().getColor()).toEqual(expecSymb.color);
        });
    });
    it('can write a OpenLayers LineSymbolizer', () => {
      expect.assertions(4);
      return styleParser.writeStyle(line_simpleline)
        .then((olStyles: ol.style.Style[]) => {
          expect(olStyles).toBeDefined();

          const expecSymb = line_simpleline.rules[0].symbolizer as LineSymbolizer;
          const olStroke = olStyles[0].getStroke();

          expect(olStroke).toBeDefined();
          expect(olStroke.getColor()).toEqual(expecSymb.color);
          expect(olStroke.getWidth()).toEqual(expecSymb.width);
        });
    });
    it('can write a OpenLayers PolygonSymbolizer', () => {
      expect.assertions(5);
      return styleParser.writeStyle(polygon_transparentpolygon)
        .then((olStyles: ol.style.Style[]) => {
          expect(olStyles).toBeDefined();

          const expecSymb = polygon_transparentpolygon.rules[0].symbolizer as FillSymbolizer;
          const olStroke = olStyles[0].getStroke();

          expect(olStroke).toBeDefined();
          expect(olStroke.getColor()).toEqual(expecSymb.outlineColor);

          const olFill = olStyles[0].getFill();
          expect(olFill).toBeDefined();
          const expecSymbCol: string = expecSymb.color as string;
          const expecSymbOpac: number = expecSymb.opacity as number;
          expect(olFill.getColor()).toEqual(OlStyleUtil.getRgbaColor(expecSymbCol, expecSymbOpac));
        });
    });
    it('can write a OpenLayers TextSymbolizer', () => {
      expect.assertions(11);
      return styleParser.writeStyle(point_styledlabel)
        .then((olStyles: ol.style.Style[] | ol.StyleFunction[]) => {
          expect(olStyles).toBeDefined();

          const expecSymb = point_styledlabel.rules[0].symbolizer as TextSymbolizer;

          const dummyFeat = new ol.Feature({
            name: 'GeoStyler'
          });
          const olStyleFn = olStyles[0] as ol.StyleFunction;
          expect(olStyleFn).toBeDefined();
          // execute the returned StyleFunction and get the underlying OL style object
          const olStyle: ol.style.Style = olStyleFn(dummyFeat, 1) as ol.style.Style;

          const olText = olStyle.getText();
          expect(olText).toBeDefined();

          const olTextStroke = olText.getStroke();
          expect(olTextStroke).toBeDefined();
          expect(olTextStroke.getColor()).toEqual(expecSymb.color);

          const olTextFill = olText.getFill();
          expect(olTextFill).toBeDefined();
          expect(olTextFill.getColor()).toEqual(expecSymb.color);

          const olTextFont = olText.getFont();
          expect(olTextFont).toEqual(OlStyleUtil.getTextFont(expecSymb));

          const olTextContent = olText.getText();
          expect(olTextContent).toEqual(dummyFeat.get('name'));

          const olTextOffsetX = olText.getOffsetX();
          const olTextOffsetY = olText.getOffsetY();
          const expectedOffsetX = expecSymb.offset ? expecSymb.offset[0] : null;
          const expectedOffsetY = expecSymb.offset ? expecSymb.offset[1] : null;
          expect(olTextOffsetX).toEqual(expectedOffsetX);
          expect(olTextOffsetY).toEqual(expectedOffsetY);
        });
    });
    // it('can write a OpenLayers style with a filter', () => {
    //   expect.assertions(2);
    //   return styleParser.writeStyle(point_simplepoint_filter)
    //     .then((sldString: string) => {
    //       expect(sldString).toBeDefined();
    //       // As string comparison between to XML-Strings is awkward and nonesens
    //       // we read it again and compare the json input with the parser output
    //       return styleParser.readStyle(sldString)
    //         .then(readStyle => {
    //           expect(readStyle).toEqual(point_simplepoint_filter);
    //         });
    //     });
    // });

    // describe('#geoStylerStyleToOlObject', () => {
    //   it('is defined', () => {
    //     expect(styleParser.geoStylerStyleToOlObject).toBeDefined();
    //   });
    // });

    // describe('#getSldRulesFromRules', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getSldRulesFromRules).toBeDefined();
    //   });
    // });

    describe('#getOlSymbolizerFromSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getOlSymbolizerFromSymbolizer).toBeDefined();
      });
    });

    describe('#getOlTextSymbolizerFromTextSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getOlTextSymbolizerFromTextSymbolizer).toBeDefined();
      });
    });

    describe('#getOlPolygonSymbolizerFromFillSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getOlPolygonSymbolizerFromFillSymbolizer).toBeDefined();
      });
    });

    describe('#getOlLineSymbolizerFromLineSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getOlLineSymbolizerFromLineSymbolizer).toBeDefined();
      });
    });

    describe('#getOlPointSymbolizerFromCircleSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getOlPointSymbolizerFromCircleSymbolizer).toBeDefined();
      });
    });

    // describe('#getSldComparisonFilterFromComparisonFilte', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getSldComparisonFilterFromComparisonFilter).toBeDefined();
    //   });
    // });

    // describe('#getSldFilterFromFilter', () => {
    //   it('is defined', () => {
    //     expect(styleParser.getSldFilterFromFilter).toBeDefined();
    //   });
    // });

  });

});