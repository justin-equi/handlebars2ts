# handlebars2ts

The idea is to compile a handlebars template into a typescript interface, extracting the variables and such.  
This is meant to work with Sendgrid, so we can pull down their mail templates and create typesafe code against them.

# Usage

There are 2 main entry points

- `makeTemplate('template content')` this will output a string suitable to be saved in a typescript file.
- `textToIntf('template content')` this will return a string that is suitable to be used as anonymous type to the content object.

# CLI

A cli tool handlebars2ts is included. It's probably not what you want as it is super basic,
but it shows how the tool could be used.
