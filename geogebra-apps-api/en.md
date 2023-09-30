# Reference:GeoGebra Apps API

This page describes the GeoGebra Apps API to interact with GeoGebra apps. Please see [GeoGebra Apps Embedding](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding) on how to embed our apps into your web pages.

# Examples

In these examples you can see the GeoGebra Apps API in action:

- [Showing & hiding objects with buttons](http://dev.geogebra.org/examples/html/example-api-multiple.html)
- [Saving & loading state](http://dev.geogebra.org/examples/html/example-api-save-state.html)
- [Listening to update, add, remove events](http://dev.geogebra.org/examples/html/example-api-listeners.html)

> **Note:** Arguments in square brackets can be omitted.

# Commands and Undo-Points

<table class="pretty" style="width: 100%;">
    <tr>
      <th>Method Signature</th>
      <th style="text-align: center;">Since</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>boolean evalCommand(String cmdString)</td>
      <td style="text-align: center;">3.0</td>
      <td> Evaluates the given string just like it would be evaluated when entered into GeoGebra's input bar. Returns whether command evaluation was successful. <br> From GeoGebra 3.2 you can pass multiple commands at once by separating them with \n. <br> Note: you must use English commands names<br>
      </td>
    </tr><tr><td>String[] evalCommandGetLabels(String cmdString)</td><td>5.0</td><td>Like evalCommand(), but the return value is a String containing a comma-separated list of the labels of the created objects eg <code>"A,B,C"</code></td></tr><tr>
      <td>String evalCommandCAS(String string) </td>
      <td style="text-align: center;">3.2</td>
      <td>Passes the string to GeoGebra's CAS and returns the result as a String.<br>
      </td>
    </tr>
    <tr>
      <td>void setUndoPoint()</td>
      <td style="text-align: center;">3.2</td>
      <td> Sets an undo point. Useful if you want the user to be able to undo that action of evalCommand eg if you have made an HTML button to act as a custom tool<br>
      </td>    
      </tr>
</table>

# Setting the state of objects

## General methods

<table class="pretty" style="width: 100%;">
    <tr>
      <th>Method Signature</th>
      <th style="text-align: center;">Since</th>
      <th>Description</th>
    </tr>
    <tr>
      <td> void deleteObject(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Deletes the object with the given name.</td>
    </tr>
 <tr>
      <td> void setAuxiliary(geo, true/false)</td>
      <td style="text-align: center;">5.0</td>
      <td>Affects or not the status of "auxiliary object" to object ''geo''.</td>
    </tr>
    <tr>
      <td>void setValue(String objName, double value)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the double value of the object with the given name. Note: if the specified object is boolean, use a value of 1 to set it to true and any other value to set it to false. For any other object type, nothing is done.</td>
    </tr>
    <tr>
      <td>void setTextValue(String objName, String value)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the text value of the object with the given name. For any other object type, nothing is done.</td>
    </tr>
    <tr>
     <td>void setListValue(String objName, int i, double value)</td>
      <td style="text-align: center;">5.0</td>
      <td>Sets the value of the list element at position 'i' to 'value'</td>
    </tr>
    <tr>
      <td>void setCoords(String objName, double x, double y)<br />void setCoords(String objName, double x, double y, double z)</td>
      <td style="text-align: center;">3.0<br />5.0</td>
      <td>Sets the coordinates of the object with the given name.
Note: if the specified object is not a point, vector, line or absolutely positioned object (text, button, checkbox, input box) nothing is done.</td>
    </tr>
 <tr>
      <td>void setCaption(String objName, String caption)</td>
      <td style="text-align: center;">5.0</td>
      <td>Sets the caption of object with given name.</td>
    </tr>
    <tr>
      <td>void setColor(String objName, int red, int green, int
blue)</td>
      <td style="text-align: center;">2.7</td>
      <td>Sets the color of the object with the given name.</td>
    </tr>
    <tr>
      <td>void setVisible(String objName, boolean visible) </td>
      <td style="text-align: center;">2.7</td>
      <td>Shows or hides the object with the given name in the graphics window.</td>
    </tr>
    <tr>
      <td>void setLabelVisible(String objName, boolean visible) </td>
      <td style="text-align: center;">3.0</td>
      <td>Shows or hides the label of the object with the given name in the graphics window.</td>
    </tr>
    <tr>
      <td>void setLabelStyle(String objName, int style)</td>
      <td style="text-align: center;">3.0</td>
      <td>Sets the label style of the object with the given name in the graphics window. Possible label styles are NAME = 0, NAME_VALUE = 1, VALUE = 2 and (from GeoGebra 3.2) CAPTION = 3</td>
    </tr>
    <tr>
      <td>void setFixed(String objName, boolean fixed, boolean selectionAllowed)</td>
      <td style="text-align: center;">3.0</td>
      <td>Sets the "Fixed" and "Selection Allowed" state of the object with the given name. Note: fixed objects cannot be changed.</td>
    </tr>
    <tr>
      <td>void setTrace(String objName, boolean flag)</td>
      <td style="text-align: center;">3.0</td>
      <td>Turns the trace of the object with the given name on or off.</td>
    </tr>
    <tr>
      <td>boolean renameObject(String oldObjName, String newObjName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Renames oldObjName to newObjName. Returns whether the rename was successful</td>
    </tr>
    <tr>
      <td>void setLayer(String objName, int layer)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the layer of the object</td>
    </tr>
    <tr>
      <td>void setLayerVisible(int layer, boolean visible)</td>
      <td style="text-align: center;">3.2</td>
      <td>Shows or hides the all objects in the given layer</td>
    </tr>
    <tr>
      <td>void setLineStyle(String objName, int style)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the line style for the object (0 to 4)</td>
    </tr>
    <tr>
      <td>void setLineThickness(String objName, int thickness)</td>
      <td style="text-align: center;">3.2</td>
      <td>sets the thickness of the object (1 to 13, -1 for default)</td>
    </tr>
    <tr>
      <td>void setPointStyle(String objName, int style)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the style of points (-1 default, 0 filled circle, 1 cross, 2 circle, 3 plus, 4 filled diamond, 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west)) - see https://wiki.geogebra.org/en/SetPointStyle_Command for the full list</td>
    </tr>
    <tr>
      <td>void setPointSize(String objName, int size)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the size of a point (from 1 to 9)</td>
    </tr><tr><td>void setDisplayStyle(String objName, String style)</td><td style="text-align: center;">5.0</td><td>Sets the display style of an object. Style should be one of "parametric", "explicit", "implicit", "specific"</td></tr><tr>
      <td>void setFilling(String objName, double filling)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the filling of an object (from 0 to 1)</td>
    </tr>
    <tr>
      <td>String getPNGBase64(double exportScale, boolean transparent, double DPI)</td>
      <td style="text-align: center;">4.0</td>
      <td>Returns the active Graphics View as a base64-encoded String<br>eg var str = ggbApplet.getPNGBase64(1, true, 72); <br> The DPI setting is slow, set to <code>undefined</code> if you don't need it</td>
    </tr>
    <tr>
      <td>void exportSVG(String filename) <br>or <br>void exportSVG(function callback)</td>
      <td style="text-align: center;">HTML5</td>
      <td>Renders the active Graphics View as an SVG and either downloads it as the given filename or sends it to the callback function <br> The value is <code>null</code> if the active view is 3D <br> <code> ggbApplet.exportSVG(svg =&gt; console.log("data:image/svg+xml;utf8," + encodeURIComponent(svg))); </code> <br> For Classic 5 compatibility please use <code>ExportImage("type", "svg", "filename", "foo.svg")</code> inside materials
      </td>
    </tr>
    <tr>
      <td>void exportPDF(double scale, String filename, String sliderLabel) <br>or <br>void exportPDF(double scale, function callback, String sliderLabel)</td>
      <td style="text-align: center;">HTML5</td>
      <td> Renders the active Graphics View as a PDF and either downloads it as the given filename or sends it to the callback function <br> <code> ggbApplet.exportPDF(1, pdf =&gt; console.log(pdf)); </code> <br> For Classic 5 compatibility please use <code>ExportImage("type", "pdf", "filename", "foo.pdf")</code> instead
      </td>
    </tr>
    <tr>
      <td>void getScreenshotBase64(function callback)</td>
      <td style="text-align: center;">5.0</td>
      <td>Gets the screenshot of the whole applet as PNG and sends it to the callback function as a base64 encoded string. Example: <code>
ggbApplet.getScreenshotBase64(function(url){window.open("data:image/png;base64,"+url);});</code><br><b>For internal use only, may not work in all browsers</b></td>
    </tr>
    <tr>
      <td>boolean writePNGtoFile(String filename, double exportScale, boolean transparent, double DPI)
</td>
      <td style="text-align: center;">4.0</td>
      <td>Exports the active Graphics View to a .PNG file. The DPI setting is slow, set to <code>undefined</code> if you don't need it <br>
eg var success = ggbApplet.writePNGtoFile("myImage.png", 1, false, 72);      </td>
    </tr>
    <tr>
      <td>boolean isIndependent(String objName)
</td>
      <td style="text-align: center;">4.0</td>
      <td> checks if '''objName''' is independent      </td>
    </tr>
    <tr>
      <td>boolean isMoveable(String objName)
</td>
      <td style="text-align: center;">4.0</td>
      <td> checks if '''objName''' is is moveable</td>
    </tr>
    <tr>
      <td>void showAllObjects()</td>
      <td style="text-align: center;">5.0</td>
      <td>Changes bounds of the Graphics View so that all visible objects are on screen.</td>
    </tr>
</table>

## Automatic Animation

<table class="pretty" style="width: 100%;">
    <tr>
      <th>Method Signature</th>
      <th style="text-align: center;">Since</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>void setAnimating(String objName, boolean animate)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets whether an object should be animated. This does not start the animation yet, use startAnimation() to do so.</td>
    </tr>
       <tr>
      <td>void setAnimationSpeed(String objName, double speed)</td>
      <td style="text-align: center;">3.2</td>
      <td>Sets the animation speed of an object.</td>
    </tr>
  <tr>
      <td>void startAnimation()</td>
      <td style="text-align: center;">3.2</td>
      <td>Starts automatic animation for all objects with the animating flag set, see setAnimating()</td>
    </tr>
    <tr>
      <td>void stopAnimation()</td>
      <td style="text-align: center;">3.2</td>
      <td>Stops animation for all objects with the animating flag set, see setAnimating()</td>
    </tr>	
   <tr>
      <td>boolean isAnimationRunning()</td>
      <td style="text-align: center;">3.2</td>
      <td>Returns whether automatic animation is currently running.</td>
    </tr>	
</table>

# Getting the state of objects

<table class="pretty" style="width: 100%;">
    <tr>
      <th>Method Signature</th>
      <th style="text-align: center;">Since</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>double getXcoord(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the cartesian x-coord of the object with the given name.
Note: returns 0 if the object is not a point or a vector.</td>
    </tr>
    <tr>
      <td>double getYcoord(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the cartesian y-coord of the object with the given name.
Note: returns 0 if the object is not a point or a vector.</td>
    </tr>
 <tr>
      <td>double getZcoord(String objName)</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns the cartesian z-coord of the object with the given name.
Note: returns 0 if the object is not a point or a vector.</td>
    </tr>
    <tr>
      <td>double getValue(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Returns the double value of the object with the given name (e.g. length of segment, area of polygon). Note: returns 1 for a boolean object with value true. Otherwise 0 is returned.<br>
      </td>
    </tr>
    <tr>
      <td>double getListValue(String objName, Integer index)</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns the double value of the object in the list (with the given name) with the given index. Note: returns 1 for a boolean object with value true. Otherwise 0 is returned.<br>
      </td>
    </tr>
    <tr>
      <td>String getColor(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the color of the object with the given name as a hex string, e.g. "#FF0000" for red. Note that the hex string always starts with # and contains no lower case letters.</td>
    </tr>
    <tr>
      <td> boolean getVisible(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Returns true or false depending on whether the object is visible in the Graphics View. Returns false if the object does not exist.</td>
    </tr>
    <tr>
      <td> boolean getVisible(String objName, int view)</td>
      <td style="text-align: center;">4.2</td>
      <td>Returns true or false depending on whether the object is visible in Graphics View 'view' (1 or 2). Returns false if the object does not exist.</td>
    </tr>
    <tr>
      <td> String getValueString(String objName [, boolean useLocalizedInput = true])</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the value of the object with the given name as a string. If useLocalizedInput is false, returns the command in English, otherwise in current GUI language. Note: Localized input uses parentheses, non-localized input uses brackets.<br>For this method (<b>and all others returning type String</b>) it's important to coerce it properly to a JavaScript string for compatibility with GeoGebra Classic 5 eg <code>var s = getValueString("text1") + "";</code></td>
    </tr>
    <tr>
      <td>String getDefinitionString(String objName) </td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the description of the object with the given name as a string (in the currently selected language)</td>
    </tr>
    <tr>
      <td>String getCommandString(String objName [, boolean useLocalizedInput])</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns the command of the object with the given name as a string. If useLocalizedInput is false, returns the command in English, otherwise in current GUI language. Note: Localized input uses parentheses, non-localized input uses brackets.</td>
    </tr><tr><td>String getLaTeXString(String objName)</td><td>5.0</td><td>Returns the value of given object in LaTeX syntax</td></tr><tr><td>String getLaTeXBase64(String objName, boolean value)</td><td>5.0</td><td>Returns base64 encoded PNG picture containing the object as LaTeX. For value = false the object is represented as the definition, for value=true the object value is used.</td></tr><tr>
      <td>String getObjectType(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the type of the given object as a string (like "point", "line", "circle", etc.).</td>
    </tr>
    <tr>
      <td>boolean exists(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns whether an object with the given name exists in the construction.</td>
    </tr>
    <tr>
      <td>boolean isDefined(String objName)</td>
      <td style="text-align: center;">2.7</td>
      <td>Returns whether the given object's value is valid at the moment.</td>
    </tr>
    <tr>
      <td>String [] getAllObjectNames([String type])<br>
      <td style="text-align: center;">2.7</td>
      <td>Returns an array with all object names in the construction. If type parameter is entered, only objects of given type are returned.</td>
    </tr>
    <tr>
      <td>int getObjectNumber()</td>
      <td style="text-align: center;">3.0</td>
      <td>Returns the number of objects in the construction.</td>
    </tr>
<tr>
      <td>int getCASObjectNumber()</td>
      <td style="text-align: center;">3.0</td>
      <td>Returns the number of object (nonempty cells) in CAS.</td>
    </tr>
  <tr>
      <td>String getObjectName(int i)</td>
      <td style="text-align: center;">3.0</td>
      <td>Returns the name of the n-th object of the construction.</td>
    </tr>
  <tr>
      <td>String getLayer(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Returns the layer of the object.</td>
    </tr>
    <tr>
      <td>int getLineStyle(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Gets the line style for the object (0 to 4)</td>
    </tr>
    <tr>
      <td>int getLineThickness(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Gets the thickness of the line (1 to 13)</td>
    </tr>
    <tr>
      <td>int getPointStyle(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Gets the style of points (-1 default, 0 filled circle, 1 circle, 2 cross, 3 plus, 4 filled diamond, 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west))</td>
    </tr>
    <tr>
      <td>int getPointSize(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Gets the size of a point (from 1 to 9)</td>
    </tr>
    <tr>
      <td>double getFilling(String objName)</td>
      <td style="text-align: center;">3.2</td>
      <td>Gets the filling of an object (from 0 to 1)</td>
    </tr>
<tr>
      <td>getCaption(String objectName, boolean substitutePlaceholders)</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns the caption of the object. If the caption contains placeholders (%n, %v,...), you can use the second parameter to specify whether you want to substitute them or not. </td>
    </tr>
<tr>
      <td>getLabelStyle(String objectName)</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns label type for given object, see setLabelStyle for possible values.</td>
    </tr>
<tr>
      <td>getLabelVisible()</td>
      <td style="text-align: center;">5.0</td>
      <td></td>
    </tr>
<tr>
      <td>isInteractive(String objName)</td>
      <td style="text-align: center;"></td>
      <td>Returns true, if the object with label objName is existing and the user can get to this object using TAB.</td>
    </tr>

</table>

# Construction / User Interface

<table class="pretty" style="width: 100%;">
   <tr>
      <th>Method Signature</th>
      <th style="text-align: center;">Since</th>
      <th style="font-weight: bold;">Description</th>
    </tr>
    <tr>
      <td>void setMode(int mode)</td>
      <td style="text-align: center;">2.7</td>
      <td>Sets the mouse mode (i.e. tool) for the graphics window
(see [[Reference:Toolbar|toolbar reference]] and the [[Reference:Applet_Parameters|applet parameters]] "showToolBar" and &nbsp;"customToolBar"  )</td>
    </tr><tr><td>int getMode()</td><td>5.0</td><td>Gets the mouse mode (i.e. tool), see [[Reference:Toolbar|toolbar reference]] for details</td></tr><tr>
      <td>void openFile(String strURL)</td>
      <td style="text-align: center;">2.7 (Java only)</td>
      <td>Opens a construction from a&nbsp; file (given as absolute or relative URL string)</td>
    </tr>
    <tr>
      <td>void reset()</td>
      <td style="text-align: center;">2.7</td>
      <td>Reloads the initial construction (given in filename parameter) of this applet.<br>
      </td>
   </tr>
    <tr>
      <td>void newConstruction()</td>
      <td style="text-align: center;">2.7</td>
      <td>Removes all construction objects<br>
      </td>
   </tr>
   <tr>
      <td>void refreshViews()</td>
      <td style="text-align: center;">2.7</td>
      <td>Refreshs all views. Note: this clears all traces in the graphics window.</td>
    </tr>
    <tr>
      <td>void setOnTheFlyPointCreationActive(boolean flag)<br>
      </td>
      <td style="text-align: center;">3.2</td>
      <td>Turns on the fly creation of points in graphics view on (true) or off (false). Note: this is useful if you don't want tools to have the side effect of creating points. For example, when this flag is set to false, the tool "line through two points" will not create points on the fly when you click on the background of the graphics view.</td>
    </tr>
    <tr>
      <td>void setPointCapture(view, mode)<br>
      </td>
      <td style="text-align: center;">5.0</td>
      <td>Change point capturing mode. 
view: 1 for graphics, 2 for graphics 2, -1 for 3D. 
mode: 0 for no capturing, 1 for snap to grid, 2 for fixed to grid, 3 for automatic.</td>
    </tr>
    <tr>
      <td>void setRounding(string round)<br>
      </td>
      <td style="text-align: center;">5.0</td>
      <td>The string consists of a number and flags, "s" flag for significant digits, "d" for decimal places (default). JavaScript integers are cast to string automaticlly. Example: "10s", "5", 3
</td>
    </tr>
    <tr>
      <td>void hideCursorWhenDragging(boolean flag)<br>
      </td>
      <td style="text-align: center;">3.2</td>
      <td>Hides (true) or shows (false) the mouse cursor (pointer) when dragging an object to change the construction. </td>
    </tr>
    <tr>
      <td>void setRepaintingActive(boolean flag)<br>
      </td>
      <td style="text-align: center;">2.7</td>
      <td>Turns the repainting of this applet on (true) or off (false).
Note: use this method for efficient repainting when you invoke several methods.</td>
    </tr>
    <tr>
      <td>void setErrorDialogsActive(boolean flag)</td>
      <td style="text-align: center;">3.0</td>
      <td>Turns showing of error dialogs on (true) or off (false). Note: this is especially useful together with evalCommand().</td>
    </tr>
    <tr>
      <td>void setCoordSystem(double xmin, double xmax, double ymin, double ymax)</td>
      <td style="text-align: center;">3.0</td>
      <td>Sets the Cartesian coordinate system of the graphics window.</td>
    </tr>
    <tr>
      <td>void setCoordSystem(double xmin, double xmax, double ymin, double ymax, double zmin, double zmax, boolean yVertical)</td>
      <td style="text-align: center;">5.0</td>
      <td>Sets the Cartesian coordinate system of the 3D graphics window. The last parameter determines whether y-axis should be oriented vertically.</td>
    </tr>
    <tr>
      <td>void setAxesVisible(boolean xAxis, boolean yAxis)</td>
      <td style="text-align: center;">3.0</td>
      <td>Shows or hides the x- and y-axis of the coordinate system in the graphics windows 1 and 2.</td>
    </tr>
 <tr>
      <td>void setAxesVisible(int viewNumber, boolean xAxis, boolean yAxis, boolean zAxis)</td>
      <td style="text-align: center;">5.0</td>
      <td>Shows or hides the x-, y- and z-axis of the coordinate system in given graphics window.
{{Example| <code>ggbApplet.setAxesVisible(3, false, true, true)</code>}}</td>
    </tr>
 <tr>
      <td>void setAxisLabels(int viewNumber, String xAxis, String yAxis, String zAxis)</td>
      <td style="text-align: center;">5.0</td>
      <td>Set label for the x-, y- and z-axis of the coordinate system in given graphics window.{{Example| <code>ggbApplet.setAxisLabels(3,"larg","long","area")</code>}}</td>
    </tr>
 <tr>
      <td>void setAxisSteps(int viewNumber, double xAxis, double yAxis, double zAxis)</td>
      <td style="text-align: center;">5.0</td>
      <td>Set distance for the x-, y- and z-axis of the coordinate system in given graphics window. {{Example| <code>ggbApplet.setAxisSteps(3, 2,1,0.5)</code>}}</td>
    </tr>
 <tr>
      <td>void setAxisUnits(int viewNumber, String xAxis, String yAxis, String zAxis)</td>
      <td style="text-align: center;">5.0</td>
      <td>Set units for the x-, y- and z-axis of the coordinate system in given graphics window.{{Example| <code>ggbApplet.setAxisUnits(3, "cm","cm","cm²")</code>}}</td>
    </tr>
    <tr>
      <td>void setGridVisible(boolean flag) </td>
      <td style="text-align: center;">3.0</td>
      <td>Shows or hides the coordinate grid in the graphics windows 1 and 2.</td>
    </tr>
 <tr>
      <td>void setGridVisible(int viewNumber, boolean flag) </td>
      <td style="text-align: center;">5.0</td>
      <td>Shows or hides the coordinate grid in given graphics view graphics window.</td>
    </tr>
<tr>
      <td>getGridVisible(int viewNumber)</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns true if grid is visible in given view. If view number is omited, returns whether grid is visible in the first graphics view.</td>
    </tr>
<tr>
      <td>getPerspectiveXML()</td>
      <td style="text-align: center;">5.0</td>
      <td>Returns an XML representation of the current perspective.</td>
    </tr>
<tr>
      <td>undo()</td>
      <td style="text-align: center;">5.0</td>
      <td>Undoes one user action. </td>
    </tr>
<tr>
      <td>redo()</td>
      <td style="text-align: center;">5.0</td>
      <td>Redoes one user action. </td>
    </tr>
<tr>
      <td>showToolBar(boolean show)</td>
      <td style="text-align: center;">HTML5</td>
      <td>Sets visibility of toolbar</td>
    </tr><tr><td>setCustomToolBar(String toolbar)</td><td>5.0</td><td>Sets the layout of the main toolbar, see [[Reference:Toolbar|toolbar reference]] for details</td></tr><tr>
      <td>showMenuBar(boolean show)</td>
      <td style="text-align: center;">HTML5</td>
      <td>Sets visibility of menu bar</td>
    </tr>
<tr>
      <td>showAlgebraInput(boolean show)</td>
      <td style="text-align: center;">HTML5</td>
      <td>Sets visibility of input bar</td>
    </tr>
<tr>
      <td>showResetIcon(boolean show)</td>
      <td style="text-align: center;">HTML5</td>
      <td>Sets visibility of reset icon</td>
    </tr>
<tr>
      <td>enableRightClick(boolean enable)</td>
      <td style="text-align: center;">5.0</td>
      <td>Enables or disables right click features</td>
    </tr>
<tr>
      <td>enableLabelDrags(boolean enable)</td>
      <td style="text-align: center;">5.0</td>
      <td>Enables or disables dragging object labels</td>
    </tr>
<tr>
      <td>enableShiftDragZoom(boolean enable)</td>
      <td style="text-align: center;">5.0</td>
      <td>Enables or disables zooming and dragging the view using mouse or keyboard</td>
    </tr>
<tr>
      <td>enableCAS(boolean enable)</td>
      <td style="text-align: center;">5.0</td>
      <td>Enables or disables CAS features (both the view and commands)</td>
    </tr>
<tr>
      <td>enable3D(boolean enable)</td>
      <td style="text-align: center;">5.0</td>
      <td>Enables or disables the 3D view</td>
    </tr>
    <tr>
      <td>void setPerspective(string perspective)</td>
      <td style="text-align: center;">5.0</td>
      <td>Changes the open views, see [[SetPerspective Command]] for the string interpretation.<br>
      </td>
   </tr>
<tr>
      <td>setWidth(int width)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Change width of the applet (in pixels)</td>
    </tr>
<tr>
      <td>setHeight(int height)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Change height of the applet (in pixels)</td>
    </tr>
<tr>
      <td>setSize(int width, int height)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Change width and height of the applet (in pixels)</td>
    </tr>
<tr>
      <td>recalculateEnvironments()</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Update the applet after scaling by external CSS</td>
    </tr>
<tr>
      <td>getEditorState()</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Get state of the equation editor in algebra view (or in evaluator applet). Returns JSON object with <code>content</code> and optional fields (<code>caret</code> for graphing app, <code>eval</code> and <code>latex</code> for evaluator app)</td>
    </tr>
<tr>
      <td>setEditorState(Object state)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Set state of the equation editor in algebra view (or in evaluator applet). The argument should be a JSON (object or string) with <code>content</code> and optional <code>caret</code> field. </td>
    </tr>
<tr>
      <td>getGraphicsOptions(int viewId)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Get the graphics options for euclidian view specified by viewId. It returns a JSON (object or string) with <code>rightAngleStyle</code>, <code>pointCapturing</code>, <code>grid</code>, <code>gridIsBold</code>, <code>gridType</code>, <code>bgColor</code>, <code>gridColor</code>, <code>axesColor</code>, <code>axes</code>, <code>gridDistance</code> </td>
    </tr>
    <tr>
      <td>setGraphicsOptions(int viewId, Object options)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Set the graphics options for euclidian view specified by viewId. The second argument should be a JSON (object or string) with optional fields with <code>rightAngleStyle</code>, <code>pointCapturing</code>, <code>grid</code>, <code>gridIsBold</code>, <code>gridType</code>, <code>bgColor</code>, <code>gridColor</code>, <code>axesColor</code>, <code>axes</code>, <code>gridDistance</code></td>
    </tr>
<tr>
      <td>setAlgebraOptions(Object options)</td>
      <td style="text-align: center;">5.0 (HTML5)</td>
      <td>Set the options for the algebra view. The argument should be a JSON (object or string) with field <code>sortBy</code></td>
    </tr>
</table>

# Event listeners

With these methods you can implement Applet to JavaScript communication. For example, these methods can be used to:

- monitor user actions (see [http://dev.geogebra.org/examples/html/example8.html Event listeners example])
- communicate between two GeoGebra applets (see [http://dev.geogebra.org/examples/html/example9.html two applets example])
<table class="pretty" style="width: 100%;">
 <tr>
 <th>Method Signature</th>
 <th style="text-align: center;">Since</th>
 <th style="font-weight: bold;">Description</th>
 </tr>
 <tr>
 <td>void registerAddListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Registers a JavaScript function as an <span style="font-weight: bold;">add</span> listener for the applet's construction. Whenever a new object is created in the GeoGebraApplet's construction, the JavaScript function <span style="font-style: italic;">JSFunctionName</span> is called using the name of the newly created object as its single argument. <br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerAddListener("myAddListenerFunction");</span> <br>
 </div>
When an object "A" is created, the GeoGebra Applet will call the Javascript function<br>
 <div style="margin-left: 40px;"><span style="font-family: monospace;">myAddListenerFunction("</span><span style="font-family: monospace;">A");<br>
 </span></div>
 </td>
 </tr>
 <tr>
 <td>void unregisterAddListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered add listener, see <span style="font-style: italic;">registerAddListener()</span></td>
 </tr>
 <tr>
 <td>void registerRemoveListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Registers a JavaScript function as a <span style="font-weight: bold;">remove</span> listener for the applet's construction. Whenever an object is deleted from the GeoGebraApplet's construction, the JavaScript function <span style="font-style: italic;">JSFunctionName</span> is called using the name of the deleted object as its single argument. Note: when a construction is cleared, remove is not called for every single object, see registerClearListener().<br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerRemoveListener("myRemoveListenerFunction");</span> </div>
When the object "A" is deleted, the GeoGebra Applet will call the Javascript function<br>
 <div style="margin-left: 40px;"><span style="font-family: monospace;">myRemoveListenerFunction</span><span style="font-family: monospace;">("</span><span style="font-family: monospace;">A");<br>
 </span></div>
 </td>
 </tr>
 <tr>
 <td>void unregisterRemoveListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered remove listener, see <span style="font-style: italic;">registerRemoveListener()</span></td>
 </tr>
 <tr>
 <td>void registerUpdateListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Registers a JavaScript function as a <span style="font-weight: bold;">update</span> listener for the applet's construction. Whenever any object is updated in the GeoGebraApplet's construction, the JavaScript function <span style="font-style: italic;">JSFunctionName</span> is called using the name of the updated object as its single argument. Note: when you only want to listen for the updates of a single object use registerObjectUpdateListener() instead.<br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerUpdateListener("myUpdateListenerFunction");</span> </div>
When the object "A" is updated, the GeoGebra Applet will call the Javascript function
<div><span style="font-family: monospace;">myUpdateListenerFunction("A");</span></div>

 </td>
 </tr>
 <tr>
 <td>void unregisterUpdateListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered update listener, see <span style="font-style: italic;">registerUpdateListener()</span></td>
 </tr>

 <tr>
 <td>void registerClickListener(String JSFunctionName)</td>
 <td style="text-align: center;">5.0</td>
 <td>Registers a JavaScript function as a <span style="font-weight: bold;">click</span> listener for the applet's construction. Whenever any object is clicked in the GeoGebraApplet's construction, the JavaScript function <span style="font-style: italic;">JSFunctionName</span> is called using the name of the updated object as its single argument. Note: when you only want to listen for the updates of a single object use registerObjectClickListener() instead.<br>
 </td>
 </tr>
 <tr>
 <td>void unregisterClickListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered click listener, see <span style="font-style: italic;">registerClickListener()</span></td>
 </tr>
 <tr>
 <td>void registerObjectUpdateListener(String objName, String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Registers a JavaScript function as an <span style="font-weight: bold;">update</span> listener for a single object. Whenever the object with the given name is updated, the JavaScript function <span style="font-style: italic;">JSFunctionName</span>is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function, the old value is replaced. Note: all object updated listeners are unregistered when their object is removed or the construction is cleared, see registerRemoveListener() and registerClearListener().<br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerObjectUpdateListener("A", "</span><span style="font-family: monospace;">myAupdateListenerFunction</span><span style="font-family: monospace;">");</span> <br>
 </div>
Whenever the object A is updated, the GeoGebra Applet will call the Javascript function<br>
 <div style="margin-left: 40px;"><span style="font-family: monospace;">myAupdateListenerFunction();<br>
 </span></div>
Note: an object update listener will still work after an object is renamed.
</td>
</tr>
<tr>
 <td>void unregisterObjectUpdateListener(String objName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered object update listener of the object with the given name, see <span style="font-style: italic;">registerObjectUpdateListener()</span></td>
 </tr>
 <tr>
 <td>void registerObjectClickListener(String objName, String JSFunctionName)</td>
 <td style="text-align: center;">5.0</td>
 <td>Registers a JavaScript function as a <span style="font-weight: bold;">click</span> listener for a single object. Whenever the object with the given name is clicked, the JavaScript function <span style="font-style: italic;">JSFunctionName</span>is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function, the old value is replaced. Note: all object click listeners are unregistered when their object is removed or the construction is cleared, see registerRemoveListener() and registerClearListener().<br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerObjectClickListener("A", "</span><span style="font-family: monospace;">myAclickListenerFunction</span><span style="font-family: monospace;">");</span> <br>
 </div>
Whenever the object A is clicked, the GeoGebra Applet will call the Javascript function<br>
 <div style="margin-left: 40px;"><span style="font-family: monospace;">myAclickListenerFunction();<br>
 </span></div>
Note: an object click listener will still work after an object is renamed.
</td>
</tr>
<tr>
 <td>void unregisterObjectClickListener(String objName)</td>
 <td style="text-align: center;">5.0</td>
 <td>Removes a previously registered object click listener of the object with the given name, see <span style="font-style: italic;">registerObjectClickListener()</span></td>
 </tr>
 <tr>
 <td>void registerRenameListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Registers a JavaScript function as a <span style="font-weight: bold;">rename</span> listener for the applet's construction. Whenever an object is renamed in the GeoGebraApplet's construction, the JavaScript function <span style="font-style: italic;">JSFunctionName</span> is called using the old name and the new name of the renamed object as its two arguments. <br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerRenameListener("myRenameListenerFunction");</span> </div>
When an object "A" is renamed to "B", the GeoGebra Applet will call the Javascript function<br>
 <div style="margin-left: 40px;"><span style="font-family: monospace;">myRenameListenerFunction</span><span style="font-family: monospace;">("</span><span style="font-family: monospace;">A", "B");<br>
 </span></div>
 </td>
 </tr>
 <tr>
 <td>void unregisterRenameListener(String objName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered rename listener, see <span style="font-style: italic;">registerRenameListener()</span></td>
 </tr>
 <tr>
 <td>void registerClearListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Registers a JavaScript function as a <span style="font-weight: bold;">clear</span> listener for the applet's construction. Whenever the construction in the GeoGebraApplet is cleared (i.e. all objects are removed), the JavaScript function JSFunctionName is called using no arguments. Note: all update listeners are unregistered when a construction is cleared. See registerUpdateListener() and registerRemoveListener().<br>
<span style="font-style: italic;">Example</span>: First, register a listening JavaScript function:<br>
<div style="margin-left: 40px;"><span style="font-family: monospace;">ggbApplet.registerClearListener("myClearListenerFunction");</span> </div>
When the construction is cleared (i.e. after reseting a construction or opening a new construction file), the GeoGebra Applet will call the Javascript function<br>
 <div style="margin-left: 40px;"><span style="font-family: monospace;">myClearListenerFunction</span><span style="font-family: monospace;">(</span><span style="font-family: monospace;">);</span></div>
 </td>
 </tr>
 <tr>
 <td>void unregisterClearListener(String JSFunctionName)</td>
 <td style="text-align: center;">3.0</td>
 <td>Removes a previously registered clear listener, see ''registerClearListener()''
</td>
 </tr>
<tr>
<td>
void registerStoreUndoListener(String JSFunctionName)
</td>
<td>
4.4
</td>
<td>Registers a listener that is called (with no arguments) every time an undo point is created.</td>
</tr>
<tr>
<td>void unregisterStoreUndoListener(String JSFunctionName)
</td>
<td>
4.4
</td>
<td>
Removes previously registered listener for storing undo points, see registerStoreUndoListener
</td>
</tr>
<tr>
 <td>void registerClientListener(String JSFunctionName)</td>
 <td style="text-align: center;">5.0</td>
 <td>Registers a JavaScript function as a generic listener for the applet's construction. The listener receives events as JSON objects of the form 
<code>{type: "setMode", target:"", argument: "2"}</code> where <code>target</code> is the label of the construction element related to the event (if applicable), <code>argument</code> provides additional information based on the event type (e.g. the mode number for setMode event). Please refer to the list of client events below.
 </td>
 </tr>
<tr>
<td>void unregisterClientListener(String JSFunctionName)
</td>
<td>
5.0
</td>
<td>
Removes previously registered client listener, see registerClientListener
</td>
</tr>
</table>

## Client Events

These events can be observed using the <code>registerClientListener</code> method
{| class="pretty"
!Type
!Attributes
!Description
|-
| addMacro
|<code>argument</code>: macro name
| when new macro is added
|-
| addPolygon
|
| polygon construction started
|-
| addPolygonComplete
| <code>target</code>: polygon label
| polygon construction finished
|-
| algebraPanelSelected
|
| Graphing / Geometry apps: algebra tab selected in sidebar
|-
| deleteGeos
|
| multiple objects deleted
|-
| deselect
|<code>target</code>: object name (for single object) or null (deselect all)
| one or all objects removed from selection
|-
| dragEnd
|
|mouse drag ended
|-
| dropdownClosed
|<code>target</code>: dropdown list name, <code>index</code> index of selected item (0 based)
| dropdown list closed
|-
| dropdownItemFocused
|<code>target</code>: dropdown list name, <code>index</code> index of focused item (0 based)
| dropdown list item focused using mouse or keyboard
|-
| dropdownOpened
|<code>target</code>: dropdown list name
| dropdown list opened
|-
| editorKeyTyped
|
|key typed in editor (Algebra view of any app or standalone Evaluator app)
|-
| editorStart
|<code>target:</code> object label if editing existing object
|user moves focus to the editor (Algebra view of any app or standalone Evaluator app)
|-
| editorStop
|<code>target</code>: object label if editing existing object
|user (Algebra view of any app or standalone Evaluator app)
|-
| export
|<code>argument</code>: JSON encoded array including export format
|export started
|-
| mouseDown
|<code>x</code>: mouse x-coordinate, <code>y</code>: mouse y-coordinate
|user pressed the mouse button
|-
| movedGeos
|<code>argument</code>: object labels
|multiple objects move ended
|-
| movingGeos
|<code>argument</code>: object labels
|multible objects are being moved
|-
| openDialog
|<code>argument</code>: dialog ID
|dialog is opened (currently just for export dialog)
|-
| openMenu
|<code>argument</code>: submenu ID
|main menu or one of its submenus were open
|-
| pasteElms
|<code>argument</code>: pasted objects as XML
|pasting multiple objects started
|-
| pasteElmsComplete
|
|pasting multiple objects ended
|-
| perspectiveChange
|
|perspective changed (e.g. a view was opened or closed)
|-
| redo
|
|redo button pressed
|-
| relationTool
|<code>argument</code>: HTML description of the object relation
|relation tool used
|-
| removeMacro
|<code>argument</code>: custom tool name
|custom tool removed
|-
| renameComplete
|
|object renaming complete (in case of chain renames)
|-
| renameMacro
|<code>argument</code>: array [old name, new name]
|custom tool was renamed
|-
| select
|<code>target</code>: object label
|object added to selection
|-
| setMode
|<code>argument</code>: mode number (see toolbar reference for details)
|app mode changed (e.g. a tool was selected)
|-
| showNavigationBar
|<code>argument</code>: "true" or "false"
|navigation bar visibility changed
|-
| showStyleBar
|<code>argument</code>: "true" or "false"
|style bar visibility changed
|-
| sidePanelClosed
|
|side panel (where algebra view is in Graphing Calculator) closed
|-
| sidePanelOpened
|
|side panel (where algebra view is in Graphing Calculator) opened
|-
| tablePanelSelected
|
|table of values panel selected
|-
| toolsPanelSelected
|
|tools panel selected
|-
| undo
|
|undo pressed
|-
| updateStyle
|<code>target</code>: object label
|object style changed
|-
| viewChanged2D
|<code>xZero</code>: horizontal pixel position of point (0,0), <code>yZero</code>: vertical pixel position of point (0,0), <code>xscale</code>: ratio pixels / horizontal units, <code>yscale</code>: ratio pixels / vertical units, <code>viewNo</code>: graphics view number (1 or 2)
|graphics view dimensions changed by zooming or panning
|-
| viewChanged3D
|similar to 2D, e.g. <code>xZero: 0,yZero: 0,scale: 50,yscale: 50,viewNo: 512,zZero: -1.5,zscale: 50,xAngle: -40,zAngle: 24</code>
|3D view dimensions changed by zooming or panning
|-
|}

# GeoGebra's File format

With these methods you can set everything in a construction (see [[Reference:Xml|XML Reference]] ).

<table class="pretty" style="width: 100%;">
    <tr>
      <th>Method Signature</th>
      <th style="text-align: center;">Since</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>void evalXML(String xmlString) </td>
      <td style="text-align: center;">2.7</td>
      <td>Evaluates the given XML string and changes the current construction. Note: the construction is NOT cleared before evaluating the XML string.      </td>
    </tr>
    <tr>
      <td>void setXML(String xmlString) </td>
      <td style="text-align: center;">2.7</td>
      <td>Evaluates the given XML string and changes the current construction. Note: the construction is cleared before evaluating the XML string. This method could be used to load constructions. </td>
    </tr>
    <tr>
      <td>String getXML()<br>
      </td>
      <td style="text-align: center;">2.7</td>
      <td>Returns the current construction in GeoGebra's XML format. This method could be used to save constructions.</td>
    </tr>
  <tr>
      <td>String getXML(String objName)<br>
      </td>
      <td style="text-align: center;">3.2</td>
      <td>Returns the GeoGebra XML string for the given object, i.e. only the &lt;element&gt; tag is returned.</td>
    </tr>
<tr>
      <td>String getAlgorithmXML(String objName)<br>
      </td>
      <td style="text-align: center;">3.2</td>
      <td>For a dependent GeoElement objName the XML string of the parent algorithm and all its output objects is returned. For a free GeoElement objName "" is returned. 
      </td>
    </tr>
 <tr>
      <td>String getFileJSON()</td>
      <td style="text-align: center;">5.0</td>
      <td> Gets the current construction as JSON object including the XML and images</td>
    </tr>
 <tr>
      <td>String setFileJSON(Object content)</td>
      <td style="text-align: center;">5.0</td>
      <td>Sets the current construction from a JSON (object or string) that includes XML and images (try getFileJSON for the precise format)</td>
    </tr>
 <tr>
      <td>String getBase64()</td>
      <td style="text-align: center;"></td>
      <td> Gets the current construction as a base64-encoded .ggb file</td>
    </tr>
 <tr>
      <td>String getBase64(function callback)</td>
      <td style="text-align: center;">4.2</td>
      <td> Gets the current construction as a base64-encoded .ggb file asynchronously, passes as parameter to the callback function when ready. The callback function should take one parameter (the base64 string).</td>
    </tr>
    <tr>
      <td>void setBase64(String [, function callback] )</td>
      <td style="text-align: center;">4.0</td>
      <td> Sets the current construction from a base64-encoded .ggb file. If callback function is specified, it is called after the file is loaded.</td>
</tr>
</table>

# Miscellaneous

<table class="pretty" style="width: 100%;">
    <tr>
      <th>Method Signature</th>
      <th>Since</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>void debug(String string) </td>
      <td style="text-align: center;">3.2</td>
      <td>Prints the string to the Java Console
      </td>
    </tr>
<tr>
<td>String getVersion()</td>
<td>5.0</td>
<td>Returns the version of GeoGebra</td>
</tr>
<tr>
<td>void remove()</td>
<td>5.0</td>
<td>Removes the applet and frees up memory</td>
</tr>
</table>

## Obtaining the API Object

If you are loading GeoGebra using the <code>deployggb.js</code> script, you can access the api either as an argument of <code>appletOnLoad</code> or via the <code>getAppletObject</code> method:

<pre>
const ggb = new GGBApplet({
  appletOnLoad(api1) {
    // api1 provides the applet API
  }
});
ggb.inject(document.body);
const api2 = ggb.getAppletObject(); // api2 is also the API object
</pre>

For compatibility reasons the API objects can be also accessed via global variables. The name of the global variable is <code>ggbApplet</code> by default and can be overridden by the <code>id</code> parameter passed to <code>new GGBApplet(...)</code>. In case you have multiple GeoGebra apps on a page, <code>ggbApplet</code> always contains API of the last active one. In such case you should either avoid using global variables or use set the <code>id</code> parameter explicitly for all apps.

## Obtaining the API Object as a module: The ES6 way

You can use math-apps module now to inject the applet the ES6 way too

<pre>
<script type="module">
    import {mathApps} from '@geogebra/math-apps';
    mathApps.create({'width':'800', 'height':'600',
        'showAlgebraInput': 'true',
        'material_id':'MJWHp9en'})
        .inject(document.querySelector("#applet1"));
</script>
<div id="applet1"></div>
</pre>

Example of using the API:

<pre>
mathApps.create({'appName':'graphing'})
    .inject(document.querySelector("#plot"))
    .getAPI().then(api => api.evalCommand('f(x)=sin(x)'));
</pre>
