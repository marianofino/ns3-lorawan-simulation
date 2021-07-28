const { spawn } = require('child_process')

function Simulation(scenarioPath, simInstance, defaultValues, ns3) {

  const naMode = simInstance.trafficShapingPolicy ? getNAModeMapped(simInstance.trafficShapingPolicy) : getNAModeMapped(defaultValues.trafficShapingPolicy)
  const msgSize = simInstance.msgSize ? simInstance.msgSize : defaultValues.msgSize
  const msgPeriod = simInstance.msgPeriod ? simInstance.msgPeriod : defaultValues.msgPeriod
  const budgetPerNode = simInstance.budgetPerNode ? simInstance.budgetPerNode : defaultValues.budgetPerNode
  const maxPackets = simInstance.maxPackets ? simInstance.maxPackets : defaultValues.maxPackets
  const priorityLvl = simInstance.priorityLvl ? simInstance.priorityLvl : defaultValues.priorityLvl

  const endDevicesCSV = scenarioPath.devices
  const gatewaysCSV = scenarioPath.gateways

  let simArgs = {
    endDevicesCSV,
    gatewaysCSV
  }

  if (naMode !== undefined) simArgs.naMode = naMode
  if (msgSize !== undefined) simArgs.msgSize = msgSize
  if (msgPeriod !== undefined) simArgs.msgPeriod = msgPeriod
  if (budgetPerNode !== undefined) simArgs.budgetPerNode = budgetPerNode
  if (maxPackets !== undefined) simArgs.maxPackets = maxPackets
  if (priorityLvl !== undefined) simArgs.priorityLvl = priorityLvl

  let command = `cd ${ns3.wafDir} && ./waf --run "na-gateway`

  Object.keys(simArgs).forEach((a) => {
    const v = simArgs[a]
    command += ` --${a}=${v}`
  })

  command += '"'

  this.run = () => {

    return new Promise((res, rej) => {

      console.log(`Executing command:\n${command}`)

      const child = spawn(command, {
        shell: true
      })

      let storeOutput = false
      let output = ''

      child.stdout.on('data', data => {

        if (storeOutput) {
          output += data
        }

        if (data.toString().slice(0, 7) === '\'build\'')
          storeOutput = true

      })

      child.on('error', (error) => {
        console.error(output)
        rej(error)
      })

      child.on('close', (code) => {
        try {
          let result = JSON.parse(output)
          result.args.trafficShapingPolicy = getNAModeMapped(result.args.naMode)
          res(result)
        } catch (e) {
          console.error(output)
          rej(e)
        }
      })

    })

  }

}

function getNAModeMapped(naModeInput) {

  const dict = {
    none: 0,
    byNodeId: 1,
    byNodePrioriy: 2,
    byBudget: 3,
    byMaxPackets: 4
  }

  const isLabel = isNaN(naModeInput)

  if (isLabel)
    return dict[naModeInput]

  return Object.keys(dict)[naModeInput]

}

module.exports = Simulation
