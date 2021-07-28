const vega = require('vega')

const COVERAGE_RADIUS = 9000 // 9000m based on standard propagation model
const GATEWAY_HEIGHT = 15 // 15m of height based on standard propagation model
const DEVICE_HEIGHT = 0 // arbitrary height for devices
const DRAWING_SCALE_FACTOR = 0.01 // scale to draw in SVG 

function Scenario() {

  // TODO put all of this to create(config, iteration) and add a function to import(devicesCSV, gatewaysCSV)

  const _distanceBtwCenters = getDistanceBtwGateways(COVERAGE_RADIUS)
  let _gatewaysPlacement = []
  let _scenarioSize = { width: 0, height: 0 }
  let _devicesPlacement = []

  this.create = (config, iteration) => {
    _gatewaysPlacement = getGatewaysPlacement(config.gateways.qty, _distanceBtwCenters, iteration)
    _scenarioSize = getScenarioSize(_gatewaysPlacement, _distanceBtwCenters)
    _devicesPlacement = getDevicesPlacement(config.devices.minQty, config.devices.maxQty, _scenarioSize)
  }

  this.import = (scenario) => {
    _gatewaysPlacement = scenario.gateways
    _devicesPlacement = scenario.devices
    _scenarioSize = getScenarioSize(_gatewaysPlacement, _distanceBtwCenters)
  }

  this.getRenderInSVG = async () => {

    let spec = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": _scenarioSize.width * DRAWING_SCALE_FACTOR,
      "height": _scenarioSize.height * DRAWING_SCALE_FACTOR,
      "padding": 0,

      "data": [
        {
          "name": "devices",
          "values": clone(_devicesPlacement),
          "transform": [
            {"type": "formula", "as": "pos_x", "expr": `datum.x * ${DRAWING_SCALE_FACTOR}` },
            {"type": "formula", "as": "pos_y", "expr": `datum.y * ${DRAWING_SCALE_FACTOR}` }
          ]
        },

        {
          "name": "gateways",
          "values": clone(_gatewaysPlacement),
          "transform": [
            {"type": "formula", "as": "pos_x", "expr": `datum.x * ${DRAWING_SCALE_FACTOR}` },
            {"type": "formula", "as": "pos_y", "expr": `datum.y * ${DRAWING_SCALE_FACTOR}` }
          ]
        },

        {
          "name": "gateways_circle",
          "values": clone(_gatewaysPlacement),
          "transform": [
            {"type": "formula", "as": "circle_x", "expr": `(datum.x - ${COVERAGE_RADIUS}) * ${DRAWING_SCALE_FACTOR}` },
            {"type": "formula", "as": "circle_y", "expr": `(datum.y - ${COVERAGE_RADIUS}) * ${DRAWING_SCALE_FACTOR}` }
          ]
        }

      ],

      "marks": [
        {
          "type": "rect",
          "encode": {
            "enter": {
              "fill": { "value": "#CCC" },
              "x": { "value": 0 },
              "y": { "value": 0 },
              "width": { "value": _scenarioSize.width * DRAWING_SCALE_FACTOR },
              "height": { "value": _scenarioSize.height * DRAWING_SCALE_FACTOR }
            }
          }
        },

        {
          "type": "symbol",
          "from": { "data": "gateways" },
          "encode": {
            "enter": {
              "fill": { "value": "#000" },
              "x": { "field": "pos_x" },
              "y": { "field": "pos_y" },
              "size": { "value": 3 },
              "shape": { "value": "cross" }
            }
          }
        },

        {
          "type": "rect",
          "from": { "data": "gateways_circle" },
          "encode": {
            "enter": {
              "stroke": { "value": "#000" },
              "strokeWidth": { "value": 1 },
              "cornerRadius": { "value": COVERAGE_RADIUS * 2 * DRAWING_SCALE_FACTOR },
              "x": { "field": "circle_x" },
              "y": { "field": "circle_y" },
              "width": { "value": COVERAGE_RADIUS * 2 * DRAWING_SCALE_FACTOR },
              "height": { "value": COVERAGE_RADIUS * 2 * DRAWING_SCALE_FACTOR }
            }
          }
        },

        {
          "type": "symbol",
          "from": { "data": "devices" },
          "encode": {
            "enter": {
              "fill": { "value": "blue" },
              "x": { "field": "pos_x" },
              "y": { "field": "pos_y" },
              "size": { "value": 2 },
              "shape": { "value": "circle" }
            }
          }
        }

      ]

    }

    const view = new vega.View(vega.parse(spec), { renderer: 'svg' })
    return await view.toSVG()

  }

  this.export = () => {
    return {
      gateways: _gatewaysPlacement,
      devices: _devicesPlacement
    }
  }

  // TODO add this simulation result
  this.addSimulationsResults = () => {

  }

}

// returns a grid of random dimensions, bounded by the min and max qty and a fixed distance between its points
function getGatewaysPlacement(qty, distanceBtwCenters, iteration) {

  // get number for one side of the grid
  const maxColumns = parseInt(Math.sqrt(qty))
  const dividends = Array(maxColumns).fill(0).map((v, i) => i+1).filter((v) => qty % v === 0)

  const columns = iteration < dividends.length ? dividends[iteration] : dividends[iteration % dividends.length]

  // get number for the other side of the grid
  const rows = parseInt(qty / columns)

  const n = columns * rows
  const gateways = Array(n).fill().map(() => ({}))

  for (const i in gateways) {
    const xIndex = i % rows
    const yIndex = parseInt(i / rows)

    // store x and y coordinates roundest to the nearest meter, with origin at top left
    gateways[i].x = Math.round(xIndex * distanceBtwCenters + distanceBtwCenters / 2)
    gateways[i].y = Math.round(yIndex * distanceBtwCenters + distanceBtwCenters / 2)
    gateways[i].z = GATEWAY_HEIGHT
  }

  return gateways

}

// return bounding coordinates of scenario
function getScenarioSize(gatewaysPlacement, distance) {

  const last = gatewaysPlacement[gatewaysPlacement.length - 1]

  return {
    height: last.y + distance / 2,
    width: last.x + distance / 2
  }
}

// return an array of random placements for the devices within the defined scenario
function getDevicesPlacement(minQty, maxQty, scenarioSize) {

  // get random number of devices
  const n = between(minQty, maxQty)

  const devices = Array(n).fill().map(() => ({}))

  for (const i in devices) {
    // store x and y coordinates
    devices[i].x = between(0, scenarioSize.width)
    devices[i].y = between(0, scenarioSize.height)
    devices[i].z = DEVICE_HEIGHT
  }

  return devices

}

// distance is the side length of the square circumscribed by circle (gtw coverage)
function getDistanceBtwGateways(radius) {
  const hypotenuse = radius * 2
  return Math.cos(45 * Math.PI / 180) * hypotenuse
}

// returns a random number between min and max
function between(min, max) {  
  return Math.floor(
    getRandomNbr() * (max - min) + min
  )
}

// random function used
function getRandomNbr() {
  return Math.random()
}

function clone(o) {
  return JSON.parse(JSON.stringify(o))
}

module.exports = Scenario
