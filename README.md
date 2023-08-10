# bars2ts

The idea is to compile a handlebars template into a typescript interface, extracting the variables and such.  
This is meant to work with Sendgrid, so we can pull down their mail templates and create typesafe code against them.

# Usage

There are 2 main entry points

- `makeTemplate('template content')` this will output a string suitable to be saved in a typescript file.
- `textToIntf('template content')` this will return a string that is suitable to be used as anonymous type to the content object.

# Not Done

There is no deamon or tool that will scan a directory or whatever and generate typescript files. I don't really need
that. Patches welcome.
