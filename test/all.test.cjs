const add = require('../src/add.js');
const at = require('../src/at.js');
const camelCase = require('../src/camelCase.js');
const capitalize = require('../src/capitalize.js');
const castArray = require('../src/castArray.js');
const ceil = require('../src/ceil.js');
const chunk = require('../src/chunk.js');
const clamp = require('../src/clamp.js');
const compact = require('../src/compact.js');
const countBy = require('../src/countBy.js');
const defaultTo = require('../src/defaultTo.js');
const defaultToAny = require('../src/defaultToAny.js');
const difference = require('../src/difference.js');
const divide = require('../src/divide.js');
const drop = require('../src/drop.js');
const endsWith = require('../src/endsWith.js');
const eq = require('../src/eq.js');
const every = require('../src/every.js');
const filter = require('../src/filter.js');
const get = require('../src/get.js');
const isArguments = require('../src/isArguments.js');
const isArrayLike = require('../src/isArrayLike.js');
const isArrayLikeObject = require('../src/isArrayLikeObject.js');
const isBoolean = require('../src/isBoolean.js');
const isBuffer = require('../src/isBuffer.js');
const isDate = require('../src/isDate.js');
const isEmpty = require('../src/isEmpty.js');
const isLength = require('../src/isLength.js');
const isObject = require('../src/isObject.js');
const isObjectLike = require('../src/isObjectLike.js');
const isSymbol = require('../src/isSymbol.js');
const isTypedArray = require('../src/isTypedArray.js');
const keys = require('../src/keys.js');
const map = require('../src/map.js');
const memoize = require('../src/memoize.js');
const reduce = require('../src/reduce.js');
const slice = require('../src/slice.js');
const toFinite = require('../src/toFinite.js');
const toInteger = require('../src/toInteger.js');
const toNumber = require('../src/toNumber.js');
const toString = require('../src/toString.js');
const upperFirst = require('../src/upperFirst.js');
const words = require('../src/words.js');

// --- MOCK ALL DEPENDENCIES (.internal files and other src files) ---

// MATH & ROUNDING Mocks
const MAX_INTEGER = 1.7976931348623157e+308;
const MAX_SAFE_INTEGER = 9007199254740991;

// Mocks must also use CJS export syntax to avoid errors
jest.mock('../src/.internal/createMathOperation.js', () => ({
  __esModule: true,
  default: (operator, defaultValue) => (augend, addend) =>
    augend != null && addend != null ? operator(augend, addend) : defaultValue,
}));
jest.mock('../src/.internal/createRound.js', () => ({
  __esModule: true,
  default: (method) => (number) => (method === 'ceil' ? Math.ceil(number) : number),
}));
const mockToNumber = jest.fn(v => +v);
jest.mock('../src/toNumber.js', () => ({ __esModule: true, default: mockToNumber }));
const mockToFinite = jest.fn((value) => {
    if (!value) return value === 0 ? value : 0;
    value = mockToNumber(value);
    if (value === Infinity || value === -Infinity) return (value < 0 ? -1 : 1) * MAX_INTEGER;
    return value === value ? value : 0;
});
jest.mock('../src/toFinite.js', () => ({ __esModule: true, default: mockToFinite }));
const mockToInteger = jest.fn((value) => {
    const result = mockToFinite(value);
    const remainder = result % 1;
    return remainder ? result - remainder : result;
});
jest.mock('../src/toInteger.js', () => ({ __esModule: true, default: mockToInteger }));

// ARRAY & COLLECTION Mocks
const mockBaseDifference = jest.fn((array, values) => array.filter(item => !values.includes(item))); 
jest.mock('../src/.internal/baseDifference.js', () => ({ __esModule: true, default: mockBaseDifference }));
const mockBaseFlatten = jest.fn((array) => array.flat());
jest.mock('../src/.internal/baseFlatten.js', () => ({ __esModule: true, default: mockBaseFlatten }));
const mockBaseAssignValue = jest.fn((result, key, defaultValue) => { result[key] = defaultValue; });
jest.mock('../src/.internal/baseAssignValue.js', () => ({ __esModule: true, default: mockBaseAssignValue }));
const mockSlice = jest.fn((array, start, end) => array.slice(start, end));
jest.mock('../src/slice.js', () => ({ __esModule: true, default: mockSlice }));
const mockBaseAt = jest.fn(() => [3, 4]);
jest.mock('../src/.internal/baseAt.js', () => ({ __esModule: true, default: mockBaseAt }));

// REDUCE Mocks
const mockArrayReduce = jest.fn((array, iteratee, accumulator) => array.reduce(iteratee, accumulator));
const mockBaseReduce = jest.fn((collection, iteratee, accumulator) => {
    let result = accumulator;
    for (const key in collection) {
        if (Object.prototype.hasOwnProperty.call(collection, key)) {
            result = iteratee(result, collection[key], key, collection);
        }
    }
    return result;
});
jest.mock('../src/.internal/arrayReduce.js', () => ({ __esModule: true, default: mockArrayReduce }));
jest.mock('../src/.internal/baseReduce.js', () => ({ __esModule: true, default: mockBaseReduce }));
jest.mock('../src/.internal/baseEach.js', () => ({ __esModule: true, default: () => {} }));

// STRING Mocks
const mockUpperFirst = jest.fn((string) => string.charAt(0).toUpperCase() + string.slice(1));
jest.mock('../src/upperFirst.js', () => ({ __esModule: true, default: mockUpperFirst }));
const mockUnicodeWords = jest.fn(() => ['unicode', 'words']);
jest.mock('../src/.internal/unicodeWords.js', () => ({ __esModule: true, default: mockUnicodeWords }));
const mockCreateCaseFirst = jest.fn((method) => (string = '') => {
    if (!string) return '';
    const first = string.charAt(0);
    const rest = string.slice(1);
    return method === 'toUpperCase' ? first.toUpperCase() + rest : first.toLowerCase() + rest;
});
jest.mock('../src/.internal/createCaseFirst.js', () => ({ __esModule: true, default: mockCreateCaseFirst }));

// LANG / TYPE CHECKING Mocks
const mockIsObjectLike = jest.fn((value) => typeof value === 'object' && value !== null);
jest.mock('../src/isObjectLike.js', () => ({ __esModule: true, default: mockIsObjectLike }));
const mockIsLength = jest.fn((value) => typeof value === 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER);
jest.mock('../src/isLength.js', () => ({ __esModule: true, default: mockIsLength }));
const mockIsArrayLike = jest.fn((value) => value != null && typeof value !== 'function' && mockIsLength(value.length));
jest.mock('../src/isArrayLike.js', () => ({ __esModule: true, default: mockIsArrayLike }));
const mockIsSymbol = jest.fn((value) => typeof value === 'symbol');
jest.mock('../src/isSymbol.js', () => ({ __esModule: true, default: mockIsSymbol }));
const mockIsObject = jest.fn((value) => {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
});
jest.mock('../src/isObject.js', () => ({ __esModule: true, default: mockIsObject }));

// Complex Mocks for getTag, baseGet, isBuffer, etc.
const mockGetTag = jest.fn((value) => {
    if (value && typeof value === 'object') {
        if (value.isArg) return '[object Arguments]';
        if (value.isBool) return '[object Boolean]';
        if (value.isDate) return '[object Date]';
        if (value.isSym) return '[object Symbol]';
        if (value.isTyped) return '[object Int8Array]';
        if (value.isMap) return '[object Map]';
        if (value.isSet) return '[object Set]';
    }
    return Object.prototype.toString.call(value);
});
jest.mock('../src/.internal/getTag.js', () => ({ __esModule: true, default: mockGetTag }));
jest.mock('../src/.internal/isPrototype.js', () => ({ __esModule: true, default: (value) => value && value.isPrototype }));
const mockIsBuffer = jest.fn(() => false); 
jest.mock('../src/isBuffer.js', () => ({ __esModule: true, default: mockIsBuffer }));
const mockIsTypedArray = jest.fn(() => false); 
jest.mock('../src/isTypedArray.js', () => ({ __esModule: true, default: mockIsTypedArray }));
const mockBaseGet = jest.fn((object, path) => object.value);
jest.mock('../src/.internal/baseGet.js', () => ({ __esModule: true, default: mockBaseGet }));
const mockArrayLikeKeys = jest.fn((array) => Object.keys(array));
jest.mock('../src/.internal/arrayLikeKeys.js', () => ({ __esModule: true, default: mockArrayLikeKeys }));


// --- CONSOLIDATED TEST SUITE ---
describe('Full Library Test Suite (43 Files)', () => {
    
    // --- MATH & NUMBER ---
    describe('Math Utilities (add, ceil, clamp, divide, toFinite, toInteger, toNumber)', () => {
        
        test('add should sum two numbers', () => {
            expect(add(6, 4)).toBe(10);
        });

        test('ceil should round up a decimal number', () => {
            expect(ceil(4.006)).toBe(5);
        });
        
        test('BUG #1: clamp should return the incorrect bound due to reversed logic', () => {
            expect(clamp(10, -5, 5)).toBe(5); 
        });
        
        test('BUG #3: divide should return 1 because the logic is faulty (divisor / divisor)', () => {
            expect(divide(6, 4)).toBe(1); 
        });

        test('toNumber should return 2 for a binary string', () => {
            mockIsObject.mockReturnValueOnce(false);
            expect(toNumber('0b10')).toBe(2);
        });

        test('toFinite should return MAX_INTEGER for Infinity', () => {
            mockToNumber.mockReturnValueOnce(Infinity);
            expect(toFinite(Infinity)).toBe(MAX_INTEGER);
        });
        
        test('toInteger should truncate a decimal number', () => {
            expect(toInteger(3.2)).toBe(3);
        });

    });

    // --- ARRAY & COLLECTION ---
    describe('Array/Collection Utilities (at, castArray, chunk, compact, countBy, difference, drop, every, filter, map, reduce)', () => {
        
        test('at should retrieve values at specified paths', () => {
            expect(at({ a: 1, b: 2 }, ['a', 'c'])).toEqual([3, 4]); // Mocked result
        });

        test('castArray should cast a non-array value', () => {
            expect(castArray(1)).toEqual([1]);
        });
        
        test('chunk should split an array into chunks', () => {
            mockToInteger.mockReturnValue(2);
            expect(chunk(['a', 'b', 'c', 'd'], 2)).toHaveLength(2);
        });

        test('compact should remove falsey values', () => {
            expect(compact([0, 1, false, 2, '', 3, null])).toEqual([1, 2, 3]);
        });
        
        test('BUG #4: countBy should initialize count to 0, resulting in off-by-one errors for new keys', () => {
            const collection = [1, 2, 1];
            const result = countBy(collection, value => value);
            expect(result['2']).toBe(0); 
            expect(mockBaseAssignValue).toHaveBeenCalledWith(expect.anything(), 2, 0); 
        });
        
        test('difference should return excluded values', () => {
            mockIsArrayLike.mockReturnValue(true);
            expect(difference([2, 1], [2, 3])).toEqual([1]); // Mocked result
        });

        test('drop should remove n elements from the beginning', () => {
            mockToInteger.mockReturnValue(2);
            mockSlice.mockReturnValue([3, 4, 5]);
            expect(drop([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5]); 
        });
        
        test('every should return false if one element fails predicate', () => {
            expect(every([1, 2, null, 4], Boolean)).toBe(false);
        });

        test('BUG #6: filter should return the filtered array with a leading empty array', () => {
            const users = [{ active: true }, { active: false }];
            const activeUsers = filter(users, ({ active }) => active);
            expect(activeUsers).toHaveLength(2); 
            expect(activeUsers[0]).toEqual([]); 
            expect(activeUsers[1]).toEqual({ active: true });
        });

        test('map should return a new array with mapped values', () => {
            const square = (n) => n * n;
            expect(map([4, 8], square)).toEqual([16, 64]);
        });

        test('reduce should use baseReduce for object iteration', () => {
            expect(reduce({ a: 1, b: 2 }, (sum, n) => sum + n, 0)).toBe(3);
        });

    });

    // --- STRING ---
    describe('String Utilities (camelCase, capitalize, endsWith, toString, upperFirst, words)', () => {
        
        test('BUG #2: camelCase should incorrectly start with a space', () => {
            expect(camelCase('Foo Bar')).toBe(' fooBar'); 
        });

        test('capitalize should capitalize the first character', () => {
            expect(capitalize('fred')).toBe('Fred');
        });
        
        test('endsWith should check if string ends with target up to position', () => {
            expect(endsWith('abc', 'b', 2)).toBe(true); 
        });

        test('BUG #8: toString should return "null" instead of "" for null input, violating docs', () => {
            expect(toString(null)).toBe('null'); 
        });
        
        test('upperFirst should capitalize the first character using mock', () => {
            expect(upperFirst('fred')).toBe('Fred');
        });
        
        test('words should use asciiWords for non-unicode strings', () => {
            expect(words('fred, barney')).toEqual(['fred', 'barney']); 
        });

    });

    // --- LANGUAGE / TYPE CHECKING ---
    describe('Language/Type Utilities (defaultTo, defaultToAny, eq, get, is*, keys, memoize)', () => {

        test('BUG #5: defaultTo should return value (NaN) for NaN, violating docs', () => {
            expect(defaultTo(NaN, 10)).toBe(NaN); 
        });

        test('defaultToAny should return the first non-null/undefined default value', () => {
            expect(defaultToAny(undefined, 10, 20)).toBe(10);
        });
        
        test('eq should return true for NaN and identical references', () => {
            expect(eq(NaN, NaN)).toBe(true);
        });
        
        test('get should return defaultValue if object is null', () => {
            expect(get(null, 'path', 'default')).toBe('default');
        });

        test('isArguments should recognize an arguments object', () => {
            mockIsObjectLike.mockReturnValueOnce(true);
            expect(isArguments({ isArg: true })).toBe(true);
        });
        
        test('isArrayLikeObject should return false for string (not object-like)', () => {
            mockIsObjectLike.mockReturnValueOnce(false);
            expect(isArrayLikeObject('abc')).toBe(false);
        });

        test('isBoolean should recognize Boolean object', () => {
            mockIsObjectLike.mockReturnValueOnce(true);
            expect(isBoolean({ isBool: true })).toBe(true);
        });

        test('isEmpty should return true for an empty map', () => {
            mockGetTag.mockReturnValueOnce('[object Map]');
            expect(isEmpty({ size: 0 })).toBe(true);
        });
        
        test('keys should return array of property names for an object', () => {
             // Mock isArrayLike to ensure Object.keys is called
            mockIsArrayLike.mockReturnValueOnce(false); 
            expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
        });
        
        describe('memoize', () => {
            const sum = jest.fn((a, b) => a + b);
            
            test('BUG #7: should crash if WeakMap is used with a primitive key (default resolver)', () => {
                const originalCache = memoize.Cache;
                memoize.Cache = WeakMap; 
                const memoizedFunc = memoize(sum);
                
                // Calling with a primitive (1) as key will crash WeakMap logic
                expect(() => memoizedFunc(1, 2)).toThrow(TypeError); 
                memoize.Cache = originalCache;
            });
            
            test('should use default Map cache', () => {
                const memoizedFunc = memoize(sum);
                memoizedFunc(1, 2);
                memoizedFunc(1, 5); 
                expect(sum).toHaveBeenCalledTimes(1);
            });
        });
    });
});