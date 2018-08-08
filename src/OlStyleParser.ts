import {
  Style,
  StyleParser,
  Rule,
  Symbolizer,
  BaseMarkSymbolizer,
  MarkSymbolizer,
  LineSymbolizer,
  FillSymbolizer,
  TextSymbolizer,
  StyleType,
  PointSymbolizer,
  IconSymbolizer,
  TriangleSymbolizer,
  StarSymbolizer,
  CircleSymbolizer,
  SquareSymbolizer,
  CrossSymbolizer,
  XSymbolizer
} from 'geostyler-style';

import OlStyle from 'ol/style/style';
import OlStyleImage from 'ol/style/image';
import OlStyleFill from 'ol/style/fill';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleText from 'ol/style/text';
import OlStyleCircle from 'ol/style/circle';
import OlStyleIcon from 'ol/style/icon';
import OlStyleRegularshape from 'ol/style/regularshape';

import OlStyleUtil from './Util/OlStyleUtil';
import { isNumber } from 'util';

/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style Parser interface to work with OpenLayers styles.
 *
 * @class OlStyleParser
 * @implements StyleParser
 */
class OlStyleParser implements StyleParser {

  /**
   * The name of the OlStyleParser.
   */
  public static title = 'OpenLayers Style Parser';

  /**
   * Get the GeoStyler-Style PointSymbolizer from an OpenLayers Style object.
   *
   * @param {object} olStyle The OpenLayers Style object
   * @return {PointSymbolizer} The GeoStyler-Style PointSymbolizer
   */
  getPointSymbolizerFromOlStyle(olStyle: OlStyle): PointSymbolizer {
    let pointSymbolizer: PointSymbolizer;
    if (olStyle.getImage() instanceof OlStyleCircle) {
      // circle
      const olCircleStyle = olStyle.getImage() as OlStyleCircle;
      const olFillStyle = olCircleStyle.getFill();
      const olStrokeStyle = olCircleStyle.getStroke();
      const circleSymbolizer: CircleSymbolizer = {
        kind: 'Mark',
        wellKnownName: 'Circle',
        color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor() as string) : undefined,
        opacity: olFillStyle ? OlStyleUtil.getOpacity(olFillStyle.getColor() as string) : undefined,
        radius: (olCircleStyle.getRadius() !== 0) ? olCircleStyle.getRadius() : 5,
        strokeColor: olStrokeStyle ? olStrokeStyle.getColor() as string : undefined,
        strokeOpacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor() as string) : undefined,
        strokeWidth: olStrokeStyle ? olStrokeStyle.getWidth() : undefined
      };
      pointSymbolizer = circleSymbolizer;
    } else if (olStyle.getImage() instanceof OlStyleRegularshape) {
      // square, triangle, star, cross or x
      let markSymbolizer: MarkSymbolizer = {} as MarkSymbolizer;
      const olRegularStyle = olStyle.getImage() as OlStyleRegularshape;
      const olFillStyle = olRegularStyle.getFill();
      const olStrokeStyle = olRegularStyle.getStroke();
      const points = olRegularStyle.getPoints();
      const radius = olRegularStyle.getRadius();
      const radius2 = olRegularStyle.getRadius2();

      let baseMarkSymbolizer: BaseMarkSymbolizer = {
        kind: 'Mark',
        color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor() as string) : undefined,
        opacity: olFillStyle ? OlStyleUtil.getOpacity(olFillStyle.getColor() as string) : undefined,
        strokeColor: olStrokeStyle ? olStrokeStyle.getColor() as string : undefined,
        strokeOpacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor() as string) : undefined,
        strokeWidth: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
        // Rotation in openlayers is radians while we use degree
        rotation: olRegularStyle.getRotation() / Math.PI * 180,
        points: points
      } as MarkSymbolizer;

      switch (baseMarkSymbolizer.points) {
        case 3:
          // triangle
          const triangleSymbolizer: TriangleSymbolizer = {
            wellKnownName: 'Triangle',
            radius: isNumber(radius) ? radius : 5,
            angle: 0
          } as TriangleSymbolizer;
          markSymbolizer = {...baseMarkSymbolizer, ...triangleSymbolizer}
          break;
        case 4:
          if (isNumber(radius2)) {
            // cross or x
            if (olRegularStyle.getAngle() === 0) {
              // cross
              const crossSymbolizer: CrossSymbolizer = {
                wellKnownName: 'Cross',
                radius1: (radius !== 0) ? radius : 5,
                radius2: 0,
                angle: 0
              } as CrossSymbolizer;
              markSymbolizer = {...baseMarkSymbolizer, ...crossSymbolizer};
            } else {
              // x
              const xSymbolizer: XSymbolizer = {
                wellKnownName: 'X',
                radius1: (radius !== 0) ? radius: 5,
                radius2: 0,
                angle: 45
              } as XSymbolizer;
              markSymbolizer = {...baseMarkSymbolizer, ...xSymbolizer};
            }
          } else {
            // square
            const squareSymbolizer: SquareSymbolizer = {
              wellKnownName: 'Square',
              radius: (radius !== 0) ? radius : 5,
              angle: 45
            } as SquareSymbolizer;
            markSymbolizer = {...baseMarkSymbolizer, ...squareSymbolizer};
          }
          break;
        case 5:
          // star
          const starSymbolizer: StarSymbolizer = {
            wellKnownName: 'Star',
            radius1: isNumber(radius) ? radius : 5,
            radius2: isNumber(radius2) ? radius2 : (5 / 2.5),
            angle: 0
          } as StarSymbolizer;
          markSymbolizer = {...baseMarkSymbolizer, ...starSymbolizer};
          break;
        default:
          throw new Error(`Could not parse OlStyle. Only 3, 4 or 5 point regular shapes are allowed`);
      }
      pointSymbolizer = markSymbolizer;
    } else {
      // icon
      const olIconStyle: OlStyleIcon = olStyle.getImage() as OlStyleIcon;
      let iconSymbolizer: IconSymbolizer = {
        kind: 'Icon',
        image: olIconStyle.getSrc() ? olIconStyle.getSrc() : undefined,
        opacity: olIconStyle.getOpacity(),
        size: (olIconStyle.getScale() !== 0) ? olIconStyle.getScale() : 5,
        // Rotation in openlayers is radians while we use degree
        rotate: olIconStyle.getRotation() / Math.PI * 180
      };
      pointSymbolizer = iconSymbolizer;
    }
    return pointSymbolizer;
  }

  /**
   * Get the GeoStyler-Style LineSymbolizer from an OpenLayers Style object.
   *
   * @param {object} olStyle The OpenLayers Style object
   * @return {LineSymbolizer} The GeoStyler-Style LineSymbolizer
   */
  getLineSymbolizerFromOlStyle(olStyle: OlStyle): LineSymbolizer {
    const olStrokeStyle = olStyle.getStroke() as OlStyleStroke;

    return {
      kind: 'Line',
      color: olStrokeStyle ? OlStyleUtil.getHexColor(olStrokeStyle.getColor() as string) as string : undefined,
      opacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor() as string) : undefined,
      width: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
      cap: olStrokeStyle ? <LineSymbolizer['cap']> olStrokeStyle.getLineCap() : 'butt',
      join: olStrokeStyle ? <LineSymbolizer['join']> olStrokeStyle.getLineJoin() : 'miter',
      dasharray: olStrokeStyle ? olStrokeStyle.getLineDash() : undefined,
      dashOffset: olStrokeStyle ? olStrokeStyle.getLineDashOffset() : undefined
    };
  }

  /**
   * Get the GeoStyler-Style FillSymbolizer from an OpenLayers Style object.
   *
   * PolygonSymbolizer Stroke is just partially supported.
   *
   * @param {OlStyle} olStyle The OpenLayers Style object
   * @return {FillSymbolizer} The GeoStyler-Style FillSymbolizer
   */
  getFillSymbolizerFromOlStyle(olStyle: OlStyle): FillSymbolizer {
    const olFillStyle = olStyle.getFill() as OlStyleFill;
    const olStrokeStyle = olStyle.getStroke() as OlStyleStroke;

    return {
      kind: 'Fill',
      color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor() as string) : undefined,
      opacity: olFillStyle ? OlStyleUtil.getOpacity(olFillStyle.getColor() as string) : undefined,
      outlineColor: olStrokeStyle ? olStrokeStyle.getColor() as string : undefined
    };
  }

  /**
   * Get the GeoStyler-Style TextSymbolizer from an OpenLayers Style object.
   *
   *
   * @param {OlStyle} olStyle The OpenLayers Style object
   * @return {TextSymbolizer} The GeoStyler-Style TextSymbolizer
   */
  getTextSymbolizerFromOlStyle(olStyle: OlStyle): TextSymbolizer {
    const olTextStyle = olStyle.getText() as OlStyleText;
    const olFillStyle = olTextStyle.getFill() as OlStyleFill;
    const offsetX = olTextStyle.getOffsetX();
    const offsetY = olTextStyle.getOffsetY();
    const font = olTextStyle.getFont();

    // font-size is always the first part of font-size/line-height
    const fontStyleWeightSize: string = font.split('px')[0].trim();
    const fontSizePart: string[] = fontStyleWeightSize.split(' ');
    // The last element contains font size
    const fontSize = parseInt(fontSizePart[fontSizePart.length - 1], 10);

    return {
      kind: 'Text',
      color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor() as string) : undefined,
      size: isFinite(fontSize) ? fontSize : undefined,
      font: [font],
      offset: offsetX && offsetY ? [offsetX, offsetY] : [0, 0]
    };
  }

  /**
   * Get the GeoStyler-Style Symbolizer from an OpenLayers Style object.
   *
   * @param {OlStyle} olStyle The OpenLayers Style object
   * @return {Symbolizer} The GeoStyler-Style Symbolizer
   */
  getSymbolizerFromOlStyle(olStyles: OlStyle[]): Symbolizer[] {
    const symbolizers: Symbolizer[] = [];
    olStyles.forEach((olStyle: OlStyle) => {
      let symbolizer: Symbolizer;
      const styleType: StyleType = this.getStyleTypeFromOlStyle(olStyle);
      switch (styleType) {
        case 'Point':
          if (olStyle.getText()) {
            symbolizer = this.getTextSymbolizerFromOlStyle(olStyle);
          } else {
            symbolizer = this.getPointSymbolizerFromOlStyle(olStyle);
          }
          break;
        case 'Line':
          symbolizer = this.getLineSymbolizerFromOlStyle(olStyle);
          break;
        case 'Fill':
          symbolizer = this.getFillSymbolizerFromOlStyle(olStyle);
          break;
        default:
          throw new Error('Failed to parse SymbolizerKind from OpenLayers Style');
      }
      symbolizers.push(symbolizer);
    });

    return symbolizers;
  }

  /**
   * Get the GeoStyler-Style Rule from an OpenLayers Style object.
   *
   * @param {OlStyle} olStyle The OpenLayers Style object
   * @return {Rule} The GeoStyler-Style Rule
   */
  getRulesFromOlStyle(olStyles: OlStyle[][]): Rule[] {
    let rules: Rule[] = [];
    olStyles.forEach((olRule: OlStyle[], idx: number) => {
      const symbolizer: Symbolizer[] = this.getSymbolizerFromOlStyle(olRule);
      const name = 'OL Style Rule ' + idx;
      rules.push({
        name, symbolizer
      });
    });

    return rules;
  }

  /**
   * Get the GeoStyler-Style Symbolizer from an OpenLayers Style object.
   *
   * @param {OlStyle} olStyle The OpenLayers Style object
   * @return {Symbolizer} The GeoStyler-Style Symbolizer
   */
  getStyleTypeFromOlStyle(olStyle: OlStyle): StyleType {
    let styleType: StyleType;

    if (olStyle.getImage() instanceof OlStyleImage) {
      styleType = 'Point';
    } else if (olStyle.getText() instanceof OlStyleText) {
      styleType = 'Point';
    } else if (olStyle.getFill() instanceof OlStyleFill) {
      styleType = 'Fill';
    } else if (olStyle.getStroke() && !olStyle.getFill()) {
      styleType = 'Line';
    } else {
      throw new Error('StyleType could not be detected');
    }

    return styleType;
  }

  /**
   * Get the GeoStyler-Style Style from an OpenLayers Style object.
   *
   * @param {object} olStyle The OpenLayers Style object
   * @return {Style} The GeoStyler-Style Style
   */
  olStyleToGeoStylerStyle(olStyle: OlStyle[][]): Style {
    const name = 'OL Style';
    const rules = this.getRulesFromOlStyle(olStyle);
    return {
      name,
      rules
    };
  }

  /**
   * The readStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads an OpenLayers style instance and returns a Promise.
   * The Promise itself resolves with a GeoStyler-Style Style.
   *
   * @param {string} olStyle An OpenLayers style instance
   * @return {Promise} The Promise resolving with the GeoStyler-Style Style
   */
  readStyle(olStyle: OlStyle[][]): Promise<Style> {
    return new Promise<Style>((resolve, reject) => {
      try {

        const geoStylerStyle: Style = this.olStyleToGeoStylerStyle(olStyle);
        resolve(geoStylerStyle);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a GeoStyler-Style Style and returns a Promise.
   * The Promise itself resolves with an OpenLayers style object.
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {Promise} The Promise resolving with an OpenLayers style instance.
   */
  writeStyle(geoStylerStyle: Style): Promise<OlStyle[][]> {
    return new Promise<any>((resolve, reject) => {
      try {

        const olStyles = this.geoStylerStyleToOlStyle(geoStylerStyle);
        resolve(olStyles);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the OpenLayers Style object from an GeoStyler-Style Style
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {OlStyle[][]} A nested array containing OpenLayers style instance(s)
   */
  geoStylerStyleToOlStyle(geoStylerStyle: Style): OlStyle[][] {

    const rules = geoStylerStyle.rules;

    let symbArr: any[] = [];
    rules.forEach((rule: Rule) => {
      const ruleSymbs: any[] = [];
      rule.symbolizer.forEach((symb: Symbolizer) => {
        ruleSymbs.push(this.getOlSymbolizerFromSymbolizer(symb));
      });
      symbArr.push(ruleSymbs);
    });
    return symbArr;
  }

  /**
   * Get the OpenLayers Style object or an OL StyleFunction from an
   * GeoStyler-Style Symbolizer.
   *
   * @param {Symbolizer} symbolizer A GeoStyler-Style Symbolizer.
   * @return {object} The OpenLayers Style object or a StyleFunction
   */
  getOlSymbolizerFromSymbolizer(symbolizer: Symbolizer): any {
    let olSymbolizer: OlStyle | ol.StyleFunction;
    switch (symbolizer.kind) {
      case 'Mark':
        olSymbolizer = this.getOlPointSymbolizerFromMarkSymbolizer(symbolizer);
        break;
      case 'Icon':
        olSymbolizer = this.getOlIconSymbolizerFromIconSymbolizer(symbolizer);
        break;
      case 'Text':
        olSymbolizer = this.getOlTextSymbolizerFromTextSymbolizer(symbolizer);
        break;
      case 'Line':
        olSymbolizer = this.getOlLineSymbolizerFromLineSymbolizer(symbolizer);
        break;
      case 'Fill':
        olSymbolizer = this.getOlPolygonSymbolizerFromFillSymbolizer(symbolizer);
        break;
      default:
        // Return the OL default style since the TS type binding does not allow
        // us to set olSymbolizer to undefined
        var fill = new OlStyleFill({
          color: 'rgba(255,255,255,0.4)'
        });
        var stroke = new OlStyleStroke({
          color: '#3399CC',
          width: 1.25
        });
        olSymbolizer = new OlStyle({
          image: new OlStyleCircle({
            fill: fill,
            stroke: stroke,
            radius: 5
          }),
          fill: fill,
          stroke: stroke
        });
        break;
    }
    return olSymbolizer;
  }

  /**
   * Get the OL Style object  from an GeoStyler-Style MarkSymbolizer.
   *
   * @param {MarkSymbolizer} markSymbolizer A GeoStyler-Style MarkSymbolizer.
   * @return {object} The OL Style object
   */
  getOlPointSymbolizerFromMarkSymbolizer(markSymbolizer: MarkSymbolizer): OlStyle {
    let stroke;
    if (markSymbolizer.strokeColor) {
      stroke = new OlStyleStroke({
        color: markSymbolizer.strokeColor,
        width: markSymbolizer.strokeWidth
      });
    }
    const fill = new OlStyleFill({
      color: (markSymbolizer.color && markSymbolizer.opacity) ?
        OlStyleUtil.getRgbaColor(markSymbolizer.color, markSymbolizer.opacity) : markSymbolizer.color
    });

    let olStyle: OlStyle;
    let shapeOpts: any = {
      fill: fill,
      stroke: stroke,
      opacity: markSymbolizer.opacity || 1
    };
    
    switch (markSymbolizer.wellKnownName) {
      case 'Circle':
        shapeOpts.radius = markSymbolizer.radius || 5;
        olStyle = new OlStyle({
          image: new OlStyleCircle(shapeOpts)
        });
        break;
      case 'Square':
        shapeOpts.points = 4;
        shapeOpts.radius = markSymbolizer.radius || 5;
        shapeOpts.angle = Math.PI / 4;
        // Rotation in openlayers is radians while we use degree
        shapeOpts.rotation = markSymbolizer.rotation ? markSymbolizer.rotation * Math.PI / 180 : undefined;
        olStyle = new OlStyle({
          image: new OlStyleRegularshape(shapeOpts)
        });
        break;
      case 'Triangle':
        shapeOpts.points = 3;
        shapeOpts.radius = markSymbolizer.radius || 5;
        shapeOpts.angle = 0;
        // Rotation in openlayers is radians while we use degree
        shapeOpts.rotation = markSymbolizer.rotation ? markSymbolizer.rotation * Math.PI / 180 : undefined;
        olStyle = new OlStyle({
          image: new OlStyleRegularshape(shapeOpts)
        });
        break;
      case 'Star':
        shapeOpts.points = 5;
        shapeOpts.radius1 = markSymbolizer.radius1 || 5;
        shapeOpts.radius2 = markSymbolizer.radius2 || (5 / 2.5);
        shapeOpts.angle = 0;
        // Rotation in openlayers is radians while we use degree
        shapeOpts.rotation = markSymbolizer.rotation ? markSymbolizer.rotation * Math.PI / 180 : undefined;
        olStyle = new OlStyle({
          image: new OlStyleRegularshape(shapeOpts)
        });
        break;
      case 'Cross':
        shapeOpts.points = 4;
        shapeOpts.radius1 = markSymbolizer.radius1 || 5;
        shapeOpts.radius2 = 0;
        shapeOpts.angle = 0;
        // Rotation in openlayers is radians while we use degree
        shapeOpts.rotation = markSymbolizer.rotation ? markSymbolizer.rotation * Math.PI / 180 : undefined;
        olStyle = new OlStyle({
          image: new OlStyleRegularshape(shapeOpts)
        });
        break;
      case 'X':
        shapeOpts.points = 4;
        shapeOpts.radius1 = markSymbolizer.radius1 || 5;
        shapeOpts.radius2 = 0;
        shapeOpts.angle = Math.PI / 4;
        // Rotation in openlayers is radians while we use degree
        shapeOpts.rotation = markSymbolizer.rotation ? markSymbolizer.rotation * Math.PI / 180 : undefined;
        olStyle = new OlStyle({
          image: new OlStyleRegularshape(shapeOpts)
        });
        break;
      default:
        throw new Error(`MarkSymbolizer cannot be parsed. Only "Circle", "Square", 
        "Triangle", "Star", "Cross" or "X" are supported as WellKnownName.`);
    }

    return olStyle;
  }

  /**
   * Get the OL Style object  from an GeoStyler-Style IconSymbolizer.
   *
   * @param {IconSymbolizer} symbolizer  A GeoStyler-Style IconSymbolizer.
   * @return {object} The OL Style object
   */
  getOlIconSymbolizerFromIconSymbolizer(symbolizer: IconSymbolizer): OlStyle {
    return new OlStyle({
      image: new OlStyleIcon({
        src: symbolizer.image,
        crossOrigin: 'anonymous',
        opacity: symbolizer.opacity,
        scale: symbolizer.size || 1,
        // Rotation in openlayers is radians while we use degree
        rotation: symbolizer.rotate ? symbolizer.rotate * Math.PI / 180 : undefined
      })
    });
  }

  /**
   * Get the OL Style object from an GeoStyler-Style LineSymbolizer.
   *
   * @param {LineSymbolizer} lineSymbolizer A GeoStyler-Style LineSymbolizer.
   * @return {object} The OL Style object
   */
  getOlLineSymbolizerFromLineSymbolizer(symbolizer: LineSymbolizer) {
    return new OlStyle({
      stroke: new OlStyleStroke({
        color: (symbolizer.color && symbolizer.opacity) ?
          OlStyleUtil.getRgbaColor(symbolizer.color, symbolizer.opacity) : symbolizer.color,
        width: symbolizer.width,
        lineCap: symbolizer.cap,
        lineJoin: symbolizer.join,
        lineDash: symbolizer.dasharray,
        lineDashOffset: symbolizer.dashOffset
      })
    });
  }

  /**
   * Get the OL Style object from an GeoStyler-Style FillSymbolizer.
   *
   * @param {FillSymbolizer} fillSymbolizer A GeoStyler-Style FillSymbolizer.
   * @return {object} The OL Style object
   */
  getOlPolygonSymbolizerFromFillSymbolizer(symbolizer: FillSymbolizer) {
    return new OlStyle({
      stroke: new OlStyleStroke({
        color: symbolizer.outlineColor
      }),
      fill: new OlStyleFill({
        color: (symbolizer.color && symbolizer.opacity) ?
          OlStyleUtil.getRgbaColor(symbolizer.color, symbolizer.opacity) : symbolizer.color
      })
    });
  }

  /**
   * Get the OL StyleFunction object from an GeoStyler-Style TextSymbolizer.
   *
   * @param {TextSymbolizer} textSymbolizer A GeoStyler-Style TextSymbolizer.
   * @return {object} The OL StyleFunction
   */
  getOlTextSymbolizerFromTextSymbolizer(symbolizer: TextSymbolizer): ol.StyleFunction {
    const olPointStyledLabelFn = (feature: ol.Feature, res: number) => {

      const text = new OlStyleText({
        font: OlStyleUtil.getTextFont(symbolizer),
        text: feature.get(symbolizer.field || '') + '',
        fill: new OlStyleFill({
          color: (symbolizer.color && symbolizer.opacity) ?
            OlStyleUtil.getRgbaColor(symbolizer.color, symbolizer.opacity) : symbolizer.color
        }),
        stroke: new OlStyleStroke({
          color: (symbolizer.color && symbolizer.opacity) ?
            OlStyleUtil.getRgbaColor(symbolizer.color, symbolizer.opacity) : symbolizer.color
        }),
        offsetX: symbolizer.offset ? symbolizer.offset[0] : 0,
        offsetY: symbolizer.offset ? symbolizer.offset[1] : 0,
        // TODO check why props match
        // textAlign: symbolizer.pitchAlignment,
        // textBaseline: symbolizer.anchor
      });

      const style = new OlStyle({
        text: text
      });

      return style;
    };

    return olPointStyledLabelFn;
  }

}

export default OlStyleParser;
