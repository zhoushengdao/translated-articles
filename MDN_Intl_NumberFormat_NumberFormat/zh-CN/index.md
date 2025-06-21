---
title: Intl.NumberFormat() 构造函数
slug: Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
page-type: javascript-constructor
browser-compat: javascript.builtins.Intl.NumberFormat.NumberFormat
---

{{JSRef}}

**`Intl.NumberFormat()`** 构造函数创建 {{jsxref("Intl.NumberFormat")}} 对象。

{{InteractiveExample("JavaScript Demo: Intl.NumberFormat() constructor", "taller")}}

```js interactive-example
const number = 123456.789;

console.log(
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    number,
  ),
);
// 预期输出："123.456,79 €"

// 日元不使用辅币单位
console.log(
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(
    number,
  ),
);
// 预期输出："￥123,457"

// 限制为三位有效数字
console.log(
  new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(
    number,
  ),
);
// 预期输出："1,23,000"
```

## 语法

```js-nolint
new Intl.NumberFormat()
new Intl.NumberFormat(locales)
new Intl.NumberFormat(locales, options)

Intl.NumberFormat()
Intl.NumberFormat(locales)
Intl.NumberFormat(locales, options)
```

> **注意：**`Intl.NumberFormat()` 可以带或不带 [`new`](/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 调用。 两者都会创建一个新的 `Intl.NumberFormat` 实例。 然而，当不带 `new` 调用且 `this` 值是另一个 `Intl.NumberFormat` 实例时，有一个特殊行为；参见 [返回值](#返回值)。

### 参数

- `locales` {{optional_inline}}

  - : 一个带有 BCP 47 语言标签的字符串或一个 {{jsxref("Intl.Locale")}} 实例，或这样的区域标识符数组。 当传递 `undefined` 或不支持指定的区域标识符时，使用运行时的默认区域设置。 关于 `locales` 参数的一般形式和解释，参见 [`Intl` 主页面上的参数描述](/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_参数)。

    允许以下 Unicode 扩展键：

    - `nu`
      - : 参见 [`numberingSystem`](#numberingsystem)。

    此键也可以通过 `options` 设置（如下所列）。 当两者都设置时，`options` 属性优先。

- `options` {{optional_inline}}

  - : 一个对象。 为了便于阅读，属性列表根据其用途分为几个部分，包括[区域选项](#区域选项)、[样式选项](#样式选项)、[数字选项](#数字选项)和[其他选项](#其他选项)。

#### 区域选项

- `localeMatcher`
  - : 使用的区域匹配算法。 可能的值为 `"lookup"` 和 `"best fit"`；默认为 `"best fit"`。
    关于此选项的信息，参见 [区域识别和判定](/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl#语言区域识别和判定)。
- `numberingSystem`
  - : 用于数字格式化的数字系统，如 `"arab"`、`"hans"`、`"mathsans"` 等。 有关支持的数字系统类型列表，参见 [`Intl.supportedValuesOf()`](/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf#supported_numbering_system_types)。 此选项也可以通过 `nu` Unicode 扩展键设置；如果两者都提供，此 `options` 属性优先。

#### 样式选项

根据使用的 `style`，其中一些可能被忽略，而其他一些可能是必需的：

- `style`
  - : 使用的格式化样式。
    - `"decimal"`（默认）
      - : 用于普通数字格式化。
    - `"currency"`
      - : 用于货币格式化。
    - `"percent"`
      - : 用于百分比格式化。
    - `"unit"`
      - : 用于单位格式化。
- `currency`
  - : 用于货币格式化的货币。 : 用于货币格式化的货币。 可能的值为 ISO 4217 货币代码，如 `"USD"` 表示美元，`"EUR"` 表示欧元，或 `"CNY"` 表示人民币 — 参见 [`Intl.supportedValuesOf()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf#supported_currency_identifiers)。 没有默认值；如果 `style` 是 `"currency"`，则必须提供 `currency` 属性。 它被规范化为大写。 没有默认值；如果 `style` 是 `"currency"`，则必须提供 `currency` 属性。 它被规范化为大写。
- `currencyDisplay`
  - : 如何在货币格式化中显示货币。
    - `"code"`
      - : 使用 ISO 货币代码。
    - `"symbol"`（默认）
      - : 使用本地化的货币符号，如 €。
    - `"narrowSymbol"`
      - : 使用窄格式符号（"$100" 而不是 "US$100"）。
    - `"name"`
      - : 使用本地化的货币名称，如 `"dollar"`。
- `currencySign`
  - : 在许多区域设置中，会计格式意味着用括号包裹数字而不是附加减号。 可能的值为 `"standard"` 和 `"accounting"`；默认为 `"standard"`。 可能的值为 `"standard"` 和 `"accounting"`；默认为 `"standard"`。
- `unit`
  - ：在 `unit` 格式化中使用的单位，可能的值列在 [`Intl.supportedValuesOf()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf#supported_unit_identifiers) 中。 简单的单位对可以通过 "-per-" 连接起来形成一个复合单位。 没有默认值；如果 `style` 是 `"unit"`，则必须提供 `unit` 属性。 简单的单位对可以通过 "-per-" 连接起来形成一个复合单位。 没有默认值；如果 `style` 是 `"unit"`，则必须提供 `unit` 属性。
- `unitDisplay`
  - ：在 `unit` 格式化中使用的单位格式化样式。 可能的值为：
    - `"short"`（默认）
      - ：例如，`16 l`。
    - `"narrow"`
      - ：例如，`16l`。
    - `"long"`
      - ：例如，`16 litres`。

#### 数字选项

以下属性也由 {{jsxref("Intl.PluralRules")}} 支持。

- `minimumIntegerDigits`
  - ：使用的最小整数位数。 ：使用的最小整数位数。 当格式化时，整数位数小于此数的值将在左侧填充零（到指定长度）。 可能的值从 `1` 到 `21`；默认为 `1`。 可能的值从 `1` 到 `21`；默认为 `1`。

- `minimumFractionDigits`
  - ：使用的最小小数位数。 可能的值从 `0` 到 `100`；对于普通数字和百分比格式化的默认值为 `0`；对于货币格式化的默认值为由 [ISO 4217 货币代码列表](https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml) 提供的小数位数（如果列表未提供该信息，则为 2）。 参见 [SignificantDigits/FractionDigits 默认值](#significantdigitsfractiondigits_default_values) 了解何时应用此默认值。

- `maximumFractionDigits`
  - ：使用的最大小数位数。 ：使用的最小小数位数。 可能的值从 `0` 到 `100`；对于普通数字和百分比格式化的默认值为 `0`；对于货币格式化的默认值为由 [ISO 4217 货币代码列表](https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml) 提供的小数位数（如果列表未提供该信息，则为 2）。 参见 [SignificantDigits/FractionDigits 默认值](#significantdigitsfractiondigits_default_values) 了解何时应用此默认值。 参见 [SignificantDigits/FractionDigits 默认值](#significantdigitsfractiondigits_default_values) 了解何时应用此默认值。

- `minimumSignificantDigits`
  - ：使用的最小有效位数。 可能的值从 `1` 到 `21`；默认为 `1`。 参见 [SignificantDigits/FractionDigits 默认值](#significantdigitsfractiondigits_default_values) 了解何时应用此默认值。

- `maximumSignificantDigits`
  - ：使用的最大有效位数。 可能的值从 `1` 到 `21`；默认为 `21`。 参见 [SignificantDigits/FractionDigits 默认值](#significantdigitsfractiondigits_default_values) 了解何时应用此默认值。

- `roundingPriority`

  - ：如果同时指定了 "FractionDigits"（[`minimumFractionDigits`](#minimumfractiondigits)/[`maximumFractionDigits`](#maximumfractiondigits)）和 "SignificantDigits"（[`minimumSignificantDigits`](#minimumsignificantdigits)/[`maximumSignificantDigits`](#maximumsignificantdigits)），则指定如何解决舍入冲突。
    可能的值为：
    可能的值为：

    - `"auto"`（默认）
      - ：使用来自有效位数属性的结果。
    - `"morePrecision"`
      - ：使用来自导致更高精度的属性的结果。
    - `"lessPrecision"`
      - ：使用来自导致更低精度的属性的结果。

    如果 `notation` 是 `"compact"` 且未设置四个 "FractionDigits"/"SignificantDigits" 选项中的任何一个，则值 `"auto"` 被标准化为 `"morePrecision"`。

    请注意，对于 `auto` 以外的值，更高精度的结果是从 [`maximumSignificantDigits`](#minimumsignificantdigits) 和 [`maximumFractionDigits`](#maximumfractiondigits) 计算得出的（最小小数和有效数字设置被忽略）。

- `roundingIncrement`

  - ：指示相对于计算的舍入幅度应进行舍入的增量。 可能的值为 `1`、`2`、`5`、`10`、`20`、`25`、`50`、`100`、`200`、`250`、`500`、`1000`、`2000`、`2500` 和 `5000`；默认为 `1`。 它不能与有效数字舍入或 `roundingPriority` 的任何设置（除了 `auto`）混合使用。

- `roundingMode`

  - ：应如何舍入小数。 可能的值为： 可能的值为：

    - `"ceil"`
      - ：向 +∞ 方向舍入。 正值向上舍入。 负值向 "更正" 方向舍入。
    - `"floor"`
      - ：向 -∞ 方向舍入。 正值向下取整。 负值向“更负”方向取整。
    - `"expand"`
      - ：远离0取整。 通过取整，值的_大小_总是增加。 正值向上取整。 负值向“更负”方向取整。
    - `"trunc"`
      - ：向0取整。 通过取整，值的_大小_总是减少。 正值向下取整。 负值向“更负”方向取整。
    - `"halfCeil"`
      - ：向 +∞ 方向舍入。 正值向上舍入。 负值向 "更正" 方向舍入。 半增量以上的值像`"ceil"`（向+∞方向）取整，以下的像`"floor"`（向-∞方向）取整。 在半增量上，值像`"ceil"`一样取整。
    - `"halfFloor"`
      - ：向-∞方向取整。 半增量以上的值像`"ceil"`（向+∞方向）取整，以下的像`"floor"`（向-∞方向）取整。 在半增量上，值像`"floor"`一样取整。
    - `"halfExpand"`（默认）
      - ：远离0取整。 半增量以上的值像`"expand"`（远离零）取整，以下的像`"trunc"`（向0方向）取整。 在半增量上，值像`"expand"`一样取整。
    - `"halfTrunc"`
      - ：向0取整。 半增量以上的值像`"expand"`（远离零）取整，以下的像`"trunc"`（向0方向）取整。 在半增量上，值像`"trunc"`一样取整。
    - `"halfEven"`
      - ：向最近的偶数取整。 半增量以上的值像`"expand"`（远离零）取整，以下的像`"trunc"`（向0方向）取整。 在半增量上，值向最近的偶数取整。

    这些选项反映了[ICU用户指南](https://unicode-org.github.io/icu/userguide/format_parse/numbers/rounding-modes.html)，其中"expand"和"trunc"分别映射到ICU的"UP"和"DOWN"。
    下面的[取整模式](#rounding_modes)示例展示了每种模式的工作方式。
    下面的[取整模式](#rounding_modes)示例展示了每种模式的工作方式。

- `trailingZeroDisplay`
  - ：显示整数尾随零的策略。 可能的值为： 可能的值为：
    - `"auto"`（默认）
      - ：根据`minimumFractionDigits`和`minimumSignificantDigits`保留尾随零。
    - `"stripIfInteger"`
      - ：如果所有小数位都是零，则移除小数部分。 ：如果所有小数位都是零，则移除小数部分。 如果任何小数位非零，这与`"auto"`相同。

##### SignificantDigits/FractionDigits 默认值

对于上述四个选项（`FractionDigits`和`SignificantDigits`选项），我们提到了它们的默认值；然而，这些默认值_不是无条件应用的_。 它们仅在属性实际使用时应用，这取决于[`roundingPriority`](#roundingpriority)和[`notation`](#notation)设置。 具体来说： 它们仅在属性实际使用时应用，这取决于[`roundingPriority`](#roundingpriority)和[`notation`](#notation)设置。 具体来说：

- 如果`roundingPriority`不是`"auto"`，则所有四个选项都适用。
- 如果`roundingPriority`是`"auto"`并且至少设置了一个`SignificantDigits`选项，则`SignificantDigits`选项适用，`FractionDigits`选项被忽略。
- 如果`roundingPriority`是`"auto"`，并且至少设置了一个`FractionDigits`选项或`notation`不是`"compact"`，则`FractionDigits`选项适用，`SignificantDigits`选项被忽略。
- 如果`roundingPriority`是`"auto"`，`notation`是`"compact"`，并且四个选项均未设置，则它们设置为`{ minimumFractionDigits: 0, maximumFractionDigits: 0, minimumSignificantDigits: 1, maximumSignificantDigits: 2 }`，不考虑上述默认值，并且`roundingPriority`设置为`"morePrecision"`。

#### 其他选项

- `notation`
  - ：应该为数字显示的格式。 可能的值为： 可能的值为：
    - `"standard"`（默认）
      - ：普通数字格式。
    - `"scientific"`
      - : 返回格式化数字的数量级。
    - `"engineering"`
      - : 当可以被三整除时，返回十的指数。
    - `"compact"`
      - : 表示指数的字符串；默认为使用"短"形式。

- `compactDisplay`
  - : 仅在`notation`为`"紧凑"`时使用。 : 仅在`notation`为`"紧凑"`时使用。 可能的值是`"短"`和`"长"`；默认为`"短"`。

- `useGrouping`

  - : 是否使用分组分隔符，如千位分隔符或千/十万/千万分隔符。

    - `"always"`
      - : 即使区域设置偏好不同，也显示分组分隔符。
    - `"auto"`
      - : 根据区域设置偏好显示分组分隔符，这也可能取决于货币。
    - `"min2"`
      - : 当一组中至少有2位数字时显示分组分隔符。
    - `true`
      - : 同 `"always"`。
    - `false`
      - : 不显示分组分隔符。

    如果`notation`是`"紧凑"`，则默认为`"最小2"`，否则为`"自动"`。 接受字符串值`"true"`和`"false"`，但总是转换为默认值。 接受字符串值`"true"`和`"false"`，但总是转换为默认值。

- `signDisplay`
  - : 何时显示数字的符号。 可能的值为：
    - `"auto"`（默认）
      - : 仅对负数显示符号，包括负零。
    - `"always"`
      - : 总是显示符号。
    - `"exceptZero"`
      - : 对正数和负数显示符号，但不包括零。
    - `"negative"`
      - : 仅对负数显示符号，不包括负零。
    - `"never"`
      - : 从不显示符号。

### 返回值

一个新的`Intl.NumberFormat`对象。

> [!NOTE]
> 下面的文本描述了被规范标记为"可选"的行为。 它可能不会在所有环境中工作。 检查[浏览器兼容性表](#浏览器兼容性)。

通常，`Intl.NumberFormat()` 可以带或不带 [`new`](/zh-CN/docs/Web/JavaScript/Reference/Operators/new)调用，并且在两种情况下都会返回一个新的 `Intl.NumberFormat` 实例。 但是，如果 [`this`](/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 值是一个[`instanceof`](/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) `Intl.NumberFormat` 的对象（不一定意味着它是通过 `new Intl.NumberFormat` 创建的；只是它在原型链中有 `Intl.NumberFormat.prototype`），那么将返回 `this` 的值，而新创建的`Intl.NumberFormat` 对象隐藏在 `[Symbol(IntlLegacyConstructedSymbol)]` 属性中（一个在实例之间重用的唯一符号）。

```js
const formatter = Intl.NumberFormat.call(
  { __proto__: Intl.NumberFormat.prototype },
  "en-US",
  { notation: "scientific" },
);
console.log(Object.getOwnPropertyDescriptors(formatter));
// {
//   [Symbol(IntlLegacyConstructedSymbol)]: {
//     value: NumberFormat [Intl.NumberFormat] {},
//     writable: false,
//     enumerable: false,
//     configurable: false
//   }
// }
```

注意，这里只有一个实际的`Intl.NumberFormat`实例：隐藏在`[Symbol(IntlLegacyConstructedSymbol)]`中的那个。 注意，这里只有一个实际的`Intl.NumberFormat`实例：隐藏在`[Symbol(IntlLegacyConstructedSymbol)]`中的那个。 在`formatter`上调用[`format()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format)和[`resolvedOptions()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/resolvedOptions)方法会正确使用该实例中存储的选项，但调用所有其他方法（例如[`formatRange()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatRange)）会因为那些方法不咨询隐藏实例的选项而失败，并显示"TypeError: formatRange method called on incompatible Object"。

这种行为，称为`ChainNumberFormat`，当`Intl.NumberFormat()`不带`new`调用但`this`设置为任何不是`instanceof Intl.NumberFormat`的其他内容时不会发生。 如果你直接以`Intl.NumberFormat()`调用它，`this`值是[`Intl`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)，并且一个新的`Intl.NumberFormat`实例会正常创建。 如果你直接以`Intl.NumberFormat()`调用它，`this`值是[`Intl`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)，并且一个新的`Intl.NumberFormat`实例会正常创建。

### 异常

- {{jsxref("RangeError")}}
  - : 在以下情况之一抛出：
    - 一个接受枚举值的属性（如`style`、`units`、`currency`等）被设置为无效值。
    - `maximumFractionDigits`和`minimumFractionDigits`都被设置，并且它们被设置为不同的值。
      请注意，根据各种格式化选项，这些属性可以有默认值。
      因此，即使你只设置了一个属性，也可能得到这个错误。
      请注意，根据各种格式化选项，这些属性可以有默认值。
      因此，即使你只设置了一个属性，也可能得到这个错误。
- {{jsxref("TypeError")}}
  - : 如果`options.style`属性设置为"unit"或"currency"，并且没有为相应的属性`options.unit`或`options.currency`设置值，则抛出。

## 示例

### 基本用法

在不指定区域设置的基本使用中，返回默认区域设置和默认选项的格式化字符串。

```js
const amount = 3500;

console.log(new Intl.NumberFormat().format(amount));
// '3,500' 如果是在美国英语区域设置中
```

### 小数和百分比格式化

```js
const amount = 3500;

new Intl.NumberFormat("en-US", {
  style: "decimal",
}).format(amount); // '3,500'
new Intl.NumberFormat("en-US", {
  style: "percent",
}).format(amount); // '350,000%'
```

### 单位格式化

如果 `style` 是 `'unit'`，则必须提供 `unit` 属性。
可选地，`unitDisplay` 控制单位的格式化。

```js
const amount = 3500;

new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "liter",
}).format(amount); // '3,500 L'

new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "liter",
  unitDisplay: "long",
}).format(amount); // '3,500 liters'
```

### 货币格式化

如果 `style` 是 `'currency'`，则必须提供 `currency` 属性。 可选地，`currencyDisplay` 和 `currencySign` 控制单位的格式化。

```js
const amount = -3500;
new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(amount); // '-$3,500.00'

new Intl.NumberFormat("bn", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "name",
}).format(amount); // '-3,500.00 US dollars'

new Intl.NumberFormat("bn", {
  style: "currency",
  currency: "USD",
  currencySign: "accounting",
}).format(amount); // '($3,500.00)'
```

### 科学、工程或紧凑表示法

科学和紧凑表示法由 `notation` 选项表示，可以这样格式化：

```js
new Intl.NumberFormat("en-US", {
  notation: "scientific",
}).format(987654321);
// 9.877E8

new Intl.NumberFormat("pt-PT", {
  notation: "scientific",
}).format(987654321);
// 9,877E8

new Intl.NumberFormat("en-GB", {
  notation: "engineering",
}).format(987654321);
// 987.654E6

new Intl.NumberFormat("de", {
  notation: "engineering",
}).format(987654321);
// 987,654E6

new Intl.NumberFormat("zh-CN", {
  notation: "compact",
}).format(987654321);
// 9.9 亿

new Intl.NumberFormat("fr", {
  notation: "compact",
  compactDisplay: "long",
}).format(987654321);
// 988 millions

new Intl.NumberFormat("en-GB", {
  notation: "compact",
  compactDisplay: "short",
}).format(987654321);
// 988M
```

### 显示符号

为正值和负值显示符号，但不为零显示：

```js
new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
}).format(0.55);
// '+55%'
```

注意，当货币符号为 "accounting" 时，可能会使用括号而不是减号：

```js
new Intl.NumberFormat("bn", {
  style: "currency",
  currency: "USD",
  currencySign: "accounting",
  signDisplay: "always",
}).format(-3500);
// '($3,500.00)'
```

### FractionDigits、SignificantDigits 和 IntegerDigits

在格式化数字时，您可以指定要显示的最小或最大小数位数、整数位数或有效位数。

> [!注意]
> 如果同时指定了有效位数和小数位数的限制，那么实际的格式化取决于 [`roundingPriority`](#roundingpriority)。

#### 使用 FractionDigits 和 IntegerDigits

整数和小数位数属性分别表示在小数点前后显示的位数。
如果要显示的值具有的整数位数少于指定的位数，则将在左侧填充零以达到预期的位数。
如果小数位数较少，则将在右侧填充零。
以下两种情况均显示：
如果要显示的值具有的整数位数少于指定的位数，则将在左侧填充零以达到预期的位数。
如果小数位数较少，则将在右侧填充零。
以下两种情况均显示：

```js
// 格式化添加零以显示最小整数和小数
console.log(
  new Intl.NumberFormat("en", {
    minimumIntegerDigits: 3,
    minimumFractionDigits: 4,
  }).format(4.33),
);
// "004.3300"
```

如果一个值的小数位数多于指定的最大数，它将被四舍五入。
四舍五入的方式取决于 [`roundingMode`](#roundingmode) 属性（更多细节在[四舍五入模式](#rounding_modes)部分提供）。
下面的值从五个小数位 (`4.33145`) 四舍五入到两个 (`4.33`)：

```js
// 显示值缩短到最大位数
console.log(
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(4.33145),
);
// "4.33"
```

如果值已经具有多于 2 个小数位，则最小小数位数没有效果：

```js
// 如果值的精度更高，最小小数位数没有效果。
console.log(
  new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
  }).format(4.33145),
);
// "4.331"
```

> [!警告]
> 注意默认值，因为它们可能会影响格式化，即使未在代码中指定。
> [!警告]
> 注意默认值，因为它们可能会影响格式化，即使未在代码中指定。
> 对于普通值，默认的最大数字值为 `3`，对于货币为 `2`，对于其他预定义类型可能有不同的值。

上面的格式化值被四舍五入到3位，即使我们没有指定最大位数！
这是因为当我们指定 `minimumFractionDigits` 时，`maximumFractionDigits` 的默认值被设置，反之亦然。 上面的格式化值被四舍五入到3位，即使我们没有指定最大位数！
这是因为当我们指定 `minimumFractionDigits` 时，`maximumFractionDigits` 的默认值被设置，反之亦然。 `maximumFractionDigits` 和 `minimumFractionDigits` 的默认值分别为 `3` 和 `0`。

您可以使用 [`resolvedOptions()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/resolvedOptions) 来检查格式化器。

```js
console.log(
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).resolvedOptions(),
);
// {
//   …
//   minimumIntegerDigits: 1,
//   minimumFractionDigits: 0,
//   maximumFractionDigits: 2,
//   …
// }

console.log(
  new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
  }).resolvedOptions(),
);
// {
//   …
//   minimumIntegerDigits: 1,
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 3,
//   …
// }
```

#### 使用 SignificantDigits

有效位数的总数是包括整数和小数部分的总位数。
有效位数的总数是包括整数和小数部分的总位数。
`maximumSignificantDigits` 用于指示从原始值显示的总位数。

下面的例子展示了这是如何工作的。
下面的例子展示了这是如何工作的。
特别注意最后一种情况：只保留第一个数字，其他数字被丢弃/设置为零。

```js
// 显示 5 位有效数字
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 5,
  }).format(54.33145),
);
// "54.331"

// 最大 2 位有效数字
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(54.33145),
);
// "54"

// 最大 1 位有效数字
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 1,
  }).format(54.33145),
);
// "50"
```

`minimumSignificantDigits` 确保至少显示指定数量的数字，如果需要，则在值的末尾添加零。

```js
// 最小 10 位有效数字
console.log(
  new Intl.NumberFormat("en", {
    minimumSignificantDigits: 10,
  }).format(54.33145),
);
// "54.33145000"
```

> [!警告]
> 注意默认值，因为它们可能会影响格式化。
> 如果只使用一个 `SignificantDigits` 属性，那么它的对应属性将自动应用默认值。
> 默认的最大和最小有效数字值分别为21和1。

#### 同时指定有效位数和小数位数

小数位数（[`minimumFractionDigits`](#minimumfractiondigits)/[`maximumFractionDigits`](#maximumfractiondigits)）和有效位数（[`minimumSignificantDigits`](#minimumsignificantdigits)/[`maximumSignificantDigits`](#maximumsignificantdigits)）都是控制应格式化多少小数位和前导位的方法。
如果同时使用两者，它们可能会发生冲突。
如果同时使用两者，它们可能会发生冲突。

这些冲突通过 [`roundingPriority`](#roundingpriority) 属性解决。
这些冲突通过 [`roundingPriority`](#roundingpriority) 属性解决。
默认情况下，其值为 `"auto"`，这意味着如果指定了 [`minimumSignificantDigits`](#minimumsignificantdigits) 或 [`maximumSignificantDigits`](#minimumsignificantdigits)，则将忽略小数和整数位数属性。

例如，下面的代码用 `maximumFractionDigits: 3` 格式化 `4.33145` 的值，然后用 `maximumSignificantDigits: 2`，然后两者都用。
两者都用的值是使用 `maximumSignificantDigits` 设置的值。
两者都用的值是使用 `maximumSignificantDigits` 设置的值。

```js
console.log(
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 3,
  }).format(4.33145),
);
// "4.331"
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(4.33145),
);
// "4.3"
console.log(
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 3,
    maximumSignificantDigits: 2,
  }).format(4.33145),
);
// "4.3"
```

使用[`resolvedOptions()`](/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/resolvedOptions)来检查格式化器，我们可以看到返回的对象在指定了`maximumSignificantDigits`或`minimumSignificantDigits`时不包含`maximumFractionDigits`。

```js
console.log(
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 3,
    maximumSignificantDigits: 2,
  }).resolvedOptions(),
);
// {
//   …
//   minimumIntegerDigits: 1,
//   minimumSignificantDigits: 1,
//   maximumSignificantDigits: 2,
//   …
// }
console.log(
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 3,
    minimumSignificantDigits: 2,
  }).resolvedOptions(),
);
// {
//   …
//   minimumIntegerDigits: 1,
//   minimumSignificantDigits: 2,
//   maximumSignificantDigits: 21,
//   …
// }
```

除了`"auto"`，您还可以通过将[`roundingPriority`](#roundingpriority)指定为`"morePrecision"`或`"lessPrecision"`来解决冲突。
格式化器使用`maximumSignificantDigits`和`maximumFractionDigits`的值来计算精度。
格式化器使用`maximumSignificantDigits`和`maximumFractionDigits`的值来计算精度。

下面的代码显示了为三种不同的舍入优先级选择的格式：

```js
const maxFracNF = new Intl.NumberFormat("en", {
  maximumFractionDigits: 3,
});
console.log(`maximumFractionDigits:3 - ${maxFracNF.format(1.23456)}`);
// "maximumFractionDigits:2 - 1.235"

const maxSigNS = new Intl.NumberFormat("en", {
  maximumSignificantDigits: 3,
});
console.log(`maximumSignificantDigits:3 - ${maxSigNS.format(1.23456)}`);
// "maximumSignificantDigits:3 - 1.23"

const bothAuto = new Intl.NumberFormat("en", {
  maximumSignificantDigits: 3,
  maximumFractionDigits: 3,
});
console.log(`auto - ${bothAuto.format(1.23456)}`);
// "auto - 1.23"

const bothLess = new Intl.NumberFormat("en", {
  roundingPriority: "lessPrecision",
  maximumSignificantDigits: 3,
  maximumFractionDigits: 3,
});
console.log(`lessPrecision - ${bothLess.format(1.23456)}`);
// "lessPrecision - 1.23"

const bothMore = new Intl.NumberFormat("en", {
  roundingPriority: "morePrecision",
  maximumSignificantDigits: 3,
  maximumFractionDigits: 3,
});
console.log(`morePrecision - ${bothMore.format(1.23456)}`);
// "morePrecision - 1.235"
```

请注意，如果指定了最小值而没有最大值，算法可能会以非直观的方式行为。
请注意，如果指定了最小值而没有最大值，算法可能会以非直观的方式行为。
下面的例子格式化值`1`，指定`minimumFractionDigits: 2`（格式化为`1.00`）和`minimumSignificantDigits: 2`（格式化为`1.0`）。
由于`1.00`比`1.0`有更多的数字，这应该是优先考虑`morePrecision`时的结果，但实际上相反：
由于`1.00`比`1.0`有更多的数字，这应该是优先考虑`morePrecision`时的结果，但实际上相反：

```js
const bothLess = new Intl.NumberFormat("en", {
  roundingPriority: "lessPrecision",
  minimumFractionDigits: 2,
  minimumSignificantDigits: 2,
});
console.log(`lessPrecision - ${bothLess.format(1)}`);
// "lessPrecision - 1.00"

const bothMore = new Intl.NumberFormat("en", {
  roundingPriority: "morePrecision",
  minimumFractionDigits: 2,
  minimumSignificantDigits: 2,
});
console.log(`morePrecision - ${bothMore.format(1)}`);
// "morePrecision - 1.0"
```

这样做的原因是只有"最大精度"值用于计算，而`maximumSignificantDigits`的默认值比`maximumFractionDigits`高得多。

> [!注意]
> 工作组已经提出了算法的修改，其中格式化器应该独立评估使用指定的分数和有效数字的结果（考虑最小值和最大值）。
> 然后，如果设置了`morePrecision`，它将选择显示更多分数数字的选项，如果设置了`lessPrecision`，则选择显示更少的选项。
> 这将导致这种情况下更直观的行为。
> 然后，如果设置了`morePrecision`，它将选择显示更多分数数字的选项，如果设置了`lessPrecision`，则选择显示更少的选项。
> 这将导致这种情况下更直观的行为。

### 舍入模式

如果一个值的分数数字比构造函数选项允许的多，格式化后的值将被_舍入_到指定的分数数字数量。
值的_舍入方式_取决于[`roundingMode`](#roundingmode)属性。
值的_舍入方式_取决于[`roundingMode`](#roundingmode)属性。

数字格式化器默认使用`halfExpand`舍入，即在半增量时"远离零"舍入值（换句话说，值的_幅度_被向上舍入）。

对于一个正数，如果要移除的分数数字更接近下一个增量（或在半路上），则剩余的分数数字将被向上舍入，否则它们将被向下舍入。
对于一个正数，如果要移除的分数数字更接近下一个增量（或在半路上），则剩余的分数数字将被向上舍入，否则它们将被向下舍入。
如下所示：2.23舍入到两个有效数字被截断为2.2，因为2.23小于半增量2.25，而2.25及以上的值被向上舍入到2.3：

```js
// 值低于半增量：向下舍入。
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(2.23),
);
// "2.2"

// 值在半增量或以上：向上舍入。
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(2.25),
);
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(2.28),
);
// "2.3"
// "2.3"
```

负数在半增量点或以下也被远离零舍入（变得更负）：

```js
// 值低于半增量：向下舍入。
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(-2.23),
);
// "-2.2"

// 值在半增量或以上：向上舍入。
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(-2.25),
);
console.log(
  new Intl.NumberFormat("en", {
    maximumSignificantDigits: 2,
  }).format(-2.28),
);
// "-2.3"
// "-2.3"
```

下表显示了不同舍入模式对半增量及其周围的正负值的影响。

| 舍入模式         | 2.23 | 2.25 | 2.28 | -2.23 | -2.25 | -2.28 |
| ------------ | -------------------- | -------------------- | -------------------- | --------------------- | --------------------- | --------------------- |
| `ceil`       | 2.3  | 2.3  | 2.3  | -2.2  | -2.2  | -2.2  |
| `floor`      | 2.2  | 2.2  | 2.2  | -2.3  | -2.3  | -2.3  |
| `expand`     | 2.3  | 2.3  | 2.3  | -2.3  | -2.3  | -2.3  |
| `trunc`      | 2.2  | 2.2  | 2.2  | -2.2  | -2.2  | -2.2  |
| `halfCeil`   | 2.2  | 2.3  | 2.3  | -2.2  | -2.2  | -2.3  |
| `halfFloor`  | 2.2  | 2.2  | 2.3  | -2.2  | -2.3  | -2.3  |
| `halfExpand` | 2.2  | 2.3  | 2.3  | -2.2  | -2.3  | -2.3  |
| `halfTrunc`  | 2.2  | 2.2  | 2.3  | -2.2  | -2.2  | -2.3  |
| `halfEven`   | 2.2  | 2.2  | 2.3  | -2.2  | -2.2  | -2.3  |

当使用`halfEven`时，其行为还取决于被四舍五入数字的最后一位的奇偶性。 例如，上表中`halfEven`的行为与`halfTrunc`相同，因为所有数字的大小都在较小的"偶数"数字（2.2）和较大的"奇数"数字（2.3）之间。 如果数字在±2.3和±2.4之间，`halfEven`将表现得像`halfExpand`。 这种行为避免了在大数据样本中持续低估或高估半增量。

### 使用roundingIncrement

有时我们希望将剩余的小数位数四舍五入到其他增量，而不是下一个整数。
有时我们希望将剩余的小数位数四舍五入到其他增量，而不是下一个整数。
例如，最小硬币为5美分的货币可能希望将值四舍五入到5的增量，反映实际可以用现金支付的金额。

这种四舍五入可以通过[`roundingIncrement`](#roundingincrement)属性实现。

例如，如果`maximumFractionDigits`为2且`roundingIncrement`为5，则数字将四舍五入到最接近的0.05：

```js
const nf = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingIncrement: 5,
});

console.log(nf.format(11.29)); // "$11.30"
console.log(nf.format(11.25)); // "$11.25"
console.log(nf.format(11.22)); // "$11.20"
```

这种特定模式被称为"镍四舍五入"，其中镍是美国5美分硬币的俗称。
这种特定模式被称为"镍四舍五入"，其中镍是美国5美分硬币的俗称。
要四舍五入到最接近的10美分（"角四舍五入"），您可以将`roundingIncrement`更改为`10`。

```js
const nf = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingIncrement: 10,
});

console.log(nf.format(11.29)); // "$11.30"
console.log(nf.format(11.25)); // "$11.30"
console.log(nf.format(11.22)); // "$11.20"
```

您还可以使用[`roundingMode`](#roundingmode)来更改四舍五入算法。
下面的示例展示了如何使用`halfCeil`四舍五入来将值"更不积极"地四舍五入到半增量以下，"更积极"地四舍五入到半增量以上或等于半增量。
增量数字为"0.05"，因此半增量在.025（下面，这在11.225处显示）。

```js
const nf = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingIncrement: 5,
  roundingMode: "halfCeil",
});

console.log(nf.format(11.21)); // "$11.20"
console.log(nf.format(11.22)); // "$11.20"
console.log(nf.format(11.224)); // "$11.20"
console.log(nf.format(11.225)); // "$11.25"
console.log(nf.format(11.23)); // "$11.25"
```

如果需要更改数字的位数，请记住`minimumFractionDigits`和`maximumFractionDigits`必须设置为相同的值，否则会抛出`RangeError`。

`roundingIncrement`不能与有效数字四舍五入或`roundingPriority`的任何设置（除了`auto`）混合使用。

## 规范

{{Specifications}}

## 浏览器兼容性

{{Compat}}

## 参见

- {{jsxref("Intl.NumberFormat")}}
- {{jsxref("Intl.supportedValuesOf()")}}
- {{jsxref("Intl")}}
