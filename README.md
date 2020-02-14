#Node Multi Service Starter (nodemss)
---
Interactive cli tool to list, control and run start multiple services listed in JSON file simultainously.

##Install
```
$ npm i -g nodemss
```

##Usage
Navigate to any folder containing the config file in json format

###Syntax
```
$ nodemss [run] --config PATH_TO_CONFIG_FILE
```


###Load config file and start all processess
```
$ nodemss run --config PATH_TO_CONFIG_FILE
```

###Load config file without running / starting all processess
```
$ nodemss --config PATH_TO_CONFIG_FILE
```

##Menu
```
?:                      Shows help screen.
find [xxxx]:            Finds the process matching the pattern xxxx
kill xxxx:              Kills the process associated with PID xxxx
killAll:                Kills all process started and their status
listAll:                Lists all process started and their status
start service name:     Starts the service identified by the name. If the service is started already, it will ignore the command
startAll:               Starts all the services. If the service is started already, it will ignore the command
exit || bye:            Exits the programme. !!All opened processess may be still running!!
```

##Config file syntax
###Config File
```
{
    "defaultCommand": "",       // Represents the default command. This can be the command that most of your services use.
    "defaultArguments": [""],   // Array of strings for each argument the command uses
    "defaultOptions": {         // Default options for the processess. 
        "shell": true,
        "detached": true
    },
    "processess": []
}
```
###Processess
```
{
    "name": "" ,                    // Name to reffer the servie. It can be module name or project name or app name.
    "command": ""   ,               // This field is optional. Value provided here will override the defaultCommand.
    "arguments": [""],              // This field is optional. Value provided here will override the defaultArguments.
    "options": {}                   // This field is optional. Value provided here will override the defaultOptions. Reffer SpawnOptions
}
```
###Options / SpawnOptions

- **cwd** ``<string>`` Current working directory of the child process.
- **env** ``<Object>`` Environment key-value pairs. Default: process.env.
- **argv0** ``<string>`` Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified.
- **stdio** ``<Array> | <string>`` Child's stdio configuration.
- **detached** ``<boolean>`` Prepare child to run independently of its parent process. Specific behavior depends on the platform, see options.detached).
- **uid** ``<number>`` Sets the user identity of the process.
- **gid** ``<number>`` Sets the group identity of the process.
- **serialization** ``<string>`` Specify the kind of serialization used for sending messages between processes. Possible values are 'json' and 'advanced'. See Advanced Serialization for more details. Default: 'json'.
- **shell** ``<boolean> | <string>`` If true, runs command inside of a shell. Uses '/bin/sh' on Unix, and process.env.ComSpec on Windows. A different shell can be specified as a string. See Shell Requirements and Default Windows Shell. Default: false (no shell).
- **windowsVerbatimArguments** ``<boolean>`` No quoting or escaping of arguments is done on Windows. Ignored on Unix. This is set to true automatically when shell is specified and is CMD. Default: false.
- **windowsHide** ``<boolean>`` Hide the subprocess console window that would normally be created on Windows systems. Default: false.

Fore more information refer this [link](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

**Sample**
```
"options": {
    "shell": true,
    "detached": true,
    "cwd": "working_directory_of_the_service",
    "timeout": 20000,
    "stdio": ["ignore", "ignore", "ignore"]
}
```

##Troubleshooting
###1. Script permission issue on windows
```
nodemss : File D:\Users\.... cannot be loaded because running scripts is
disabled on this system. For more information, see about_Execution_Policies at
http://go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ nodemss
+ ~~~~~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```
**Take utmost care while fixing this issue. The author will not take any liability from the fallout of this action.**
**Refer [here](http://go.microsoft.com/fwlink/?LinkID=135170).**
**You should know what you are doing!!!**

**Fix**
In Power Shell window with administrator privilages run:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

