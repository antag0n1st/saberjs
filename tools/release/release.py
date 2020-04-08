#!/usr/bin/env python
from __future__ import print_function
import os,sys,json ,shutil , re
from path import Path
from functions import *


#### do your thing here

release_dir = 'release';

if not os.path.exists(release_dir+'/'):
    os.makedirs(release_dir+'/')

#CLEAR DIRECTORY
folder = release_dir;
for filename in os.listdir(folder):
    file_path = os.path.join(folder, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (file_path, e))



#### create an index.html for release
with open('index.html', 'r') as myfile:
    data = myfile.read();

with open('scripts.html', 'r') as myfile:
    javascripts = myfile.read();

start_string = '<!--//SCRIPTS-BEGIN-->';
end_string = '<!--//SCRIPTS-END-->';


data = re.sub(''+start_string+'.*?'+end_string,javascripts,data, flags=re.DOTALL)

#data = data.replace("{name}","aha");

filename = release_dir+"/index.html";
myfile = open(filename, 'w+')
myfile.write(data);
myfile.close()

print("Generated: "+filename)


#### copy other files
copy_and_overwrite('assets',release_dir+'/assets')
copyfile('pixi.min.js', release_dir+'/pixi.min.js')
copyfile('lib.min.js', release_dir+'/lib.min.js')
copyfile('config.js', release_dir+'/config.js')
copyfile('app.min.js', release_dir+'/app.min.js')
