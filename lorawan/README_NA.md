# LoRaWAN ns-3 module extension for NA Gateways #

### Instructions

There are 2 ways to use this module. In both ways, it is needed to install the LoRaWAN NS3 module like indicated in the [README.md](./README.md).

The first way to use it is by either coding a custom scenario or using the na-gateway in the examples directoy. This last version is a command line tool. For help, run `./waf --run "na-gateway --PrintHelp"`.

The other way, is to run na-lorawan-simulator wrapper, written in Node.js, that can be found in the `../na-lorawan-simulator` directory. The first step is to configure the scenarios in the `config.yaml`. Then, the scenarios must be created running `node index.js scenarios`. Finally, the simulations should be ran with `node index.js run`. The scenarios can be found in the `scenarios` folder, while the results of the simulations in CSV format in the `results.csv`.

### Notes for the na-gateway example code

* All intervals are predefined by hour.
* Traffic shaping policies cannot be combined. 
