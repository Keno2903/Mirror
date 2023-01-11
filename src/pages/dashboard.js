import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import axios from "axios";
import { Button, MenuItem, Select } from "@mui/material";
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const [values, setValues] = useState([]);

  const [layout, setLayout] = useState([
    { i: "a", x: 0, y: 0, w: 1, h: 1, isResizable: false },
    { i: "b", x: 1, y: 0, w: 1, h: 1, isResizable: false },
    { i: "c", x: 2, y: 0, w: 1, h: 1, isResizable: false },
    { i: "d", x: 0, y: 1, w: 1, h: 1, isResizable: false },
    { i: "e", x: 1, y: 1, w: 1, h: 1, isResizable: false },
    { i: "f", x: 2, y: 1, w: 1, h: 1, isResizable: false },
    { i: "g", x: 0, y: 2, w: 1, h: 1, isResizable: false },
    { i: "h", x: 1, y: 2, w: 1, h: 1, isResizable: false },
    { i: "i", x: 2, y: 2, w: 1, h: 1, isResizable: false },
  ]);

  const convertData = (v) => {
    if(v) {
    var objsForServer = [];

    if (v.length === 9) {
      layout.map((obj) => {
        var module = {
          position: "",
          value: v.filter((item) => {
            if (item.i === obj.i) {
              return item;
            }
          })[0].value,
        };
        console.log(obj);
        if (obj.x === 0 && obj.y === 0) {
          module.position = "top_left";
        } else if (obj.x === 1 && obj.y === 0) {
          module.position = "top_center";
        } else if (obj.x === 2 && obj.y === 0) {
          module.position = "top_right";
        } else if (obj.x === 0 && obj.y === 1) {
          module.position = "middle_left";
        } else if (obj.x === 1 && obj.y === 1) {
          module.position = "middle_center";
        } else if (obj.x === 2 && obj.y === 1) {
          module.position = "middle_right";
        } else if (obj.x === 0 && obj.y === 2) {
          module.position = "bottom_left";
        } else if (obj.x === 1 && obj.y === 2) {
          module.position = "bottom_center";
        } else if (obj.x === 2 && obj.y === 2) {
          module.position = "bottom_right";
        }

        objsForServer.push(module);
      });

      console.log(objsForServer)
      var data = { id: 1, objects: objsForServer };
      writeFile(data);
    }
  }
  };

  const writeFile = async (data) => {
    try {
      await axios
        .post("http://localhost:8080/writeFile", data)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch {}
  };

  useEffect(() => {
    // Update the document title using the browser API
    if(values.length === 0) {readFile()}
  });

  const readFile = () => {
    axios.get("http://localhost:8080/readFile").then((response) => {
      // Parse the string data into a JavaScript object
      var string = extractSubstring(response.data);
      // Use the function to convert the string into an object
      var modules = extractModulesArray(string);
      console.log(string);
      modules.map((o,i) => {
        if(i > 0){
          o.position = o.position.slice(1, -1);
          o.module = o.module.slice(1, -1);
        }
      })

      var array = [];
      array.length = 9;

      modules.map((obj) => {
        switch (obj.position) {
          case "top_left":
            array[0] = { i: "a", value: obj.module };
            break;
          case "top_center":
            array[1] = { i: "b", value: obj.module };
            break;
          case "top_right":
            array[2] = { i: "c", value: obj.module };
            break;
          case "middle_left":
            array[3] = { i: "d", value: obj.module };
            break;
          case "middle_center":
            array[4] = { i: "e", value: obj.module };
            break;
          case "middle_right":
            array[5] = { i: "f", value: obj.module };
          case "bottom_left":
            array[6] = { i: "g", value: obj.module };
            break;
          case "bottom_center":
            array[7] = { i: "h", value: obj.module };
            break;
          case "bottom_right":
            array[8] = { i: "i", value: obj.module };
            break;
          default:
            break;
        }
      });

console.log(array);
      setValues(array);
      
    });
  };

  function extractModulesArray(str) {
    // Use a regular expression to match the `modules` property and its value
    // in the given string
    const regex = /modules:\s*(\[[\s\S]*\])/;
    const match = str.match(regex);
    if (!match) {
      return null; // no match found
    }

    // The first capture group contains the entire `modules` array
    const modulesArrayString = match[1];

    // Use another regular expression to match each object in the array
    const objectRegex = /{([^}]+)}/g;
    const objects = modulesArrayString.match(objectRegex);

    // For each object, use a regular expression to match its properties
    // and values, and store them in an object literal
    const modulesArray = objects.map((object) => {
      const propRegex = /(\w+):\s*("[^"]+"|\w+)/g;
      const props = {};
      let propMatch;
      while ((propMatch = propRegex.exec(object))) {
        props[propMatch[1]] = propMatch[2];
      }
      return props;
    });

    return modulesArray;
  }

  function extractSubstring(response) {
    // Find the starting index of the substring.
    // In this case, we're looking for the first occurrence of the string "modules: ["
    var startIndex = response.indexOf("modules: [");

    // Find the ending index of the substring.
    // In this case, we're looking for the first occurrence of the closing square bracket character "]"
    // that follows the string "modules: ["
    var endIndex = response.indexOf("]", startIndex);

    // Use the substring() method to extract the substring from the response string
    var substring = response.substring(startIndex, endIndex + 1);

    return substring;
  }

  const fixLayout = (layout) => {
    convertData(values);
    // `y` is calculated by `h` in the layout object, since `h` is 20
    // first row will be 0, second 20, third 40
    const maxY = 2;

    // when an item goes to a new row, there is an empty column in the maxY row
    // so here we find which columns exist
    // tslint:disable-next-line:max-line-length
    const maxRowXs = layout
      .map((item) => (item.y === maxY ? item.x : null))
      .filter((value) => value !== null);

    // xs or cols, we only have 3 cols
    const xs = [0, 1, 2];

    // find the missing col
    // tslint:disable-next-line:max-line-length
    const missingX = xs.find((value) =>
      maxRowXs.every((maxRowX) => maxRowX !== value)
    );

    // bring the item from the new row into maxY row
    // and place it in the missing column
    const fixedLayout = layout.map((item) => {
      if (item.y > maxY) {
        const fixedItem = {
          ...item,
          y: maxY,
          x: missingX,
        };
        return fixedItem;
      }
      return item;
    });
    return fixedLayout;
  };

  const onChange = (value, event) => {
    setValues((prevState) => {
      let stateCopy = [...prevState];
      const index = stateCopy.findIndex((obj) => obj.i === value);
      stateCopy[index] = { ...stateCopy[index], value: event.target.value };
      convertData(stateCopy);
      return stateCopy;
    });
  };

  return (
    <div>{values.length !== 0 && <ResponsiveGridLayout
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 3, md: 3, sm: 3, xs: 2, xxs: 1 }}
      rowHeight={300}
      onLayoutChange={(e) => setLayout(fixLayout(e))}
      width={1200}
      maxRows={3}
    >
      {
        layout.map((obj) => {
          return (
            <div id={obj.i} key={obj.i} style={{ background: "grey" }}>
              <Select
                value={
                  values.filter((item) => {
                    if (item.i === obj.i) {
                      return item;
                    }
                  })[0].value
                }
                onChange={(e) => {
                  onChange(obj.i, e);
                }}
              >
                <MenuItem value="MMM-Jast">Stock Ticker</MenuItem>
                <MenuItem value="MMM-AirQuality">Air Quality</MenuItem>
                <MenuItem value="MMM-MacAddressScan">Mac Address Scan</MenuItem>
                <MenuItem value="MMM-ip">IP</MenuItem>
                <MenuItem value="clock">Clock</MenuItem>
                <MenuItem value="MMM-DarkSkyRadar">Clock</MenuItem>
                <MenuItem value="Blank">Blank</MenuItem>
              </Select>
            </div>
          );
        })}
    </ResponsiveGridLayout>}</div>
  );
}
