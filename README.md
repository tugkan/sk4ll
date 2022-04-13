# SK4LL

Sk4ll is a modular and plugin based CIDR scanner which got inspired by this [article](https://infosecwriteups.com/how-i-discovered-thousands-of-open-databases-on-aws-764729aa7f32) by [Avi Lumelsky](https://mobile.twitter.com/avi_lum). Just to keep in mind that this repository is there for **educational purposes**.

## Overview

Internally, Sk4ll uses `masscan` to scan all the [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) blocks that has been provided by the user. Then by each of the plugin, Sk4ll decides to use which ports are the most important ones and triggers an internal Node Event to inform the plugins for the execution.

When an event gets received by the plugins, the `init` function of them will be triggered with the payload of `ip` and `port`. After that point, what needs to be done (base logic of the ip/port pair) will be decided and initiated by the plugin itself.


## Installation

Please keep in mind that Sk4ll uses command line executions to scan the targets. That's why you have to install the pre-requisite libraries first. You can find the required and plugin-based CLI tools that you need to install below.

- [Masscan](https://github.com/robertdavidgraham/masscan) (Required)
- [MySQL](https://www.mysql.com/) (Optional by plugin)
- [Wget](https://www.gnu.org/software/wget/) (Optional by FTP plugin)



This package is developed specifically for the CLI usage however you can also use it as a library as far as you pass the arguments to the library itself.


To install it globally you can just type the following command:

```
npm i sk4ll -g
```

For using it as a library you can simply install it with the basic npm installation command.

```
npm i sk4ll -S
```

and use it as a package in your codebase;

```
const sk4ll = require('sk4ll');
```

## Usage

S4kll has several different base parameters which helps users to define what needs to be scanned and what should be prioritized.

### Help (-h)
This command prints all the possible options that can be used on Sk4ll. It is the most known basic command.

### Proxy (-p, --proxy)
Some of the plugins like Directory Listing and Elasticsearch is based on HTTP scanning. This option is completely optional but *suggested* if you would like to use the HTTP or HTTPS protocol on the plugins.

Example;

`--proxy=http://PROXY_URL`

### CIDR Blocks (-c, --cidr)
This command is being used for `masscan` to scan all the IPs inside the provided CIDR blocks. This option also supports multiple CIDR blocks at once.

`-c=10.10.14.14/8,1.2.3.4/16`

### CIDR Block Files (-f, --cidr-files)
When you would like to scan many CIDR blocks but also very lazy to add all of these as CLI commands, you can use this command to pass file paths for Sk4ll to use.

All the CIDR blocks in the files must be splitted by a newline. Examples can be found on the `data` folder at the repository. This option also supports multiple paths as well.

Example;

`--cidr-files=./data/aws.txt,./data/digitalocean.txt`

### Plugins (--plugin)
Sk4ll provides several built-in plugins by default. If you want to use all the plugins at once, you don't need to use this flag. However if you would like to use only one or several of them at the same time, you can just pass the name of the plugins (folder names) and let Sk4ll to use them. Like said, the default is `all`.

`--plugin=elasticsearch,mongo,redis`

### Log Level (-l, --log-level)
Currently, Sk4ll provides 4 different logging levels which are `info`, `debug` and `warn` which is exactly the same importancy level on the Node itself. Default logging level is `info`.

Example;

`--log-level=debug`

## Developing a custom plugin
Developing a custom plugin is completely possible within Sk4ll. You just have to follow the basic template which is provided below. Also with the flexible approach of the plugin-based approach, you can initiate any payload that you would like to kickoff after finding the vulnerable services.

```

const PluginName = {
    ports: [8080],
    name: 'Plugin Name', // This is necessary for better logging
    service: 'pluginname', // This is being used for sk4ll's internal infrastructure
    init: async ({ ip, port }) => { // Required for initiation
    	// The code that will be executed once masscan
    	// finds the open port on the IP itself.
    }
};

module.exports = PluginName;

```

`init` function is required for `masscan` to trigger. Then with the logic inside the function; you can check, validate and trigger a custom payload that you want to execute after a successfull finding. For the details, you can check the current implementations.

For an example; after you check the possible open Redis service, you can initiate a bash script to exploit and retrieve a reverse shell from the vulnerable service itself.


## Todo
* Development of LDAP plugin
* Development of SMB plugin
* Development of PostgreSQL plugin
* Development of MSSQL plugin
* Development of Kibana plugin
* Development of Grafana plugin
* Removing all the prerequisites
* 100% coverage on the tests (and initial test development)
