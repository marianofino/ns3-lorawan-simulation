const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')
const converter = require('json-2-csv')

const Scenario = require('./Scenario')
const Simulation = require('./Simulation')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const flatten = require('flat')

yargs(hideBin(process.argv))
  .command('scenarios', 'create scenarios', (yargs) => {
    return yargs
      .positional('config', {
        describe: 'path to config file',
        default: './config.yaml'
      })
  }, (argv) => {
    createScenarios(argv)
  })
  .command('run', 'run the simulations', (yargs) => {
    return yargs
      .positional('config', {
        describe: 'path to config file',
        default: './config.yaml'
      })
  }, (argv) => {
    run(argv)
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv

async function createScenarios(options) {

  try {

    const config = yaml.load(fs.readFileSync(options.config, 'utf8'))
    const scenariosDir = config.scenarios.dir

    // create directory if it doesn't exist
    if (!fs.existsSync(scenariosDir)){
      fs.mkdirSync(scenariosDir);
    }

    // if there are already files in dir, do not create scenarios
    if (fs.readdirSync(scenariosDir).length > 0) {
      return
    }

    for (const i in Array(config.scenarios.qty).fill()) {
      const iteration = parseInt(i)

      const scenario = new Scenario()
      scenario.create(config.scenarios, iteration)

      const svg = await scenario.getRenderInSVG()
      const exported = await scenario.export()

      const devicesCSV = await converter.json2csvAsync(exported.devices)
      const gatewaysCSV = await converter.json2csvAsync(exported.gateways)

      fs.writeFileSync(`${config.scenarios.dir}/scenario_${iteration}.svg`, svg)
      fs.writeFileSync(`${config.scenarios.dir}/scenario_${iteration}_devices.csv`, devicesCSV)
      fs.writeFileSync(`${config.scenarios.dir}/scenario_${iteration}_gateways.csv`, gatewaysCSV)
    }

  } catch (e) {
    console.error(e);
  }

}

async function run(options) {

  try {

    const config = yaml.load(fs.readFileSync(options.config, 'utf8'))

    const scenarios = fs.readdirSync(config.scenarios.dir)
                        .reduce((acc, file) => {
                            const prefix = file.match(/scenario_[0-9]*/gm)[0]
                            if (acc.indexOf(prefix) < 0)
                              acc.push(prefix)
                            return acc
                          }, [])

    const simulationInstances = config.simulations.instances
    const defaultValues = config.simulations.defaultValues ? config.simulations.defaultValues : {}

    let results = []
    let id = 0

    const totalSimulations = scenarios.length * simulationInstances.length

    for (const scenario of scenarios) {

      const devicesPath = path.join(path.resolve(), config.scenarios.dir, `${scenario}_devices.csv`)
      const gatewaysPath = path.join(path.resolve(), config.scenarios.dir, `${scenario}_gateways.csv`)

      const scenarioPath = {
        devices: devicesPath,
        gateways: gatewaysPath
      }

      for (const simInstance of simulationInstances) {

        console.log(`Simulation ${id+1}/${totalSimulations}`)

        const sim = new Simulation(scenarioPath, simInstance, defaultValues, config.ns3)
        try {
          let result = await sim.run()
          result.scenario = scenario
          result.simulationId = id++
          results.push(flatten(result, { delimiter: '_' }))
        } catch (e) {
          console.error(e)
          process.exit()
        }

      }
    }

    const resultsInCSV = await converter.json2csvAsync(results)

    fs.writeFileSync('results.csv', resultsInCSV)

  } catch (e) {
    console.error(e);
  }

}
