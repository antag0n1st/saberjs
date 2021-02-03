#!/usr/bin/env python
from __future__ import print_function
import os,sys,json ,shutil , re
from path import Path
from functions import *

#### do your thing here

release_dir = 'release';
version_number = sys.argv[1];

#### read the navigator file

file_name = 'lib/display/h_navigator.js';

with open(file_name, 'r') as myfile:
    data = myfile.read();

### strip the code

start_string = '//-START-EXPOSURE-1';
end_string = '//-END-EXPOSURE-1';
to_replace_with = start_string + '\n\n' + end_string;
data = re.sub(''+start_string+'.*?'+end_string,to_replace_with,data, flags=re.DOTALL)

### write to file

filename = file_name;
myfile = open(filename, 'w+');
myfile.write(data);
myfile.close();
