from __future__ import print_function
import os,sys,json ,shutil
from path import Path
from shutil import copyfile

def get_directories(path,exclude):
 
	files = os.listdir(path);
	dirs = [];
	
	for name in files:	 
		full_path = os.path.join(path, name)	
		
		if os.path.isdir(full_path) and (name not in exclude) :
			dirs.append(Path(name ,path, full_path));
	
	return dirs;
		

def get_config(path):
	if os.path.isfile(path):
	
		with open(path) as json_file:  
			data = json.load(json_file)
			return data;
	else:
		return None;

def get_files(path,all_files = [],extensions = [],exclude = [],start_path = ''):
 
	if start_path == '' :
		start_path = path;

	files = os.listdir(path)
	for name in files:
	 
		full_path = os.path.join(path, name)	
		
		if os.path.isdir(full_path):
			get_files(full_path,all_files,extensions,exclude,start_path);
		elif os.path.isfile(full_path):

			if name not in exclude :

				o = Path(name,path,full_path ,path.replace(start_path,''));

				if len(extensions) > 0 : 
				
					for allowed in extensions :
						if name.endswith(allowed):							
							all_files.append(o);
				else :
					all_files.append(o);
			
	
	return all_files;

def copy_and_overwrite(from_path, to_path):
    if os.path.exists(to_path):
        shutil.rmtree(to_path)
    shutil.copytree(from_path, to_path)
