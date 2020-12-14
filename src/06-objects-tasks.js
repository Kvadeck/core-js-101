/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CSSPath {
  constructor() {
    this.css = {};
  }

  element(value) {
    if (this.css.element) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.checkOrder('element');
    this.css.element = value;
    return this;
  }

  id(value) {
    if (this.css.id) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.checkOrder('id');
    this.css.id = `#${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.css.pseudoElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.checkOrder('pseudoElement');
    this.css.pseudoElement = `::${value}`;
    return this;
  }

  class(value) {
    if (!this.css.class) {
      this.css.class = '';
    }
    this.checkOrder('class');
    this.css.class += `.${value}`;
    return this;
  }

  attr(value) {
    if (!this.css.attribute) {
      this.css.attribute = '';
    }
    this.checkOrder('attribute');
    this.css.attribute += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (!this.css.pseudoClass) {
      this.css.pseudoClass = '';
    }
    this.checkOrder('pseudoClass');
    this.css.pseudoClass += `:${value}`;
    return this;
  }

  checkOrder(field) {
    const order = ['element', 'id', 'class', 'attribute', 'pseudoClass', 'pseudoElement'];
    const prev = order.slice(order.indexOf(field) + 1)
      .some((f) => this.css[f]);
    if (prev) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  stringify() {
    let result = '';
    if (this.css.element) {
      result += this.css.element;
    }
    if (this.css.id) {
      result += this.css.id;
    }
    if (this.css.class) {
      result += this.css.class;
    }
    if (this.css.attribute) {
      result += this.css.attribute;
    }
    if (this.css.pseudoClass) {
      result += this.css.pseudoClass;
    }
    if (this.css.pseudoElement) {
      result += this.css.pseudoElement;
    }
    return result;
  }
}

function CSSCombinedPath(firstSelector, combinator, secondSelector) {
  this.firstSelector = firstSelector;
  this.combinator = combinator;
  this.secondSelector = secondSelector;

  this.stringify = () => `${this.firstSelector.stringify()} ${this.combinator} ${this.secondSelector.stringify()}`;
}


const cssSelectorBuilder = {
  element(value) {
    return new CSSPath().element(value);
  },

  id(value) {
    return new CSSPath().id(value);
  },

  class(value) {
    return new CSSPath().class(value);
  },

  attr(value) {
    return new CSSPath().attr(value);
  },

  pseudoClass(value) {
    return new CSSPath().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CSSPath().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CSSCombinedPath(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
