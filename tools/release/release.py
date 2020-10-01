#!/usr/bin/env python
from __future__ import print_function
import os,sys,json ,shutil , re
from path import Path
from functions import *

#### do your thing here

release_dir = 'release';
version_number = sys.argv[1];

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

with open('tools/scripts.html', 'r') as myfile:
    javascripts = myfile.read();

with open('tools/release/pwa/worker-registration', 'r') as myfile:
    worker_registration = myfile.read();

with open('tools/release/pwa/serviceworker', 'r') as myfile:
    serviceworker = myfile.read();

serviceworker = serviceworker.replace("{version}",""+version_number);

data = data.replace("<!--//INCLUDE-PWA-->", worker_registration);

start_string = '<!--//SCRIPTS-BEGIN-->';
end_string = '<!--//SCRIPTS-END-->';

data = data.replace("v=1","v="+version_number);

data = data.replace("var _VERSION = 1;","var _VERSION = "+version_number+";");
javascripts = javascripts.replace("v=1","v="+version_number);

data = re.sub(''+start_string+'.*?'+end_string,javascripts,data, flags=re.DOTALL)



filename = release_dir+"/index.html";
myfile = open(filename, 'w+');
myfile.write(data);
myfile.close();

print("Generated: "+filename)

### generate a service worker

filename = release_dir+"/serviceworker.js";
myfile = open(filename, 'w+');
myfile.write(serviceworker);
myfile.close();

print("\nGenerated: "+filename);


#### copy other files
copy_and_overwrite('assets',release_dir+'/assets')
copyfile('pixi.min.js', release_dir+'/pixi.min.js')
copyfile('lib.min.js', release_dir+'/lib.min.js')
copyfile('config.js', release_dir+'/config.js')
copyfile('app.min.js', release_dir+'/app.min.js')
copyfile('.htaccess', release_dir+'/.htaccess')

copyfile('manifest.json', release_dir+'/manifest.json')
copyfile('workbox-sw.js', release_dir+'/workbox-sw.js')
### copyfile('serviceworker.js', release_dir+'/serviceworker.js')
