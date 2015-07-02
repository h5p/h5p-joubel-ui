h5p-joubel-ui
=============

This is a utility library for creating UI widgets. It does not implement attach, so it has to bee actively used by
other libraries

API description
===============
## Functions
<dl>
<dt><a href="#setScore">setScore(score)</a></dt>
<dd><p>Set the current score</p>
</dd>
<dt><a href="#incrementScore">incrementScore([incrementBy])</a></dt>
<dd><p>Increment score</p>
</dd>
<dt><a href="#setMaxScore">setMaxScore(maxScore)</a></dt>
<dd><p>Set the max score</p>
</dd>
<dt><a href="#updateVisuals">updateVisuals()</a></dt>
<dd><p>Updates the progressbar visuals</p>
</dd>
</dl>
<a name="setScore"></a>
## setScore(score)
Set the current score

**Kind**: global function  

| Param | Type |
| --- | --- |
| score | <code>number</code> |

<a name="incrementScore"></a>
## incrementScore([incrementBy])
Increment score

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [incrementBy] | <code>number</code> | Optional parameter, defaults to 1 |

<a name="setMaxScore"></a>
## setMaxScore(maxScore)
Set the max score

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| maxScore | <code>number</code> | The max score |

<a name="updateVisuals"></a>
## updateVisuals()
Updates the progressbar visuals

**Kind**: global function  
<a name="createTip"></a>
## .createTip(text, params) ⇒ <code>H5P.JoubelTip</code>
Create a tip

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The textual tip |
| params | <code>Object</code> | Parameters |

<a name="createMessageDialog"></a>
## .createMessageDialog($container, message) ⇒ <code>[JoubelMessageDialog](#H5P.JoubelMessageDialog)</code>
Create message dialog

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| $container | <code>H5P.jQuery</code> | The dom container |
| message | <code>string</code> | The message |

<a name="createHelpTextDialog"></a>
## .createHelpTextDialog(header, message) ⇒ <code>[JoubelHelpTextDialog](#H5P.JoubelHelpTextDialog)</code>
Create help text dialog

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| header | <code>string</code> | The textual header |
| message | <code>string</code> | The textual message |

<a name="createProgressCircle"></a>
## .createProgressCircle(number, progressColor, fillColor, backgroundColor) ⇒ <code>[JoubelProgressCircle](#H5P.JoubelProgressCircle)</code>
Create progress circle

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | The progress (0 to 100) |
| progressColor | <code>string</code> | The progress color in hex value |
| fillColor | <code>string</code> | The fill color in hex value |
| backgroundColor | <code>string</code> | The background color in hex value |

<a name="createThrobber"></a>
## .createThrobber() ⇒ <code>H5P.JoubelThrobber</code>
Create throbber for loading

**Kind**: static function  
<a name="createSimpleRoundedButton"></a>
## .createSimpleRoundedButton(text) ⇒ <code>H5P.SimpleRoundedButton</code>
Create simple rounded button

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The button label |

<a name="createSlider"></a>
## .createSlider($container, params) ⇒ <code>H5P.JoubelSlider</code>
Create Slider

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| $container | <code>H5P.jQuery</code> | The dom container |
| params | <code>Object</code> | Parameters |

<a name="createScoreBar"></a>
## .createScoreBar([maxScore]) ⇒ <code>H5P.JoubelScoreBar</code>
Create Score Bar

**Kind**: static function  

| Param | Type | Description |
| --- | --- | --- |
| [maxScore] | <code>number</code> | The maximum score |

<a name="createButton"></a>
## .createButton(params) ⇒ <code>H5P.jQuery</code>
Create standard Joubel button

**Kind**: static function  
**Returns**: <code>H5P.jQuery</code> - The jquery element created  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | May hold any properties allowed by jQuery. If href is set, an A tag  is used, if not a button tag is used. |

License
=======
(The MIT License)

Copyright (c) 2015 Joubel AS

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
